'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { HeroContentForm } from '@/components/admin/hero-content-form'
import { cms } from '@/lib/cms-client'
import type { HeroContent } from '@/lib/cms-types'

export default function AdminHeroContentPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Nội dung Hero" subtitle="Quản lý nội dung phần hero trên các trang.">
      <HeroContentForm
        load={cms.heroContent.list}
        update={cms.heroContent.update as (id: string, data: Partial<HeroContent>) => Promise<unknown>}
        create={cms.heroContent.create as (data: Partial<HeroContent>) => Promise<{ id: string }>}
        remove={cms.heroContent.remove}
      />
    </AdminLayout>
  )
}
