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
import { RichTextEditor, RichTextEditorMultilang } from './rich-text-editor'
import { useDraft } from '@/lib/use-draft'

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
      <div className="flex justify-between items-center">
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
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium" style={{ color: semanticColors.text }}>
                        {SECTION_LABELS[section.type]}
                      </div>
                      <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                        {section.id} • Thứ tự {index + 1}
                        {hasContent ? ' • Đã có nội dung' : ' • Trống'}
                      </div>
                    </div>
                    <div className="flex gap-1">
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
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMove(index, 1)}
                        disabled={index === sections.length - 1}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm section mới</DialogTitle>
            <DialogDescription>
              Chọn loại section. Nội dung chi tiết có thể sửa sau khi thêm.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label>Loại section</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          <DialogFooter>
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
  onSave: (data: SectionData) => Promise<void>
}) {
  const initial = (section.data ?? {}) as SectionData
  const [title, setTitle] = useState<SectionData['title']>(initial.title ?? emptyLocalized())
  const [subtitle, setSubtitle] = useState<SectionData['subtitle']>(initial.subtitle ?? emptyLocalized())
  const [body, setBody] = useState<SectionData['body']>(initial.body ?? emptyLocalized())
  const [saving, setSaving] = useState(false)

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

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({ title, subtitle, body })
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Sửa nội dung: {SECTION_LABELS[section.type]}
          </DialogTitle>
          <DialogDescription>
            Mỗi field có bản nháp riêng, tự động lưu vào trình duyệt. Bấm Lưu để ghi vào CMS.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
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

        <DialogFooter>
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