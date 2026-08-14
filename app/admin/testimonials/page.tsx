'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { cms } from '@/lib/cms-client'
import type { Testimonial } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

const fields = [
  { key: 'name', label: 'Tên', kind: 'text' as const, placeholder: 'Nguyễn Văn A' },
  { key: 'role', label: 'Vai trò', kind: 'text' as const, placeholder: 'Phụ huynh học sinh' },
  { key: 'avatarUrl', label: 'Avatar URL', kind: 'text' as const, placeholder: 'https://...' },
  { key: 'content', label: 'Nội dung', kind: 'richtext' as const, multilang: true },
  { key: 'rating', label: 'Số sao (1-5)', kind: 'number' as const },
  { key: 'isFeatured', label: 'Nổi bật', kind: 'checkbox' as const },
]

export default function AdminTestimonialsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Lời chứng thực" subtitle="Quản lý testimonials hiển thị trên trang chủ.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <CrudList<Testimonial>
        title="Testimonials"
        fields={fields}
        load={cms.testimonials.list}
        create={(d) => cms.testimonials.create(d as never) as unknown as Promise<{ id: string }>}
        update={(id, d) => cms.testimonials.update(id, d as never) as unknown as Promise<unknown>}
        remove={cms.testimonials.remove}
        reorder={cms.testimonials.reorder}
      />
    </AdminLayout>
  )
}
