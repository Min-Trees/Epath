'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
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
    posts: number
    leads: number
    achievements: number
  }
}

export default function AdminDashboardPage() {
  const user = useRequireAdmin()
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSeeding, setIsSeeding] = useState(false)
  const [seedMessage, setSeedMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showSeedDialog, setShowSeedDialog] = useState(false)

  const fetchData = () => {
    setIsLoading(true)
    Promise.all([
      fetch('/api/cms/programs').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/partners').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/events').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/faqs').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/statistics').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/testimonials').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/core-values').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/team').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/pathways').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/admission-steps').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/blog-posts').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/leads').then((r) => r.json()).catch(() => ({ items: [] })),
      fetch('/api/cms/achievements').then((r) => r.json()).catch(() => ({ items: [] })),
    ])
      .then(
        ([
          programs,
          partners,
          events,
          faqs,
          statistics,
          testimonials,
          coreValues,
          team,
          pathways,
          admissionSteps,
          posts,
          leads,
          achievements,
        ]) => ({
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
            posts: posts.items?.length ?? 0,
            leads: leads.items?.length ?? 0,
            achievements: achievements.items?.length ?? 0,
          },
        })
      )
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSeedData = async () => {
    if (!confirm('Tạo dữ liệu mẫu? Hành động này sẽ thêm dữ liệu mẫu vào Firestore.')) return

    setIsSeeding(true)
    setSeedMessage(null)
    try {
      const res = await fetch('/api/cms/seed', { method: 'POST' })
      const result = await res.json()
      if (res.ok) {
        setSeedMessage({ type: 'success', text: 'Đã tạo dữ liệu mẫu thành công!' })
        fetchData()
        setShowSeedDialog(false)
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

  const adminDisplayName = user?.name || user?.email?.split('@')[0] || 'Quản trị viên'

  return (
    <AdminLayout>
      {/* Welcome Banner - 4px radius, no icons */}
      <div className="relative rounded p-5 sm:p-6 bg-[#1e3a8a] text-white overflow-hidden mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-block px-2.5 py-0.5 rounded bg-white/10 text-xs font-medium text-[#84cc16] mb-2 border border-white/15">
              Hệ thống quản trị trực tuyến EPath
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1.5">
              Xin chào, {adminDisplayName}!
            </h1>
            <p className="text-xs sm:text-sm text-white/80 max-w-2xl leading-relaxed">
              Trung tâm điều hành nội dung EPath Education. Lựa chọn phân hệ bên dưới để quản lý chương trình học, bài viết, tuyển sinh và cấu hình website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/vi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 h-8 rounded bg-[#84cc16] hover:bg-[#72b012] text-[#1e3a8a] font-semibold text-xs transition-colors"
            >
              <span>Xem Website ↗</span>
            </a>

            <button
              type="button"
              onClick={fetchData}
              disabled={isLoading}
              className="h-8 px-3 rounded bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium transition-colors"
            >
              <span>{isLoading ? 'Đang tải...' : 'Làm mới số liệu'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Grouped Top KPI Metrics - No icons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
        <AdminStatCard
          label="Chương trình & Lộ trình"
          value={isLoading ? '—' : `${(data?.counts.programs ?? 0) + (data?.counts.pathways ?? 0)}`}
          hint={`${data?.counts.programs ?? 0} chương trình • ${data?.counts.pathways ?? 0} lộ trình`}
          accent="primary"
        />
        <AdminStatCard
          label="Hộp thư tư vấn (Leads)"
          value={isLoading ? '—' : `${data?.counts.leads ?? 0}`}
          hint="Hồ sơ & liên hệ từ phụ huynh"
          accent="cta"
        />
        <AdminStatCard
          label="Bài viết & Sự kiện"
          value={isLoading ? '—' : `${(data?.counts.posts ?? 0) + (data?.counts.events ?? 0)}`}
          hint={`${data?.counts.posts ?? 0} bài viết • ${data?.counts.events ?? 0} sự kiện`}
          accent="accent"
        />
        <AdminStatCard
          label="Thành tích & Đối tác"
          value={isLoading ? '—' : `${(data?.counts.achievements ?? 0) + (data?.counts.partners ?? 0)}`}
          hint={`${data?.counts.achievements ?? 0} thành tích • ${data?.counts.partners ?? 0} đối tác`}
          accent="dark"
        />
      </div>

      {/* 5 Functional Domain Hubs */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#1E3570]">
              Danh Mục Chức Năng Quản Trị
            </h2>
            <p className="text-xs text-[#5C6069]">
              Truy cập nhanh các module theo từng phân hệ nghiệp vụ
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {/* Group 1: Overview */}
          <DomainCard
            title="1. Tổng Quan & Xử Lý"
            description="Xem trạng thái hoạt động, duyệt nội dung và tiếp nhận đăng ký của phụ huynh."
            color="border-l-[#1e3a8a]"
            links={[
              { href: '/admin/dashboard', label: 'Bàn làm việc (Dashboard)' },
              { href: '/admin/review-queue', label: 'Hàng chờ duyệt nội dung' },
              { href: '/admin/leads', label: 'Hộp thư tư vấn (Leads)' },
            ]}
          />

          {/* Group 2: Pages & Layout */}
          <DomainCard
            title="2. Trang & Giao Diện"
            description="Tùy biến các khối section, banner chuyển động, tầm nhìn sứ mệnh và thành tích."
            color="border-l-[#84cc16]"
            links={[
              { href: '/admin/pages', label: 'Bố cục trang (Page Builder)' },
              { href: '/admin/hero-content', label: 'Banner & Slide Hero' },
              { href: '/admin/about-content', label: 'Giới thiệu & Tầm nhìn' },
              { href: '/admin/core-values', label: 'Giá trị cốt lõi' },
              { href: '/admin/achievements', label: 'Thành tích học sinh' },
              { href: '/admin/statistics', label: 'Số liệu & Thống kê' },
            ]}
          />

          {/* Group 3: Academics */}
          <DomainCard
            title="3. Học Vụ & Tuyển Sinh"
            description="Quản lý các chương trình Tú tài, Song bằng, lộ trình K-12 và đội ngũ giảng viên."
            color="border-l-[#2563eb]"
            links={[
              { href: '/admin/programs', label: 'Chương trình đào tạo' },
              { href: '/admin/pathways', label: 'Lộ trình học thuật' },
              { href: '/admin/team', label: 'Giảng viên & Cố vấn 1:1' },
              { href: '/admin/admission-steps', label: 'Quy trình tuyển sinh' },
            ]}
          />

          {/* Group 4: Media & News */}
          <DomainCard
            title="4. Truyền Thông & Tin Tức"
            description="Đăng bài viết mới, thông báo sự kiện, đối tác quốc tế và thư viện hình ảnh."
            color="border-l-amber-500"
            links={[
              { href: '/admin/posts', label: 'Bài viết & Tin tức' },
              { href: '/admin/events', label: 'Sự kiện học thuật' },
              { href: '/admin/partners', label: 'Đối tác chiến lược' },
              { href: '/admin/testimonials', label: 'Cảm nhận Phụ huynh' },
              { href: '/admin/faqs', label: 'Hỏi đáp thường gặp (FAQ)' },
              { href: '/admin/media', label: 'Thư viện hình ảnh S3' },
            ]}
          />

          {/* Group 5: System */}
          <DomainCard
            title="5. Hệ Thống & Cấu Hình"
            description="Thiết lập hotline, địa chỉ, mạng xã hội, nhật ký thao tác và sao lưu dữ liệu."
            color="border-l-[#0f172a]"
            links={[
              { href: '/admin/site-settings', label: 'Cấu hình chung website' },
              { href: '/admin/activity-logs', label: 'Nhật ký thao tác' },
              { href: '/admin/backups', label: 'Sao lưu dữ liệu' },
            ]}
          />

          {/* Tools & Dev Helpers */}
          <div className="bg-white rounded p-4 border border-[#e2e8f0] flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-sm text-[#0f172a] mb-1">Công Cụ Dữ Liệu</h3>
              <p className="text-xs text-[#64748b] leading-relaxed mb-3">
                Tạo dữ liệu ban đầu hoặc kiểm tra trạng thái lưu trữ của hệ thống Firestore.
              </p>
            </div>

            <div className="pt-2.5 border-t border-[#e2e8f0]">
              <button
                type="button"
                onClick={() => setShowSeedDialog(!showSeedDialog)}
                className="w-full text-left px-2.5 h-8 rounded border border-[#e2e8f0] text-xs font-medium hover:bg-slate-50 transition-colors flex items-center justify-between"
              >
                <span>Dữ liệu mẫu (Seed Data)</span>
                <span className="text-slate-400 font-mono text-[11px]">{showSeedDialog ? '–' : '+'}</span>
              </button>

              {showSeedDialog && (
                <div className="mt-2.5 p-3 rounded bg-amber-50/70 border border-amber-200 text-xs">
                  <p className="text-amber-800 mb-2">
                    Thao tác này sẽ bổ sung các bản ghi mẫu vào cơ sở dữ liệu nếu còn thiếu.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleSeedData}
                    disabled={isSeeding}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium h-7 rounded"
                  >
                    {isSeeding ? 'Đang khởi tạo...' : 'Xác nhận tạo dữ liệu mẫu'}
                  </Button>
                </div>
              )}

              {seedMessage && (
                <div
                  className={`mt-2 p-2 rounded text-xs border ${
                    seedMessage.type === 'success'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}
                >
                  {seedMessage.text}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function DomainCard({
  title,
  description,
  color,
  links,
}: {
  title: string
  description: string
  color: string
  links: { href: string; label: string }[]
}) {
  return (
    <div
      className={`rounded p-4 bg-white border border-[#e2e8f0] border-l-4 ${color} transition-colors hover:border-slate-300 flex flex-col justify-between`}
    >
      <div>
        <h3 className="font-semibold text-sm text-[#0f172a] mb-1">{title}</h3>
        <p className="text-xs text-[#64748b] leading-relaxed mb-3">{description}</p>
      </div>

      <div className="pt-2.5 border-t border-[#e2e8f0] space-y-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-2 py-1 rounded text-xs font-normal text-slate-700 hover:bg-slate-100 hover:text-[#1e3a8a] transition-colors"
          >
            <span className="truncate block">{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
