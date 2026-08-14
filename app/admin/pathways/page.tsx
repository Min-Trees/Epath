'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { LearningPathway } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
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
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
]

export default function AdminPathwaysPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Lộ trình học tập" subtitle="Quản lý các cấp học trong lộ trình.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<LearningPathway>
        title="Lộ trình"
        fields={fields}
        load={cms.pathways.list}
        create={(d) => cms.pathways.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.pathways.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.pathways.remove}
        reorder={cms.pathways.reorder}
      />
    </AdminLayout>
  )
}