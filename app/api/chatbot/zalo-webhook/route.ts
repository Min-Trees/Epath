/**
 * POST /api/chatbot/zalo-webhook
 *
 * Webhook endpoint mà Zalo Bot sẽ gọi về mỗi khi có người nhắn với bot.
 *
 * Hai nhiệm vụ chính:
 *   1. Reply tự động cho user đã nhắn (để Zalo active bot).
 *   2. Lưu chat_id của user vào file để admin lấy được.
 *
 * Zalo gửi kèm header "X-Bot-Api-Secret-Token" để verify request.
 *
 * Setup:
 *   - Local dev: dùng `cloudflared` hoặc `ngrok` để expose URL HTTPS
 *   - Sau đó: POST /api/chatbot/zalo-setup-webhook?url=https://xxx.com
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Store chat_id log in a writable location. On Vercel the project root
// is read-only, so fall back to /tmp (also writable, but ephemeral —
// entries are lost when the serverless function cold-starts in a new
// region). For local dev we keep using .data/ so logs survive restarts.
const LOG_DIR = process.env.VERCEL
  ? join('/tmp', 'zalo-logs')
  : join(process.cwd(), '.data', 'zalo')
const LOG_FILE = join(LOG_DIR, 'chats.json')

interface ChatEntry {
  chatId: string
  fromName?: string
  lastMessage?: string
  lastSeenAt: string
  messageCount: number
}

async function readChats(): Promise<Record<string, ChatEntry>> {
  if (!existsSync(LOG_FILE)) return {}
  try {
    const raw = await readFile(LOG_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

async function writeChats(data: Record<string, ChatEntry>): Promise<void> {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true })
  }
  await writeFile(LOG_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

async function sendReply(chatId: string, text: string): Promise<void> {
  const token = process.env.ZALO_BOT_TOKEN
  if (!token) return
  const url = `https://bot-api.zaloplatforms.com/bot${encodeURIComponent(token)}/sendMessage`
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })
  } catch (err) {
    console.error('[zalo-webhook] reply failed:', err)
  }
}

export async function POST(request: NextRequest) {
  // Verify secret token (Zalo sends it via header on every webhook call).
  const expected = process.env.ZALO_BOT_WEBHOOK_SECRET
  if (expected) {
    const provided = request.headers.get('x-bot-api-secret-token')
    if (provided !== expected) {
      return NextResponse.json({ ok: false, error: 'Invalid secret' }, { status: 403 })
    }
  }

  let payload: any = {}
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: true })
  }

  // Zalo có nhiều event types, mình chỉ quan tâm message events.
  const message = payload?.message ?? payload?.result?.message
  if (!message) {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const chatId = message?.chat?.id ?? message?.from?.id
  const fromName = [message?.from?.first_name, message?.from?.last_name]
    .filter(Boolean)
    .join(' ')
  const text: string = message?.text ?? ''

  if (!chatId) {
    return NextResponse.json({ ok: true, ignored: true, reason: 'no chat id' })
  }

  // Persist chat_id để admin có thể copy.
  const chats = await readChats()
  const existing = chats[chatId]
  chats[chatId] = {
    chatId,
    fromName: fromName || existing?.fromName,
    lastMessage: text,
    lastSeenAt: new Date().toISOString(),
    messageCount: (existing?.messageCount ?? 0) + 1,
  }
  await writeChats(chats)

  // Reply auto để user biết bot đã nhận được tin + thông báo sẽ được lưu.
  await sendReply(
    chatId,
    `👋 Xin chào${fromName ? ' ' + fromName : ''}!\n\n` +
      `Cảm ơn bạn đã liên hệ EPath. Thông tin của bạn đã được ghi nhận, đội ngũ tư vấn sẽ phản hồi sớm nhất.\n\n` +
      `💬 Chat ID của bạn: ${chatId}`
  )

  return NextResponse.json({ ok: true, captured: chatId })
}

export async function GET() {
  // Endpoint tiện ích: list toàn bộ chat_id đã tương tác.
  const chats = await readChats()
  const list = Object.values(chats).sort(
    (a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime()
  )
  return NextResponse.json({
    count: list.length,
    chats: list,
    hint: 'Dùng chat_id ở trên làm ZALO_BOT_CHAT_ID trong .env.local',
  })
}