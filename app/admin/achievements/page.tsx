'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Achievement } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
  { key: 'images', label: 'URL hình ảnh (mỗi dòng một URL)', kind: 'textarea' as const },
]

export default function AdminAchievementsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Thành tích" subtitle="Quản lý thành tích học sinh hiển thị trên trang chủ.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<Achievement>
        title="Thành tích"
        fields={fields}
        load={cms.achievements.list}
        create={(d) => cms.achievements.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.achievements.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.achievements.remove}
        reorder={cms.achievements.reorder}
      />
    </AdminLayout>
  )
}