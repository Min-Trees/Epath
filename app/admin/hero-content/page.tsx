'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { HeroContentForm } from '@/components/admin/hero-content-form'
import { cms } from '@/lib/cms-client'
import type { HeroContent } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminHeroContentPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Nội dung Hero" subtitle="Quản lý nội dung phần hero trên các trang.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <HeroContentForm
        load={cms.heroContent.list}
        update={cms.heroContent.update as (id: string, data: Partial<HeroContent>) => Promise<unknown>}
        create={cms.heroContent.create as (data: Partial<HeroContent>) => Promise<{ id: string }>}
      />
    </AdminLayout>
  )
}
