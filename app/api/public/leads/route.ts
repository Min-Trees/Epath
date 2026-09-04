import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { runLeadPipeline, type LeadPipelineResult } from '@/lib/lead-pipeline'
import type { LeadInput } from '@/lib/cms-types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const LeadPayloadSchema = z.object({
  name: z.string().default(''),
  phone: z.string().min(1),
  email: z.string().default(''),
  childAge: z.string().default(''),
  program: z.string().default(''),
  campus: z.string().default(''),
  topicsInterested: z.array(z.string()).default([]),
  conversationSummary: z.string().default(''),
  conversationCount: z.number().int().default(0),
  locale: z.string().default('vi'),
  source: z.enum(['chatbot', 'contact-form', 'zalo', 'manual', 'website', 'events']).default('contact-form'),
})

/**
 * Public lead endpoint – used by every "đăng ký tư vấn" / contact / register
 * form on the marketing site (excluding the chatbot itself, which posts to
 * `/api/chatbot/lead`).
 *
 * Same pipeline as the chatbot endpoint:
 *   1. Save to Firestore so the lead appears in `/admin/leads`
 *   2. Push to Google Sheets CRM backup (if configured)
 *   3. Notify the sales team via Zalo (if configured)
 *
 * The contract is intentionally lenient: even if Sheets/Zalo are down or
 * unconfigured, the lead is persisted to Firestore and the public form
 * still gets a 200 so the customer sees the success message.
 */
export async function POST(req: NextRequest) {
  const json = await req.json().catch(() => null)
  const parsed = LeadPayloadSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payload', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const data = parsed.data as LeadInput
  const result = await runLeadPipeline(data, {
    // Tag the Zalo message so the sales team can tell where the lead came from.
    zaloSourceLabel:
      data.source === 'contact-form' ? 'Form liên hệ' :
      data.source === 'events' ? 'Sự kiện' :
      data.source === 'zalo' ? 'Zalo' :
      data.source === 'manual' ? 'Thủ công' :
      data.source === 'website' ? 'Website' :
      'Website',
  })

  if (!result.zalo.ok && result.zalo.attempted) {
    console.warn('[public/leads] Zalo notification failed:', result.zalo.error)
  }
  if (!result.firestore.ok && result.firestore.attempted) {
    console.warn('[public/leads] Firestore persist failed:', result.firestore.error)
  }

  // Public surface: we 200 as long as the lead was accepted. Surface the
  // individual channel statuses in the response so the front-end can
  // decide whether to show a "đã lưu, team sẽ liên hệ" or a softer
  // "đã ghi nhận, sẽ xử lý sớm" message.
  return NextResponse.json(buildPublicResponse(result))
}

function buildPublicResponse(result: LeadPipelineResult) {
  const { firestore, sheet, zalo } = result

  if (!firestore.ok) {
    return {
      success: false,
      persisted: false,
      error: firestore.error || 'Không thể lưu lead vào hệ thống',
      sheet,
      zalo,
      firestore,
    }
  }

  return {
    success: true,
    id: firestore.id,
    persisted: true,
    // `notified` tells the front-end whether Zalo actually pinged the
    // sales team (useful for QA / manual review of failed notifications).
    notified: zalo.ok === true,
    sheet,
    zalo,
    firestore,
  }
}

/**
 * GET – returns the current lead pipeline configuration so an admin can
 * quickly check whether Zalo / Sheets are wired up without having to
 * inspect server logs.
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'POST a lead payload to this endpoint to save + notify sales.',
    config: {
      firestoreConfigured: Boolean(process.env.FIREBASE_ADMIN_PROJECT_ID),
      sheetsConfigured: Boolean(
        process.env.GOOGLE_SHEETS_ID &&
          process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
          process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
      ),
      zaloConfigured: Boolean(
        process.env.ZALO_BOT_TOKEN && process.env.ZALO_BOT_CHAT_ID
      ),
    },
  })
}