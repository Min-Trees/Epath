'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Statistic } from '@/lib/cms-types'

const fields = [
  { key: 'value', label: 'Giá trị', kind: 'text' as const, placeholder: '10+' },
  { key: 'label', label: 'Nhãn', kind: 'text' as const, multilang: true },
  { key: 'suffix', label: 'Hậu tố', kind: 'text' as const, placeholder: '+' },
  { key: 'icon', label: 'Mã biểu tượng', kind: 'text' as const, placeholder: 'TrendingUp' },
  { key: 'imageUrl', label: 'Hình ảnh', kind: 'image' as const, placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'statistics' },
]

export default function AdminStatisticsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Thống kê" subtitle="Quản lý các số liệu hiển thị trên trang chủ.">
      <CrudList<Statistic>
        title="Số liệu"
        fields={fields}
        load={cms.statistics.list}
        create={(d) => cms.statistics.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.statistics.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.statistics.remove}
        reorder={cms.statistics.reorder}
        reviewCollection="statistics"
      />
    </AdminLayout>
  )
}
