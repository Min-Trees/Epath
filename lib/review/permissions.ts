// Review permissions - quyền edit/delete cho từng trạng thái.
import 'server-only'
import type { ReviewStatus } from '../cms-types'
import type { SessionUser } from '../session'

/**
 * Document có thể chỉnh sửa trong các trạng thái này.
 * Editor: chỉ trên bài của mình.
 */
const EDITABLE_STATUSES: ReviewStatus[] = ['DRAFT', 'REJECTED', 'UNPUBLISHED']

export function canEdit(
  user: SessionUser,
  doc: { status?: ReviewStatus | string; createdByUid?: string } = {}
): { ok: boolean; reason?: string } {
  const status = (doc.status || 'DRAFT') as ReviewStatus
  if (!EDITABLE_STATUSES.includes(status)) {
    return { ok: false, reason: `Không thể chỉnh sửa nội dung ở trạng thái ${status}` }
  }
  if (user.role === 'viewer') return { ok: false, reason: 'Viewer không có quyền chỉnh sửa' }
  if (user.role === 'editor') {
    if (doc.createdByUid && doc.createdByUid !== user.uid) {
      return { ok: false, reason: 'Editor chỉ có thể chỉnh sửa bài của mình' }
    }
  }
  return { ok: true }
}

/**
 * Xác định document có thể xóa (hard-delete) hay không.
 * - Chỉ admin/super_admin.
 * - Không cho phép xóa PUBLISHED (phải unpublish trước rồi archive).
 */
export function canDelete(
  user: SessionUser,
  doc: { status?: ReviewStatus | string } = {}
): { ok: boolean; reason?: string } {
  if (user.role !== 'super_admin' && user.role !== 'admin') {
    return { ok: false, reason: 'Chỉ admin mới có thể xóa nội dung' }
  }
  const status = (doc.status || 'DRAFT') as ReviewStatus
  if (status === 'PUBLISHED') {
    return { ok: false, reason: 'Hãy gỡ xuất bản trước khi xóa' }
  }
  return { ok: true }
}

/**
 * Quyền thao tác backup.
 */
export function canCreateBackup(user: SessionUser): boolean {
  return user.role === 'super_admin' || user.role === 'admin'
}

export function canRestore(user: SessionUser): boolean {
  return user.role === 'super_admin'
}
