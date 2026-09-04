// Review repository - ghi lịch sử và chuyển trạng thái document.
import 'server-only'
import { getAdminDb } from '../firebase-admin'
import {
  CollectionNames,
  REVIEWABLE_COLLECTIONS,
  ReviewStatusSchema,
  type ReviewEvent,
  type ReviewStatus,
} from '../cms-types'
import type { SessionUser } from '../session'
import { getTransitionAction } from './state-machine'

interface RecordEventInput {
  collection: string
  documentId: string
  from: ReviewStatus
  to: ReviewStatus
  actor: SessionUser
  comment?: string
  scheduledAt?: string
}

/**
 * Ghi 1 event vào subcollection /{collection}/{docId}/reviewHistory.
 */
export async function recordEvent(input: RecordEventInput): Promise<ReviewEvent> {
  const db = getAdminDb()
  const event: ReviewEvent = {
    from: input.from,
    to: input.to,
    actorUid: input.actor.uid,
    actorEmail: input.actor.email || '',
    actorName: input.actor.name || '',
    comment: input.comment || '',
    scheduledAt: input.scheduledAt || '',
    at: new Date(),
  }
  const ref = await db
    .collection(input.collection)
    .doc(input.documentId)
    .collection('reviewHistory')
    .add(event)
  return { id: ref.id, ...event }
}

/**
 * Lấy lịch sử review của 1 document.
 */
export async function getHistory(collection: string, documentId: string, limit = 100): Promise<ReviewEvent[]> {
  const db = getAdminDb()
  const snap = await db
    .collection(collection)
    .doc(documentId)
    .collection('reviewHistory')
    .orderBy('at', 'desc')
    .limit(limit)
    .get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ReviewEvent, 'id'>) }))
}

/**
 * Đọc status hiện tại và createdByUid của 1 document.
 */
export async function readDoc(
  collection: string,
  id: string
): Promise<{ status: ReviewStatus; createdByUid: string } | null> {
  const db = getAdminDb()
  const snap = await db.collection(collection).doc(id).get()
  if (!snap.exists) return null
  const data = snap.data() || {}
  const status = ReviewStatusSchema.safeParse(data.status)
  return {
    status: status.success ? status.data : 'DRAFT',
    createdByUid: typeof data.createdByUid === 'string' ? data.createdByUid : '',
  }
}

interface ApplyTransitionInput {
  collection: string
  documentId: string
  to: ReviewStatus
  actor: SessionUser
  comment?: string
  scheduledAt?: string
}

/**
 * Cập nhật document: set status + audit fields + thời điểm tương ứng.
 * Sau đó ghi event vào reviewHistory.
 */
export async function applyTransition(input: ApplyTransitionInput): Promise<ReviewEvent> {
  const db = getAdminDb()
  const now = new Date()
  const update: Record<string, unknown> = {
    status: input.to,
    lastReviewerUid: input.actor.uid,
    lastReviewerEmail: input.actor.email || '',
    lastReviewerName: input.actor.name || '',
    rejectionReason: input.to === 'REJECTED' ? input.comment || '' : '',
    scheduledAt: input.to === 'SCHEDULED' ? input.scheduledAt || '' : '',
    publishedAt: input.to === 'PUBLISHED' ? now.toISOString() : '',
    updatedAt: now,
  }
  if (input.to === 'PENDING_REVIEW') update.submittedAt = now.toISOString()
  if (input.to === 'APPROVED' || input.to === 'REJECTED') update.reviewedAt = now.toISOString()

  await db.collection(input.collection).doc(input.documentId).update(update)

  const prev = await readDoc(input.collection, input.documentId)
  return recordEvent({
    collection: input.collection,
    documentId: input.documentId,
    from: prev?.status || 'DRAFT',
    to: input.to,
    actor: input.actor,
    comment: input.comment,
    scheduledAt: input.scheduledAt,
  })
}

export interface QueueItem {
  collection: string
  id: string
  title: string
  createdByUid: string
  createdByName: string
  createdByEmail: string
  submittedAt: string
}

/**
 * Lấy danh sách document PENDING_REVIEW gom từ 13 collection.
 */
export async function listPendingReview(): Promise<QueueItem[]> {
  const db = getAdminDb()
  const results: QueueItem[] = []
  await Promise.all(
    REVIEWABLE_COLLECTIONS.map(async (name) => {
      const snap = await db.collection(name).where('status', '==', 'PENDING_REVIEW').get()
      snap.docs.forEach((d) => {
        const data = d.data() as Record<string, unknown>
        const title = deriveTitleForQueue(name, data)
        results.push({
          collection: name,
          id: d.id,
          title,
          createdByUid: typeof data.createdByUid === 'string' ? data.createdByUid : '',
          createdByName: typeof data.createdByName === 'string' ? data.createdByName : '',
          createdByEmail: typeof data.createdByEmail === 'string' ? data.createdByEmail : '',
          submittedAt: typeof data.submittedAt === 'string' ? data.submittedAt : '',
        })
      })
    })
  )
  // Sort mới nhất trước
  results.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || ''))
  return results
}

/**
 * Lấy tất cả document SCHEDULED có scheduledAt <= now.
 */
export async function listScheduledDue(now: Date = new Date()): Promise<Array<{ collection: string; id: string }>> {
  const db = getAdminDb()
  const results: Array<{ collection: string; id: string }> = []
  await Promise.all(
    REVIEWABLE_COLLECTIONS.map(async (name) => {
      const snap = await db.collection(name).where('status', '==', 'SCHEDULED').get()
      snap.docs.forEach((d) => {
        const data = d.data() as Record<string, unknown>
        const scheduledAt = typeof data.scheduledAt === 'string' ? data.scheduledAt : ''
        if (!scheduledAt) return
        const t = new Date(scheduledAt).getTime()
        if (Number.isNaN(t)) return
        if (t <= now.getTime()) {
          results.push({ collection: name, id: d.id })
        }
      })
    })
  )
  return results
}

function deriveTitleForQueue(collection: string, data: Record<string, unknown>): string {
  const t = data.title as { vi?: string; en?: string } | string | undefined
  if (typeof t === 'string' && t.trim()) return t
  if (t && typeof t === 'object') return t.vi || t.en || ''
  const name = data.name
  if (typeof name === 'string' && name.trim()) return name
  const slug = data.slug
  if (typeof slug === 'string' && slug.trim()) return slug
  return collection
}
