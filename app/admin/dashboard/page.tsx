'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  AdminLayout,
  AdminStatCard,
  useRequireAdmin,
} from '@/components/admin/admin-layout'
import { semanticColors, shadows } from '@/lib/design-tokens'

const stats = [
  { label: 'Tin nhắn mới', value: 5, accent: 'primary' as const },
  { label: 'Đơn đăng ký', value: 12, accent: 'accent' as const },
  { label: 'Học sinh', value: 156, accent: 'cta' as const },
  { label: 'Testimonials', value: 8, accent: 'dark' as const },
]

export default function AdminDashboardPage() {
  const isLoggedIn = useRequireAdmin()
  if (!isLoggedIn) return null

  return (
    <AdminLayout title="Dashboard" subtitle="Xem tổng quan về hệ thống">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <AdminStatCard
            key={index}
            label={stat.label}
            value={stat.value}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* Recent Messages */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          backgroundColor: semanticColors.surface,
          boxShadow: shadows.card,
        }}
      >
        <div
          className="p-6"
          style={{ borderBottom: '1px solid rgba(35,31,32,0.08)' }}
        >
          <h2 className="text-lg font-bold" style={{ color: semanticColors.text }}>
            Tin nhắn gần đây
          </h2>
        </div>
        <div>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 transition-colors duration-200 cursor-pointer hover:bg-black/[0.02]"
              style={{ borderTop: i > 1 ? '1px solid rgba(35,31,32,0.08)' : 'none' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium" style={{ color: semanticColors.text }}>
                  Phụ huynh {i}
                </span>
                <span className="text-xs" style={{ color: semanticColors.textMuted }}>
                  2 giờ trước
                </span>
              </div>
              <p className="text-sm line-clamp-1" style={{ color: semanticColors.textMuted }}>
                Tôi muốn được tư vấn về chương trình Tiểu học cho con...
              </p>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(35,31,32,0.08)' }} className="p-4">
          <Link href="/admin/messages">
            <Button variant="outline" className="w-full">
              Xem tất cả tin nhắn
            </Button>
          </Link>
        </div>
      </div>
    </AdminLayout>
  )
}
