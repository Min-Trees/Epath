'use client'

/**
 * ImagePicker — reusable component that lets admins either:
 *  - Pick a previously uploaded image from the CMS media library
 *  - Upload a NEW file directly to Viettel S3 (via /api/admin/upload)
 *  - Paste any external URL
 *
 * It binds to a single string value (the image URL). All other state
 * is local: a transient `error` string, an in-flight `uploading` flag,
 * and the open/close toggle for the gallery.
 *
 * Re-uses the picker everywhere via:
 *   <ImagePicker value={value} onChange={setValue} folder="core-values" />
 */
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { compressImageForUpload } from '@/lib/client-image'

export interface MediaItem {
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

export interface ImagePickerProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  helperText?: string
  /** Optional alt text (only used for accessibility on the preview). */
  altText?: string
  onAltTextChange?: (alt: string) => void
  /** Show the library tab even if no media has been uploaded yet. */
  showLibrary?: boolean
  /** Allow the URL-only tab (paste external link). Defaults to true. */
  allowUrl?: boolean
}

type Tab = 'upload' | 'library' | 'url'

export function ImagePicker({
  value,
  onChange,
  folder = 'cms',
  label,
  helperText,
  altText,
  onAltTextChange,
  showLibrary = true,
  allowUrl = true,
}: ImagePickerProps) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('upload')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loadingMedia, setLoadingMedia] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadMedia = async () => {
    setLoadingMedia(true)
    try {
      const res = await fetch('/api/cms/media', { cache: 'no-store' })
      const data = await res.json()
      setMedia(Array.isArray(data.items) ? data.items : [])
    } catch (err) {
      console.error('Failed to load media', err)
      setMedia([])
    } finally {
      setLoadingMedia(false)
    }
  }

  useEffect(() => {
    if (open && tab === 'library' && media.length === 0) {
      loadMedia()
    }
  }, [open, tab, media.length])

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const optimizedFile = await compressImageForUpload(file)
      const fd = new FormData()
      fd.append('file', optimizedFile)
      fd.append('folder', folder)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      if (!res.ok) {
        if (res.status === 413) {
          throw new Error('Dung lượng tệp quá lớn (vượt quá giới hạn máy chủ 4.5MB). Vui lòng chọn ảnh nhỏ hơn.')
        }
        let errMsg = 'Upload thất bại'
        try {
          const data = await res.json()
          errMsg = data.error || errMsg
        } catch {
          errMsg = `Lỗi máy chủ (${res.status} ${res.statusText})`
        }
        throw new Error(errMsg)
      }
      const data = await res.json()
      onChange(data.media.url)
      setOpen(false)
    } catch (err) {
      setError((err as Error).message || 'Upload thất bại')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!value) return
    if (!confirm('Xóa ảnh này?')) return
    try {
      // Find the media record to get S3 key
      const match = media.find((m) => m.url === value)
      if (match) {
        // Delete from S3 and Firestore
        await fetch(`/api/admin/upload?key=${encodeURIComponent(match.key)}`, {
          method: 'DELETE',
        })
      }
      onChange('')
      setMedia((prev) => prev.filter((m) => m.url !== value))
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'upload', label: 'Upload' },
    ...(showLibrary ? [{ id: 'library' as const, label: 'Thư viện' }] : []),
    ...(allowUrl ? [{ id: 'url' as const, label: 'URL ngoài' }] : []),
  ]

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex items-center gap-3">
        <div
          className="relative w-28 h-28 rounded overflow-hidden border bg-gray-50 flex items-center justify-center shrink-0"
          style={{ borderColor: 'rgba(35,31,32,0.15)' }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt={altText || ''}
              className="object-contain w-full h-full"
              style={{ imageRendering: 'auto' }}
              onError={(e) => {
                ;(e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span className="text-xs text-slate-400">Chưa có ảnh</span>
          )}
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="rounded h-8 text-xs">
              {value ? 'Thay ảnh' : 'Chọn ảnh'}
            </Button>
            {value && (
              <Button type="button" variant="outline" size="sm" onClick={handleDelete} className="rounded h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">
                Xóa
              </Button>
            )}
          </div>
          {value && (
            <div className="text-xs truncate font-mono" style={{ color: '#6B6B6B' }}>
              <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {value}
              </a>
            </div>
          )}
          {helperText && (
            <p className="text-xs" style={{ color: '#6B6B6B' }}>
              {helperText}
            </p>
          )}
          {onAltTextChange && value && (
            <Input
              placeholder="Alt text (mô tả ảnh cho SEO/a11y)"
              value={altText ?? ''}
              onChange={(e) => onAltTextChange(e.target.value)}
              className="rounded h-8 text-xs"
            />
          )}
        </div>
      </div>

      {open && (
        <div className="relative z-10 bg-white rounded border border-gray-200 shadow-md overflow-hidden mt-2">
          <div className="flex items-center justify-between p-3 border-b bg-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Chọn hình ảnh</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs text-gray-600 hover:text-gray-900 border border-gray-200 px-2 py-0.5 rounded hover:bg-gray-100 transition-colors"
              aria-label="Đóng"
            >
              Đóng
            </button>
          </div>

          <div className="flex gap-1.5 p-2.5 border-b" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1 text-xs font-medium rounded transition-all ${
                  tab === t.id
                    ? 'bg-[#3A53A3] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="mx-4 mt-3 text-xs p-2.5 rounded" style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}>
              {error}
            </div>
          )}

          <div className="max-h-[300px] overflow-y-auto p-4">
            {tab === 'upload' && (
              <div className="flex flex-col items-center justify-center">
                <div
                  className="border-2 border-dashed rounded p-6 text-center w-full transition-colors hover:border-[#3A53A3]"
                  style={{ borderColor: 'rgba(35,31,32,0.15)' }}
                >
                  <p className="text-sm mb-1 font-medium">Kéo thả hoặc chọn tệp để upload lên S3</p>
                  <p className="text-xs mb-3 text-gray-500">JPG, PNG, WebP, GIF, AVIF, SVG (tự động tối ưu dung lượng)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif,image/svg+xml"
                    className="hidden"
                    id="image-picker-upload"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleFile(f)
                    }}
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    size="sm"
                    className="rounded h-8 text-xs"
                  >
                    {uploading ? 'Đang upload…' : 'Chọn tệp'}
                  </Button>
                </div>
              </div>
            )}

            {tab === 'library' && (
              <div className="flex flex-col">
                {loadingMedia ? (
                  <div className="flex items-center justify-center py-8 text-gray-500">Đang tải thư viện…</div>
                ) : media.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
<div className="text-base mb-2">Thư viện trống</div>
                      <div className="text-sm">Hãy upload tệp mới ở tab Upload</div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {media.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          onChange(m.url)
                          setOpen(false)
                        }}
                        className="relative aspect-square rounded overflow-hidden border hover:border-[#3A53A3] transition-all"
                        style={{ borderColor: 'rgba(35,31,32,0.15)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.url}
                          alt={m.altText || m.fileName}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-[10px] truncate px-2 py-1">
                          {m.fileName}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center mt-3 pt-3 border-t text-sm text-gray-500" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
                  <span>{media.length} ảnh</span>
                  <button
                    type="button"
                    className="text-[#3A53A3] hover:underline font-medium"
                    onClick={() => loadMedia()}
                  >
                    Tải lại
                  </button>
                </div>
              </div>
            )}

            {tab === 'url' && (
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">URL hình ảnh</Label>
                  <Input
                    className="text-base"
                    placeholder="https://..."
                    defaultValue={value}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const url = (e.currentTarget.value || '').trim()
                        if (url) {
                          onChange(url)
                          setOpen(false)
                        }
                      }
                    }}
                  />
                </div>
<p className="text-sm text-gray-500">
                    Nhấn Enter để lưu. Có thể paste link ảnh từ bất kỳ CDN nào.
                  </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
