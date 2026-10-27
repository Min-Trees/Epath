'use client'

/**
 * AdminLayout
 * Shared shell for every admin page (dashboard, faqs, programs, ...).
 *
 * Categorized Navigation Architecture:
 * 1. Overview & Processing
 * 2. Pages & Layout
 * 3. Academics & Admissions
 * 4. News & Community
 * 5. System & Settings
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface AdminNavItem {
  href: string
  label: string
  icon?: unknown
  badge?: string
}

export interface AdminNavGroup {
  id: string
  title: string
  items: AdminNavItem[]
}

export const adminNavGroups: AdminNavGroup[] = [
  {
    id: 'overview',
    title: 'Tổng quan & Xử lý',
    items: [
      { href: '/admin/dashboard', label: 'Bàn làm việc (Dashboard)' },
      { href: '/admin/review-queue', label: 'Hàng chờ duyệt nội dung' },
      { href: '/admin/leads', label: 'Hộp thư tư vấn (Leads)' },
    ],
  },
  {
    id: 'pages-layout',
    title: 'Trang & Giao diện',
    items: [
      { href: '/admin/pages', label: 'Bố cục trang (Page Builder)' },
      { href: '/admin/hero-content', label: 'Banner & Slide Hero' },
      { href: '/admin/featured-courses', label: 'Khóa học nổi bật (Home)' },
      { href: '/admin/promo-popup', label: 'Popup quảng cáo & Tư vấn' },
      { href: '/admin/about-content', label: 'Giới thiệu & Tầm nhìn' },
      { href: '/admin/core-values', label: 'Giá trị cốt lõi' },
      { href: '/admin/achievements', label: 'Thành tích học sinh' },
      { href: '/admin/statistics', label: 'Số liệu & Thống kê' },
    ],
  },
  {
    id: 'academics',
    title: 'Học vụ & Tuyển sinh',
    items: [
      { href: '/admin/programs', label: 'Chương trình đào tạo' },
      { href: '/admin/pathways', label: 'Lộ trình học thuật' },
      { href: '/admin/team', label: 'Giảng viên & Cố vấn 1:1' },
      { href: '/admin/admission-steps', label: 'Quy trình tuyển sinh' },
    ],
  },
  {
    id: 'media-news',
    title: 'Truyền thông & Tin tức',
    items: [
      { href: '/admin/posts', label: 'Bài viết & Tin tức' },
      { href: '/admin/events', label: 'Sự kiện học thuật' },
      { href: '/admin/partners', label: 'Đối tác chiến lược' },
      { href: '/admin/testimonials', label: 'Cảm nhận Phụ huynh' },
      { href: '/admin/faqs', label: 'Hỏi đáp thường gặp (FAQ)' },
      { href: '/admin/media', label: 'Thư viện hình ảnh S3' },
    ],
  },
  {
    id: 'system',
    title: 'Hệ thống & Cấu hình',
    items: [
      { href: '/admin/site-settings', label: 'Cấu hình chung website' },
      { href: '/admin/activity-logs', label: 'Nhật ký thao tác' },
      { href: '/admin/backups', label: 'Sao lưu dữ liệu' },
    ],
  },
]

// Flat list for backward compatibility
export const adminNavItems: AdminNavItem[] = adminNavGroups.flatMap((g) => g.items)

interface AdminLayoutProps {
  children: React.ReactNode
  /** Title shown in the page header (e.g. "Quản lý FAQ"). */
  title?: string
  /** Optional subtitle/description. */
  subtitle?: string
  /** Optional actions rendered to the right of the title (buttons, etc.). */
  actions?: React.ReactNode
}

export interface AdminUser {
  uid: string
  email: string | null
  name: string | null
  role: string
}

/**
 * Helper to compute breadcrumb navigation from current route
 */
function getBreadcrumbs(pathname: string, pageTitle?: string): { groupTitle: string; itemLabel: string } {
  for (const group of adminNavGroups) {
    for (const item of group.items) {
      if (pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href + '/'))) {
        return {
          groupTitle: group.title,
          itemLabel: pageTitle || item.label.replace(/\s*\(.*?\)\s*/g, '').trim(),
        }
      }
    }
  }
  return {
    groupTitle: 'Hệ thống CMS',
    itemLabel: pageTitle || 'Bàn làm việc',
  }
}

/**
 * Hook used by admin pages to fetch the current admin user and redirect
 * to /admin/login if the session cookie is missing or expired.
 */
