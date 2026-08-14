'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { CoreValue } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'icon', label: 'Icon (Lucide)', kind: 'text' as const, placeholder: 'Compass' },
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
]

export default function AdminCoreValuesPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Giá trị cốt lõi" subtitle="Quản lý các giá trị hiển thị trên trang chủ và trang About.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<CoreValue>
        title="Giá trị"
        fields={fields}
        load={cms.coreValues.list}
        create={(d) => cms.coreValues.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.coreValues.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.coreValues.remove}
        reorder={cms.coreValues.reorder}
      />
    </AdminLayout>
  )
}