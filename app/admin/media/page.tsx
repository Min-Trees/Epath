'use client'

/**
 * /admin/media — Media Library.
 *
 * Provides a single place to:
 *   - See every file uploaded to the S3 bucket
 *   - Upload new files (drag-and-drop or picker)
 *   - Copy the public URL of any file
 *   - Delete a file (removes both the S3 object and the CMS record)
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AdminLayout,
  useRequireAdmin,
} from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { semanticColors } from '@/lib/design-tokens'
import { Copy, Loader2, Trash2, Upload } from 'lucide-react'

interface MediaItem {
  id: string
  key: string
  url: string
  bucket: string
  fileName: string
  mimeType: string
  size: number
  folder: string
  uploadedBy: string
  uploaderEmail: string
  uploaderName: string
  uploadedAt: string
  altText: string
}

const ACCEPT = 'image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml'

function formatSize(bytes: number) {
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let n = bytes
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i += 1
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`
}

export default function AdminMediaPage() {
  const user = useRequireAdmin()
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [configured, setConfigured] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/upload', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Không tải được thư viện')
      }
      setItems(Array.isArray(data.items) ? data.items : [])
      setConfigured(typeof data.configured === 'boolean' ? data.configured : true)
    } catch (err) {
      setError((err as Error).message || 'Không tải được thư viện')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError(null)
    setUploading(true)
    try {
      for (const file of Array.from(files)) {
        if (file.type && !ACCEPT.split(',').includes(file.type)) {
          throw new Error(`Tệp ${file.name} không đúng định dạng`)
        }
        const fd = new FormData()
        fd.append('file', file)
        fd.append('folder', 'cms')
        const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload thất bại')
      }
      await refresh()
    } catch (err) {
      setError((err as Error).message || 'Upload thất bại')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (m: MediaItem) => {
    if (!confirm(`Xóa vĩnh viễn ${m.fileName}?`)) return
    setError(null)
    try {
      const res = await fetch(`/api/admin/upload?key=${encodeURIComponent(m.key)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xóa thất bại')
      await refresh()
    } catch (err) {
      setError((err as Error).message || 'Xóa thất bại')
    }
  }

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Đã copy URL vào clipboard')
    } catch {
      // Fallback: prompt
      prompt('Copy URL:', url)
    }
  }

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Thư viện Media"
      subtitle="Tất cả ảnh đã upload lên Viettel S3 (CloudStorage)."
      actions={
        <>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang upload…
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload ảnh
              </>
            )}
          </Button>
        </>
      }
    >
      {configured === false && (
        <div
          className="text-sm p-4 rounded mb-4"
          style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
        >
          S3 chưa được cấu hình (thiếu S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_BUCKET trong .env.local).
        </div>
      )}
      {error && (
        <div
          className="text-sm p-3 rounded mb-4"
          style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
        >
          {error}
        </div>
      )}

      <div
        className="text-sm p-4 rounded mb-4"
        style={{ color: semanticColors.textMuted, backgroundColor: semanticColors.surface }}
      >
        Tổng cộng <strong>{items.length}</strong> ảnh. Upload tệp JPG/PNG/WebP/GIF/AVIF/SVG. Không giới hạn dung lượng.
        Tệp sẽ được gắn vào bucket <code>epath-images-website</code>.
      </div>

      {loading ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Thư viện trống. Nhấn “Upload ảnh” để thêm tệp.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <CardContent className="p-3 space-y-2">
                <div className="aspect-square rounded-md overflow-hidden border bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.url}
                    alt={m.altText || m.fileName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="text-xs truncate" title={m.fileName}>
                  {m.fileName}
                </div>
                <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                  {formatSize(m.size)} · {m.folder}
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => copyUrl(m.url)}
                  >
                    <Copy className="w-3 h-3 mr-1" /> URL
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(m)}
                    style={{ color: '#dc2626' }}
                    aria-label="Xóa"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
