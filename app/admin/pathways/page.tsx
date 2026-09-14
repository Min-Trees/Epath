'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList, type CrudFieldDef } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { LearningPathway } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields: CrudFieldDef[] = [
  {
    key: 'level',
    label: 'Cấp học',
    kind: 'select',
    options: [
      { value: 'kindergarten', label: '01 - Mầm non (3 – 6 tuổi)' },
      { value: 'elementary', label: '02 - Tiểu học (Lớp 1 – 5)' },
      { value: 'middle', label: '03 - THCS (Lớp 6 – 8)' },
      { value: 'high', label: '04 - THPT (Lớp 9 – 12)' },
    ],
  },
  { key: 'step', label: 'Số thứ tự bước (VD: 01, 02, 03, 04)', kind: 'text' },
  { key: 'title', label: 'Tiêu đề giai đoạn', kind: 'text', multilang: true },
  { key: 'subtitle', label: 'Phụ đề định hướng học thuật', kind: 'text', multilang: true },
  { key: 'modelTag', label: 'Mô hình đào tạo & Thời lượng', kind: 'text', multilang: true },
  { key: 'badges', label: 'Chương trình & Khung chuẩn (phân cách bởi dấu phẩy)', kind: 'text' },
  { key: 'imageUrl', label: 'Hình ảnh minh họa', kind: 'image', folder: 'pathways' },
  { key: 'outcomes', label: 'Mục tiêu & Chuẩn đầu ra (Mỗi mục 1 dòng)', kind: 'textarea', multilang: true },
  { key: 'ctaUrl', label: 'Đường dẫn đăng ký tư vấn', kind: 'text' },
]

export default function AdminPathwaysPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Lộ trình học tập xuyên suốt"
      subtitle="Quản lý 4 giai đoạn đào tạo (Mầm non, Tiểu học, THCS, THPT) hiển thị trên website."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<LearningPathway>
        title="Giai đoạn học tập"
        fields={fields}
        load={cms.pathways.list}
        create={(d) => cms.pathways.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.pathways.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.pathways.remove}
        reorder={cms.pathways.reorder}
        reviewCollection="learningPathways"
      />
    </AdminLayout>
  )
}