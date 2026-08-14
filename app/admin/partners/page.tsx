'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Partner } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'name', label: 'Tên đối tác', kind: 'text' as const },
  { key: 'logoUrl', label: 'URL Logo', kind: 'text' as const },
  { key: 'website', label: 'Website', kind: 'text' as const },
  {
    key: 'category',
    label: 'Loại',
    kind: 'select' as const,
    options: [
      { value: 'curriculum', label: 'Chương trình học' },
      { value: 'certification', label: 'Kiểm định' },
      { value: 'lab', label: 'Lab & trải nghiệm' },
      { value: 'other', label: 'Khác' },
    ],
  },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
  { key: 'isFeatured', label: 'Nổi bật (hiển thị trên Home)', kind: 'checkbox' as const },
]

export default function AdminPartnersPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Đối tác"
      subtitle="Quản lý danh sách đối tác. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <CrudList<Partner>
        title="Đối tác"
        fields={fields}
        load={cms.partners.list}
        create={(d) => cms.partners.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.partners.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.partners.remove}
        reorder={cms.partners.reorder}
        renderSummary={(item) => (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="text-xs px-2 py-1 rounded"
                style={{
                  color: semanticColors.primary,
                  backgroundColor: semanticColors.primaryBg,
                }}
              >
                {item.category}
              </div>
              {item.isFeatured && (
                <span
                  className="text-xs px-2 py-1 rounded"
                  style={{
                    color: '#fff',
                    backgroundColor: semanticColors.cta,
                  }}
                >
                  Nổi bật
                </span>
              )}
            </div>
            <div className="font-medium" style={{ color: semanticColors.text }}>
              {item.name}
            </div>
            <div className="text-sm line-clamp-2" style={{ color: semanticColors.textMuted }}>
              {item.description.vi}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}