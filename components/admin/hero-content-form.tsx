'use client'

import { useEffect, useState } from 'react'
import { Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { HeroContent, PageSlug } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

interface HeroContentFormProps {
  load: () => Promise<HeroContent[]>
  update: (id: string, data: Partial<HeroContent>) => Promise<unknown>
  create: (data: Partial<HeroContent>) => Promise<{ id: string }>
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

export function HeroContentForm({ load, update, create }: HeroContentFormProps) {
  const [items, setItems] = useState<HeroContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState<Partial<HeroContent>>(defaultForm)

  useEffect(() => {
    load()
      .then((data) => {
        setItems(data)
        if (data.length > 0) {
          setForm({ ...defaultForm, ...data[0] })
        }
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setIsLoading(false))
  }, [load])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSuccess(false)
    try {
      if (items.length > 0) {
        await update(items[0].id, form)
      } else {
        await create(form as HeroContent)
      }
      const data = await load()
      setItems(data)
      if (data.length > 0) {
        setForm({ ...defaultForm, ...data[0] })
      }
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
        <CardContent>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={form.pageId ?? 'home'}
            onChange={(e) => setField('pageId', e.target.value as PageSlug)}
          >
            <option value="home">Trang chủ (Home)</option>
            <option value="about">Giới thiệu (About)</option>
            <option value="programs">Chương trình (Programs)</option>
            <option value="admissions">Tuyển sinh (Admissions)</option>
            <option value="events">Sự kiện (Events)</option>
            <option value="partners">Đối tác (Partners)</option>
          </select>
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
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={form.backgroundImage ?? ''}
              onChange={(e) => setField('backgroundImage', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <Label>Video URL (YouTube/Vimeo)</Label>
            <Input
              value={form.videoUrl ?? ''}
              onChange={(e) => setField('videoUrl', e.target.value)}
              placeholder="https://youtube.com/embed/..."
            />
          </div>
          <div>
            <Label>Video Thumbnail URL</Label>
            <Input
              value={form.videoThumbnail ?? ''}
              onChange={(e) => setField('videoThumbnail', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </div>
    </div>
  )
}
