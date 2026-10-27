'use client'

import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PromoPopupForm } from '@/components/admin/promo-popup-form'

export default function AdminPromoPopupPage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Popup Quảng Cáo & Tư Vấn"
      subtitle="Quản lý nội dung, hình ảnh, thời gian chờ và các nút hành động cho modal tư vấn xuất hiện tự động trên website."
    >
      <PromoPopupForm />
    </AdminLayout>
  )
}
