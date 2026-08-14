import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import {
  buildLeadRow,
  LeadRow,
  type LeadPayload,
} from '@/lib/google-sheets'
import { sendZaloMessage, formatLeadMessage } from '@/lib/zalo-bot'

export const runtime = 'nodejs'
// Disable static optimization – this route reads from env at runtime.
export const dynamic = 'force-dynamic'

interface RequestBody extends LeadPayload {}

function getServiceAccount(): InstanceType<typeof google.auth.JWT> | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY

  if (!email || !privateKey) {
    return null
  }

  // Vercel / many PaaS providers store the key with escaped newlines;
  // rewrite them back to real `\n` so JWT auth can parse the PEM.
  const normalizedKey = privateKey.replace(/\\n/g, '\n')

  return new google.auth.JWT({
    email,
    key: normalizedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheetConfig() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID
  // Single-tab mode by user preference, but we still allow override.
  const sheetName = process.env.GOOGLE_SHEETS_TAB || 'Sheet1'
  return { spreadsheetId, sheetName }
}

function validatePayload(body: unknown): { ok: true; data: LeadPayload } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid payload' }
  }
  const b = body as Record<string, unknown>

  if (typeof b.phone !== 'string' || !b.phone.trim()) {
    return { ok: false, error: 'Số điện thoại là bắt buộc' }
  }

  // Loose phone validation: 8-15 digits, allowing +, spaces, dashes.
  const phoneClean = b.phone.replace(/[\s+\-]/g, '')
  if (!/^\d{8,15}$/.test(phoneClean)) {
    return { ok: false, error: 'Số điện thoại không hợp lệ' }
  }

  return {
    ok: true,
    data: {
      name: typeof b.name === 'string' ? b.name : '',
      phone: b.phone,
      email: typeof b.email === 'string' ? b.email : '',
      childAge: typeof b.childAge === 'string' ? b.childAge : '',
      program: typeof b.program === 'string' ? b.program : '',
      campus: typeof b.campus === 'string' ? b.campus : '',
      topicsInterested: Array.isArray(b.topicsInterested)
        ? b.topicsInterested.filter((x): x is string => typeof x === 'string')
        : [],
      conversationSummary:
        typeof b.conversationSummary === 'string' ? b.conversationSummary : '',
      conversationCount: typeof b.conversationCount === 'number' ? b.conversationCount : 0,
      locale: typeof b.locale === 'string' ? b.locale : 'vi',
      source: typeof b.source === 'string' ? b.source : 'chatbot',
    },
  }
}

async function ensureHeader(
  auth: InstanceType<typeof google.auth.JWT>,
  spreadsheetId: string,
  sheetName: string
) {
  const sheets = google.sheets({ version: 'v4', auth })
  const range = `${sheetName}!A1:Z1`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const existing = response.data.values?.[0] ?? []
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [LeadRow.columns],
      },
    })
  }
}

interface SheetResult {
  ok: boolean
  error?: string
}

async function saveToSheet(
  leadData: LeadPayload,
  row: string[]
): Promise<SheetResult> {
  const { spreadsheetId, sheetName } = getSheetConfig()
  if (!spreadsheetId) {
    return { ok: false, error: 'GOOGLE_SHEETS_ID chưa được cấu hình' }
  }

  const auth = getServiceAccount()
  if (!auth) {
    return {
      ok: false,
      error: 'Google Service Account credentials chưa được cấu hình',
    }
  }

  try {
    await auth.authorize()
    await ensureHeader(auth, spreadsheetId, sheetName)

    const sheets = google.sheets({ version: 'v4', auth })
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    })
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[chatbot/lead] Google Sheets error:', message)
    return { ok: false, error: message }
  }
}

interface ZaloResult {
  attempted: boolean
  ok?: boolean
  error?: string
  messageId?: string
}

async function notifyZalo(leadData: LeadPayload): Promise<ZaloResult> {
  const chatId = process.env.ZALO_BOT_CHAT_ID
  const token = process.env.ZALO_BOT_TOKEN

  if (!token || !chatId) {
    return { attempted: false }
  }

  const timestamp = new Date().toISOString()
  const text = formatLeadMessage(leadData, timestamp)
  const result = await sendZaloMessage(chatId, text)

  if (result.ok) {
    return { attempted: true, ok: true, messageId: result.messageId }
  }
  return { attempted: true, ok: false, error: result.error }
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const validation = validatePayload(body)
  if (!validation.ok) {
    return NextResponse.json({ success: false, error: validation.error }, { status: 400 })
  }

  const leadData = validation.data
  const row = buildLeadRow(leadData)

  // Run Sheets + Zalo in parallel so a slow notification channel doesn't
  // block the lead from being persisted. Each step is independent and
  // its failure is reported back individually.
  const [sheetResult, zaloResult] = await Promise.all([
    saveToSheet(leadData, row),
    notifyZalo(leadData),
  ])

  // Sheets is the historical CRM and nice-to-have. Zalo is the primary
  // notification channel the sales team watches in real time. To match
  // that priority we let a missing/broken Sheet config NOT block the
  // lead — Zalo still fires, we still 200, and we surface sheet status
  // for debugging.
  if (!zaloResult.ok && zaloResult.attempted) {
    console.error('[chatbot/lead] Zalo notification failed:', zaloResult.error)
  }

  if (sheetResult.ok) {
    return NextResponse.json({
      success: true,
      sheet: sheetResult,
      zalo: zaloResult,
    })
  }

  // Sheet not configured or failed AND Zalo also didn't fire → return 500.
  // Sheet failed but Zalo still pinged → still a success (team has the lead).
  if (!zaloResult.attempted || zaloResult.ok === false) {
    // Special case: neither Sheets nor Zalo is configured (common in local
    // dev / preview deploys). Don't 500 in that case — surface it as a
    // warning so the front-end doesn't show a scary "mất kết nối" message
    // and the dev can see in the server logs what's missing.
    if (!zaloResult.attempted && !sheetResult.ok) {
      console.warn(
        '[chatbot/lead] Neither Google Sheets nor Zalo Bot is configured. Lead accepted but not persisted/forwarded. Set GOOGLE_SHEETS_* and ZALO_BOT_* env vars.'
      )
      return NextResponse.json({
        success: true,
        sheet: sheetResult,
        zalo: zaloResult,
        warning:
          'Chưa cấu hình Google Sheets và Zalo Bot. Lead chỉ được ghi nhận tạm trong log.',
      })
    }

    return NextResponse.json(
      {
        success: false,
        error:
          sheetResult.error ||
          zaloResult.error ||
          'Không thể gửi thông tin lúc này.',
        sheet: sheetResult,
        zalo: zaloResult,
      },
      { status: 500 }
    )
  }

  // Zalo fired (or was configured but didn't error) — treat as success.
  return NextResponse.json({
    success: true,
    sheet: sheetResult,
    zalo: zaloResult,
    warning: sheetResult.error || 'Google Sheets chưa được cấu hình, lead chỉ được gửi qua Zalo.',
  })
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'POST a lead payload to this endpoint to save to Google Sheets and notify Zalo.',
    config: {
      sheetsConfigured: Boolean(process.env.GOOGLE_SHEETS_ID),
      zaloConfigured: Boolean(
        process.env.ZALO_BOT_TOKEN && process.env.ZALO_BOT_CHAT_ID
      ),
    },
  })
}
