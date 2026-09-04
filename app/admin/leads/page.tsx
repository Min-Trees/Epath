'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  RefreshCw,
  Phone,
  Mail,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  UserCheck,
  Archive,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { cms } from '@/lib/cms-client'
import type { Lead } from '@/lib/cms-client'
import type { LeadStatus } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { formatDateVi } from '@/lib/date-utils'

const STATUSES: { value: LeadStatus; label: string; color: string; icon: typeof Clock }[] = [
  { value: 'new', label: 'Mới', color: '#0d9488', icon: Clock },
  { value: 'contacted', label: 'Đã liên hệ', color: '#2563eb', icon: Phone },
  { value: 'qualified', label: 'Quan tâm', color: '#9333ea', icon: UserCheck },
  { value: 'converted', label: 'Đã chuyển đổi', color: '#16a34a', icon: CheckCircle2 },
  { value: 'archived', label: 'Lưu trữ', color: '#6b7280', icon: Archive },
]

const SOURCE_LABELS: Record<string, string> = {
  chatbot: 'Chatbot',
  'contact-form': 'Form liên hệ',
  zalo: 'Zalo',
  manual: 'Thủ công',
}

/**
 * Firestore trả `createdAt` về nhiều kiểu tuỳ context (Date, ISO string,
 * Firestore Timestamp, JSON-serialized Timestamp…), chuẩn hoá qua
 * `lib/date-utils` rồi format theo locale vi-VN.
 */
function formatDate(value: Lead['createdAt']) {
  return formatDateVi(value, '—')
}

