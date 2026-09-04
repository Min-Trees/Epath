'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, X, Loader2 } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { review } from '@/lib/review-client'
import type { ReviewQueueItem } from '@/lib/review-client'
import { getCollectionLabel } from '@/lib/review/collection-labels'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminReviewQueuePage() {
  const user = useRequireAdmin()
  const [items, setItems] = useState<ReviewQueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterCollection, setFilterCollection] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const data = await review.queue()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const handleAction = async (
    item: ReviewQueueItem,
    to: 'APPROVED' | 'REJECTED',
    comment = ''
  ) => {
    setActionId(item.id)
    try {
      await review.transition(item.collection, item.id, to, comment)
      await fetchQueue()
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setActionId(null)
    }
  }

  const filtered = items.filter((item) => {
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase())
    const matchCollection = !filterCollection || item.collection === filterCollection
    return matchSearch && matchCollection
  })

  if (user === undefined) return null

  const collections = Array.from(new Set(items.map((i) => i.collection)))

  return (
    <AdminLayout
      title="Hàng chờ duyệt"
      subtitle={`${items.length} nội dung đang chờ được duyệt`}
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Input
          placeholder="Tìm kiếm tiêu đề..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-md border px-3 py-2 text-sm"
          value={filterCollection}
          onChange={(e) => setFilterCollection(e.target.value)}
          style={{ borderColor: 'rgba(35,31,32,0.15)' }}
        >
          <option value="">Tất cả collection</option>
          {collections.map((c) => (
            <option key={c} value={c}>
              {getCollectionLabel(c)}
            </option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={fetchQueue} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Làm mới'}
        </Button>
      </div>

      {/* Queue list */}
      {loading && items.length === 0 ? (
        <div className="text-center py-12" style={{ color: semanticColors.textMuted }}>
          <Loader2 className="w-8 h-8 mx-auto animate-spin mb-3" />
          Đang tải...
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center py-12 rounded-xl"
          style={{ backgroundColor: semanticColors.surface }}
        >
          <div className="text-4xl mb-3">🎉</div>
          <p className="font-medium" style={{ color: semanticColors.text }}>
            Hàng chờ duyệt trống
          </p>
          <p className="text-sm mt-1" style={{ color: semanticColors.textMuted }}>
            Không có nội dung nào đang chờ được duyệt.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={`${item.collection}-${item.id}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs px-2 py-1 rounded font-medium text-white"
                        style={{ backgroundColor: '#f59e0b' }}
                      >
                        {getCollectionLabel(item.collection)}
                      </span>
                      <span className="text-xs" style={{ color: semanticColors.textMuted }}>
                        {item.submittedAt
                          ? new Date(item.submittedAt).toLocaleString('vi-VN', { hour12: false })
                          : ''}
                      </span>
                    </div>
                    <div
                      className="font-semibold text-base mb-1 truncate"
                      style={{ color: semanticColors.text }}
                    >
                      {item.title || '(không có tiêu đề)'}
                    </div>
                    <div className="text-sm" style={{ color: semanticColors.textMuted }}>
                      Tạo bởi: {item.createdByName || item.createdByEmail || item.createdByUid}
                    </div>
                    <div className="mt-2">
                      <Link
                        href={`/admin/${item.collection}`}
                        className="text-sm underline"
                        style={{ color: semanticColors.primary }}
                      >
                        Xem trong collection →
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleAction(item, 'APPROVED')}
                      disabled={actionId === item.id}
                      style={{ backgroundColor: '#16a34a', color: '#fff' }}
                    >
                      {actionId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4 mr-1" />
                      )}
                      Duyệt
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const reason = prompt('Nhập lý do từ chối:')
                        if (reason) handleAction(item, 'REJECTED', reason)
                      }}
                      disabled={actionId === item.id}
                      style={{ color: '#dc2626', borderColor: '#fecaca' }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Từ chối
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AdminLayout>
  )
}
