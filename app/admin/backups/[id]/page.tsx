'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
        className="inline-block text-xs text-slate-500 hover:text-slate-800 mb-3"
      >
        ← Quay lại danh sách
      </Link>

      {loading ? (
        <div className="text-center py-12 text-gray-500 text-sm">Đang tải...</div>
      ) : !backup ? (
        <div className="text-center py-12 text-gray-500 text-sm">Backup không tồn tại.</div>
      ) : (
        <>
          <div className="rounded border border-gray-200 p-4 mb-4 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Trạng thái</div>
                <BackupStatusBadge status={backup.status} />
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Loại</div>
                <div className="font-medium text-sm">{backup.type}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Collections</div>
                <div className="font-medium text-sm">{backup.collections?.length || 0}</div>
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
              <div className="mt-3 text-xs text-red-600">Lỗi: {backup.error}</div>
            )}
            {backup.notes && (
              <div className="mt-3 text-xs text-gray-600 italic">Ghi chú: {backup.notes}</div>
            )}
          </div>

          <div className="rounded border border-gray-200 p-4 bg-white">
            <h3 className="font-semibold text-sm mb-3">Collections trong backup</h3>
            <div className="space-y-1">
              {(backup.collections || []).map((c) => (
                <div key={c} className="text-xs py-1 px-2 rounded hover:bg-gray-50 flex items-center">
                  <span className="font-mono text-xs text-gray-400 mr-2">•</span>
                  <span>{c}</span>
                </div>
              ))}
            </div>
          </div>

          {backup.status === 'completed' && (
            <div className="mt-4">
              <button
                onClick={() => setShowRestore(true)}
                className="inline-flex items-center px-4 py-2 rounded text-xs font-medium text-white bg-[#1E3570] hover:bg-[#2A4B9B]"
              >
                Khôi phục backup này
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
