'use client'

export interface BackupStatusBadgeProps {
  status: 'pending' | 'running' | 'completed' | 'failed'
}

const STATUS_META = {
  pending: { label: 'Đang chờ', color: '#6b7280' },
  running: { label: 'Đang chạy', color: '#f59e0b' },
  completed: { label: 'Hoàn thành', color: '#16a34a' },
  failed: { label: 'Thất bại', color: '#dc2626' },
}

export function BackupStatusBadge({ status }: BackupStatusBadgeProps) {
  const cfg = STATUS_META[status] || STATUS_META.pending
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      style={{ backgroundColor: cfg.color }}
    >
      {cfg.label}
    </span>
  )
}
