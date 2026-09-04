'use client'

import { REVIEW_STATUS_LABELS, type ReviewStatus } from '@/lib/cms-types'

export interface ReviewStatusBadgeProps {
  status: ReviewStatus | string | null | undefined
  size?: 'sm' | 'md'
  showIcon?: boolean
}

export function ReviewStatusBadge({ status, size = 'md', showIcon = true }: ReviewStatusBadgeProps) {
  const cfg = REVIEW_STATUS_LABELS[status as ReviewStatus] || {
    vi: String(status || 'DRAFT'),
    color: '#6b7280',
  }
  const padding = size === 'sm' ? '2px 6px' : '4px 10px'
  const fontSize = size === 'sm' ? 10 : 12
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full font-medium text-white"
      style={{
        backgroundColor: cfg.color,
        padding,
        fontSize,
        whiteSpace: 'nowrap',
      }}
    >
      {showIcon && <StatusIcon status={status as ReviewStatus} />}
      {cfg.vi}
    </span>
  )
}

function StatusIcon({ status }: { status: ReviewStatus }) {
  // Dùng ký tự đơn giản để tránh thêm icon dependency.
  const map: Record<ReviewStatus, string> = {
    DRAFT: '✎',
    PENDING_REVIEW: '⏳',
    REJECTED: '✗',
    APPROVED: '✓',
    SCHEDULED: '⏰',
    PUBLISHED: '●',
    UNPUBLISHED: '◌',
    ARCHIVED: '▣',
  }
  return <span style={{ fontSize: 10 }}>{map[status] || '•'}</span>
}
