// POST /api/cms/review/transition/[collection]/[id]
// Body: { to: ReviewStatus, comment?: string, scheduledAt?: string }
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '@/lib/session'
import { isReviewable } from '@/lib/review/with-review'
import { applyTransition, readDoc } from '@/lib/review/repo'
import { canTransition } from '@/lib/review/state-machine'
import { ReviewStatusSchema } from '@/lib/cms-types'
import { logActivity } from '@/lib/activity-log'

const BodySchema = z.object({
  to: ReviewStatusSchema,
  comment: z.string().optional().default(''),
  scheduledAt: z.string().optional().default(''),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { collection: string; id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection, id } = params
  if (!isReviewable(collection)) {
    return NextResponse.json({ error: 'Collection không hỗ trợ review' }, { status: 400 })
  }

  const json = await req.json().catch(() => null)
  const parsed = BodySchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const current = await readDoc(collection, id)
  if (!current) {
    return NextResponse.json({ error: 'Document không tồn tại' }, { status: 404 })
  }

  const check = canTransition(current.status, parsed.data.to, user, { createdByUid: current.createdByUid })
  if (!check.ok) {
    return NextResponse.json({ error: check.reason || 'Forbidden' }, { status: 403 })
  }

  const event = await applyTransition({
    collection,
    documentId: id,
    to: parsed.data.to,
    actor: user,
    comment: parsed.data.comment,
    scheduledAt: parsed.data.scheduledAt,
  })

  await logActivity({
    action: (check.action as 'approve') || 'update',
    collection,
    documentId: id,
    documentLabel: id,
    changes: { from: current.status, to: parsed.data.to, comment: parsed.data.comment },
    actor: user,
    request: req,
  })

  return NextResponse.json({ ok: true, event })
}
