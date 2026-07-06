/**
 * GET /api/chatbot/zalo-test
 *
 * Endpoint tiện ích để:
 *   1. Test bot token có hoạt động không (gọi getMe).
 *   2. Gửi 1 message test đến chat_id đã cấu hình.
 *   3. Hỗ trợ discovery chat_id qua getUpdates.
 *
 * Truy cập trên trình duyệt:
 *   GET /api/chatbot/zalo-test                 -> gọi getMe
 *   GET /api/chatbot/zalo-test?action=send     -> gửi test message đến ZALO_BOT_CHAT_ID
 *   GET /api/chatbot/zalo-test?action=updates  -> lấy 100 update gần nhất để tìm chat_id
 *
 * Sau khi chạy action=updates, copy chat_id của bạn từ response rồi paste vào
 * ZALO_BOT_CHAT_ID trong .env.local.
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendZaloMessage } from '@/lib/zalo-bot'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ZALO_API_BASE = 'https://bot-api.zaloplatforms.com/bot'

async function callZaloMethod(
  method: string,
  body?: Record<string, unknown>
): Promise<{ ok: boolean; status: number; data: unknown }> {
  const token = process.env.ZALO_BOT_TOKEN
  if (!token) {
    return { ok: false, status: 0, data: { error: 'ZALO_BOT_TOKEN chưa được cấu hình' } }
  }
  const url = `${ZALO_API_BASE}${encodeURIComponent(token)}/${method}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    })
    const data = await response.json().catch(() => ({}))
    return { ok: response.ok, status: response.status, data }
  } catch (err) {
    return {
      ok: false,
      status: 0,
      data: { error: err instanceof Error ? err.message : 'Network error' },
    }
  }
}

export async function GET(request: NextRequest) {
  const action = request.nextUrl.searchParams.get('action') || 'me'
  const token = process.env.ZALO_BOT_TOKEN

  if (!token) {
    return NextResponse.json(
      {
        success: false,
        error: 'ZALO_BOT_TOKEN chưa được cấu hình trong .env.local',
      },
      { status: 500 }
    )
  }

  if (action === 'me') {
    const result = await callZaloMethod('getMe')
    return NextResponse.json(
      {
        action: 'getMe',
        configured: {
          tokenSet: true,
          chatIdSet: Boolean(process.env.ZALO_BOT_CHAT_ID),
          chatIdPreview: process.env.ZALO_BOT_CHAT_ID
            ? `${process.env.ZALO_BOT_CHAT_ID.slice(0, 4)}...${process.env.ZALO_BOT_CHAT_ID.slice(-4)}`
            : null,
        },
        zalo: result.data,
      },
      { status: result.ok ? 200 : 502 }
    )
  }

  if (action === 'send') {
    const chatId = process.env.ZALO_BOT_CHAT_ID
    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'ZALO_BOT_CHAT_ID chưa được cấu hình. Hãy chạy ?action=updates trước để tìm chat_id của bạn.',
        },
        { status: 400 }
      )
    }

    const text = `✅ Test từ EPath Chatbot\n\nBot đã kết nối thành công. Bạn sẽ nhận được tin nhắn này mỗi khi có lead mới.\n\n⏰ ${new Date().toISOString()}`
    const result = await sendZaloMessage(chatId, text)
    return NextResponse.json(
      {
        action: 'sendTest',
        ok: result.ok,
        messageId: result.messageId,
        error: result.error,
        raw: result.raw,
      },
      { status: result.ok ? 200 : 502 }
    )
  }

  if (action === 'updates') {
    const result = await callZaloMethod('getUpdates', { limit: 100 })
    return NextResponse.json(
      {
        action: 'getUpdates',
        hint:
          'Tìm chat_id trong mảng result. Đó chính là ID tài khoản/đã nhắn với bot của bạn.',
        zalo: result.data,
      },
      { status: result.ok ? 200 : 502 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Action không hợp lệ. Dùng: me | send | updates',
    },
    { status: 400 }
  )
}
