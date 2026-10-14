'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ALLOWED_TRANSITIONS } from '@/lib/review/state-machine'
import { ReviewStatus, REVIEW_STATUS_LABELS } from '@/lib/cms-types'
import { ReviewStatusBadge } from './review-status-badge'

export interface ReviewActionsProps {
  collection: string
  documentId: string
  status: ReviewStatus | string
  /** Optional callback khi action thành công. */
  onActionCompleted?: () => void
  /** Compact mode - chỉ hiển thị icon, không text. */
  compact?: boolean
}

const ACTION_LABELS: Record<string, string> = {
  submit_review: 'Gửi duyệt',
  approve: 'Duyệt',
  reject: 'Từ chối',
  publish: 'Xuất bản',
  schedule: 'Lên lịch',
  restore_draft: 'Về nháp',
  unpublish: 'Gỡ xuất bản',
  archive: 'Lưu trữ',
}

export function ReviewActions(props: ReviewActionsProps) {
  const { collection, documentId, status, onActionCompleted } = props
  const from = status as ReviewStatus
  const allowed = ALLOWED_TRANSITIONS[from] || []

  const [pending, setPending] = useState<string | null>(null)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const [scheduledAt, setScheduledAt] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = async (to: ReviewStatus, body: Record<string, unknown> = {}) => {
    setPending(to)
    setError(null)
    try {
      const res = await fetch(`/api/cms/review/transition/${collection}/${documentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, ...body }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Lỗi ${res.status}`)
        return
      }
      onActionCompleted?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {allowed.map(({ to, action }) => {
        const label = ACTION_LABELS[action] || to
        if (action === 'reject') {
          return (
            <Button
              key={to}
              variant="outline"
              size="sm"
              disabled={pending !== null}
              onClick={() => setRejectOpen(true)}
              className="rounded h-7 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
            >
              {label}
            </Button>
          )
        }
        if (action === 'schedule') {
          return (
            <Button
              key={to}
              variant="outline"
              size="sm"
              disabled={pending !== null}
              onClick={() => setScheduleOpen(true)}
              className="rounded h-7 px-2.5 text-xs text-purple-700 border-purple-200 hover:bg-purple-50"
            >
              {label}
            </Button>
          )
        }
        return (
          <Button
            key={to}
            variant="outline"
            size="sm"
            disabled={pending !== null}
            onClick={() => submit(to)}
            className="rounded h-7 px-2.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50"
          >
            {label}
          </Button>
        )
      })}

      {error && (
        <p className="text-xs w-full" style={{ color: '#dc2626' }}>
          {error}
        </p>
      )}

      {/* Reject dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối nội dung</DialogTitle>
            <DialogDescription>
              Nhập lý do từ chối. Tác giả sẽ nhận được thông báo và có thể chỉnh sửa lại.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Lý do từ chối</Label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full min-h-[100px] rounded border p-3 text-sm"
              placeholder="Ví dụ: Tiêu đề chưa rõ ràng, thiếu hình ảnh..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={!rejectReason.trim() || pending !== null}
              onClick={async () => {
                await submit('REJECTED', { comment: rejectReason })
                setRejectOpen(false)
                setRejectReason('')
              }}
              style={{ backgroundColor: '#dc2626', color: '#fff' }}
            >
              Xác nhận từ chối
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule dialog */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Lên lịch xuất bản</DialogTitle>
            <DialogDescription>
              Cron job sẽ tự động xuất bản nội dung khi đến thời điểm đã chọn.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Thời điểm xuất bản</Label>
            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>
              Hủy
            </Button>
            <Button
              disabled={!scheduledAt || pending !== null}
              onClick={async () => {
                await submit('SCHEDULED', {
                  scheduledAt: new Date(scheduledAt).toISOString(),
                })
                setScheduleOpen(false)
                setScheduledAt('')
              }}
            >
              Xác nhận lên lịch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
