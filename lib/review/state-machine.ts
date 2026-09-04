// Review state machine - định nghĩa các chuyển trạng thái hợp lệ.
// Safe to import from both server and client components.
import type { ReviewStatus } from '../cms-types'
import type { SessionUser } from '../session'

/**
 * Bảng chuyển trạng thái hợp lệ.
 * - Mỗi `from -> Set<to>` là các action được phép.
 * - Action tương ứng được dùng khi ghi activity log.
 */
export const ALLOWED_TRANSITIONS: Record<ReviewStatus, Array<{ to: ReviewStatus; action: string }>> = {
  DRAFT: [
    { to: 'PENDING_REVIEW', action: 'submit_review' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  PENDING_REVIEW: [
    { to: 'APPROVED', action: 'approve' },
    { to: 'REJECTED', action: 'reject' },
    { to: 'DRAFT', action: 'restore_draft' }, // rút lại về nháp
  ],
  REJECTED: [
    { to: 'DRAFT', action: 'restore_draft' },
    { to: 'PENDING_REVIEW', action: 'submit_review' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  APPROVED: [
    { to: 'PUBLISHED', action: 'publish' },
    { to: 'SCHEDULED', action: 'schedule' },
    { to: 'DRAFT', action: 'restore_draft' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  SCHEDULED: [
    { to: 'PUBLISHED', action: 'publish' },
    { to: 'APPROVED', action: 'restore_draft' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  PUBLISHED: [
    { to: 'UNPUBLISHED', action: 'unpublish' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  UNPUBLISHED: [
    { to: 'PUBLISHED', action: 'publish' },
    { to: 'DRAFT', action: 'restore_draft' },
    { to: 'ARCHIVED', action: 'archive' },
  ],
  ARCHIVED: [
    { to: 'DRAFT', action: 'restore_draft' },
  ],
}

export interface TransitionResult {
  ok: boolean
  reason?: string
  action?: string
}

/**
 * Xác định xem một chuyển trạng thái có hợp lệ không.
 * - Kiểm tra state machine.
 * - Áp dụng rule: tác giả (createdByUid) không tự duyệt bài của mình.
 * - Editor: chỉ được submit/restore_draft/archive cho bài của mình.
 */
export function canTransition(
  from: ReviewStatus,
  to: ReviewStatus,
  user: SessionUser,
  doc: { createdByUid?: string } = {}
): TransitionResult {
  const allowed = ALLOWED_TRANSITIONS[from] || []
  const target = allowed.find((t) => t.to === to)
  if (!target) {
    return { ok: false, reason: `Không thể chuyển từ ${from} sang ${to}` }
  }

  const role = user.role
  const isAuthor = doc.createdByUid && doc.createdByUid === user.uid

  // Editor: chỉ được submit_review, restore_draft, archive (trên bài của mình).
  if (role === 'editor') {
    const allowedEditorActions = ['submit_review', 'restore_draft', 'archive']
    if (!allowedEditorActions.includes(target.action)) {
      return { ok: false, reason: 'Editor không có quyền thực hiện thao tác này' }
    }
    if (doc.createdByUid && !isAuthor) {
      return { ok: false, reason: 'Editor chỉ có thể thao tác trên bài của mình' }
    }
  }

  // Admin: không tự duyệt bài của mình.
  if ((role === 'admin' || role === 'super_admin') && isAuthor) {
    const selfBlockActions = ['approve', 'reject', 'publish', 'schedule', 'unpublish']
    if (selfBlockActions.includes(target.action)) {
      return { ok: false, reason: 'Bạn là tác giả, không thể tự duyệt/xuất bản bài của mình' }
    }
  }

  // Viewer: không thao tác gì.
  if (role === 'viewer') {
    return { ok: false, reason: 'Viewer không có quyền thao tác review' }
  }

  return { ok: true, action: target.action }
}

/**
 * Lấy action tương ứng khi chuyển trạng thái (dùng để ghi log).
 */
export function getTransitionAction(from: ReviewStatus, to: ReviewStatus): string | undefined {
  const allowed = ALLOWED_TRANSITIONS[from] || []
  return allowed.find((t) => t.to === to)?.action
}
