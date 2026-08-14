'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { CmsEvent } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tên sự kiện', kind: 'text' as const, multilang: true },
  { key: 'slug', label: 'Slug', kind: 'text' as const },
  { key: 'shortDescription', label: 'Mô tả ngắn', kind: 'richtext' as const, multilang: true },
  { key: 'content', label: 'Nội dung chi tiết', kind: 'richtext' as const, multilang: true },
  { key: 'startDate', label: 'Ngày bắt đầu (YYYY-MM-DD)', kind: 'text' as const },
  { key: 'endDate', label: 'Ngày kết thúc', kind: 'text' as const },
  { key: 'location', label: 'Địa điểm', kind: 'text' as const },
  { key: 'imageUrl', label: 'URL ảnh đại diện', kind: 'text' as const },
  { key: 'registerUrl', label: 'URL đăng ký', kind: 'text' as const },
  {
    key: 'status',
    label: 'Trạng thái',
    kind: 'select' as const,
    options: [
      { value: 'upcoming', label: 'Sắp diễn ra' },
      { value: 'ongoing', label: 'Đang diễn ra' },
      { value: 'completed', label: 'Đã kết thúc' },
      { value: 'cancelled', label: 'Đã huỷ' },
    ],
  },
  { key: 'isFeatured', label: 'Nổi bật', kind: 'checkbox' as const },
]

export default function AdminEventsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Sự kiện"
      subtitle="Quản lý sự kiện. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <CrudList<CmsEvent>
        title="Sự kiện"
        fields={fields}
        load={cms.events.list}
        create={(d) => cms.events.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.events.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.events.remove}
        reorder={cms.events.reorder}
        renderSummary={(item) => (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs px-2 py-1 rounded"
                style={{
                  color: semanticColors.primary,
                  backgroundColor: semanticColors.primaryBg,
                }}
              >
                {item.status}
              </span>
              <span className="text-xs" style={{ color: semanticColors.textMuted }}>
                {item.startDate}
              </span>
            </div>
            <div className="font-medium" style={{ color: semanticColors.text }}>
              {item.title.vi}
            </div>
            <div className="text-sm line-clamp-2" style={{ color: semanticColors.textMuted }}>
              {item.shortDescription.vi}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}