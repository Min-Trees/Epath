'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { AboutContentForm } from '@/components/admin/about-content-form'
import { cms } from '@/lib/cms-client'
import type { AboutContent } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminAboutContentPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Nội dung trang About" subtitle="Quản lý nội dung giới thiệu, tầm nhìn, sứ mệnh và cột mốc.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <AboutContentForm
        load={cms.aboutContent.list}
        update={cms.aboutContent.update as (id: string, data: Partial<AboutContent>) => Promise<unknown>}
        create={cms.aboutContent.create as (data: Partial<AboutContent>) => Promise<{ id: string }>}
      />
    </AdminLayout>
  )
}
