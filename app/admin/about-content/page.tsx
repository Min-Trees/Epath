'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { AboutContentForm } from '@/components/admin/about-content-form'
import { cms } from '@/lib/cms-client'
import type { AboutContent } from '@/lib/cms-types'

export default function AdminAboutContentPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Nội dung trang About" subtitle="Quản lý nội dung giới thiệu, tầm nhìn, sứ mệnh và cột mốc.">
      <AboutContentForm
        load={cms.aboutContent.list}
        update={cms.aboutContent.update as (id: string, data: Partial<AboutContent>) => Promise<unknown>}
        create={cms.aboutContent.create as (data: Partial<AboutContent>) => Promise<{ id: string }>}
      />
    </AdminLayout>
  )
}