export default function AdminLeadsPage() {
  const user = useRequireAdmin()
  const [leads, setLeads] = useState<Lead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<LeadStatus | ''>('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<Lead | null>(null)

  const refresh = async () => {
    setIsLoading(true)
    try {
      const items = await cms.leads.list({ limit: 200 })
      setLeads(items)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const counts = useMemo(() => {
    const out: Record<LeadStatus, number> = {
      new: 0, contacted: 0, qualified: 0, converted: 0, archived: 0,
    }
    leads.forEach((l) => {
      const status = l.status as LeadStatus
      out[status] = (out[status] || 0) + 1
    })
    return out
  }, [leads])

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter && lead.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !lead.name.toLowerCase().includes(q) &&
          !lead.phone.toLowerCase().includes(q) &&
          !lead.email.toLowerCase().includes(q) &&
          !lead.program.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [leads, statusFilter, search])

  const handleQuickStatus = async (lead: Lead, status: LeadStatus) => {
    await cms.leads.update(lead.id, { status })
    setLeads((prev) => prev.map((l) => (l.id === lead.id ? { ...l, status } : l)))
  }

  const handleDelete = async (lead: Lead) => {
    if (!confirm(`Xóa lead của "${lead.name || lead.phone}"?`)) return
    await cms.leads.remove(lead.id)
    setLeads((prev) => prev.filter((l) => l.id !== lead.id))
  }

  const handleSaveEdit = async (data: { status: LeadStatus; notes: string; assignedTo: string }) => {
    if (!editing) return
    await cms.leads.update(editing.id, data)
    setLeads((prev) =>
      prev.map((l) => (l.id === editing.id ? { ...l, ...data } : l))
    )
    setEditing(null)
  }

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Hộp thư liên hệ"
      subtitle="Quản lý các lead từ chatbot, form liên hệ và Zalo"
      actions={
        <Button variant="outline" onClick={refresh} disabled={isLoading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Làm mới
        </Button>
      }
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => setStatusFilter(statusFilter === s.value ? '' : s.value)}
            className="rounded-lg p-3 text-left border transition-all"
            style={{
              backgroundColor:
                statusFilter === s.value ? s.color : semanticColors.surface,
              borderColor: statusFilter === s.value ? s.color : 'rgba(35,31,32,0.1)',
              color: statusFilter === s.value ? 'white' : semanticColors.text,
            }}
          >
            <div className="text-xs opacity-80">{s.label}</div>
            <div className="text-2xl font-bold">{counts[s.value]}</div>
          </button>
        ))}
      </div>

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4" style={{ color: semanticColors.textMuted }} />
            <span className="text-sm font-medium">Bộ lọc</span>
          </div>
          <Input
            placeholder="Tìm theo tên, SĐT, email, chương trình..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="text-sm mb-3" style={{ color: semanticColors.textMuted }}>
        Hiển thị {filtered.length} / {leads.length} lead
      </div>

      {isLoading ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          {leads.length === 0
            ? 'Chưa có lead nào. Các lead từ chatbot và form sẽ xuất hiện ở đây.'
            : 'Không có lead nào khớp bộ lọc.'}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => {
            const status = STATUSES.find((s) => s.value === lead.status) ?? STATUSES[0]
            const StatusIcon = status.icon
            return (
              <Card key={lead.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <StatusIcon
                          className="w-4 h-4 shrink-0"
                          style={{ color: status.color }}
                        />
                        <span className="font-semibold">
                          {lead.name || '(Không tên)'}
                        </span>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: status.color, color: 'white' }}
                        >
                          {status.label}
                        </span>
                        <span className="text-xs" style={{ color: semanticColors.textMuted }}>
                          · {SOURCE_LABELS[lead.source] || lead.source}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5" style={{ color: semanticColors.textMuted }} />
                          <a href={`tel:${lead.phone}`} className="hover:underline">
                            {lead.phone}
                          </a>
                        </div>
                        {lead.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5" style={{ color: semanticColors.textMuted }} />
                            <a href={`mailto:${lead.email}`} className="hover:underline">
                              {lead.email}
                            </a>
                          </div>
                        )}
                      </div>
                      {(lead.program || lead.childAge || lead.campus) && (
                        <div className="mt-2 text-xs flex flex-wrap gap-x-3 gap-y-1" style={{ color: semanticColors.textMuted }}>
                          {lead.program && <span>CT: {lead.program}</span>}
                          {lead.childAge && <span>Tuổi: {lead.childAge}</span>}
                          {lead.campus && <span>Cơ sở: {lead.campus}</span>}
                        </div>
                      )}
                      {lead.topicsInterested.length > 0 && (
                        <div className="mt-1 text-xs" style={{ color: semanticColors.textMuted }}>
                          Quan tâm: {lead.topicsInterested.join(', ')}
                        </div>
                      )}
                      {lead.conversationSummary && (
                        <details className="mt-2">
                          <summary className="text-xs cursor-pointer" style={{ color: semanticColors.textMuted }}>
                            Tóm tắt hội thoại ({lead.conversationCount} tin)
                          </summary>
                          <pre
                            className="text-xs mt-1 p-2 rounded whitespace-pre-wrap"
                            style={{ backgroundColor: semanticColors.surfaceAlt }}
                          >
                            {lead.conversationSummary}
                          </pre>
                        </details>
                      )}
                      {lead.notes && (
                        <div className="mt-2 text-xs p-2 rounded" style={{ backgroundColor: semanticColors.surfaceAlt }}>
                          <strong>Ghi chú:</strong> {lead.notes}
                        </div>
                      )}
                      <div className="text-xs mt-2" style={{ color: semanticColors.textMuted }}>
                        {formatDate(lead.createdAt)}
                        {lead.assignedTo && ` · Phụ trách: ${lead.assignedTo}`}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {STATUSES.filter((s) => s.value !== lead.status).map((s) => (
                      <Button
                        key={s.value}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickStatus(lead, s.value)}
                        style={{ color: s.color, borderColor: s.color }}
                      >
                        <s.icon className="w-3 h-3 mr-1" />
                        {s.label}
                      </Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={() => setEditing(lead)}>
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(lead)}
                      style={{ color: semanticColors.cta }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Xóa
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {editing && (
        <EditLeadDialog
          lead={editing}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}
    </AdminLayout>
  )
}

function EditLeadDialog({
  lead,
  onClose,
  onSave,
}: {
  lead: Lead
  onClose: () => void
  onSave: (data: { status: LeadStatus; notes: string; assignedTo: string }) => Promise<void>
}) {
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [notes, setNotes] = useState(lead.notes || '')
  const [assignedTo, setAssignedTo] = useState(lead.assignedTo || '')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave({ status, notes, assignedTo })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa lead: {lead.name || lead.phone}</DialogTitle>
          <DialogDescription>
            Cập nhật trạng thái, ghi chú và người phụ trách.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Trạng thái</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeadStatus)}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Người phụ trách</Label>
            <Input
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              placeholder="Tên nhân viên"
            />
          </div>
          <div>
            <Label>Ghi chú</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              placeholder="Ghi chú nội bộ..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Hủy
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}