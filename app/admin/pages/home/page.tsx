'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PageSectionsEditor } from '@/components/admin/page-sections-editor'

export default function AdminHomePage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Trang chủ"
      subtitle="Sắp xếp và bật/tắt các section trên trang chủ. Thay đổi cập nhật realtime."
    >
      <PageSectionsEditor
        pageId="home"
        title="Thứ tự hiển thị trên trang chủ"
        subtitle="Dùng nút lên/xuống để thay đổi thứ tự section"
      />
    </AdminLayout>
  )
}