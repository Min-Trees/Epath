'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PageSectionsEditor } from '@/components/admin/page-sections-editor'

export default function AdminHomeBuilderPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null
  return (
    <AdminLayout
      title="Page Builder – Trang chủ"
      subtitle="Kéo thả các section để thay đổi thứ tự hiển thị."
    >
      <PageSectionsEditor pageId="home" title="Section trang chủ" />
    </AdminLayout>
  )
}