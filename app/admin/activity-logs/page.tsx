'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { cms } from '@/lib/cms-client'
import type { ActivityLog } from '@/lib/cms-client'
import { semanticColors } from '@/lib/design-tokens'
import { formatDateVi } from '@/lib/date-utils'

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  create: { label: 'Tạo mới', color: '#16a34a' },
  update: { label: 'Cập nhật', color: '#2563eb' },
  delete: { label: 'Xóa', color: '#dc2626' },
  reorder: { label: 'Sắp xếp', color: '#9333ea' },
  login: { label: 'Đăng nhập', color: '#0d9488' },
  logout: { label: 'Đăng xuất', color: '#6b7280' },
}

const COLLECTION_LABELS: Record<string, string> = {
  faqs: 'FAQ',
  coreValues: 'Giá trị cốt lõi',
  learningPathways: 'Lộ trình học',
  programs: 'Chương trình học',
  partners: 'Đối tác',
  events: 'Sự kiện',
  admissionSteps: 'Quy trình tuyển sinh',
  achievements: 'Thành tích',
  teamMembers: 'Đội ngũ',
  statistics: 'Thống kê',
  testimonials: 'Phản hồi PH',
  siteSettings: 'Cài đặt site',
  heroContent: 'Hero content',
  aboutContent: 'About content',
  leads: 'Lead liên hệ',
  blogPosts: 'Blog/Posts',
  navigation: 'Menu navigation',
  media: 'Media library',
  pages: 'Page Builder',
  auth: 'Xác thực',
}

function formatDate(value: ActivityLog['createdAt']) {
  return formatDateVi(value, '—')
}

export default function AdminActivityLogsPage() {
  const user = useRequireAdmin()
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState('')
  const [collectionFilter, setCollectionFilter] = useState('')
  const [search, setSearch] = useState('')

  const refresh = async () => {
    setIsLoading(true)
    try {
      const items = await cms.activityLogs.list({ limit: 200 })
      setLogs(items)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (user) refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const filtered = useMemo(() => {
    return logs.filter((log) => {
      if (actionFilter && log.action !== actionFilter) return false
      if (collectionFilter && log.collection !== collectionFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (
          !log.actorEmail.toLowerCase().includes(q) &&
          !log.actorName.toLowerCase().includes(q) &&
          !log.documentLabel.toLowerCase().includes(q) &&
          !log.collection.toLowerCase().includes(q)
        )
          return false
      }
      return true
    })
  }, [logs, actionFilter, collectionFilter, search])

  const collections = useMemo(() => {
    const set = new Set<string>()
    logs.forEach((l) => set.add(l.collection))
    return Array.from(set).sort()
  }, [logs])

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Lịch sử hoạt động"
      subtitle="Theo dõi mọi thao tác CRUD trong hệ thống"
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

      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4" style={{ color: semanticColors.textMuted }} />
            <span className="text-sm font-medium">Bộ lọc</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs block mb-1" style={{ color: semanticColors.textMuted }}>
                Tìm kiếm
              </label>
              <Input
                placeholder="Email, tên, nội dung..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: semanticColors.textMuted }}>
                Hành động
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
              >
                <option value="">— Tất cả —</option>
                {Object.entries(ACTION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1" style={{ color: semanticColors.textMuted }}>
                Module
              </label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={collectionFilter}
                onChange={(e) => setCollectionFilter(e.target.value)}
              >
                <option value="">— Tất cả —</option>
                {collections.map((c) => (
                  <option key={c} value={c}>
                    {COLLECTION_LABELS[c] || c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm mb-3" style={{ color: semanticColors.textMuted }}>
        Hiển thị {filtered.length} / {logs.length} mục
      </div>

      {isLoading ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          Đang tải…
        </p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: semanticColors.textMuted }}>
          {logs.length === 0
            ? 'Chưa có hoạt động nào được ghi nhận.'
            : 'Không có mục nào khớp bộ lọc.'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((log) => {
            const actionMeta = ACTION_LABELS[log.action] || {
              label: log.action,
              color: '#6b7280',
            }
            const collectionLabel = COLLECTION_LABELS[log.collection] || log.collection
            return (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                          style={{ backgroundColor: actionMeta.color }}
                        >
                          {actionMeta.label}
                        </span>
                        <span className="text-sm font-medium">{collectionLabel}</span>
                        {log.documentLabel && (
                          <span className="text-sm" style={{ color: semanticColors.textMuted }}>
                            · {log.documentLabel}
                          </span>
                        )}
                      </div>
                      <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                        {log.actorName || log.actorEmail || log.actorUid || 'Ẩn danh'}
                        {' · '}
                        {formatDate(log.createdAt)}
                        {log.ip && ` · ${log.ip}`}
                      </div>
                      {log.changes && (
                        <details className="mt-2">
                          <summary
                            className="text-xs cursor-pointer"
                            style={{ color: semanticColors.textMuted }}
                          >
                            Xem thay đổi
                          </summary>
                          <pre
                            className="text-xs mt-1 p-2 rounded overflow-x-auto"
                            style={{ backgroundColor: semanticColors.surfaceAlt }}
                          >
                            {JSON.stringify(log.changes, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}