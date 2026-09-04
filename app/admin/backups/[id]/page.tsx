'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { BackupStatusBadge } from '@/components/admin/backup/backup-status-badge'
import { BackupRestoreDialog } from '@/components/admin/backup/backup-restore-dialog'
import type { Backup } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { useParams } from 'next/navigation'

export default function AdminBackupDetailPage() {
  const user = useRequireAdmin()
  const params = useParams()
  const id = params.id as string
  const [backup, setBackup] = useState<Backup | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRestore, setShowRestore] = useState(false)

  useEffect(() => {
    fetch(`/api/cms/backup/${id}`)
      .then((r) => r.json())
      .then((d) => setBackup(d.item))
      .catch(() => setBackup(null))
      .finally(() => setLoading(false))
  }, [id])

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Chi tiết Backup"
      subtitle={backup ? new Date(backup.startedAt).toLocaleString('vi-VN', { hour12: false }) : '...'}
    >
      <Link
        href="/admin/backups"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
      </Link>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Đang tải...</div>
      ) : !backup ? (
        <div className="text-center py-12 text-gray-500">Backup không tồn tại.</div>
      ) : (
        <>
          <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: semanticColors.surface }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                <BackupStatusBadge status={backup.status} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Loại</div>
                <div className="font-medium">{backup.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Collections</div>
                <div className="font-medium">{backup.collections?.length || 0}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Tạo bởi</div>
                <div className="font-medium text-sm">{backup.triggeredByName || backup.triggeredByEmail || 'Hệ thống'}</div>
              </div>
            </div>
            {backup.gcsPrefix && (
              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">GCS Prefix</div>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">{backup.gcsPrefix}</code>
              </div>
            )}
            {backup.error && (
              <div className="mt-4 text-sm text-red-600">Lỗi: {backup.error}</div>
            )}
            {backup.notes && (
              <div className="mt-4 text-sm text-gray-600 italic">Ghi chú: {backup.notes}</div>
            )}
          </div>

          <div className="rounded-xl p-6" style={{ backgroundColor: semanticColors.surface }}>
            <h3 className="font-semibold mb-3">Collections trong backup</h3>
            <div className="space-y-1">
              {(backup.collections || []).map((c) => (
                <div key={c} className="text-sm py-1 px-2 rounded hover:bg-gray-50">
                  <span className="font-mono text-xs text-gray-500 mr-2">→</span>
                  {c}
                </div>
              ))}
            </div>
          </div>

          {backup.status === 'completed' && (
            <div className="mt-6">
              <button
                onClick={() => setShowRestore(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: semanticColors.primary }}
              >
                Khôi phục backup này <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {backup && showRestore && (
        <BackupRestoreDialog
          open={showRestore}
          onOpenChange={setShowRestore}
          backup={backup}
          onRestored={() => window.location.reload()}
        />
      )}
    </AdminLayout>
  )
}
