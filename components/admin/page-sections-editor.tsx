'use client'

/**
 * PageSectionsEditor - reorder, toggle, delete, and edit per-section content.
 *
 * Each section is a `PageSection` stored in Firestore under
 * `pages/{pageId}/sections/{id}` with shape:
 *
 *   {
 *     id, pageId, type, order, isActive,
 *     data: {
 *       title?:   { vi: string, en: string },   // plain text, multilang
 *       subtitle?: { vi: string, en: string },  // plain text, multilang
 *       body?:    { vi: string, en: string },   // TipTap HTML, multilang
 *     }
 *   }
 *
 * `title` and `subtitle` are plain text (rendered as `<h2>`/`<p>`).
 * `body` is rich text (TipTap HTML). Other keys are passed through as-is.
 *
 * Hero sections get extra media fields (backgroundImage, videoUrl,
 * videoThumbnail, welcome, cta*, secondaryCta*). Those values are
 * mirrored into the `heroContent` collection so the public `HeroSection`
 * component picks them up without needing a second loader.
 *
 * Drafts:
 *   - The dialog auto-saves `data` to localStorage per `sectionId` while
 *     the user is editing. A banner offers Restore / Discard if an
 *     orphan draft is detected on mount.
 */
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Plus, Save, Trash2, Power, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { semanticColors } from '@/lib/design-tokens'
import type { PageSection, SectionType } from '@/lib/pages-repo'
import { RichTextEditorMultilang } from './rich-text-editor'
import { ImagePicker } from './image-picker'
import { useDraft } from '@/lib/use-draft'
import { cms } from '@/lib/cms-client'
import type { HeroContent } from '@/lib/cms-types'

const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Hero / Banner',
  intro: 'Lời mở đầu',
  vision: 'Tầm nhìn',
  mission: 'Sứ mệnh',
  coreValues: 'Giá trị cốt lõi',
  learningPathways: 'Lộ trình học',
  stepModel: 'Mô hình STEP',
  statistics: 'Thống kê',
  testimonials: 'Phản hồi phụ huynh',
  partners: 'Đối tác',
  achievements: 'Thành tích',
  whyEdmentum: 'Vì sao chọn Edmentum',
  faqs: 'FAQ',
  admissionSteps: 'Quy trình tuyển sinh',
  pricing: 'Học phí',
  team: 'Đội ngũ',
  cta: 'CTA / Liên hệ',
  featuredCourses: 'Khóa học nổi bật',
}

const SECTION_TYPES: SectionType[] = Object.keys(SECTION_LABELS) as SectionType[]

interface Props {
  pageId: 'home' | 'about' | 'programs' | 'partners' | 'admissions' | 'events'
  title: string
  subtitle?: string
}

interface SectionData {
  title?: { vi: string; en: string }
  subtitle?: { vi: string; en: string }
  body?: { vi: string; en: string }
  // Hero-only fields. These mirror the `heroContent` collection schema
  // and are synced to it on save so the public HeroSection picks them up.
  welcome?: { vi: string; en: string }
  description?: { vi: string; en: string }
  ctaLabel?: { vi: string; en: string }
  ctaUrl?: string
  secondaryCtaLabel?: { vi: string; en: string }
  secondaryCtaUrl?: string
  backgroundImage?: string
  videoUrl?: string
  videoThumbnail?: string
}

function emptyLocalized(): { vi: string; en: string } {
  return { vi: '', en: '' }
}

