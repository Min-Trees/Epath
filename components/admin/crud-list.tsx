'use client'

/**
 * Generic CRUD list view for a CMS collection. Supports:
 *  - Add / Edit / Delete via dialogs
 *  - Reorder by drag (mouse only) or via move up/down buttons
 *  - Toggle isActive
 */
import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, Edit, Plus, Trash2, Power } from 'lucide-react'
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

export interface CrudFieldDef {
  key: string
  label: string
  kind: 'text' | 'textarea' | 'number' | 'select' | 'checkbox' | 'image' | 'richtext'
  options?: { value: string; label: string }[]
  placeholder?: string
  multilang?: boolean
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
}: CrudListProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editing, setEditing] = useState<T | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
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
      if (editing?.id) {
        await update(editing.id, form)
      } else {
        await create({ ...form, order: items.length, isActive: true })
      }
      setIsDialogOpen(false)
      setEditing(null)
      await refresh()
    } catch (err) {
      setError((err as Error).message)
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
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {renderSummary ? (
                      renderSummary(item)
                    ) : (
                      <Summary item={item} fields={fields} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMove(index, -1)}
                        aria-label="Move up"
                        disabled={index === 0}
                      >
                        <ArrowUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleMove(index, 1)}
                        aria-label="Move down"
                        disabled={index === items.length - 1}
                      >
                        <ArrowDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
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
                        size="icon"
                        onClick={() => openEdit(item)}
                        aria-label="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Delete"
                        style={{ color: semanticColors.cta }}
                      >
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

      <CrudDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditing(null)
        }}
        title={editing ? `Chỉnh sửa ${title.toLowerCase()}` : `Thêm ${title.toLowerCase()}`}
        fields={fields}
        initial={editing as unknown as Record<string, unknown> | null}
        onSubmit={handleSubmit}
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
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  fields: CrudFieldDef[]
  initial: Record<string, unknown> | null
  onSubmit: (data: Record<string, unknown>) => void
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
          next[f.key] = v ?? (f.kind === 'checkbox' ? false : '')
        }
      })
      setForm(next)
    }
  }, [open, initial, fields])

  const handle = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }))

  const submit = () => onSubmit(form)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Điền đầy đủ thông tin bên dưới rồi lưu lại.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {fields.map((f) => (
            <FieldRow key={f.key} field={f} value={form[f.key]} onChange={(v) => handle(f.key, v)} />
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={submit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FieldRow({
  field,
  value,
  onChange,
}: {
  field: CrudFieldDef
  value: unknown
  onChange: (v: unknown) => void
}) {
  if (field.multilang) {
    const obj = (value as { vi?: string; en?: string } | undefined) ?? { vi: '', en: '' }
    if (field.kind === 'richtext') {
      return (
        <div className="space-y-2">
          <Label>{field.label}</Label>
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
      <div className="space-y-2 border rounded-md p-3" style={{ borderColor: 'rgba(35,31,32,0.1)' }}>
        <Label>{field.label}</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-xs mb-1" style={{ color: semanticColors.textMuted }}>
              Tiếng Việt
            </div>
            {field.kind === 'textarea' ? (
              <Textarea
                value={obj.vi ?? ''}
                onChange={(e) => onChange({ ...obj, vi: e.target.value })}
                placeholder={field.placeholder}
              />
            ) : (
              <Input
                value={obj.vi ?? ''}
                onChange={(e) => onChange({ ...obj, vi: e.target.value })}
                placeholder={field.placeholder}
              />
            )}
          </div>
          <div>
            <div className="text-xs mb-1" style={{ color: semanticColors.textMuted }}>
              English
            </div>
            {field.kind === 'textarea' ? (
              <Textarea
                value={obj.en ?? ''}
                onChange={(e) => onChange({ ...obj, en: e.target.value })}
                placeholder={field.placeholder}
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
      <div>
        <Label>{field.label}</Label>
        <select
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
      </div>
    )
  }

  if (field.kind === 'checkbox') {
    return (
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-sm">{field.label}</span>
      </label>
    )
  }

  if (field.kind === 'textarea') {
    return (
      <div>
        <Label>{field.label}</Label>
        <Textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    )
  }

  if (field.kind === 'richtext') {
    return (
      <div>
        <Label>{field.label}</Label>
        <RichTextEditor
          draftKey={field.key}
          value={(value as string) ?? ''}
          onChange={(html) => onChange(html)}
          placeholder={field.placeholder}
        />
      </div>
    )
  }

  return (
    <div>
      <Label>{field.label}</Label>
      <Input
        type={field.kind === 'number' ? 'number' : 'text'}
        value={(value as string) ?? ''}
        onChange={(e) => onChange(field.kind === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={field.placeholder}
      />
    </div>
  )
}