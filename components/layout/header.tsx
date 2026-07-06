'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/language-switcher'
import { motion, AnimatePresence } from 'framer-motion'
import { duration, easeOut } from '@/lib/motion-presets'

/**
 * Header – performance-optimised rebuild.
 *
 * Why the old version was laggy:
 *   - Wrapping `<header>` in <motion.header animate={{paddingTop/Bottom}}>
 *     forced React to re-render the entire header tree on every scroll tick.
 *   - The logo <Image> switched CSS `height` mid-animation, fighting with
 *     framer-motion's transform and producing layout shift (CLS).
 *
 * New approach (zero React re-renders while scrolling):
 *   - The header is a plain element; we toggle the `is-scrolled` class via a
 *     ref + rAF-throttled scroll handler. CSS handles ALL visual changes
 *     (padding, shadow, colors, logo size) via transitions on transform &
 *     opacity-friendly properties only.
 *   - `data-scrolled` attribute on <header> drives every child rule so we
 *     never need to re-render children.
 *   - The mobile menu/dropdown still use motion (user-driven, rare) but
 *     stay outside the scroll hot path.
 */
export function Header() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  // useTransition: mark locale updates as non-urgent so the visible tree
  // (header / footer) stays responsive while the new route is prepared.
  const [, startTransition] = useTransition()
  const headerRef = useRef<HTMLElement>(null)

  // rAF-throttled scroll handler. Writes to a DOM attribute instead of
  // setState, so React never re-renders during scroll. Only one DOM
  // mutation per animation frame, no per-pixel cost.
  useEffect(() => {
    let ticking = false
    const update = () => {
      const el = headerRef.current
      if (!el) {
        ticking = false
        return
      }
      const scrolled = window.scrollY > 20
      // ToggleAttribute is cheap; CSS reads [data-scrolled].
      if (scrolled) el.setAttribute('data-scrolled', 'true')
      else el.removeAttribute('data-scrolled')
      ticking = false
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }
    update() // sync state on mount
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route changes
  useEffect(() => {
    startTransition(() => {
      setIsMobileMenuOpen(false)
      setActiveDropdown(null)
    })
  }, [locale, startTransition])

  const navItems = [
    { label: t('home'), href: `/${locale}` },
    {
      label: t('about'),
      href: `/${locale}/about`,
      children: [
        { label: t('aboutUs'), href: `/${locale}/about#about` },
        { label: t('vision'), href: `/${locale}/about#vision` },
        { label: t('mission'), href: `/${locale}/about#mission` },
        { label: t('values'), href: `/${locale}/about#values` },
      ],
    },
    {
      label: t('programs'),
      href: `/${locale}/programs`,
      children: [
        { label: t('kindergarten'), href: `/${locale}/programs?level=kindergarten` },
        { label: t('elementary'), href: `/${locale}/programs?level=elementary` },
        { label: t('middle'), href: `/${locale}/programs?level=middle` },
        { label: t('high'), href: `/${locale}/programs?level=high` },
      ],
    },
    { label: t('partners'), href: `/${locale}/partners` },
    {
      label: t('admissions'),
      href: `/${locale}/admissions`,
      children: [
        { label: t('tuition'), href: `/${locale}/admissions#tuition` },
        { label: t('faq'), href: `/${locale}/admissions#faq` },
        { label: t('contact'), href: `/${locale}/admissions#contact` },
      ],
    },
    { label: t('events'), href: `/${locale}/events` },
  ]

  return (
    <header ref={headerRef} className="epath-header">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center gap-2 group">
            <div className="logo-pill">
              <Image
                src="/epath_logo.png"
                alt="EPath Education"
                width={120}
                height={35}
                className="logo-img"
                priority
              />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-0.5">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => item.children && setActiveDropdown(null)}
              >
                <Link href={item.href} className="nav-link">
                  {item.label}
                </Link>

                {/* Invisible bridge so the cursor can travel from the
                    nav-link down to the dropdown without ever leaving
                    the hover region. Without this, the dropdown closes
                    the moment the cursor crosses the 4px gap. */}
                {item.children && (
                  <div
                    className="absolute top-full left-0 right-0 h-2"
                    aria-hidden
                  />
                )}

                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: duration.fast, ease: easeOut }}
                      // z-[60] sits above chat-bubble (z-50) and any
                      // sticky / positioned siblings.
                      className="absolute top-full left-0 mt-2 min-w-48 bg-white shadow-xl rounded-xl py-1.5 border border-[#3A53A3]/10 z-[60]"
                      onMouseEnter={() => setActiveDropdown(item.label)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#231F20] hover:bg-[#3A53A3] hover:text-white transition-colors duration-200"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <ChevronRight className="w-3 h-3 text-[#8BC53F]" />
                          {child.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
            <Link href={`/${locale}/admissions#contact`} className="header-cta">
              {t('register')}
            </Link>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              type="button"
            >
              <span className="menu-icon" data-open={isMobileMenuOpen}>
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="lg:hidden overflow-hidden mt-4 pb-4 border-t border-white/20 pt-4"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'block px-4 py-3 font-medium rounded-lg transition-colors duration-200',
                        'text-[#231F20] hover:bg-[#3A53A3] hover:text-white'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-6 flex flex-col gap-0.5 mt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              'flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors duration-200',
                              'text-[#231F20]/70 hover:bg-[#3A53A3] hover:text-white'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ChevronRight className="w-4 h-4 text-[#8BC53F]" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4 px-4">
                  <Link
                    href={`/${locale}/admissions#contact`}
                    className="block w-full py-3 text-center bg-[#F05A28] text-white font-medium rounded-full transition-colors duration-200 hover:bg-[#E04D1A]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('register')}
                  </Link>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
