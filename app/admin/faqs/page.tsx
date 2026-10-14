'use client'

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
  { key: 'imageUrl', label: 'Hình nền', kind: 'image' as const, placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'faqs' },
]

export default function AdminFAQsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Quản lý FAQ"
      subtitle="Thêm, sửa, xóa câu hỏi thường gặp. Thay đổi cập nhật realtime."
    >
      <CrudList<FAQ>
        title="FAQ"
        fields={fields}
        load={cms.faqs.list}
        create={(d) => cms.faqs.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.faqs.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.faqs.remove}
        reorder={cms.faqs.reorder}
        reviewCollection="faqs"
        renderSummary={(item) => (
          <div>
            <div
              className="text-xs px-2 py-0.5 rounded inline-block mb-1 font-medium"
              style={{
                color: semanticColors.primary,
                backgroundColor: semanticColors.primaryBg,
              }}
            >
              {item.category}
            </div>
            <div className="font-semibold text-sm" style={{ color: semanticColors.text }}>
              {item.question.vi}
            </div>
            <div className="text-xs line-clamp-2 mt-0.5" style={{ color: semanticColors.textMuted }}>
              {item.answer.vi}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  )
}