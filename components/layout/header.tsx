'use client'

import { useState, useEffect, useTransition, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('nav')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  // useTransition: mark locale updates as non-urgent so the visible tree
  // (header / footer) stays responsive while the new route is prepared.
  const [, startTransition] = useTransition()
  const headerRef = useRef<HTMLElement>(null)

  const isHomePage = !pathname || pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`

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
      // On subpages, header is always solid white
      const scrolled = !isHomePage || window.scrollY > 20
      if (scrolled) {
        el.setAttribute('data-scrolled', 'true')
        if (!isHomePage) el.setAttribute('data-solid', 'true')
      } else {
        el.removeAttribute('data-scrolled')
        el.removeAttribute('data-solid')
      }
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
  }, [isHomePage])

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
    <header
      ref={headerRef}
      className={cn('epath-header', !isHomePage && 'epath-header--solid')}
      data-scrolled={!isHomePage ? 'true' : undefined}
      data-solid={!isHomePage ? 'true' : undefined}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-12">
            <Link href={`/${locale}`} className="flex items-center group py-0.5 flex-shrink-0" aria-label="EPath Education">
              <div className="logo-wrapper">
                <Image
                  src="/epath-logo-background-white.png"
                  alt="EPath Education"
                  width={200}
                  height={96}
                  className="logo-img logo-img-light"
                  priority
                />
                <Image
                  src="/epath-logo-background-white.png"
                  alt="EPath Education"
                  width={200}
                  height={96}
                  className="logo-img logo-img-dark"
                  priority
                />
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {navItems.map((item) => {
                const isHome = item.href === `/${locale}` || item.href === '/'
                const isActive = isHome
                  ? pathname === `/${locale}` || pathname === '/' || pathname === `/${locale}/`
                  : pathname.startsWith(item.href)

                return (
                  <div
                    key={item.label}
                    className="relative"
                    onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                    onMouseLeave={() => item.children && setActiveDropdown(null)}
                  >
                    <Link
                      href={item.href}
                      className={cn(
                        'nav-link',
                        isActive && 'nav-link-active',
                        activeDropdown === item.label && 'nav-link-open'
                      )}
                    >
                      <span>{item.label}</span>
                    </Link>

                    {/* Invisible bridge so the cursor can travel from the
                        nav-link down to the dropdown without ever leaving
                        the hover region. */}
                    {item.children && (
                      <div
                        className="absolute top-full left-0 right-0 h-3"
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
                          className="absolute top-full left-0 mt-1 min-w-[240px] epath-dropdown-panel z-[60]"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="flex flex-col py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                className="epath-dropdown-item group"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span className="epath-dropdown-item-text">{child.label}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#3a54a4] opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0 ml-3 flex-shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </nav>
          </div>

          <div className="hidden lg:flex items-center gap-3.5 flex-shrink-0">
            <LanguageSwitcher />
            <Link
              href={`/${locale}/admissions#contact`}
              className="header-register-btn group"
              aria-label={locale === 'vi' ? 'Đăng ký ngay' : 'Register'}
            >
              <span className="header-register-ring ring-1" aria-hidden="true" />
              <span className="header-register-ring ring-2" aria-hidden="true" />
              <span className="relative z-10 inline-flex items-center">
                <span>{locale === 'vi' ? 'Đăng ký ngay' : 'Register'}</span>
              </span>
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
              className="epath-mobile-nav lg:hidden overflow-hidden mt-3 pb-4 border-t border-[#DEDDD6] pt-3 z-[65] bg-white rounded-2xl shadow-xl px-2"
            >
              <div className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      href={item.href}
                      className={cn(
                        'epath-mobile-link block px-4 py-2.5 text-lg font-semibold rounded-xl transition-colors duration-200',
                        'text-[#20242B] hover:bg-[#2E4A9E]/8 hover:text-[#2E4A9E]'
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children && (
                      <div className="pl-6 flex flex-col gap-0.5 mt-0.5">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={cn(
                              'epath-mobile-sublink flex items-center gap-2 px-4 py-2 text-base rounded-lg transition-colors duration-200',
                              'text-[#5C6069] hover:bg-[#2E4A9E]/8 hover:text-[#2E4A9E]'
                            )}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ChevronRight className="w-4 h-4 text-[#8DC63F]" />
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
                    className="flex items-center justify-center w-full py-3 text-center bg-gradient-to-r from-[#F05A28] to-[#E04D1A] hover:from-[#E04D1A] hover:to-[#D03D0A] text-white font-semibold rounded-full shadow-md transition-all duration-200 text-base"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>{locale === 'vi' ? 'Đăng ký ngay' : 'Register'}</span>
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