export function useRequireAdmin() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: { user: AdminUser | null }) => {
        if (cancelled) return
        if (!data.user) {
          router.replace('/admin/login')
        } else {
          setUser(data.user)
        }
      })
      .catch(() => {
        if (!cancelled) router.replace('/admin/login')
      })
    return () => {
      cancelled = true
    }
  }, [router])

  return user
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: { user: AdminUser | null }) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const breadcrumbs = getBreadcrumbs(pathname, title)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a]">
      {/* Top Navbar - Height 52px, border-bottom, no drop shadow */}
      <header className="sticky top-0 z-50 h-[52px] bg-white border-b border-[#e2e8f0]">
        <div className="flex items-center justify-between h-full px-4 sm:px-6">
          {/* Left: Brand + Breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden px-2.5 h-7 rounded text-xs font-medium border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle menu"
              type="button"
            >
              {isSidebarOpen ? 'Đóng' : 'Menu'}
            </button>

            {/* Logo: EPath CMS with clean sharp mark */}
            <Link href="/admin/dashboard" className="flex items-center gap-2 shrink-0 group">
              <div className="w-7 h-7 rounded bg-[#1e3a8a] text-white font-black text-sm flex items-center justify-center">
                <span>E</span>
              </div>
              <span className="font-bold text-sm text-[#1e3a8a] tracking-tight hidden sm:inline">
                EPath CMS
              </span>
            </Link>

            {/* Divider */}
            <div className="hidden sm:block h-3.5 w-px bg-[#e2e8f0]" />

            {/* Breadcrumb Navigation - Text separator '/' instead of icon */}
            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748b] min-w-0">
              <span className="hover:text-slate-900 transition-colors truncate max-w-[140px]">
                {breadcrumbs.groupTitle}
              </span>
              <span className="text-slate-300">/</span>
              <span className="font-semibold text-[#0f172a] truncate max-w-[200px]">
                {title || breadcrumbs.itemLabel}
              </span>
            </nav>
          </div>

          {/* Right: Actions + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* View Live Website Button (Text only) */}
            <a
              href="/vi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-7 px-2.5 rounded text-xs font-medium border border-[#e2e8f0] bg-white text-slate-700 hover:bg-slate-50 hover:text-[#1e3a8a] transition-all"
              title="Mở website công khai trong tab mới"
            >
              <span>Xem Website ↗</span>
            </a>

            {/* User profile pill */}
            <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-[#e2e8f0]">
              <div className="w-6 h-6 rounded bg-[#1e3a8a] text-white font-medium text-xs flex items-center justify-center shrink-0">
                {user?.name?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="font-medium text-xs text-[#0f172a] leading-tight truncate max-w-[140px]">
                  {user?.name || user?.email?.split('@')[0] || 'Administrator'}
                </span>
                <span className="text-[10px] text-[#64748b] leading-tight">
                  {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Quản trị viên'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar: 250px, border-r, 6px neutral scrollbar */}
        <aside className="hidden lg:block w-[250px] shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto bg-white border-r border-[#e2e8f0]">
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </aside>

        {/* Mobile Sidebar Drawer */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-xs"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden overflow-y-auto bg-white shadow-xl"
              >
                <div className="h-[52px] px-4 border-b border-[#e2e8f0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#1e3a8a] text-white flex items-center justify-center font-bold text-xs">
                      E
                    </div>
                    <span className="font-bold text-sm text-[#1e3a8a]">EPath CMS</span>
                  </div>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="px-2 py-1 rounded text-xs text-slate-500 hover:bg-slate-100"
                  >
                    Đóng
                  </button>
                </div>
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setIsSidebarOpen(false)}
                  onLogout={handleLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area - Max width 1200px, 20px padding */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 max-w-[1200px] mx-auto w-full">
          {(title || subtitle || actions) && (
            <div className="mb-5 pb-3.5 border-b border-[#e2e8f0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                {title && (
                  <h1 className="text-xl sm:text-2xl font-semibold text-[#0f172a] tracking-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-[13px] text-[#64748b] leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string
  onNavigate: () => void
  onLogout: () => void
}) {
  return (
    <nav className="p-2.5 space-y-3.5">
      {adminNavGroups.map((group) => (
        <div key={group.id} className="space-y-0.5">
          {/* Group Header: Clean uppercase text only */}
          <div className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-[#64748b] select-none">
            {group.title}
          </div>

          {/* Group Items: Text only, 34px height, 4px radius, clear active state */}
          <div className="space-y-0.5">
            {group.items.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== '/admin/dashboard' && pathname.startsWith(link.href + '/'))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    'block px-2.5 py-1.5 rounded text-sm transition-colors',
                    active
                      ? 'bg-[#eef2ff] text-[#1e3a8a] font-semibold border-l-2 border-[#1e3a8a]'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-[#0f172a] font-normal'
                  )}
                >
                  <span className="truncate block">{link.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      {/* Logout Action: Text only, 4px radius */}
      <div className="pt-2 border-t border-[#e2e8f0]">
        <button
          type="button"
          onClick={onLogout}
          className="w-full text-left px-2.5 py-1.5 rounded text-sm font-medium text-[#dc2626] hover:bg-red-50 hover:text-red-700 transition-colors"
        >
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </nav>
  )
}

/** Stat card used in the dashboard. Clean text and metric only (no icons, 4px radius). */
export function AdminStatCard({
  label,
  value,
  accent = 'primary',
  hint,
}: {
  label: string
  value: number | string
  accent?: 'primary' | 'accent' | 'cta' | 'dark'
  icon?: unknown
  hint?: string
}) {
  const accentStyles = {
    primary: {
      border: 'border-l-4 border-l-[#1e3a8a]',
      numColor: 'text-[#1e3a8a]',
    },
    accent: {
      border: 'border-l-4 border-l-[#84cc16]',
      numColor: 'text-lime-700',
    },
    cta: {
      border: 'border-l-4 border-l-amber-500',
      numColor: 'text-amber-700',
    },
    dark: {
      border: 'border-l-4 border-l-[#0f172a]',
      numColor: 'text-[#0f172a]',
    },
  }[accent]

  return (
    <div
      className={cn(
        'rounded p-3.5 bg-white border border-[#e2e8f0] transition-colors hover:border-slate-300',
        accentStyles.border
      )}
    >
      <div className="text-xs font-medium text-[#64748b] truncate mb-1">
        {label}
      </div>
      <div className={cn('text-2xl font-semibold mb-1 tracking-tight', accentStyles.numColor)}>
        {value}
      </div>
      {hint && (
        <div className="text-[12px] text-[#64748b]">
          {hint}
        </div>
      )}
    </div>
  )
}