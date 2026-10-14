'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { BackupStatusBadge } from './backup-status-badge'
import { BackupRestoreDialog } from './backup-restore-dialog'
import { getCollectionLabel } from '@/lib/review/collection-labels'
import type { Backup } from '@/lib/cms-types'

export interface BackupListProps {
  onBackupsChange?: () => void
}

export function BackupList({ onBackupsChange }: BackupListProps) {
  const [backups, setBackups] = useState<Backup[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [restoreBackup, setRestoreBackup] = useState<Backup | null>(null)

  const fetchBackups = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/cms/backup')
      const data = await res.json()
      setBackups(data.items || [])
    } catch {
      setBackups([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBackups() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa backup này? Hành động không thể hoàn tác.')) return
    setDeletingId(id)
    try {
      await fetch(`/api/cms/backup/${id}`, { method: 'DELETE' })
      await fetchBackups()
      onBackupsChange?.()
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-gray-500">Đang tải danh sách backup...</p>
      </div>
    )
  }

  if (backups.length === 0) {
    return (
      <div className="text-center py-12 rounded border border-gray-200 bg-gray-50">
        <p className="font-semibold text-gray-700">Chưa có backup nào</p>
        <p className="text-xs text-gray-500 mt-1">Backup sẽ được tạo tự động vào Chủ Nhật hàng tuần.</p>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500">{backups.length} bản sao lưu</p>
        <Button variant="outline" size="sm" onClick={fetchBackups} className="rounded h-7 px-3 text-xs">
          Làm mới
        </Button>
      </div>
      <div className="space-y-2">
        {backups.map((backup) => (
          <div key={backup.id} className="p-3 bg-white border border-[#E2E8F0] rounded">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <BackupStatusBadge status={backup.status} />
                  <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-medium">
                    {backup.type === 'scheduled' ? 'Tự động' : backup.type === 'manual' ? 'Thủ công' : 'Pre-restore'}
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(backup.startedAt).toLocaleString('vi-VN', { hour12: false })}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {backup.collections?.length || 0} collections
                  {backup.gcsPrefix && (
                    <> · GCS: {backup.gcsPrefix}</>
                  )}
                </div>
                {backup.error && (
                  <div className="text-xs text-red-600 mt-1">Lỗi: {backup.error}</div>
                )}
                {backup.notes && (
                  <div className="text-xs text-gray-500 mt-1 italic">{backup.notes}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">
                  Tạo bởi: {backup.triggeredByName || backup.triggeredByEmail || 'Hệ thống'}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {backup.status === 'completed' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setRestoreBackup(backup)}
                    className="rounded h-7 px-2.5 text-xs text-[#1E3570] border-[#1E3570]/30 hover:bg-blue-50"
                  >
                    Phục hồi
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => backup.id && handleDelete(backup.id)}
                  disabled={deletingId === backup.id}
                  className="rounded h-7 px-2.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                >
                  {deletingId === backup.id ? 'Đang xóa...' : 'Xóa'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {restoreBackup && (
        <BackupRestoreDialog
          open={!!restoreBackup}
          onOpenChange={(open) => { if (!open) setRestoreBackup(null) }}
          backup={restoreBackup}
          onRestored={fetchBackups}
        />
      )}
    </>
  )
}
