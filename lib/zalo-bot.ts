/**
 * Zalo Bot client
 *
 * Gửi notification đến tài khoản Zalo cố định khi có lead mới từ chatbot.
 *
 * Cấu hình cần thiết (xem .env.example):
 *   - ZALO_BOT_TOKEN:    token từ "Zalo Bot Manager" OA
 *   - ZALO_BOT_CHAT_ID:  chat_id của tài khoản nhận notification
 *
 * Lưu ý: Zalo Bot API yêu cầu người nhận phải đã từng tương tác với bot
 * trước đó (gửi tin nhắn / bấm nút) để lấy chat_id. Nếu chưa tương tác,
 * gọi /api/chatbot/zalo-debug để xem hướng dẫn discovery.
 *
 * Docs: https://bot.zapps.me/docs/apis/sendMessage/
 */

import type { LeadPayload } from './google-sheets'

const ZALO_API_BASE = 'https://bot-api.zaloplatforms.com/bot'

export interface ZaloSendResult {
  ok: boolean
  messageId?: string
  error?: string
  raw?: unknown
}

/**
 * Gửi 1 tin nhắn text qua Zalo Bot.
 *
 * Token format: "bot_id:secret_key" – được URL-encode để phòng ký tự
 * đặc biệt. Một số secret có thể chứa ':' và '/'.
 */
export async function sendZaloMessage(
  chatId: string,
  text: string
): Promise<ZaloSendResult> {
  const token = process.env.ZALO_BOT_TOKEN
  if (!token) {
    return { ok: false, error: 'ZALO_BOT_TOKEN chưa được cấu hình' }
  }
  if (!chatId) {
    return { ok: false, error: 'Thiếu chat_id người nhận' }
  }
  if (!text || text.length === 0) {
    return { ok: false, error: 'Tin nhắn rỗng' }
  }
  if (text.length > 2000) {
    // Zalo giới hạn 2000 ký tự. Cắt cứng ở 1990 + dấu "..." để an toàn.
    text = text.slice(0, 1990) + '...'
  }

  const url = `${ZALO_API_BASE}${encodeURIComponent(token)}/sendMessage`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok || data?.ok === false) {
      const errMsg =
        (typeof data?.error === 'string' && data.error) ||
        (typeof data?.description === 'string' && data.description) ||
        `HTTP ${response.status}`
      return { ok: false, error: errMsg, raw: data }
    }

    return {
      ok: true,
      messageId: data?.result?.message_id,
      raw: data,
    }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Network error',
    }
  }
}

/**
 * Format lead thành 1 message thân thiện để gửi qua Zalo.
 * Markdown không render được trong text gốc, dùng text thuần với emoji
 * và dòng trống để dễ đọc trên mobile.
 */
export function formatLeadMessage(payload: LeadPayload, timestamp: string): string {
  const lines: string[] = [
    '🔔 LEAD MỚI TỪ CHATBOT EPATH',
    '',
    `⏰ ${formatTimestamp(timestamp)}`,
    '',
    '👤 Thông tin phụ huynh',
    `• Họ tên: ${payload.name || '(chưa cung cấp)'}`,
    `• SĐT: ${payload.phone}`,
    `• Email: ${payload.email || '(chưa cung cấp)'}`,
    '',
    '🎓 Thông tin học sinh / Quan tâm',
    `• Độ tuổi con: ${payload.childAge || '(chưa cung cấp)'}`,
    `• Chương trình: ${payload.program || '(chưa cung cấp)'}`,
    `• Cơ sở: ${payload.campus || '(chưa cung cấp)'}`,
    '',
    '💬 Tư vấn',
    `• Số câu đã hỏi: ${payload.conversationCount}`,
    `• Chủ đề quan tâm: ${payload.topicsInterested.length > 0 ? payload.topicsInterested.join(', ') : '(không có)'}`,
  ]

  if (payload.conversationSummary) {
    lines.push('', '📝 Tóm tắt hội thoại')
    // Cắt tóm tắt nếu quá dài, chia thành dòng 70 ký tự để đọc dễ trên mobile.
    const wrapped = wrapText(payload.conversationSummary, 70)
    lines.push(wrapped)
  }

  lines.push('', `🌐 Ngôn ngữ: ${payload.locale === 'en' ? 'English' : 'Tiếng Việt'}`)
  lines.push(`📡 Nguồn: ${payload.source}`)

  return lines.join('\n')
}

function formatTimestamp(iso: string): string {
  try {
    const d = new Date(iso)
    // Format: DD/MM/YYYY HH:mm (giờ Việt Nam)
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`
  } catch {
    return iso
  }
}

function wrapText(text: string, maxLineLength: number): string {
  // Tách sẵn theo \n hoặc ký tự '|' mà summarizeConversation dùng,
  // sau đó wrap từng đoạn dài.
  return text
    .split(/[\n|]/)
    .map((segment) => {
      const trimmed = segment.trim()
      if (trimmed.length <= maxLineLength) return trimmed
      const words = trimmed.split(/\s+/)
      const out: string[] = []
      let current = ''
      for (const word of words) {
        if ((current + ' ' + word).trim().length > maxLineLength) {
          if (current) out.push(current.trim())
          current = word
        } else {
          current = (current + ' ' + word).trim()
        }
      }
      if (current) out.push(current.trim())
      return out.join('\n  ')
    })
    .filter(Boolean)
    .join('\n  ')
}
