'use client'

import { useState, useEffect, useTransition, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Menu, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/language-switcher'
import { motion, AnimatePresence } from 'framer-motion'
import { duration, easeOut } from '@/lib/motion-presets'
import { useRegistrationModal } from '@/components/registration-modal-context'
import { useScrollLock } from '@/lib/use-scroll-lock'

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
  const { openRegistrationModal } = useRegistrationModal()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  // Track open sections on mobile accordion (default expanded so user can see and scroll all items)
  const [openMobileSections, setOpenMobileSections] = useState<Record<string, boolean>>({
    'item-1': true,
    'item-2': true,
    'item-4': true,
    'item-5': true,
  })

  const toggleMobileSection = (key: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [key]: !(prev[key] ?? true),
    }))
  }

  // Robust scroll to anchor with multi-interval retries that resist router layout shifts and Next.js scroll resets
  const triggerHashScroll = useCallback((targetHash: string) => {
    if (!targetHash || typeof document === 'undefined') return

    const cleanId = targetHash.replace(/^#/, '')
    let userInteracted = false

    const onUserInteraction = () => {
      userInteracted = true
    }
    window.addEventListener('wheel', onUserInteraction, { passive: true, once: true })
    window.addEventListener('touchmove', onUserInteraction, { passive: true, once: true })

    const delays = [30, 100, 200, 350, 550, 800, 1200]
    delays.forEach((delay) => {
      setTimeout(() => {
        if (userInteracted) return

        const el = document.getElementById(cleanId)
        if (!el) return

        // NOTE: the shared scroll-lock manager owns `document.body.style`
        // and restores the scroll offset itself. Clearing overflow here
        // would fight with it and leave the page permanently unscrollable.

        const headerHeight = headerRef.current?.offsetHeight || 72
        const rect = el.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0
        const targetY = Math.max(0, rect.top + scrollTop - headerHeight - 16)

        // Only scroll if we are not already positioned at the target
        if (Math.abs(scrollTop - targetY) > 25) {
          try {
            window.scrollTo({
              top: targetY,
              behavior: 'smooth',
            })
          } catch {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }, delay)
    })
  }, [])

  // Universal click handler for nav links (mobile & desktop)
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    onSuccess?: () => void
  ) => {
    // NOTE: do NOT touch `document.body.style.overflow` here.
    // The shared scroll-lock manager owns that state. Resetting it
    // manually used to leave the body pinned with `position: fixed`
    // after navigating from the mobile menu, freezing the whole page.
    onSuccess?.()
    setIsMobileMenuOpen(false)

    const [targetPath, hash] = href.split('#')
    const currentPath = (pathname || '').replace(/\/$/, '')
    const normalizedTargetPath = (targetPath || '').replace(/\/$/, '')
    const isSamePage =
      currentPath === normalizedTargetPath ||
      (!currentPath && normalizedTargetPath === `/${locale}`) ||
      (currentPath === `/${locale}` && !normalizedTargetPath)

    if (hash) {
      if (isSamePage) {
        e.preventDefault()
        if (window.location.hash !== `#${hash}`) {
          window.history.pushState(null, '', `#${hash}`)
        }
        triggerHashScroll(hash)
      } else {
        // Cross page: save hash to sessionStorage so destination page can scroll even if router delays hash
        try {
          sessionStorage.setItem('epath_nav_hash', hash)
        } catch {}
      }
    }
  }

  // Cross-page hash navigation on mount and pathname updates
  useEffect(() => {
    if (typeof window === 'undefined') return

    let hash = window.location.hash.replace(/^#/, '')
    if (!hash) {
      try {
        hash = sessionStorage.getItem('epath_nav_hash') || ''
        if (hash) {
          sessionStorage.removeItem('epath_nav_hash')
        }
      } catch {}
    }

    if (hash) {
      triggerHashScroll(hash)
    }
  }, [pathname, triggerHashScroll])

  // Listen for hashchange events
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '')
      if (hash) {
        triggerHashScroll(hash)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [triggerHashScroll])

  // Body scroll lock on mobile & desktop when menu is open: freeze the
  // background completely so the page NEVER scrolls behind the panel.
  //
  // We use the shared reference-counted lock (not a local save/restore)
  // because the registration modal can be opened from INSIDE this menu.
  // With a local lock, closing one overlay would release the lock while
  // the other was still open — leaving the page frozen forever.
  useScrollLock(isMobileMenuOpen)

  // useTransition: mark locale updates as non-urgent so the visible tree
  // (header / footer) stays responsive while the new route is prepared.
  const [, startTransition] = useTransition()
  const headerRef = useRef<HTMLElement>(null)

  const isHomePage = !pathname || pathname === '/' || pathname === `/${locale}` || pathname === `/${locale}/`

  // Publish the REAL header height as a CSS variable so the mobile nav
  // panel can align perfectly with the bottom of the header.
  //
  // Why: the panel used to hard-code `top-[76px]`. That number drifted
  // from the actual header height (logo-wrapper 52px + 12px padding x2)
  // and broke completely on short viewports / with the mobile keyboard
  // open, because the panel then had almost no scrollable height left.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return

    const apply = () => {
      document.documentElement.style.setProperty(
        '--epath-header-h',
        `${el.offsetHeight}px`
      )
    }

    apply()

    const ro = new ResizeObserver(apply)
    ro.observe(el)

    window.addEventListener('resize', apply)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', apply)
    }
  }, [])

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
  }, [pathname, locale, startTransition])

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
        { label: t('achievements'), href: `/${locale}/about#achievements` },
      ],
    },
    {
      label: t('programs'),
      href: `/${locale}/programs`,
      children: [
        { label: t('breakthroughEnglish'), href: `/${locale}/programs#breakthrough-english` },
        { label: t('scienceFoundation'), href: `/${locale}/programs#science-foundation` },
        { label: t('elementary'), href: `/${locale}/programs#elementary` },
        { label: t('middle'), href: `/${locale}/programs#middle` },
        { label: t('high'), href: `/${locale}/programs#high` },
        { label: t('personalDevelopment'), href: `/${locale}/programs#personal-development` },
      ],
    },
    { label: t('partners'), href: `/${locale}/partners` },
    {
      label: t('admissions'),
      href: `/${locale}/admissions`,
      children: [
        { label: t('promotions'), href: `/${locale}/admissions#promotions` },
        { label: t('admissionsProcess'), href: `/${locale}/admissions#steps` },
        { label: t('tuition'), href: `/${locale}/admissions#tuition` },
        { label: t('faq'), href: `/${locale}/admissions#faq` },
        { label: t('contact'), href: `/${locale}/admissions#contact` },
      ],
    },
    {
      label: t('events'),
      href: `/${locale}/events`,
      children: [
        { label: t('featuredEvents'), href: `/${locale}/events#featured` },
        { label: t('news'), href: `/${locale}/events#news` },
      ],
    },
  ]

  return (
    <>
      <header
        ref={headerRef}
        className={cn('epath-header', !isHomePage && 'epath-header--solid')}
        data-scrolled={!isHomePage ? 'true' : undefined}
        data-solid={!isHomePage ? 'true' : undefined}
        data-mobile-open={isMobileMenuOpen ? 'true' : undefined}
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
                      onClick={(e) => handleNavClick(e, item.href)}
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
                          className="absolute top-full left-0 mt-1 min-w-[280px] sm:min-w-[340px] epath-dropdown-panel z-[60] rounded-none"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                        >
                          <div className="flex flex-col py-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.label}
                                href={child.href}
                                scroll={false}
                                className="epath-dropdown-item rounded-none"
                                onClick={(e) =>
                                  handleNavClick(e, child.href, () => setActiveDropdown(null))
                                }
                              >
                                <span className="epath-dropdown-item-text">{child.label}</span>
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
            <button
              type="button"
              onClick={() => openRegistrationModal({ source: 'header' })}
              className="header-register-btn group cursor-pointer"
              aria-label={locale === 'vi' ? 'Đăng ký ngay' : 'Register'}
            >
              <span className="header-register-ring ring-1" aria-hidden="true" />
              <span className="header-register-ring ring-2" aria-hidden="true" />
              <span className="relative z-10 inline-flex items-center">
                <span>{locale === 'vi' ? 'Đăng ký ngay' : 'Register'}</span>
              </span>
            </button>
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
      </div>
    </header>

    {/* Mobile Navigation Menu - Full-height Panel with Native Touch Scroll

        Sizing strategy:
          - `top` is driven by `--epath-header-h` (the real measured header
            height, published by the ResizeObserver above) instead of a
            hard-coded 76px. This keeps the panel flush with the header
            bottom on every device / breakpoint.
          - `height` uses `100dvh` (dynamic viewport height) so the panel
            correctly follows the mobile keyboard and the iOS URL bar.
          - `overflow-y-auto` (not `overflow-y-scroll`) so the scrollbar
            only appears when there is actually content to scroll.

        z-index: the panel sits BELOW the header (z-60) on purpose. The
        header is `position: fixed` and would otherwise intercept the
        first touch near the top of the panel, making it feel "stuck". */}
    {isMobileMenuOpen && (
      <div
        className="fixed inset-x-0 bottom-0 z-[45] lg:hidden bg-white overflow-y-auto overscroll-contain border-t border-[#DEDDD6] pb-[env(safe-area-inset-bottom)]"
        style={{
          top: 'var(--epath-header-h, 76px)',
          height: 'calc(100dvh - var(--epath-header-h, 76px))',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 py-4 space-y-1 pb-32">
          {navItems.map((item, idx) => {
            const sectionKey = `item-${idx}`
            const hasChildren = Boolean(item.children && item.children.length > 0)
            const isExpanded = Boolean(openMobileSections[sectionKey] ?? true)

            return (
              <div
                key={item.label}
                className="border-b border-[#DEDDD6]/50 last:border-b-0 pb-1.5 mb-1"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    scroll={!item.href.includes('#')}
                    className={cn(
                      'flex-1 block px-3 py-2.5 text-base sm:text-lg font-bold rounded-xl transition-colors duration-200',
                      'text-[#1E3570] hover:bg-[#2E4A9E]/8 hover:text-[#2E4A9E]'
                    )}
                    onClick={(e) =>
                      handleNavClick(e, item.href, () => setIsMobileMenuOpen(false))
                    }
                  >
                    {item.label}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => toggleMobileSection(sectionKey)}
                      className="w-12 h-12 flex items-center justify-center text-[#5C6069] hover:text-[#2E4A9E] hover:bg-[#F6F5F1] rounded-xl transition-all cursor-pointer mr-0.5"
                      aria-label={`Toggle ${item.label} submenu`}
                    >
                      <ChevronDown
                        className={cn(
                          'w-5 h-5 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && isExpanded && (
                  <div className="pl-4 pr-1 py-1 flex flex-col gap-0.5 space-y-0.5 border-l-2 border-[#2E4A9E]/20 ml-3 my-1">
                    {item.children!.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        scroll={!child.href.includes('#')}
                        className={cn(
                          'flex items-center px-3 py-2 text-sm sm:text-base rounded-lg transition-all duration-200',
                          'text-[#5C6069] hover:bg-[#F6F5F1] hover:text-[#2E4A9E]'
                        )}
                        onClick={(e) =>
                          handleNavClick(e, child.href, () => setIsMobileMenuOpen(false))
                        }
                      >
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* CTA Register Button */}
          <div className="pt-4 pb-6 px-1">
            <button
              type="button"
              className="flex items-center justify-center w-full py-3.5 text-center bg-gradient-to-r from-[#F05A28] to-[#E04D1A] hover:from-[#E04D1A] hover:to-[#D03D0A] text-white font-bold rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-base cursor-pointer"
              onClick={() => {
                setIsMobileMenuOpen(false)
                openRegistrationModal({ source: 'header-mobile' })
              }}
            >
              <span>{locale === 'vi' ? 'Đăng ký ngay' : 'Register'}</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </>
)
}
