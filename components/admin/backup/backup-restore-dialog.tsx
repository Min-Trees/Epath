'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import type { Backup } from '@/lib/cms-types'
import { REVIEWABLE_COLLECTIONS, CollectionNames } from '@/lib/cms-types'

const ALL_COLLECTIONS = [
  ...REVIEWABLE_COLLECTIONS,
  CollectionNames.siteSettings,
  CollectionNames.heroContent,
  CollectionNames.aboutContent,
  CollectionNames.leads,
]

export interface BackupRestoreDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  backup: Backup
  onRestored?: () => void
}

export function BackupRestoreDialog({ open, onOpenChange, backup, onRestored }: BackupRestoreDialogProps) {
  const [mode, setMode] = useState<'full' | 'collection'>('full')
  const [selectedCollection, setSelectedCollection] = useState('')
  const [preRestore, setPreRestore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRestore = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/cms/backup/${backup.id}/restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          collection: mode === 'collection' ? selectedCollection : undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Restore failed')
        return
      }
      onOpenChange(false)
      onRestored?.()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Khôi phục backup</DialogTitle>
          <DialogDescription>
            Khôi phục dữ liệu từ backup {new Date(backup.startedAt).toLocaleString('vi-VN')}. 
            Hành động này sẽ tạo pre-restore snapshot trước.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && (
            <div className="text-sm p-3 rounded-lg bg-red-50 text-red-700">{error}</div>
          )}
          <div className="space-y-2">
            <Label>Chế độ khôi phục</Label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'full'} onChange={() => setMode('full')} />
                <span>Khôi phục toàn bộ ({ALL_COLLECTIONS.length} collections)</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="mode" checked={mode === 'collection'} onChange={() => setMode('collection')} />
                <span>Khôi phục 1 collection</span>
              </label>
            </div>
          </div>
          {mode === 'collection' && (
            <div className="space-y-2">
              <Label>Chọn collection</Label>
              <select
                className="w-full rounded-md border p-2"
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
              >
                <option value="">-- Chọn collection --</option>
                {(backup.collections?.length ? backup.collections : ALL_COLLECTIONS).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preRestore}
              onChange={(e) => setPreRestore(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Tạo pre-restore snapshot trước khi khôi phục (khuyến nghị)</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button
            onClick={handleRestore}
            disabled={
              loading ||
              (mode === 'collection' && !selectedCollection) ||
              !preRestore
            }
          >
            {loading ? 'Đang khôi phục...' : 'Khôi phục'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
