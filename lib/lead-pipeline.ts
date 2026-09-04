/**
 * Lead pipeline – chia sẻ giữa chatbot & contact-form.
 *
 * Mỗi lead mới sẽ được xử lý qua 3 bước độc lập (chạy song song):
 *   1. persistLeadToFirestore  – lưu vào collection `leads` (xem trong admin)
 *   2. saveLeadToSheet         – đẩy sang Google Sheets (CRM backup)
 *   3. notifyLeadZalo          – bắn Zalo OA cho sales team
 *
 * Cả 3 bước đều best-effort:
 *   - Không có cấu hình → báo `attempted: false`, không throw.
 *   - Có cấu hình nhưng API lỗi → trả lỗi để caller log + quyết định có
 *     500 hay không (chatbot yêu cầu bắt buộc Zalo, contact-form thì thoáng hơn).
 */

import { google } from 'googleapis'
import { getAdminDb } from '@/lib/firebase-admin'
import { CollectionNames } from '@/lib/cms-types'
import { sendZaloMessage, formatLeadMessage } from '@/lib/zalo-bot'
import { buildLeadRow, LeadRow, type LeadPayload } from '@/lib/google-sheets'

// ===================== Firestore =====================

export interface FirestoreResult {
  attempted: boolean
  ok?: boolean
  id?: string
  error?: string
}

/**
 * Persist a lead into Firestore so it shows up in the admin leads inbox.
 * Idempotent on errors – callers decide whether to surface them.
 */
export async function persistLeadToFirestore(leadData: LeadPayload): Promise<FirestoreResult> {
  try {
    const ref = await getAdminDb()
      .collection(CollectionNames.leads)
      .add({
        ...leadData,
        status: 'new',
        notes: '',
        assignedTo: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    return { attempted: true, ok: true, id: ref.id }
  } catch (err) {
    console.warn('[lead-pipeline] Firestore persist failed:', (err as Error).message)
    return { attempted: true, ok: false, error: (err as Error).message }
  }
}

// ===================== Google Sheets =====================

export interface SheetResult {
  ok: boolean
  error?: string
}

function getServiceAccount(): InstanceType<typeof google.auth.JWT> | null {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
  if (!email || !privateKey) return null
  const normalizedKey = privateKey.replace(/\\n/g, '\n')
  return new google.auth.JWT({
    email,
    key: normalizedKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
}

function getSheetConfig() {
  return {
    spreadsheetId: process.env.GOOGLE_SHEETS_ID,
    sheetName: process.env.GOOGLE_SHEETS_TAB || 'Sheet1',
  }
}

async function ensureSheetHeader(
  auth: InstanceType<typeof google.auth.JWT>,
  spreadsheetId: string,
  sheetName: string
) {
  const sheets = google.sheets({ version: 'v4', auth })
  const range = `${sheetName}!A1:Z1`
  const response = await sheets.spreadsheets.values.get({ spreadsheetId, range })
  const existing = response.data.values?.[0] ?? []
  if (existing.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values: [LeadRow.columns] },
    })
  }
}

export async function saveLeadToSheet(leadData: LeadPayload): Promise<SheetResult> {
  const { spreadsheetId, sheetName } = getSheetConfig()
  if (!spreadsheetId) {
    return { ok: false, error: 'GOOGLE_SHEETS_ID chưa được cấu hình' }
  }
  const auth = getServiceAccount()
  if (!auth) {
    return { ok: false, error: 'Google Service Account credentials chưa được cấu hình' }
  }
  try {
    await auth.authorize()
    await ensureSheetHeader(auth, spreadsheetId, sheetName)
    const sheets = google.sheets({ version: 'v4', auth })
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [buildLeadRow(leadData)] },
    })
    return { ok: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[lead-pipeline] Google Sheets error:', message)
    return { ok: false, error: message }
  }
}

// ===================== Zalo =====================

