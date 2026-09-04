import { NextRequest, NextResponse } from 'next/server'
import { runLeadPipeline, type LeadPipelineResult } from '@/lib/lead-pipeline'
import type { LeadPayload } from '@/lib/google-sheets'

export const runtime = 'nodejs'
// Disable static optimization – this route reads from env at runtime.
export const dynamic = 'force-dynamic'

interface RequestBody extends LeadPayload {}

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
  const result = await runLeadPipeline(leadData, {
    zaloSourceLabel: 'Chatbot',
  })

  // Sheets is the historical CRM and nice-to-have. Zalo is the primary
  // notification channel the sales team watches in real time. To match
  // that priority we let a missing/broken Sheet config NOT block the
  // lead — Zalo still fires, we still 200, and we surface sheet status
  // for debugging.
  if (!result.zalo.ok && result.zalo.attempted) {
    console.error('[chatbot/lead] Zalo notification failed:', result.zalo.error)
  }

  return buildResponse(result)
}

function buildResponse(result: LeadPipelineResult): NextResponse {
  const { sheet, zalo, firestore } = result

  // Zalo fired successfully — primary notification channel is happy.
  // Treat the whole request as success regardless of sheet status;
  // surface any sheet failure as a warning for debugging only.
  if (zalo.attempted && zalo.ok) {
    return NextResponse.json({
      success: true,
      sheet,
      zalo,
      firestore,
      warning: sheet.error || undefined,
    })
  }

  // Sheet OK — happy path when Zalo isn't configured.
  if (sheet.ok) {
    return NextResponse.json({ success: true, sheet, zalo, firestore })
  }

  // Zalo didn't fire (unverified capture or env missing) → silent success
  // with a warning. The lead is in Firestore; we just couldn't forward.
  if (!zalo.attempted) {
    return NextResponse.json({
      success: true,
      sheet,
      zalo,
      firestore,
      warning: zalo.error || 'Zalo Bot chưa được cấu hình hoặc lead chưa đủ tín hiệu để bắn.',
    })
  }

  // Zalo attempted but failed → real failure, surface to caller.
  return NextResponse.json(
    {
      success: false,
      error:
        sheet.error ||
        zalo.error ||
        'Không thể gửi thông tin lúc này.',
      sheet,
      zalo,
      firestore,
    },
    { status: 500 }
  )
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