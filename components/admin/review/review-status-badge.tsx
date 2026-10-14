'use client'

import { REVIEW_STATUS_LABELS, type ReviewStatus } from '@/lib/cms-types'

export interface ReviewStatusBadgeProps {
  status: ReviewStatus | string | null | undefined
  size?: 'sm' | 'md'
}

export function ReviewStatusBadge({ status, size = 'md' }: ReviewStatusBadgeProps) {
  const cfg = REVIEW_STATUS_LABELS[status as ReviewStatus] || {
    vi: String(status || 'DRAFT'),
    color: '#6b7280',
  }
  const padding = size === 'sm' ? '1px 6px' : '2px 8px'
  const fontSize = size === 'sm' ? 10 : 12
  return (
    <span
      className="inline-flex items-center rounded font-medium text-white"
      style={{
        backgroundColor: cfg.color,
        padding,
        fontSize,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.vi}
    </span>
  )
}
