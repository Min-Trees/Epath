/**
 * POST /api/chatbot/zalo-setup-webhook?url=https://your-tunnel.com
 *
 * Gọi 1 lần sau khi bạn đã expose dev server qua HTTPS (ngrok/cloudflared)
 * để register webhook với Zalo.
 *
 * Sau khi register xong, mỗi tin nhắn gửi cho bot sẽ được webhook
 * /api/chatbot/zalo-webhook nhận, lưu chat_id vào .data/zalo/chats.json.
 * Truy cập GET /api/chatbot/zalo-webhook để xem danh sách chat_id.
 */

import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const token = process.env.ZALO_BOT_TOKEN
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'ZALO_BOT_TOKEN chưa được cấu hình' },
      { status: 500 }
    )
  }

  const url = request.nextUrl.searchParams.get('url')?.trim()
  if (!url) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Thiếu url. Ví dụ: POST /api/chatbot/zalo-setup-webhook?url=https://xxx.trycloudflare.com',
      },
      { status: 400 }
    )
  }

  if (!/^https:\/\//.test(url)) {
    return NextResponse.json(
      { success: false, error: 'url phải là HTTPS. Dùng cloudflared hoặc ngrok.' },
      { status: 400 }
    )
  }

  const secret = process.env.ZALO_BOT_WEBHOOK_SECRET ||
    // Auto-generate 32-char secret nếu user chưa set
    Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10) +
      Math.random().toString(36).slice(2, 10)

  const apiUrl = `https://bot-api.zaloplatforms.com/bot${encodeURIComponent(token)}/setWebhook`

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      url: `${url.replace(/\/$/, '')}/api/chatbot/zalo-webhook`,
      secret_token: secret,
    }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data?.ok === false) {
    return NextResponse.json(
      { success: false, error: data?.description || data?.error || 'setWebhook failed', raw: data },
      { status: 502 }
    )
  }

  return NextResponse.json({
    success: true,
    webhookUrl: `${url.replace(/\/$/, '')}/api/chatbot/zalo-webhook`,
    secretNote:
      'Zalo sẽ gửi secret này trong header X-Bot-Api-Secret-Token. Lưu lại vào .env.local làm ZALO_BOT_WEBHOOK_SECRET.',
    secret,
    raw: data,
  })
}

export async function GET() {
  const token = process.env.ZALO_BOT_TOKEN
  if (!token) {
    return NextResponse.json(
      { success: false, error: 'ZALO_BOT_TOKEN chưa được cấu hình' },
      { status: 500 }
    )
  }

  const apiUrl = `https://bot-api.zaloplatforms.com/bot${encodeURIComponent(token)}/getWebhookInfo`
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const data = await response.json().catch(() => ({}))
  return NextResponse.json({ zalo: data })
}