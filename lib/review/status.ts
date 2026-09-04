// Review status helpers - re-export từ cms-types cho convenience.
import 'server-only'
import {
  REVIEW_STATUSES,
  REVIEW_STATUS_LABELS,
  type ReviewStatus,
} from '../cms-types'

export { REVIEW_STATUSES, REVIEW_STATUS_LABELS }
export type { ReviewStatus }

/**
 * Trả về label tiếng Việt cho review status.
 */
export function getStatusLabel(status: ReviewStatus | string | undefined | null): string {
  if (!status) return REVIEW_STATUS_LABELS.DRAFT.vi
  if (status in REVIEW_STATUS_LABELS) {
    return REVIEW_STATUS_LABELS[status as ReviewStatus].vi
  }
  return String(status)
}

/**
 * Trả về màu hex cho badge.
 */
export function getStatusColor(status: ReviewStatus | string | undefined | null): string {
  if (!status) return REVIEW_STATUS_LABELS.DRAFT.color
  if (status in REVIEW_STATUS_LABELS) {
    return REVIEW_STATUS_LABELS[status as ReviewStatus].color
  }
  return REVIEW_STATUS_LABELS.DRAFT.color
}

/**
 * Kiểm tra document đã "live" trên web chưa.
 * - PUBLISHED: đang hiển thị
 * - SCHEDULED với scheduledAt <= now: được public API coi là đang hiển thị
 */
export function isLiveOnSite(status: string | undefined | null, scheduledAt?: string | null, now: Date = new Date()): boolean {
  if (status === 'PUBLISHED') return true
  if (status === 'SCHEDULED' && scheduledAt) {
    const t = new Date(scheduledAt).getTime()
    if (!Number.isNaN(t) && t <= now.getTime()) return true
  }
  return false
}
