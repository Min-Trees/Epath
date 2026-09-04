// with-review - wrapper để thêm review workflow vào CRUD handler factory.
import 'server-only'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionUser } from '../session'
import { createDocument, updateDocument } from '../cms-repo'
import { REVIEWABLE_COLLECTIONS, type ReviewStatus } from '../cms-types'
import { canEdit } from './permissions'
import { logActivity } from '../activity-log'

/**
 * Trả về true nếu collection là reviewable.
 */
export function isReviewable(collection: string): boolean {
  return (REVIEWABLE_COLLECTIONS as readonly string[]).includes(collection)
}

interface CreateOptions {
  name: string
  schema: z.ZodType
}

/**
 * Wrapper tạo document với review workflow.
 * - Tự set status='DRAFT', createdBy, createdAt, updatedAt.
 * - Trả về POST handler cho Next.js App Router.
 */
export function makeCreateHandlerWithReview(opts: CreateOptions) {
  return async function POST(req: NextRequest) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await req.json().catch(() => null)
    const parsed = opts.schema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data as Record<string, unknown>
    const payload: Record<string, unknown> = {
      ...data,
      status: 'DRAFT' as ReviewStatus,
      createdByUid: user.uid,
      createdByEmail: user.email || '',
      createdByName: user.name || '',
      lastReviewerUid: '',
      lastReviewerEmail: '',
      lastReviewerName: '',
      rejectionReason: '',
      scheduledAt: '',
      publishedAt: '',
      submittedAt: '',
      reviewedAt: '',
    }

    const id = await createDocument(opts.name, payload)
    await logActivity({
      action: 'create',
      collection: opts.name,
      documentId: id,
      documentLabel: deriveLabel(data),
      actor: user,
      request: req,
    })
    return NextResponse.json({ id })
  }
}

interface UpdateOptions {
  name: string
  schema: z.ZodType
}

/**
 * Wrapper cập nhật với review workflow.
 * - Kiểm tra canEdit.
 * - Editor chỉ sửa được bài của mình.
 * - Không cho sửa ở trạng thái PENDING_REVIEW/PUBLISHED.
 */
export function makeUpdateHandlerWithReview(opts: UpdateOptions) {
  return async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    const user = await getSessionUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const json = await req.json().catch(() => null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const partialSchema = (opts.schema as any).partial()
    const parsed = partialSchema.safeParse(json)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // Đọc document để check status + createdByUid.
    const { getAdminDb } = await import('../firebase-admin')
    const db = getAdminDb()
    const snap = await db.collection(opts.name).doc(params.id).get()
    if (!snap.exists) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    const data = snap.data() as Record<string, unknown>
    const status = (typeof data.status === 'string' ? data.status : 'DRAFT') as ReviewStatus
    const createdByUid = typeof data.createdByUid === 'string' ? data.createdByUid : ''

    const editCheck = canEdit(user, { status, createdByUid })
    if (!editCheck.ok) {
      return NextResponse.json({ error: editCheck.reason || 'Forbidden' }, { status: 403 })
    }

    const body = parsed.data as Record<string, unknown>
    // Block chỉnh sửa status, audit fields qua PATCH thông thường.
    const protectedFields = ['status', 'rejectionReason', 'publishedAt', 'lastReviewerUid', 'lastReviewerEmail', 'lastReviewerName', 'submittedAt', 'reviewedAt', 'createdByUid', 'createdByEmail', 'createdByName']
    protectedFields.forEach((f) => delete body[f])

    await updateDocument(opts.name, params.id, body)
    await logActivity({
      action: 'update',
      collection: opts.name,
      documentId: params.id,
      documentLabel: deriveLabel({ ...data, ...body }),
      changes: body,
      actor: user,
      request: req,
    })
    return NextResponse.json({ ok: true })
  }
}

function deriveLabel(payload: Record<string, unknown>, fallback = ''): string {
  if (!payload) return fallback
  const t = payload.title as { vi?: string; en?: string } | string | undefined
  if (typeof t === 'string' && t.trim()) return t
  if (t && typeof t === 'object') return t.vi || t.en || fallback
  const name = payload.name as string | undefined
  if (typeof name === 'string' && name.trim()) return name
  const slug = payload.slug as string | undefined
  if (typeof slug === 'string' && slug.trim()) return slug
  return fallback
}