export interface ZaloResult {
  attempted: boolean
  ok?: boolean
  error?: string
  messageId?: string
}

/**
 * Notify the configured Zalo OA about a new lead. `sourceLabel` lets us
 * tag the message so the sales team can tell chatbot leads apart from
 * contact-form leads in the chat history.
 */
export async function notifyLeadZalo(
  leadData: LeadPayload,
  sourceLabel?: string
): Promise<ZaloResult> {
  const chatId = process.env.ZALO_BOT_CHAT_ID
  const token = process.env.ZALO_BOT_TOKEN
  if (!token && !chatId) {
    return { attempted: false, error: 'ZALO_BOT_TOKEN và ZALO_BOT_CHAT_ID chưa được cấu hình' }
  }
  if (!token) {
    return { attempted: false, error: 'ZALO_BOT_TOKEN chưa được cấu hình' }
  }
  if (!chatId) {
    return { attempted: false, error: 'ZALO_BOT_CHAT_ID chưa được cấu hình' }
  }
  const timestamp = new Date().toISOString()
  const text = formatLeadMessage(leadData, timestamp, sourceLabel)
  const result = await sendZaloMessage(chatId, text)
  if (result.ok) {
    return { attempted: true, ok: true, messageId: result.messageId }
  }
  return { attempted: true, ok: false, error: result.error }
}

// ===================== Top-level orchestrator =====================

export interface LeadPipelineResult {
  firestore: FirestoreResult
  sheet: SheetResult
  zalo: ZaloResult
}

export interface LeadPipelineOptions {
  /** Override the source label embedded in the Zalo message (default: payload.source). */
  zaloSourceLabel?: string
  /** Skip Zalo entirely (useful for test/internal leads that should not notify sales). */
  skipZalo?: boolean
  /** Skip Google Sheets (e.g. for an internal admin lead). */
  skipSheet?: boolean
}

/**
 * Decide whether a lead has enough real signal to notify the sales
 * team. A lead that only captured name+phone (pre-chat) with no
 * conversation, no topics and no form details is treated as
 * "unverified capture" — we still persist it so the admin inbox has
 * the contact, but we do NOT spam Zalo with template placeholders.
 */
export function shouldNotifyZalo(leadData: LeadPayload): boolean {
  if (leadData.conversationCount > 0) return true
  if (leadData.topicsInterested.length > 0) return true
  if (leadData.conversationSummary.trim()) return true
  // Form-side fields filled by the user (not pre-chat)
  if (leadData.email || leadData.childAge || leadData.program || leadData.campus) return true
  return false
}

/**
 * Run the full lead pipeline: persist + sheet + zalo in parallel.
 * Never throws – each step is reported individually so the caller can
 * decide whether the overall outcome is a "success" based on which
 * channels are critical.
 */
export async function runLeadPipeline(
  leadData: LeadPayload,
  options: LeadPipelineOptions = {}
): Promise<LeadPipelineResult> {
  const zaloLabel = options.zaloSourceLabel ?? leadData.source ?? 'website'
  const autoSkipZalo = !options.skipZalo && !shouldNotifyZalo(leadData)
  const tasks: [Promise<FirestoreResult>, Promise<SheetResult | null>, Promise<ZaloResult | null>] = [
    persistLeadToFirestore(leadData),
    options.skipSheet ? Promise.resolve(null) : saveLeadToSheet(leadData),
    options.skipZalo || autoSkipZalo ? Promise.resolve(null) : notifyLeadZalo(leadData, zaloLabel),
  ]
  const [firestore, sheet, zalo] = await Promise.all(tasks)
  return {
    firestore,
    sheet: sheet ?? { ok: false, error: 'skipped' },
    zalo: zalo ?? {
      attempted: false,
      error: autoSkipZalo
        ? 'Lead chỉ có tên + SĐT, không có nội dung tương tác → không bắn Zalo để tránh dữ liệu mẫu.'
        : 'skipped',
    },
  }
}