'use client'

/**
 * Generic CRUD list view for a CMS collection. Supports:
 *  - Add / Edit / Delete via dialogs
 *  - Reorder by drag (mouse only) or via move up/down buttons
 *  - Toggle isActive
 */
import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Edit, Plus, Trash2, Power, History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { RichTextEditor, RichTextEditorMultilang } from './rich-text-editor'
import { ImagePicker } from './image-picker'
import { ReviewStatusBadge } from './review/review-status-badge'
import { ReviewActions } from './review/review-actions'
import { ReviewHistoryTimeline } from './review/review-history-timeline'
import { ReviewFeedbackBanner } from './review/review-feedback-banner'

export interface CrudFieldDef {
  key: string
  label: string
  kind: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'image' | 'richtext'
  options?: { value: string; label: string }[]
  placeholder?: string
  multilang?: boolean
  /** Used when kind === 'image' — the S3 folder name to upload into. */
  folder?: string
}

export interface CrudItemBase {
  id: string
  order: number
  isActive: boolean
}

export type CrudItem = CrudItemBase & Record<string, unknown>

export interface CrudListProps<T extends CrudItem> {
  title: string
  subtitle?: string
  fields: CrudFieldDef[]
  load: () => Promise<T[]>
  create: (data: Record<string, unknown>) => Promise<{ id: string }>
  update: (id: string, data: Record<string, unknown>) => Promise<unknown>
  remove: (id: string) => Promise<unknown>
  reorder: (ids: string[]) => Promise<unknown>
  renderSummary?: (item: T) => React.ReactNode
  /** Tên collection trong Firestore. Nếu có, sẽ bật UI review workflow. */
  reviewCollection?: string
}

