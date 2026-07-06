'use client'

/**
 * AdminLayout
 * Shared shell for every admin page (dashboard, faqs, programs, ...).
 *
 * Design tokens are sourced from `lib/design-tokens.ts` and motion
 * presets from `lib/motion-presets.ts` so the admin UI stays in sync
 * with the public-facing pages.
 *
 * Sidebar (desktop) is fixed-width and sticky; on mobile it slides in
 * via framer-motion using the standard `transitionEnter` preset.
 *
 * The auth check is done at the page level (each page calls
 * `useRequireAdmin()`) so that login itself can render this layout
 * without redirect loops.
 */

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react'
import { semanticColors, shadows, radius } from '@/lib/design-tokens'
import { duration, easeOut, transitionEnter } from '@/lib/motion-presets'
import { cn } from '@/lib/utils'

export interface AdminNavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
}

export const adminNavItems: AdminNavItem[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/programs', label: 'Chương trình học', icon: BookOpen },
  { href: '/admin/faqs', label: 'FAQ', icon: MessageSquare },
  { href: '/admin/testimonials', label: 'Phản hồi PH', icon: Users },
  { href: '/admin/partners', label: 'Đối tác', icon: FileText },
  { href: '/admin/settings', label: 'Cài đặt', icon: Settings },
]

interface AdminLayoutProps {
  children: React.ReactNode
  /** Title shown in the page header (e.g. "Quản lý FAQ"). */
  title?: string
  /** Optional subtitle/description. */
  subtitle?: string
  /** Optional actions rendered to the right of the title (buttons, etc.). */
  actions?: React.ReactNode
}

/**
 * Hook used by admin pages to redirect to /admin/login when the
 * auth flag is missing.
 */
export function useRequireAdmin() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (!auth) {
      router.replace('/admin/login')
    } else {
      setIsLoggedIn(true)
    }
  }, [router])

  return isLoggedIn
}

export function AdminLayout({ children, title, subtitle, actions }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    router.push('/admin/login')
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: semanticColors.surfaceAlt }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: semanticColors.surface,
          boxShadow: shadows.nav,
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg transition-colors duration-200"
              style={{ color: semanticColors.textMuted }}
              aria-label="Toggle menu"
              type="button"
            >
              {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: semanticColors.primary }}
              >
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span
                className="font-bold hidden sm:inline"
                style={{ color: semanticColors.primary }}
              >
                EPath Admin
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-black/5"
              style={{ color: semanticColors.textMuted }}
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ backgroundColor: semanticColors.cta }}
              />
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: semanticColors.primary }}
              >
                <span className="text-white font-bold">A</span>
              </div>
              <div className="hidden sm:block">
                <div className="font-medium text-sm" style={{ color: semanticColors.text }}>
                  Admin
                </div>
                <div className="text-xs" style={{ color: semanticColors.textMuted }}>
                  Quản trị viên
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className="hidden lg:block w-64 shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto"
          style={{
            backgroundColor: semanticColors.surface,
            boxShadow: shadows.nav,
          }}
        >
          <SidebarContent
            pathname={pathname}
            onNavigate={() => setIsSidebarOpen(false)}
            onLogout={handleLogout}
          />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: duration.fast, ease: easeOut }}
                className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: -256 }}
                animate={{ x: 0 }}
                exit={{ x: -256 }}
                transition={transitionEnter}
                className="fixed inset-y-0 left-0 z-40 w-64 lg:hidden overflow-y-auto"
                style={{
                  backgroundColor: semanticColors.surface,
                  boxShadow: shadows.cardHover,
                  borderTopRightRadius: radius.xl,
                  borderBottomRightRadius: radius.xl,
                }}
              >
                <SidebarContent
                  pathname={pathname}
                  onNavigate={() => setIsSidebarOpen(false)}
                  onLogout={handleLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          {(title || subtitle || actions) && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                {title && (
                  <h1
                    className="text-2xl font-bold"
                    style={{ color: semanticColors.text }}
                  >
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm" style={{ color: semanticColors.textMuted }}>
                    {subtitle}
                  </p>
                )}
              </div>
              {actions && <div className="flex gap-2">{actions}</div>}
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
    <nav className="p-4 space-y-1">
      {adminNavItems.map((link) => {
        const active = pathname === link.href || pathname.startsWith(link.href + '/')
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
              'transition-all duration-200'
            )}
            style={{
              color: active ? semanticColors.primary : semanticColors.textMuted,
              backgroundColor: active ? semanticColors.primaryBg : 'transparent',
            }}
            onMouseEnter={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = semanticColors.surfaceAlt
                e.currentTarget.style.color = semanticColors.primary
              }
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = semanticColors.textMuted
              }
            }}
          >
            <link.icon className="w-5 h-5 shrink-0" />
            <span>{link.label}</span>
          </Link>
        )
      })}
      <button
        type="button"
        onClick={onLogout}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium',
          'transition-all duration-200'
        )}
        style={{ color: semanticColors.cta }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = semanticColors.ctaBg
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span>Đăng xuất</span>
      </button>
    </nav>
  )
}

/** Stat card used in the dashboard. Token-driven styling. */
export function AdminStatCard({
  label,
  value,
  accent = 'primary',
}: {
  label: string
  value: number | string
  accent?: 'primary' | 'accent' | 'cta' | 'dark'
}) {
  const dotColor =
    accent === 'primary'
      ? semanticColors.primary
      : accent === 'accent'
      ? semanticColors.accent
      : accent === 'cta'
      ? semanticColors.cta
      : semanticColors.textMuted

  return (
    <div
      className="rounded-xl p-5 sm:p-6 transition-shadow duration-200"
      style={{
        backgroundColor: semanticColors.surface,
        boxShadow: shadows.card,
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: dotColor }}
        />
        <span className="text-xs" style={{ color: semanticColors.textMuted }}>
          Tuần này
        </span>
      </div>
      <div
        className="text-3xl font-bold mb-1"
        style={{ color: semanticColors.text }}
      >
        {value}
      </div>
      <div className="text-sm" style={{ color: semanticColors.textMuted }}>
        {label}
      </div>
    </div>
  )
}
