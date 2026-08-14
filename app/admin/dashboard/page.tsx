'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Database, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AdminLayout,
  AdminStatCard,
  useRequireAdmin,
} from '@/components/admin/admin-layout'
import { semanticColors, shadows } from '@/lib/design-tokens'

interface DashboardData {
  counts: {
    programs: number
    partners: number
    events: number
    faqs: number
    statistics: number
    testimonials: number
    coreValues: number
    team: number
    pathways: number
    admissionSteps: number
  }
  recent: { type: string; label: string; when: string }[]
}

export default function AdminDashboardPage() {
  const user = useRequireAdmin()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchData = () => {
    Promise.all([
      fetch('/api/cms/programs').then((r) => r.json()),
      fetch('/api/cms/partners').then((r) => r.json()),
      fetch('/api/cms/events').then((r) => r.json()),
      fetch('/api/cms/faqs').then((r) => r.json()),
      fetch('/api/cms/statistics').then((r) => r.json()),
      fetch('/api/cms/testimonials').then((r) => r.json()),
      fetch('/api/cms/core-values').then((r) => r.json()),
      fetch('/api/cms/team').then((r) => r.json()),
      fetch('/api/cms/pathways').then((r) => r.json()),
      fetch('/api/cms/admission-steps').then((r) => r.json()),
    ])
      .then(([programs, partners, events, faqs, statistics, testimonials, coreValues, team, pathways, admissionSteps]) => ({
        counts: {
          programs: programs.items?.length ?? 0,
          partners: partners.items?.length ?? 0,
          events: events.items?.length ?? 0,
          faqs: faqs.items?.length ?? 0,
          statistics: statistics.items?.length ?? 0,
          testimonials: testimonials.items?.length ?? 0,
          coreValues: coreValues.items?.length ?? 0,
          team: team.items?.length ?? 0,
          pathways: pathways.items?.length ?? 0,
          admissionSteps: admissionSteps.items?.length ?? 0,
        },
        recent: [],
      }))
      .then(setData)
      .catch(() => setData(null))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSeedData = async () => {
    if (!confirm('Tạo dữ liệu mẫu? Hành động này sẽ thêm dữ liệu mới vào Firestore.')) return

    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const res = await fetch('/api/cms/seed', { method: 'POST' })
      const result = await res.json()
      if (res.ok) {
        setSeedMessage({ type: 'success', text: 'Đã tạo dữ liệu mẫu thành công!' })
        fetchData() // Refresh counts
      } else {
        setSeedMessage({ type: 'error', text: result.error || 'Lỗi khi tạo dữ liệu' })
      }
    } catch (err) {
      setSeedMessage({ type: 'error', text: (err as Error).message })
    } finally {
      setIsSeeding(false)
    }
  }

  if (user === undefined) return null

  const stats = [
    { label: 'Chương trình học', value: data?.counts.programs ?? '—', accent: 'primary' as const },
    { label: 'Đối tác', value: data?.counts.partners ?? '—', accent: 'accent' as const },
    { label: 'Sự kiện', value: data?.counts.events ?? '—', accent: 'cta' as const },
    { label: 'FAQ', value: data?.counts.faqs ?? '—', accent: 'dark' as const },
    { label: 'Thống kê', value: data?.counts.statistics ?? '—', accent: 'primary' as const },
    { label: 'Testimonials', value: data?.counts.testimonials ?? '—', accent: 'accent' as const },
    { label: 'Giá trị cốt lõi', value: data?.counts.coreValues ?? '—', accent: 'cta' as const },
    { label: 'Team', value: data?.counts.team ?? '—', accent: 'dark' as const },
  ]

  return (
    <AdminLayout title="Dashboard" subtitle="Xem tổng quan về hệ thống">
      {/* Seed Data Section */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{
          backgroundColor: semanticColors.surface,
          boxShadow: shadows.card,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: semanticColors.text }}>
              Dữ liệu mẫu
            </h2>
            <p className="text-sm mt-1" style={{ color: semanticColors.textMuted }}>
              Tạo dữ liệu mẫu để hiển thị nội dung trên website
            </p>
          </div>
          <Button onClick={handleSeedData} disabled={isSeeding} className="gap-2">
            {isSeeding ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              <>
                <Database className="w-4 h-4" />
                Tạo dữ liệu mẫu
              </>
            )}
          </Button>
        </div>
        {seedMessage && (
          <div
            className={`mt-4 p-3 rounded text-sm ${
              seedMessage.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {seedMessage.text}
          </div>
        )}
      </div>

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

      {/* Quick links */}
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
            Quản lý nội dung
          </h2>
          <p className="text-sm mt-1" style={{ color: semanticColors.textMuted }}>
            Quản lý nội dung hiển thị trên website
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
          <QuickLink href="/admin/programs" label="Chương trình học" />
          <QuickLink href="/admin/partners" label="Đối tác" />
          <QuickLink href="/admin/events" label="Sự kiện" />
          <QuickLink href="/admin/faqs" label="FAQ" />
          <QuickLink href="/admin/statistics" label="Thống kê" />
          <QuickLink href="/admin/testimonials" label="Testimonials" />
          <QuickLink href="/admin/core-values" label="Giá trị cốt lõi" />
          <QuickLink href="/admin/team" label="Team" />
          <QuickLink href="/admin/pathways" label="Lộ trình học" />
          <QuickLink href="/admin/achievements" label="Thành tích" />
          <QuickLink href="/admin/admission-steps" label="Bước nhập học" />
        </div>
      </div>

      {/* Site Settings */}
      <div
        className="rounded-xl overflow-hidden mt-6"
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
            Cài đặt trang
          </h2>
          <p className="text-sm mt-1" style={{ color: semanticColors.textMuted }}>
            Cấu hình thông tin chung của website
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4">
          <QuickLink href="/admin/site-settings" label="Thông tin liên hệ" />
          <QuickLink href="/admin/hero-content" label="Nội dung Hero" />
          <QuickLink href="/admin/about-content" label="Nội dung About" />
        </div>
      </div>
    </AdminLayout>
  )
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <Button variant="outline" className="w-full justify-between">
        <span>{label}</span>
        <span aria-hidden>→</span>
      </Button>
    </Link>
  )
}