export function CrudList<T extends CrudItem>({
  title,
  subtitle,
  fields,
  load,
  create,
  update,
  remove,
  reorder,
  renderSummary,
  reviewCollection,
}: CrudListProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState<T | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]> | null>(null)

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

  const openCreate = () => {
    setEditing(null)
    setIsDialogOpen(true)
  }

  const openEdit = (item: T) => {
    setEditing(item)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (form: Record<string, unknown>) => {
    try {
      setFieldErrors(null)
      if (editing?.id) {
        await update(editing.id, form)
      } else {
        await create({ ...form, order: items.length, isActive: true })
      }
      setIsDialogOpen(false)
      setEditing(null)
      await refresh()
      // Reload page to ensure all caches are cleared
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    } catch (err) {
      const msg = (err as Error).message
      setError(msg)
      // Server-side validation errors come back as JSON like
      // `{"error":"Validation failed","details":{"fieldErrors":{"level":["..."]}}}`
      // Try to surface per-field errors so the dialog highlights them.
      try {
        const parsed = JSON.parse(msg) as {
          details?: { fieldErrors?: Record<string, string[]> }
        }
        if (parsed.details?.fieldErrors) {
          setFieldErrors(parsed.details.fieldErrors)
        }
      } catch {
        // not JSON, leave as plain error
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Xóa mục này?')) return
    try {
      await remove(id)
      await refresh()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleToggleActive = async (item: T) => {
    try {
      await update(item.id, { isActive: !item.isActive })
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
        <div
          className="text-sm p-3 rounded"
          style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
        >
          {error}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" /> Thêm mới
        </Button>
      </div>

      {isLoading ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Chưa có dữ liệu. Bấm “Thêm mới” để bắt đầu.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex flex-col gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMove(index, -1)}
                        aria-label="Move up"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleMove(index, 1)}
                        aria-label="Move down"
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex-1 min-w-0">
                      {reviewCollection && (item as { status?: string }).status && (
                        <div className="mb-2">
                          <ReviewStatusBadge status={(item as { status?: string }).status as never} />
                        </div>
                      )}
                      {renderSummary ? (
                        renderSummary(item)
                      ) : (
                        <Summary item={item} fields={fields} />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`px-2 py-1 rounded text-xs font-medium ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {item.isActive ? 'Hiển thị' : 'Ẩn'}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleActive(item)}
                      aria-label="Toggle active"
                      title={item.isActive ? 'Đang hiển thị' : 'Đang ẩn'}
                    >
                      <Power
                        className="w-4 h-4"
                        style={{
                          color: item.isActive ? semanticColors.primary : semanticColors.textMuted,
                        }}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(item)}
                      aria-label="Edit"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete"
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                      style={{ color: semanticColors.cta }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CrudDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditing(null)
            setFieldErrors(null)
            setShowHistory(false)
          }
        }}
        title={editing ? `Chỉnh sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}
        fields={fields}
        initial={editing as unknown as Record<string, unknown> | null}
        fieldErrors={fieldErrors}
        onSubmit={handleSubmit}
        reviewCollection={reviewCollection}
        editing={editing ? (editing as Record<string, unknown>) : null}
        showHistory={showHistory}
        onToggleHistory={() => setShowHistory((v) => !v)}
        onRefresh={refresh}
      />
    </div>
  )
}

function Summary({ item, fields }: { item: CrudItem; fields: CrudFieldDef[] }) {
  return (
    <div>
      {fields.slice(0, 2).map((f) => {
        const raw = item[f.key]
        if (f.multilang && raw && typeof raw === 'object') {
          return (
            <div key={f.key}>
              <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                {f.label}
              </div>
              <div className="font-medium truncate">{(raw as { vi?: string }).vi}</div>
            </div>
          )
        }
        if (typeof raw === 'string' && raw) {
          return (
            <div key={f.key}>
              <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                {f.label}
              </div>
              <div className="font-medium truncate">{raw}</div>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}

function CrudDialog({
  open,
  onOpenChange,
  title,
  fields,
  initial,
  fieldErrors,
  onSubmit,
  reviewCollection,
  editing,
  showHistory,
  onToggleHistory,
  onRefresh,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fields: CrudFieldDef[]
  initial: Record<string, unknown> | null
  fieldErrors?: Record<string, string[]> | null
  onSubmit: (data: Record<string, unknown>) => void
  reviewCollection?: string
  editing?: Record<string, unknown> | null
  showHistory?: boolean
  onToggleHistory?: () => void
  onRefresh?: () => Promise<void> | void
}) {
  const [form, setForm] = useState<Record<string, unknown>>({})

  useEffect(() => {
    if (open) {
      const next: Record<string, unknown> = {}
      fields.forEach((f) => {
        const v = initial?.[f.key]
        if (f.multilang) {
          next[f.key] = v ?? { vi: '', en: '' }
        } else {
          // For required selects/text, default to '' rather than undefined
          // so Zod sees the field as present (and the dialog still
          // surfaces a validation error if no value was chosen).
          if (v !== undefined && v !== null) {
            next[f.key] = v
          } else if (f.kind === 'checkbox') {
            next[f.key] = false
          } else if (f.kind === 'number') {
            next[f.key] = 0
          } else {
            next[f.key] = ''
          }
        }
      })
      setForm(next)
    }
  }, [open, initial, fields])

  const handle = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const submit = () => onSubmit(form)

  const errorList = fieldErrors
    ? Object.entries(fieldErrors)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
        .join('\n')
    : null

  const status = (initial?.status || 'DRAFT') as string
  const isLocked = ['PENDING_REVIEW', 'SCHEDULED', 'PUBLISHED', 'ARCHIVED'].includes(status)
  const showReviewUI = !!reviewCollection && !!editing?.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[calc(100vw-2rem)] max-h-[90vh] overflow-y-auto rounded-xl border border-gray-200 shadow-2xl">
        <DialogHeader className="pb-4 border-b" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
          <div className="flex items-center gap-2 flex-wrap">
            <DialogTitle className="text-xl">{title}</DialogTitle>
            {showReviewUI && (
              <ReviewStatusBadge status={status as never} />
            )}
          </div>
          <DialogDescription>
            {isLocked
              ? 'Nội dung đang ở trạng thái khóa - chỉ xem, không thể sửa trực tiếp.'
              : 'Điền đầy đủ thông tin bên dưới rồi lưu lại.'}
          </DialogDescription>
        </DialogHeader>
        {showReviewUI && (
          <ReviewFeedbackBanner
            status={status}
            rejectionReason={initial?.rejectionReason as string}
            scheduledAt={initial?.scheduledAt as string}
            publishedAt={initial?.publishedAt as string}
            lastReviewerName={initial?.lastReviewerName as string}
            lastReviewerEmail={initial?.lastReviewerEmail as string}
          />
        )}
        {errorList && (
          <div
            className="text-sm p-3 rounded-lg whitespace-pre-wrap"
            style={{ color: '#dc2626', backgroundColor: '#fef2f2' }}
          >
            {errorList}
          </div>
        )
        }
        <div className="space-y-4 py-4">
          {fields.map((f) => (
            <div key={f.key} style={{ pointerEvents: isLocked ? 'none' : 'auto', opacity: isLocked ? 0.6 : 1 }}>
              <FieldRow
                field={f}
                value={form[f.key]}
                onChange={(v) => handle(f.key, v)}
                error={fieldErrors?.[f.key]?.[0]}
              />
            </div>
          ))}
        </div>
        {showReviewUI && (
          <div className="space-y-3 p-4 rounded-lg border" style={{ backgroundColor: '#fafafa', borderColor: 'rgba(35,31,32,0.1)' }}>
            <ReviewActions
              collection={reviewCollection!}
              documentId={editing!.id as string}
              status={status as never}
              onActionCompleted={async () => {
                if (onRefresh) await onRefresh()
                onOpenChange(false)
              }}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleHistory}
              className="mt-1"
            >
              <History className="w-4 h-4 mr-1" />
              {showHistory ? 'Ẩn lịch sử' : 'Xem lịch sử'}
            </Button>
            {showHistory && (
              <ReviewHistoryTimeline collection={reviewCollection!} documentId={editing!.id as string} />
            )}
          </div>
        )}
        <DialogFooter className="pt-4 border-t shrink-0" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={submit} disabled={isLocked}>
            {isLocked ? 'Không thể lưu' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FieldRow({
  field,
  value,
  onChange,
  error,
}: {
  field: CrudFieldDef
  value: unknown
  onChange: (v: unknown) => void
  error?: string
}) {
  if (field.multilang) {
    const obj = (value as { vi?: string; en?: string } | undefined) ?? { vi: '', en: '' }
    if (field.kind === 'richtext') {
      return (
        <div className="space-y-3 p-4 rounded-lg border bg-gray-50/50" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
          <Label className="font-semibold">{field.label}</Label>
          <RichTextEditorMultilang
            fieldKey={field.key}
            value={obj}
            onChange={(next) => onChange(next)}
            placeholder={field.placeholder}
          />
        </div>
      )
    }
    return (
      <div className="space-y-3 p-4 rounded-lg border bg-gray-50/50" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
        <Label className="font-semibold">{field.label}</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-[#3A53A3] text-white">VI</span>
              <span className="text-xs text-gray-500">Tiếng Việt</span>
            </div>
            {field.kind === 'textarea' ? (
              <Textarea
                value={obj.vi ?? ''}
                onChange={(e) => onChange({ ...obj, vi: e.target.value })}
                placeholder={field.placeholder}
                className="min-h-[80px]"
              />
            ) : (
              <Input
                value={obj.vi ?? ''}
                onChange={(e) => onChange({ ...obj, vi: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium px-2 py-1 rounded bg-gray-600 text-white">EN</span>
              <span className="text-xs text-gray-500">English</span>
            </div>
            {field.kind === 'textarea' ? (
              <Textarea
                value={obj.en ?? ''}
                onChange={(e) => onChange({ ...obj, en: e.target.value })}
                placeholder={field.placeholder}
                className="min-h-[80px]"
              />
            ) : (
              <Input
                value={obj.en ?? ''}
                onChange={(e) => onChange({ ...obj, en: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  if (field.kind === 'select') {
    return (
      <div className="space-y-2">
        <Label className="font-medium">{field.label}</Label>
        <select
          className="flex h-11 w-full rounded-lg border bg-background px-4 py-2 text-sm"
          style={{
            borderColor: error ? '#dc2626' : 'rgba(35,31,32,0.15)',
          }}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">— Chọn —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{error}</p>}
      </div>
    )
  }

  if (field.kind === 'checkbox') {
    return (
      <label className="flex items-center gap-3 p-3 rounded-lg border bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 rounded accent-[#3A53A3]"
        />
        <span className="text-sm font-medium">{field.label}</span>
      </label>
    )
  }

  if (field.kind === 'textarea') {
    return (
      <div className="space-y-2">
        <Label className="font-medium">{field.label}</Label>
        <Textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className="min-h-[100px]"
          style={{ borderColor: error ? '#dc2626' : 'rgba(35,31,32,0.15)' }}
        />
        {error && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{error}</p>}
      </div>
    )
  }

  if (field.kind === 'richtext') {
    return (
      <div className="space-y-2">
        <Label className="font-medium">{field.label}</Label>
        <RichTextEditor
          draftKey={field.key}
          value={(value as string) ?? ''}
          onChange={(html) => onChange(html)}
          placeholder={field.placeholder}
        />
      </div>
    )
  }

  if (field.kind === 'image') {
    return (
      <ImagePicker
        value={(value as string) ?? ''}
        onChange={(url) => onChange(url)}
        label={field.label}
        helperText={field.placeholder}
        folder={field.folder || 'cms'}
      />
    )
  }

  return (
    <div className="space-y-2">
      <Label className="font-medium">{field.label}</Label>
      <Input
        type={field.kind === 'number' ? 'number' : 'text'}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(field.kind === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
        className="h-11"
        style={{ borderColor: error ? '#dc2626' : 'rgba(35,31,32,0.15)' }}
      />
      {error && <p className="text-xs mt-1" style={{ color: '#dc2626' }}>{error}</p>}
    </div>
  )
}