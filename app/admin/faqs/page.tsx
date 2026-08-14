'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { FAQ } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'question', label: 'Câu hỏi', kind: 'text' as const, multilang: true },
  { key: 'answer', label: 'Câu trả lời', kind: 'richtext' as const, multilang: true },
  {
    key: 'category',
    label: 'Danh mục',
    kind: 'select' as const,
    options: [
      { value: 'admissions', label: 'Tuyển sinh' },
      { value: 'program', label: 'Chương trình' },
      { value: 'general', label: 'Chung' },
    ],
  },
]

export default function AdminFAQsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Quản lý FAQ"
      subtitle="Thêm, sửa, xóa câu hỏi thường gặp. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <CrudList<FAQ>
        title="FAQ"
        fields={fields}
        load={cms.faqs.list}
        create={(d) => cms.faqs.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.faqs.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.faqs.remove}
        reorder={cms.faqs.reorder}
        renderSummary={(item) => (
          <div>
            <div
              className="text-xs px-2 py-1 rounded inline-block mb-1"
              style={{
                color: semanticColors.primary,
                backgroundColor: semanticColors.primaryBg,
              }}
            >
              {item.category}
            </div>
            <div className="font-medium" style={{ color: semanticColors.text }}>
              {item.question.vi}
            </div>
            <div className="text-sm line-clamp-2" style={{ color: semanticColors.textMuted }}>
              {item.answer.vi}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}