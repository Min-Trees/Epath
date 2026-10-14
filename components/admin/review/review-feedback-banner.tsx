'use client'

import { formatDateVi } from '@/lib/date-utils'

export interface ReviewFeedbackBannerProps {
  status: string | null | undefined
  rejectionReason?: string
  scheduledAt?: string
  publishedAt?: string
  lastReviewerName?: string
  lastReviewerEmail?: string
}

export function ReviewFeedbackBanner(props: ReviewFeedbackBannerProps) {
  const status = (props.status || 'DRAFT').toUpperCase()
  if (status === 'DRAFT' || status === 'PUBLISHED') return null

  if (status === 'REJECTED' && props.rejectionReason) {
    return (
      <div
        className="p-3 rounded border text-xs"
        style={{
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#991b1b',
        }}
      >
        <div className="font-semibold mb-0.5">Nội dung bị từ chối</div>
        <p>{props.rejectionReason}</p>
      </div>
    )
  }

  if (status === 'PENDING_REVIEW') {
    return (
      <div
        className="p-3 rounded border text-xs"
        style={{
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          color: '#92400e',
        }}
      >
        <div className="font-semibold mb-0.5">Đang chờ duyệt</div>
        <p>
          Nội dung đã được gửi cho người có quyền duyệt. Bạn không thể chỉnh sửa cho đến khi được xử lý.
        </p>
      </div>
    )
  }

  if (status === 'SCHEDULED' && props.scheduledAt) {
    const formatted = formatDateVi(props.scheduledAt, '', { hour12: false })
    return (
      <div
        className="p-3 rounded border text-xs"
        style={{
          backgroundColor: '#f5f3ff',
          borderColor: '#ddd6fe',
          color: '#5b21b6',
        }}
      >
        <div className="font-semibold mb-0.5">Đã lên lịch xuất bản</div>
        <p>
          Sẽ tự động xuất bản vào {formatted || props.scheduledAt}.
        </p>
      </div>
    )
  }

  if (status === 'APPROVED') {
    return (
      <div
        className="p-3 rounded border text-xs"
        style={{
          backgroundColor: '#f0f9ff',
          borderColor: '#bae6fd',
          color: '#0c4a6e',
        }}
      >
        <div className="font-semibold mb-0.5">Đã được duyệt</div>
        <p>
          {props.lastReviewerName || props.lastReviewerEmail || 'Người duyệt'} đã duyệt nội dung này. Bạn có thể xuất bản ngay hoặc lên lịch.
        </p>
      </div>
    )
  }

  if (status === 'UNPUBLISHED') {
    return (
      <div
        className="p-3 rounded border text-xs"
        style={{
          backgroundColor: '#f1f5f9',
          borderColor: '#cbd5e1',
          color: '#334155',
        }}
      >
        <div className="font-semibold mb-0.5">Đã gỡ xuất bản</div>
        <p>
          Nội dung này không hiển thị trên website. Bạn có thể chỉnh sửa hoặc xuất bản lại.
        </p>
      </div>
    )
  }

  return null
}
