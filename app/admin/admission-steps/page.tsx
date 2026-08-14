'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { AdmissionStep } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
  { key: 'icon', label: 'Icon (Lucide)', kind: 'text' as const },
]

export default function AdminAdmissionStepsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Quy trình tuyển sinh" subtitle="Quản lý các bước trong quy trình tuyển sinh.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<AdmissionStep>
        title="Bước"
        fields={fields}
        load={cms.admissionSteps.list}
        create={(d) => cms.admissionSteps.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.admissionSteps.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.admissionSteps.remove}
        reorder={cms.admissionSteps.reorder}
      />
    </AdminLayout>
  )
}