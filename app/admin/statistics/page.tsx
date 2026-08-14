'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Statistic } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'value', label: 'Giá trị', kind: 'text' as const, placeholder: '10+' },
  { key: 'label', label: 'Nhãn', kind: 'text' as const, multilang: true },
  { key: 'suffix', label: 'Hậu tố', kind: 'text' as const, placeholder: '+' },
  { key: 'icon', label: 'Icon (Lucide)', kind: 'text' as const, placeholder: 'TrendingUp' },
]

export default function AdminStatisticsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Thống kê" subtitle="Quản lý các số liệu hiển thị trên trang chủ.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<Statistic>
        title="Số liệu"
        fields={fields}
        load={cms.statistics.list}
        create={(d) => cms.statistics.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.statistics.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.statistics.remove}
        reorder={cms.statistics.reorder}
      />
    </AdminLayout>
  )
}
