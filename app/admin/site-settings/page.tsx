'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { SiteSettingsForm } from '@/components/admin/site-settings-form'
import { cms } from '@/lib/cms-client'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminSiteSettingsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Cài đặt trang" subtitle="Quản lý thông tin liên hệ, mạng xã hội và các cài đặt chung.">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại Dashboard
      </Link>
      <SiteSettingsForm
        load={cms.siteSettings.list}
        update={cms.siteSettings.update}
      />
    </AdminLayout>
  )
}
