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
  { key: 'logoUrl', label: 'Logo', kind: 'image' as const, placeholder: 'SVG/PNG, không giới hạn dung lượng', folder: 'partners' },
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
        reviewCollection="partners"
        renderSummary={(item) => (
          <div className="flex items-start gap-3">
            {item.logoUrl ? (
              <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] overflow-hidden bg-white shrink-0 flex items-center justify-center p-1">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.logoUrl}
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
            ) : (
              <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] bg-[#F6F5F1] shrink-0 flex items-center justify-center text-xs text-[#5C6069] font-bold">
                PARTNER
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="text-xs px-2 py-0.5 rounded font-medium"
                  style={{
                    color: semanticColors.primary,
                    backgroundColor: semanticColors.primaryBg,
                  }}
                >
                  {item.category}
                </div>
                {item.isFeatured && (
                  <span
                    className="text-xs px-2 py-0.5 rounded font-bold"
                    style={{
                      color: '#fff',
                      backgroundColor: semanticColors.cta,
                    }}
                  >
                    Nổi bật
                  </span>
                )}
              </div>
              <div className="font-semibold text-sm truncate" style={{ color: semanticColors.text }}>
                {item.name}
              </div>
              <div className="text-xs line-clamp-2 mt-0.5" style={{ color: semanticColors.textMuted }}>
                {item.description.vi || item.description.en}
              </div>
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}