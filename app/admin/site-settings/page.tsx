'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { SiteSettingsForm } from '@/components/admin/site-settings-form'
import { cms } from '@/lib/cms-client'

export default function AdminSiteSettingsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout title="Cài đặt trang" subtitle="Quản lý thông tin liên hệ, mạng xã hội và các cài đặt chung.">
      <SiteSettingsForm
        load={cms.siteSettings.list}
        update={cms.siteSettings.update}
        create={cms.siteSettings.create as any}
      />
    </AdminLayout>
  )
}
