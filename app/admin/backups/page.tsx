'use client'

import { useState } from 'react'
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
      <div className="rounded border border-gray-200 p-4 mb-4 bg-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-semibold" style={{ color: semanticColors.text }}>
              Tạo backup thủ công
            </h2>
            <p className="text-xs mt-0.5" style={{ color: semanticColors.textMuted }}>
              Backup sẽ export tất cả collections lên GCS bucket. Khuyến nghị chạy vào giờ thấp điểm.
            </p>
          </div>
          <Button
            onClick={handleCreateBackup}
            disabled={creating || !canCreate}
            className="rounded h-8 px-4 text-xs font-medium bg-[#1E3570] hover:bg-[#2A4B9B] text-white"
          >
            {creating ? 'Đang tạo...' : 'Backup ngay'}
          </Button>
        </div>
        {lastError && (
          <div className="mt-3 text-xs p-2.5 rounded bg-red-50 text-red-700 border border-red-200">{lastError}</div>
        )}
      </div>

      <BackupList />
    </AdminLayout>
  )
}
