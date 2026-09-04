'use client'

import { AlertTriangle, Info, Calendar, CheckCircle2 } from 'lucide-react'
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
        className="flex items-start gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: '#fef2f2',
          borderColor: '#fecaca',
          color: '#991b1b',
        }}
      >
        <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-medium mb-1">Nội dung bị từ chối</div>
          <p className="text-sm">{props.rejectionReason}</p>
        </div>
      </div>
    )
  }

  if (status === 'PENDING_REVIEW') {
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: '#fffbeb',
          borderColor: '#fde68a',
          color: '#92400e',
        }}
      >
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-medium mb-1">Đang chờ duyệt</div>
          <p className="text-sm">
            Nội dung đã được gửi cho người có quyền duyệt. Bạn không thể chỉnh sửa cho đến khi được xử lý.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'SCHEDULED' && props.scheduledAt) {
    const formatted = formatDateVi(props.scheduledAt, '', { hour12: false })
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: '#f5f3ff',
          borderColor: '#ddd6fe',
          color: '#5b21b6',
        }}
      >
        <Calendar className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-medium mb-1">Đã lên lịch xuất bản</div>
          <p className="text-sm">
            Sẽ tự động xuất bản vào {formatted || props.scheduledAt}.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'APPROVED') {
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: '#f0f9ff',
          borderColor: '#bae6fd',
          color: '#0c4a6e',
        }}
      >
        <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-medium mb-1">Đã được duyệt</div>
          <p className="text-sm">
            {props.lastReviewerName || props.lastReviewerEmail || 'Người duyệt'} đã duyệt nội dung này. Bạn có thể xuất bản ngay hoặc lên lịch.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'UNPUBLISHED') {
    return (
      <div
        className="flex items-start gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: '#f1f5f9',
          borderColor: '#cbd5e1',
          color: '#334155',
        }}
      >
        <Info className="w-5 h-5 mt-0.5 shrink-0" />
        <div className="flex-1">
          <div className="font-medium mb-1">Đã gỡ xuất bản</div>
          <p className="text-sm">
            Nội dung này không hiển thị trên website. Bạn có thể chỉnh sửa hoặc xuất bản lại.
          </p>
        </div>
      </div>
    )
  }

  return null
}
