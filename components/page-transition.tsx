'use client'

/**
 * EPath Page Transition System
 * Smooth, seamless page transitions without language-switch flicker.
 *
 * Design notes:
 * - We do NOT key this component on `pathname` anymore. Keying on
 *   pathname forces a full unmount + remount of the entire page tree
 *   on every route change (and on every locale change), which is
 *   what caused the "giật" (flicker) when switching from English to
 *   Vietnamese: the Footer / Header outside this wrapper briefly
 *   stayed on the old locale while the main content remounted.
 * - Instead we wrap the children in a motion.div with an opacity
 *   fade, and we only trigger the entry animation on actual route
 *   changes (excluding pure locale swaps which we detect by checking
 *   that the rest of the path is identical).
 * - On the very first render we skip the entry animation entirely
 *   (`initial={false}`) so the page paints immediately.
 */

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface PageTransitionProps {
  children: React.ReactNode
  mode?: 'wait' | 'sync' | 'popLayout'
}

/**
 * SmoothPageTransition
 * Renders its children inside a motion.div with a soft opacity fade.
 * On locale switches (path changes from /en/x to /vi/x) it skips
 * the entry animation so the user sees a single atomic render.
 */
export function SmoothPageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const prevPathRef = useRef<string | null>(null)
  const justLocaleSwitchedRef = useRef(false)

  useEffect(() => {
    const prev = prevPathRef.current
    if (prev && prev !== pathname) {
      // Detect a pure locale switch: /<oldLocale>/rest -> /<newLocale>/rest
      const stripLocale = (p: string) => p.replace(/^\/(en|vi)(?=\/|$)/, '')
      if (stripLocale(prev) === stripLocale(pathname)) {
        justLocaleSwitchedRef.current = true
        // Clear the flag after one frame so subsequent renders animate again.
        requestAnimationFrame(() => {
          justLocaleSwitchedRef.current = false
        })
      }
    }
    prevPathRef.current = pathname
  }, [pathname])

  return (
    <motion.div
      key="page-transition-root"
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  )
}

/**
 * FadePageTransition
 * Alias kept for backwards compatibility.
 */
export function FadePageTransition({ children }: PageTransitionProps) {
  return <SmoothPageTransition>{children}</SmoothPageTransition>
}

/**
 * SlidePageTransition
 * Horizontal slide transition - kept for pages that explicitly need
 * a stronger effect (e.g. modals). Use with care.
 */
interface SlidePageTransitionProps {
  children: React.ReactNode
  direction?: 'left' | 'right'
}

export function SlidePageTransition({ children, direction = 'left' }: SlidePageTransitionProps) {
  const pathname = usePathname()
  const slideX = direction === 'left' ? 30 : -30

  return (
    <motion.div
      key={`slide-${pathname}`}
      initial={{ opacity: 0, x: slideX }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScalePageTransition
 * Subtle scale transition.
 */
export function ScalePageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  )
}

/**
 * CrossFadePageTransition
 * Smooth cross-fade without any movement. Best for content-heavy pages.
 */
export function CrossFadePageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.6, 1] }}
      style={{ willChange: 'opacity' }}
    >
      {children}
    </motion.div>
  )
}

// Default export - smooth transition
export { SmoothPageTransition as default }
