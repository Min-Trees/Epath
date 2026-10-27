'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { AdmissionsForm } from '@/components/admin/admissions-form'

export default function AdminAdmissionsPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Quản lý Trang Tuyển Sinh K-12"
      subtitle="Thiết lập banner Hero, 4 điểm tin cậy, 4 gói học phí, chính sách tài chính và thông tin Campus."
    >
      <AdmissionsForm />
    </AdminLayout>
  )
}