export function PageSectionsEditor({ pageId, title, subtitle }: Props) {
  const [sections, setSections] = useState<PageSection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [draftType, setDraftType] = useState<SectionType>('hero')
  const [editing, setEditing] = useState<PageSection | null>(null)

  const refresh = async () => {
    setIsLoading(true)
    const res = await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'list', pageId }),
    })
    const data = await res.json()
    setSections(data.sections || [])
    setIsLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [pageId])

  const handleMove = async (index: number, dir: -1 | 1) => {
    const next = [...sections]
    const target = index + dir
    if (target < 0 || target >= next.length) return
    const [moved] = next.splice(index, 1)
    next.splice(target, 0, moved)
    const updated = next.map((s, i) => ({ ...s, order: i }))
    setSections(updated)
    await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'reorder',
        pageId,
        ids: updated.map((s) => s.id),
      }),
    })
  }

  const handleAdd = async () => {
    const id = `${draftType}-${Date.now()}`
    const newSection: PageSection = {
      id,
      pageId,
      type: draftType,
      order: sections.length,
      isActive: true,
      data: {},
    }
    await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert', section: newSection }),
    })
    setIsAddOpen(false)
    refresh()
  }

  const handleToggle = async (section: PageSection) => {
    const updated = { ...section, isActive: !section.isActive }
    setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)))
    await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert', section: updated }),
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xoá section này?')) return
    await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', pageId, id }),
    })
    refresh()
  }

  const handleSaveContent = async (section: PageSection, newData: SectionData) => {
    const updated = { ...section, data: { ...section.data, ...newData } as Record<string, unknown> }
    setSections((prev) => prev.map((s) => (s.id === section.id ? updated : s)))
    await fetch('/api/cms/pages/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'upsert', section: updated }),
    })
    setEditing(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: semanticColors.text }}>
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm" style={{ color: semanticColors.textMuted }}>
              {subtitle}
            </p>
          )}
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm section
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </p>
      ) : sections.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Chưa có section. Bấm “Thêm section” để bắt đầu.
        </p>
      ) : (
        <div className="space-y-2">
          {sections.map((section, index) => {
            const d = (section.data ?? {}) as SectionData
            const hasContent =
              !!d.title?.vi ||
              !!d.title?.en ||
              !!d.subtitle?.vi ||
              !!d.subtitle?.en ||
              !!d.body?.vi ||
              !!d.body?.en
            return (
              <Card key={section.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium" style={{ color: semanticColors.text }}>
                        {SECTION_LABELS[section.type]}
                      </div>
                      <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                        {section.id} • Thứ tự {index + 1}
                        {hasContent ? ' • Đã có nội dung' : ' • Trống'}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap justify-end">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditing(section)}
                        aria-label="Edit content"
                        title="Sửa nội dung"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMove(index, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === sections.length - 1}
                        aria-label="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleToggle(section)}
                        title={section.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                      >
                        <Power
                          className="w-4 h-4"
                          style={{
                            color: section.isActive
                              ? semanticColors.primary
                              : semanticColors.textMuted,
                          }}
                        />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(section.id)}
                        style={{ color: semanticColors.cta }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Add section dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md w-[calc(100vw-2rem)]">
          <DialogHeader>
            <DialogTitle>Thêm section mới</DialogTitle>
            <DialogDescription>
              Chọn loại section. Nội dung chi tiết có thể sửa sau khi thêm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="section-type-select">Loại section</Label>
            <select
              id="section-type-select"
              className="flex h-11 w-full rounded-lg border bg-background px-3 py-2 text-sm"
              style={{ borderColor: 'rgba(35,31,32,0.15)' }}
              value={draftType}
              onChange={(e) => setDraftType(e.target.value as SectionType)}
            >
              {SECTION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {SECTION_LABELS[t]}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleAdd}>
              <Save className="w-4 h-4 mr-2" />
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit content dialog */}
      {editing && (
        <SectionContentDialog
          section={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => handleSaveContent(editing, data)}
        />
      )}
    </div>
  )
}

function SectionContentDialog({
  section,
  onClose,
  onSave,
}: {
  section: PageSection
  onClose: () => void
  onSave: (data: SectionData, syncHero?: boolean) => Promise<void>
}) {
  const initial = (section.data ?? {}) as SectionData
  const [title, setTitle] = useState<SectionData['title']>(initial.title ?? emptyLocalized())
  const [subtitle, setSubtitle] = useState<SectionData['subtitle']>(initial.subtitle ?? emptyLocalized())
  const [body, setBody] = useState<SectionData['body']>(initial.body ?? emptyLocalized())
  const [saving, setSaving] = useState(false)

  // Hero-only state
  const isHero = section.type === 'hero'
  const [welcome, setWelcome] = useState<SectionData['welcome']>(initial.welcome ?? emptyLocalized())
  const [description, setDescription] = useState<SectionData['description']>(initial.description ?? emptyLocalized())
  const [ctaLabel, setCtaLabel] = useState<SectionData['ctaLabel']>(initial.ctaLabel ?? emptyLocalized())
  const [ctaUrl, setCtaUrl] = useState<string>(initial.ctaUrl ?? '#programs')
  const [secondaryCtaLabel, setSecondaryCtaLabel] = useState<SectionData['secondaryCtaLabel']>(initial.secondaryCtaLabel ?? emptyLocalized())
  const [secondaryCtaUrl, setSecondaryCtaUrl] = useState<string>(initial.secondaryCtaUrl ?? '#contact')
  const [backgroundImage, setBackgroundImage] = useState<string>(initial.backgroundImage ?? '')
  const [videoUrl, setVideoUrl] = useState<string>(initial.videoUrl ?? '')
  const [videoThumbnail, setVideoThumbnail] = useState<string>(initial.videoThumbnail ?? '')

  // Draft key tied to this specific section's body field.
  // (We only draft the rich-text body because title/subtitle are short
  // plain inputs and don't need elaborate recovery.)
  const draftBody = useDraft<string>({
    key: `pages:${section.pageId}:${section.id}:body`,
    value: `${body?.vi ?? ''}|${body?.en ?? ''}`,
    initialValue: `${initial.body?.vi ?? ''}|${initial.body?.en ?? ''}`,
  })

  // If an orphan draft is detected on mount, prompt via window.confirm -
  // a tiny inline recovery that's enough for body data.
  useEffect(() => {
    if (draftBody.hasDraft && typeof window !== 'undefined') {
      const ok = window.confirm(
        'Có bản nháp nội dung chưa lưu cho section này. Khôi phục?'
      )
      if (ok) {
        const restored = draftBody.restore()
        const idx = restored.indexOf('|')
        const vi = idx >= 0 ? restored.slice(0, idx) : restored
        const en = idx >= 0 ? restored.slice(idx + 1) : ''
        setBody({ vi, en })
      } else {
        draftBody.discard()
      }
    }
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleBodyChange = (next: { vi: string; en: string }) => {
    setBody(next)
  }

  const syncHeroContent = async (next: SectionData) => {
    if (!isHero) return
    try {
      const items = await cms.heroContent.list()
      const existing = items.find((it) => (it as HeroContent).pageId === section.pageId)
      const payload: Partial<HeroContent> = {
        pageId: section.pageId as HeroContent['pageId'],
        welcome: next.welcome ?? emptyLocalized(),
        title: next.title ?? emptyLocalized(),
        subtitle: next.subtitle ?? emptyLocalized(),
        description: next.description ?? emptyLocalized(),
        ctaLabel: next.ctaLabel ?? emptyLocalized(),
        ctaUrl: next.ctaUrl,
        secondaryCtaLabel: next.secondaryCtaLabel ?? emptyLocalized(),
        secondaryCtaUrl: next.secondaryCtaUrl,
        videoUrl: next.videoUrl,
        videoThumbnail: next.videoThumbnail,
        backgroundImage: next.backgroundImage,
        isActive: true,
      }
      if (existing) {
        await cms.heroContent.update(existing.id, payload)
      } else {
        await cms.heroContent.create(payload as HeroContent)
      }
    } catch (err) {
      // Surface the error so the admin knows the hero didn't sync.
      console.warn('Failed to sync heroContent from page builder:', err)
      throw err
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const data: SectionData = {
        title,
        subtitle,
        body,
        welcome,
        description,
        ctaLabel,
        ctaUrl,
        secondaryCtaLabel,
        secondaryCtaUrl,
        backgroundImage,
        videoUrl,
        videoThumbnail,
      }
      await onSave(data, isHero)
      if (isHero) await syncHeroContent(data)
      draftBody.markSaved()
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    draftBody.discard()
    onClose()
  }

  return (
    <Dialog open onOpenChange={(o) => !o && handleCancel()}>
      <DialogContent className="max-w-3xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
          <DialogTitle>
            Sửa nội dung: {SECTION_LABELS[section.type]}
          </DialogTitle>
          <DialogDescription>
            Mỗi field có bản nháp riêng, tự động lưu vào trình duyệt. Bấm Lưu để ghi vào CMS.
            {isHero && ' Các trường media cũng sẽ được đồng bộ sang Hero Content để hiển thị trên trang.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 min-h-0">
          {isHero && (
            <>
              <div>
                <Label>Welcome</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Tiếng Việt"
                    value={welcome?.vi ?? ''}
                    onChange={(e) => setWelcome((p) => ({ ...(p ?? emptyLocalized()), vi: e.target.value }))}
                  />
                  <Input
                    placeholder="English"
                    value={welcome?.en ?? ''}
                    onChange={(e) => setWelcome((p) => ({ ...(p ?? emptyLocalized()), en: e.target.value }))}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label>Tiêu đề</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt"
                value={title?.vi ?? ''}
                onChange={(e) => setTitle((p) => ({ ...(p ?? emptyLocalized()), vi: e.target.value }))}
              />
              <Input
                placeholder="English"
                value={title?.en ?? ''}
                onChange={(e) => setTitle((p) => ({ ...(p ?? emptyLocalized()), en: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label>Phụ đề</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt"
                value={subtitle?.vi ?? ''}
                onChange={(e) => setSubtitle((p) => ({ ...(p ?? emptyLocalized()), vi: e.target.value }))}
              />
              <Input
                placeholder="English"
                value={subtitle?.en ?? ''}
                onChange={(e) => setSubtitle((p) => ({ ...(p ?? emptyLocalized()), en: e.target.value }))}
              />
            </div>
          </div>

          {isHero && (
            <>
              <div>
                <Label>Mô tả</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <TextareaCompact
                    placeholder="Tiếng Việt"
                    value={description?.vi ?? ''}
                    onChange={(v) => setDescription((p) => ({ ...(p ?? emptyLocalized()), vi: v }))}
                  />
                  <TextareaCompact
                    placeholder="English"
                    value={description?.en ?? ''}
                    onChange={(v) => setDescription((p) => ({ ...(p ?? emptyLocalized()), en: v }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>CTA chính - Label</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      placeholder="Tiếng Việt"
                      value={ctaLabel?.vi ?? ''}
                      onChange={(e) => setCtaLabel((p) => ({ ...(p ?? emptyLocalized()), vi: e.target.value }))}
                    />
                    <Input
                      placeholder="English"
                      value={ctaLabel?.en ?? ''}
                      onChange={(e) => setCtaLabel((p) => ({ ...(p ?? emptyLocalized()), en: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>CTA chính - URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="#programs"
                    value={ctaUrl}
                    onChange={(e) => setCtaUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>CTA phụ - Label</Label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input
                      placeholder="Tiếng Việt"
                      value={secondaryCtaLabel?.vi ?? ''}
                      onChange={(e) => setSecondaryCtaLabel((p) => ({ ...(p ?? emptyLocalized()), vi: e.target.value }))}
                    />
                    <Input
                      placeholder="English"
                      value={secondaryCtaLabel?.en ?? ''}
                      onChange={(e) => setSecondaryCtaLabel((p) => ({ ...(p ?? emptyLocalized()), en: e.target.value }))}
                    />
                  </div>
                </div>
                <div>
                  <Label>CTA phụ - URL</Label>
                  <Input
                    className="mt-1"
                    placeholder="#contact"
                    value={secondaryCtaUrl}
                    onChange={(e) => setSecondaryCtaUrl(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Background Image</Label>
                <div className="mt-1 min-w-0">
                  <ImagePicker
                    value={backgroundImage}
                    onChange={setBackgroundImage}
                    label="Ảnh nền hero"
                    helperText="Ảnh nền tĩnh cho hero. Sẽ làm poster khi video lỗi."
                    folder={`hero-${section.pageId}`}
                  />
                </div>
              </div>

              <div>
                <Label>Video URL (mp4 trực tiếp)</Label>
                <Input
                  className="mt-1"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://example.com/hero.mp4"
                />
                <p className="text-xs mt-1" style={{ color: semanticColors.textMuted }}>
                  Hỗ trợ URL mp4/webm trực tiếp hoặc URL embed YouTube/Vimeo.
                </p>
              </div>

              <div>
                <Label>Video Thumbnail</Label>
                <div className="mt-1 min-w-0">
                  <ImagePicker
                    value={videoThumbnail}
                    onChange={setVideoThumbnail}
                    label="Ảnh đại diện video"
                    helperText="Ảnh hiển thị trước khi video play hoặc khi video lỗi."
                    folder={`hero-${section.pageId}`}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <Label>Nội dung (TipTap - multilang)</Label>
            <div className="mt-1">
              <RichTextEditorMultilang
                fieldKey={`pages:${section.pageId}:${section.id}:body`}
                value={body}
                onChange={handleBodyChange}
                placeholder="Nhập nội dung section…"
                minHeight="200px"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t shrink-0 gap-2" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
          <Button variant="outline" onClick={handleCancel} disabled={saving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function TextareaCompact({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[80px]"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  )
}