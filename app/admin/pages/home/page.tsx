'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PageSectionsEditor } from '@/components/admin/page-sections-editor'
import { semanticColors } from '@/lib/design-tokens'

export default function AdminHomePage() {
  const user = useRequireAdmin()
  if (user === undefined) return null

  return (
    <AdminLayout
      title="Trang chủ"
      subtitle="Sắp xếp và bật/tắt các section trên trang chủ. Thay đổi cập nhật realtime."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <PageSectionsEditor
        pageId="home"
        title="Thứ tự hiển thị trên trang chủ"
        subtitle="Kéo thả (hoặc dùng nút lên/xuống) để thay đổi thứ tự section"
      />
    </AdminLayout>
  )
}