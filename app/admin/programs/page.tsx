'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Program } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tên chương trình', kind: 'text' as const, multilang: true },
  { key: 'slug', label: 'Slug', kind: 'text' as const },
  {
    key: 'level',
    label: 'Cấp học',
    kind: 'select' as const,
    options: [
      { value: 'kindergarten', label: 'Mầm non' },
      { value: 'elementary', label: 'Tiểu học' },
      { value: 'middle', label: 'Trung học cơ sở' },
      { value: 'high', label: 'Trung học phổ thông' },
    ],
  },
  { key: 'shortDescription', label: 'Mô tả ngắn', kind: 'richtext' as const, multilang: true },
  { key: 'content', label: 'Nội dung chi tiết', kind: 'richtext' as const, multilang: true },
  { key: 'ageRange', label: 'Độ tuổi / lớp', kind: 'text' as const },
  { key: 'imageUrl', label: 'URL hình ảnh', kind: 'text' as const },
  {
    key: 'status',
    label: 'Trạng thái',
    kind: 'select' as const,
    options: [
      { value: 'draft', label: 'Bản nháp' },
      { value: 'published', label: 'Đã xuất bản' },
    ],
  },
]

export default function AdminProgramsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Chương trình học"
      subtitle="Quản lý các chương trình và cấp học. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <CrudList<Program>
        title="Chương trình"
        fields={fields}
        load={cms.programs.list}
        create={(d) => cms.programs.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.programs.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.programs.remove}
        reorder={cms.programs.reorder}
        renderSummary={(item) => (
          <div>
            <div
              className="text-xs px-2 py-1 rounded inline-block mb-1"
              style={{
                color: semanticColors.primary,
                backgroundColor: semanticColors.primaryBg,
              }}
            >
              {item.level}
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