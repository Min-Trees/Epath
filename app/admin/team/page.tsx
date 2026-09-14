'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList, type CrudFieldDef } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { TeamMember } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields: CrudFieldDef[] = [
  { key: 'name', label: 'Tên nhóm / Tiêu đề', kind: 'text', multilang: true },
  { key: 'tag', label: 'Huy hiệu (Tag nổi bật)', kind: 'text', multilang: true },
  { key: 'role', label: 'Chức danh / Phân nhóm', kind: 'text', multilang: true },
  { key: 'avatarUrl', label: 'Hình ảnh đại diện', kind: 'image', folder: 'team' },
  { key: 'bio', label: 'Mô tả chi tiết / Tiêu chuẩn chuyên môn', kind: 'textarea', multilang: true },
  { key: 'point1', label: 'Nhiệm vụ / Điểm nổi bật 1', kind: 'textarea', multilang: true },
  { key: 'point2', label: 'Nhiệm vụ / Điểm nổi bật 2', kind: 'textarea', multilang: true },
]

export default function AdminTeamPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Giảng viên & Cố vấn"
      subtitle="Quản lý thông tin Đội ngũ Giảng viên & Cố vấn Học thuật hiển thị trên trang Giới thiệu (/about)."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<TeamMember>
        title="Nhóm Giảng viên & Cố vấn"
        fields={fields}
        load={cms.team.list}
        create={(d) => cms.team.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.team.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.team.remove}
        reorder={cms.team.reorder}
        reviewCollection="teamMembers"
      />
    </AdminLayout>
  )
}