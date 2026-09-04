'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HeroContent, PageSlug } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { ImagePicker } from './image-picker'

interface HeroContentFormProps {
  load: () => Promise<HeroContent[]>
  update: (id: string, data: Partial<HeroContent>) => Promise<unknown>
  create: (data: Partial<HeroContent>) => Promise<{ id: string }>
  remove?: (id: string) => Promise<unknown>
}

const defaultForm: Partial<HeroContent> = {
  pageId: 'home',
  welcome: { vi: '', en: '' },
  title: { vi: '', en: '' },
  subtitle: { vi: '', en: '' },
  description: { vi: '', en: '' },
  ctaLabel: { vi: '', en: '' },
  ctaUrl: '#programs',
  secondaryCtaLabel: { vi: '', en: '' },
  secondaryCtaUrl: '#contact',
  videoUrl: '',
  videoThumbnail: '',
  backgroundImage: '',
  isActive: true,
}

const PAGE_LABELS: Record<PageSlug, string> = {
  home: 'Trang chủ (Home)',
  about: 'Giới thiệu (About)',
  programs: 'Chương trình (Programs)',
  partners: 'Đối tác (Partners)',
  admissions: 'Tuyển sinh (Admissions)',
  events: 'Sự kiện (Events)',
}

export function HeroContentForm({ load, update, create, remove }: HeroContentFormProps) {
  const [items, setItems] = useState<HeroContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Partial<HeroContent>>(defaultForm)
  const [activePageId, setActivePageId] = useState<PageSlug>('home')

  const reload = useCallback(async () => {
    const data = await load()
    setItems(data)
    return data
  }, [load])

  const loadForPage = useCallback(
    (pageId: PageSlug, allItems: HeroContent[]) => {
      const found = allItems.find((it) => it.pageId === pageId)
      if (found) {
        setForm({ ...defaultForm, ...found })
      } else {
        setForm({ ...defaultForm, pageId })
      }
    },
    []
  )

  useEffect(() => {
    reload()
      .then((data) => loadForPage(activePageId, data))
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (next: PageSlug) => {
    setActivePageId(next)
    loadForPage(next, items)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const payload: Partial<HeroContent> = { ...form, pageId: activePageId }
      const existing = items.find((it) => it.pageId === activePageId)
      if (existing) {
        await update(existing.id, payload)
      } else {
        const created = await create(payload as HeroContent)
        setItems((prev) => [...prev, { ...(payload as HeroContent), id: created.id }])
      }
      const data = await reload()
      loadForPage(activePageId, data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!remove) return
    const existing = items.find((it) => it.pageId === activePageId)
    if (!existing) {
      setForm({ ...defaultForm, pageId: activePageId })
      return
    }
    if (!confirm('Xoá cấu hình hero cho trang này?')) return
    setIsSaving(true)
    setError(null)
    try {
      await remove(existing.id)
      const data = await reload()
      loadForPage(activePageId, data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const setField = <K extends keyof HeroContent>(key: K, value: HeroContent[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const setLocalized = <K extends keyof HeroContent>(
    key: K,
    lang: 'vi' | 'en',
    value: string
  ) => {
    const current = form[key] as { vi: string; en: string } | undefined
    setForm((prev) => ({
      ...prev,
      [key]: {
        vi: lang === 'vi' ? value : (current?.vi ?? ''),
        en: lang === 'en' ? value : (current?.en ?? ''),
      },
    }))
  }

  if (isLoading) {
    return (
      <div className="text-sm" style={{ color: semanticColors.textMuted }}>
        Đang tải…
      </div>
    )
  }

  const existingForPage = items.find((it) => it.pageId === activePageId)

  return (
    <div className="space-y-6">
      {error && (
        <div className="text-sm p-3 rounded" style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}>
          {error}
        </div>
      )}
      {success && (
        <div className="text-sm p-3 rounded" style={{ color: '#16a34a', backgroundColor: '#f0fdf4' }}>
          Đã lưu thành công!
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trang áp dụng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {(Object.keys(PAGE_LABELS) as PageSlug[]).map((pid) => {
              const hasRecord = items.some((it) => it.pageId === pid)
              const isActive = pid === activePageId
              return (
                <button
                  key={pid}
                  type="button"
                  onClick={() => handlePageChange(pid)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors"
                  style={{
                    backgroundColor: isActive ? '#3A53A3' : 'white',
                    color: isActive ? 'white' : '#231F20',
                    borderColor: isActive ? '#3A53A3' : '#e5e7eb',
                  }}
                >
                  {PAGE_LABELS[pid]}
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{ backgroundColor: hasRecord ? '#8BC53F' : '#d1d5db' }}
                    title={hasRecord ? 'Đã cấu hình' : 'Chưa có dữ liệu'}
                  />
                </button>
              )
            })}
          </div>
          <p className="text-xs" style={{ color: semanticColors.textMuted }}>
            Mỗi trang có một bản ghi hero riêng. Chuyển tab để chỉnh sửa từng trang.
            Chấm xanh = đã có dữ liệu, chấm xám = đang dùng fallback mặc định.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nội dung chính</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Welcome (VN)</Label>
            <Input
              value={(form.welcome as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('welcome', 'vi', e.target.value)}
              placeholder="Chào mừng đến với"
            />
          </div>
          <div>
            <Label>Welcome (EN)</Label>
            <Input
              value={(form.welcome as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('welcome', 'en', e.target.value)}
              placeholder="Welcome to"
            />
          </div>

          <div>
            <Label>Tiêu đề chính (VN)</Label>
            <Textarea
              value={(form.title as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('title', 'vi', e.target.value)}
              placeholder="EPath Education"
              rows={2}
            />
          </div>
          <div>
            <Label>Tiêu đề chính (EN)</Label>
            <Textarea
              value={(form.title as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('title', 'en', e.target.value)}
              placeholder="EPath Education"
              rows={2}
            />
          </div>

          <div>
            <Label>Phụ đề (VN)</Label>
            <Input
              value={(form.subtitle as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('subtitle', 'vi', e.target.value)}
              placeholder="Nơi khơi nguồn tương lai"
            />
          </div>
          <div>
            <Label>Phụ đề (EN)</Label>
            <Input
              value={(form.subtitle as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('subtitle', 'en', e.target.value)}
              placeholder="Igniting futures"
            />
          </div>

          <div>
            <Label>Mô tả (VN)</Label>
            <Textarea
              value={(form.description as { vi: string } | undefined)?.vi ?? ''}
              onChange={(e) => setLocalized('description', 'vi', e.target.value)}
              placeholder="Mô tả ngắn về EPath..."
              rows={3}
            />
          </div>
          <div>
            <Label>Mô tả (EN)</Label>
            <Textarea
              value={(form.description as { en: string } | undefined)?.en ?? ''}
              onChange={(e) => setLocalized('description', 'en', e.target.value)}
              placeholder="Short description about EPath..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Nút kêu gọi hành động (CTA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Label CTA chính (VN)</Label>
              <Input
                value={(form.ctaLabel as { vi: string } | undefined)?.vi ?? ''}
                onChange={(e) => setLocalized('ctaLabel', 'vi', e.target.value)}
                placeholder="Khám phá chương trình"
              />
            </div>
            <div>
              <Label>Label CTA chính (EN)</Label>
              <Input
                value={(form.ctaLabel as { en: string } | undefined)?.en ?? ''}
                onChange={(e) => setLocalized('ctaLabel', 'en', e.target.value)}
                placeholder="Explore programs"
              />
            </div>
          </div>
          <div>
            <Label>URL CTA chính</Label>
            <Input
              value={form.ctaUrl ?? ''}
              onChange={(e) => setField('ctaUrl', e.target.value)}
              placeholder="#programs"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Label CTA phụ (VN)</Label>
              <Input
                value={(form.secondaryCtaLabel as { vi: string } | undefined)?.vi ?? ''}
                onChange={(e) => setLocalized('secondaryCtaLabel', 'vi', e.target.value)}
                placeholder="Liên hệ tư vấn"
              />
            </div>
            <div>
              <Label>Label CTA phụ (EN)</Label>
              <Input
                value={(form.secondaryCtaLabel as { en: string } | undefined)?.en ?? ''}
                onChange={(e) => setLocalized('secondaryCtaLabel', 'en', e.target.value)}
                placeholder="Contact us"
              />
            </div>
          </div>
          <div>
            <Label>URL CTA phụ</Label>
            <Input
              value={form.secondaryCtaUrl ?? ''}
              onChange={(e) => setField('secondaryCtaUrl', e.target.value)}
              placeholder="#contact"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hình ảnh & Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImagePicker
            value={form.backgroundImage ?? ''}
            onChange={(url) => setField('backgroundImage', url)}
            label="Background Image"
            helperText="Ảnh nền cho phần hero. Không giới hạn dung lượng."
            folder="hero"
          />
          <div>
            <Label>Video URL (mp4 trực tiếp)</Label>
            <Input
              value={form.videoUrl ?? ''}
              onChange={(e) => setField('videoUrl', e.target.value)}
              placeholder="https://example.com/hero.mp4"
            />
            <p className="text-xs mt-1" style={{ color: semanticColors.textMuted }}>
              Hỗ trợ URL mp4 trực tiếp (kết thúc bằng .mp4 hoặc content-type video/mp4).
              Khi có video, ảnh nền sẽ chỉ dùng làm poster khi video lỗi.
            </p>
          </div>
          <ImagePicker
            value={form.videoThumbnail ?? ''}
            onChange={(url) => setField('videoThumbnail', url)}
            label="Video Thumbnail"
            helperText="Ảnh đại diện cho video. Không giới hạn dung lượng."
            folder="hero"
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center gap-3">
        <div className="text-xs" style={{ color: semanticColors.textMuted }}>
          {existingForPage
            ? `Đang chỉnh bản ghi #${existingForPage.id}`
            : 'Chưa có bản ghi cho trang này — lưu sẽ tạo mới'}
        </div>
        <div className="flex gap-2">
          {existingForPage && remove && (
            <Button variant="outline" onClick={handleDelete} disabled={isSaving}>
              <Trash2 className="w-4 h-4 mr-2" /> Xoá
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>
    </div>
  )
}
