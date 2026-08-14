'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { TeamMember } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'name', label: 'Họ tên', kind: 'text' as const },
  { key: 'role', label: 'Chức danh', kind: 'text' as const, multilang: true },
  { key: 'bio', label: 'Tiểu sử', kind: 'richtext' as const, multilang: true },
  { key: 'avatarUrl', label: 'URL ảnh đại diện', kind: 'text' as const },
]

export default function AdminTeamPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Đội ngũ" subtitle="Quản lý thành viên đội ngũ hiển thị trên trang About.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<TeamMember>
        title="Thành viên"
        fields={fields}
        load={cms.team.list}
        create={(d) => cms.team.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.team.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.team.remove}
        reorder={cms.team.reorder}
      />
    </AdminLayout>
  )
}