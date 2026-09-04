'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HardDriveDownload, Loader2 } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { BackupList } from '@/components/admin/backup/backup-list'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminBackupsPage() {
  const user = useRequireAdmin()
  const [creating, setCreating] = useState(false)
  const [lastError, setLastError] = useState('')

  const handleCreateBackup = async () => {
    if (!confirm('Tạo backup ngay? Hành động này sẽ export dữ liệu lên GCS.')) return
    setCreating(true)
    setLastError('')
    try {
      const res = await fetch('/api/cms/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setLastError(data.error || 'Backup failed')
        return
      }
    } catch (err) {
      setLastError((err as Error).message)
    } finally {
      setCreating(false)
    }
  }

  if (user === undefined) return null

  const canCreate = user?.role === 'super_admin' || user?.role === 'admin'

  return (
    <AdminLayout
      title="Backup dữ liệu"
      subtitle="Quản lý backup Firestore sang GCS. Tự động chạy vào Chủ Nhật hàng tuần."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: semanticColors.surface, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-base font-semibold" style={{ color: semanticColors.text }}>
              Tạo backup thủ công
            </h2>
            <p className="text-sm mt-1" style={{ color: semanticColors.textMuted }}>
              Backup sẽ export tất cả collections lên GCS bucket. Khuyến nghị chạy vào giờ thấp điểm.
            </p>
          </div>
          <Button
            onClick={handleCreateBackup}
            disabled={creating || !canCreate}
            className="gap-2"
          >
            {creating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Đang tạo...</>
            ) : (
              <><HardDriveDownload className="w-4 h-4" /> Backup ngay</>
            )}
          </Button>
        </div>
        {lastError && (
          <div className="mt-4 text-sm p-3 rounded-lg bg-red-50 text-red-700">{lastError}</div>
        )}
      </div>

      <BackupList />
    </AdminLayout>
  )
}
