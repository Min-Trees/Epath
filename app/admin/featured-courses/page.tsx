'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { FeaturedCoursesForm } from '@/components/admin/featured-courses-form'

export default function AdminFeaturedCoursesPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Khóa học nổi bật (Trang chủ)"
      subtitle="Điều chỉnh hình ảnh, tiêu đề, cấp học, mô tả và liên kết của các khóa học nổi bật trên trang chủ."
    >
      <FeaturedCoursesForm />
    </AdminLayout>
  )
}
