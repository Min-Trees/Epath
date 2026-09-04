'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown, ArrowUp, Edit, Plus, Trash2, Power, Star } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { semanticColors } from '@/lib/design-tokens'
import { RichTextEditor, RichTextEditorMultilang } from './rich-text-editor'
import type { BlogPost, BlogPostInput } from '@/lib/cms-types'
import { LocalizedStringSchema } from '@/lib/cms-types'

interface Props {
  title: string
  fields: { key: string; label: string; multilang?: boolean; kind?: string }[]
  load: () => Promise<BlogPost[]>
  create: (data: BlogPostInput) => Promise<{ id: string }>
  update: (id: string, data: Partial<BlogPostInput>) => Promise<unknown>
  remove: (id: string) => Promise<unknown>
  reorder: (ids: string[]) => Promise<unknown>
  reviewCollection?: string
}

function emptyLocalized() {
  return { vi: '', en: '' }
}

function tagsToString(tags: string[]) {
  return tags.join(', ')
}

function stringToTags(value: string) {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export function BlogPostList({
  title,
  load,
  create,
  update,
  remove,
  reorder,
  reviewCollection,
}: Props) {
  const [items, setItems] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refresh = async () => {
    try {
      const list = await load()
      setItems(list)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleSubmit = async (data: BlogPostInput) => {
    try {
      if (editing?.id) {
        await update(editing.id, data as Partial<BlogPostInput>)
      } else {
        // order / isActive default to 0 / true from Zod schema on the server.
        await create(data)
      }
      setIsOpen(false)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa bài viết này?')) return
    try {
      await remove(id)
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleToggle = async (item: BlogPost) => {
    try {
      await update(item.id, { isActive: !item.isActive })
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleToggleFeatured = async (item: BlogPost) => {
    try {
      await update(item.id, { isFeatured: !item.isFeatured })
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleMove = async (index: number, direction: -1 | 1) => {
    const next = [...items]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    setItems(next)
    try {
      await reorder(next.map((i) => i.id))
    } catch (err) {
      setError((err as Error).message)
      await refresh()
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-sm p-3 rounded" style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}>
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => { setEditing(null); setIsOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" /> Đăng bài mới
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Chưa có bài viết. Bấm "Đăng bài mới" để bắt đầu.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full text-white"
                        style={{
                          backgroundColor: item.status === 'PUBLISHED' ? '#16a34a' : item.status === 'PENDING_REVIEW' ? '#f59e0b' : item.status === 'REJECTED' ? '#dc2626' : item.status === 'SCHEDULED' ? '#8b5cf6' : '#6b7280',
                        }}
                      >
                        {item.status === 'PUBLISHED' ? 'Đã đăng' : item.status === 'PENDING_REVIEW' ? 'Chờ duyệt' : item.status === 'REJECTED' ? 'Bị từ chối' : item.status === 'SCHEDULED' ? 'Lên lịch' : item.status === 'ARCHIVED' ? 'Lưu trữ' : 'Bản nháp'}
                      </span>
                      {item.isFeatured && (
                        <span className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#9333ea' }}>
                          Nổi bật
                        </span>
                      )}
                      <span className="text-xs" style={{ color: semanticColors.textMuted }}>
                        /{item.slug}
                      </span>
                      {item.category && (
                        <span className="text-xs" style={{ color: semanticColors.textMuted }}>· {item.category}</span>
                      )}
                    </div>
                    <div className="font-medium truncate">
                      {item.title?.vi || '(Không tiêu đề)'}
                    </div>
                    <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                      {item.author && `${item.author} · `}
                      {item.publishedAt && new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                      {item.readingTimeMinutes && ` · ${item.readingTimeMinutes} phút đọc`}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex gap-1">
                      <Button variant="outline" size="icon" onClick={() => handleMove(index, -1)} disabled={index === 0}>
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleMove(index, 1)} disabled={index === items.length - 1}>
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggle(item)}
                        title={item.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                      >
                        <Power className="w-4 h-4" style={{ color: item.isActive ? semanticColors.primary : semanticColors.textMuted }} />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggleFeatured(item)}
                        title={item.isFeatured ? 'Bài nổi bật' : 'Đánh dấu nổi bật'}
                      >
                        <Star className="w-4 h-4" style={{ color: item.isFeatured ? '#9333ea' : semanticColors.textMuted }} />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => { setEditing(item); setIsOpen(true) }}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(item.id)} style={{ color: semanticColors.cta }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isOpen && (
        <BlogPostDialog
          initial={editing}
          onClose={() => { setIsOpen(false); setEditing(null) }}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}

function BlogPostDialog({
  initial,
  onClose,
  onSubmit,
}: {
  initial: BlogPost | null
  onClose: () => void
  onSubmit: (data: BlogPostInput) => Promise<void>
}) {
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [status, setStatus] = useState<string>(initial?.status ?? 'DRAFT')
  const [category, setCategory] = useState(initial?.category ?? '')
  const [title, setTitle] = useState(initial?.title ?? emptyLocalized())
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? emptyLocalized())
  const [content, setContent] = useState(initial?.content ?? emptyLocalized())
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? '')
  const [coverImageAlt, setCoverImageAlt] = useState(initial?.coverImageAlt ?? '')
  const [author, setAuthor] = useState(initial?.author ?? '')
  const [publishedAt, setPublishedAt] = useState(
    initial?.publishedAt || new Date().toISOString().slice(0, 10)
  )
  const [tagsText, setTagsText] = useState(tagsToString(initial?.tags ?? []))
  const [readingTime, setReadingTime] = useState(initial?.readingTimeMinutes ?? 5)
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async () => {
    if (!slug.trim()) {
      alert('Slug là bắt buộc')
      return
    }
    setSaving(true)
    try {
      await onSubmit({
        slug: slug.trim(),
        status: status as 'DRAFT' | 'PENDING_REVIEW' | 'REJECTED' | 'APPROVED' | 'SCHEDULED' | 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED',
        rejectionReason: initial?.rejectionReason ?? '',
        scheduledAt: initial?.scheduledAt ?? '',
        publishedAt: new Date(publishedAt).toISOString(),
        createdByUid: initial?.createdByUid ?? '',
        createdByEmail: initial?.createdByEmail ?? '',
        createdByName: initial?.createdByName ?? '',
        lastReviewerUid: initial?.lastReviewerUid ?? '',
        lastReviewerEmail: initial?.lastReviewerEmail ?? '',
        lastReviewerName: initial?.lastReviewerName ?? '',
        submittedAt: initial?.submittedAt ?? '',
        reviewedAt: initial?.reviewedAt ?? '',
        category,
        title,
        excerpt,
        content,
        coverImage,
        coverImageAlt,
        author,
        tags: stringToTags(tagsText),
        readingTimeMinutes: readingTime,
        isFeatured,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Sửa bài viết' : 'Đăng bài mới'}</DialogTitle>
          <DialogDescription>
            Mỗi trường có 2 phiên bản ngôn ngữ. Bấm Lưu để xuất bản hoặc lưu nháp.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Slug (URL) *</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="bai-viet-1" />
            </div>
            <div>
              <Label>Trạng thái</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PENDING_REVIEW">Chờ duyệt</option>
                <option value="REJECTED">Bị từ chối</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="SCHEDULED">Lên lịch</option>
                <option value="PUBLISHED">Đã xuất bản</option>
                <option value="UNPUBLISHED">Gỡ xuất bản</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
            </div>
            <div>
              <Label>Danh mục</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Tin tức / Sự kiện / Kiến thức" />
            </div>
            <div>
              <Label>Tác giả</Label>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
            <div>
              <Label>Ngày xuất bản</Label>
              <Input type="date" value={publishedAt.slice(0, 10)} onChange={(e) => setPublishedAt(e.target.value)} />
            </div>
            <div>
              <Label>Thời gian đọc (phút)</Label>
              <Input type="number" min={1} value={readingTime} onChange={(e) => setReadingTime(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <Label>Tiêu đề</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Input placeholder="Tiếng Việt" value={title.vi} onChange={(e) => setTitle((p) => ({ ...p, vi: e.target.value }))} />
              <Input placeholder="English" value={title.en} onChange={(e) => setTitle((p) => ({ ...p, en: e.target.value }))} />
            </div>
          </div>

          <div>
            <Label>Mô tả ngắn</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Textarea placeholder="Tiếng Việt" value={excerpt.vi} onChange={(e) => setExcerpt((p) => ({ ...p, vi: e.target.value }))} rows={3} />
              <Textarea placeholder="English" value={excerpt.en} onChange={(e) => setExcerpt((p) => ({ ...p, en: e.target.value }))} rows={3} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Ảnh bìa (URL)</Label>
              <Input value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label>Alt ảnh</Label>
              <Input value={coverImageAlt} onChange={(e) => setCoverImageAlt(e.target.value)} />
            </div>
          </div>

          <div>
            <Label>Tags (phân cách bằng dấu phẩy)</Label>
            <Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="gd-vbl, kindergarten, tips" />
          </div>

          <div>
            <Label>Nội dung (TipTap - multilang)</Label>
            <div className="mt-1">
              <RichTextEditorMultilang
                fieldKey="blog-content"
                value={content}
                onChange={setContent}
                placeholder="Nội dung bài viết…"
                minHeight="250px"
              />
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <span className="text-sm">Đánh dấu nổi bật</span>
          </label>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Hủy</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? 'Đang lưu…' : status === 'PUBLISHED' ? 'Xuất bản' : 'Lưu nháp'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}