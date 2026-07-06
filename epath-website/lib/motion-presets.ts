/**
 * EPath Motion Presets
 * Single source of truth for all motion in the app.
 * Every component should use these tokens (or `ease`/`duration`
 * constants from here) to ensure consistent, smooth, non-jittery motion.
 */
import type { Variants, Transition } from 'framer-motion'
import { useEffect, useRef } from 'react'

// -----------------------------------------------------------
// Easing curves
// -----------------------------------------------------------

/** Standard ease-out, ideal for entrance animations. */
export const easeOut: [number, number, number, number] = [0, 0, 0.2, 1]

/** Symmetric ease-in-out, ideal for ambient / loop animations. */
export const easeInOut: [number, number, number, number] = [0.4, 0, 0.2, 1]

/** Soft deceleration for non-jarring entrances. */
export const easeStandard: [number, number, number, number] = [0.4, 0, 0.6, 1]

// -----------------------------------------------------------
// Durations (seconds)
// -----------------------------------------------------------

export const duration = {
  instant: 0.12,
  fast: 0.18,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
  page: 0.2,
} as const

// -----------------------------------------------------------
// Common transitions
// -----------------------------------------------------------

export const transitionEnter: Transition = {
  duration: duration.normal,
  ease: easeOut,
}

export const transitionSlowEnter: Transition = {
  duration: duration.slow,
  ease: easeOut,
}

export const transitionPage: Transition = {
  duration: duration.page,
  ease: easeStandard,
}

// -----------------------------------------------------------
// Reusable variants
// -----------------------------------------------------------

/** Default viewport settings for in-view scroll animations. */
export const inViewViewport = {
  once: true,
  amount: 0.2,
  margin: '0px 0px -10% 0px',
} as const

/** Container that staggers its direct children. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren: delay,
    },
  },
})

/** Plain fade-in. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitionEnter },
}

/** Fade + translate from below. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitionSlowEnter },
}

/** Fade + translate from above. */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: transitionSlowEnter },
}

/** Fade + translate from left. */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: transitionSlowEnter },
}

/** Fade + translate from right. */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: transitionSlowEnter },
}

/** Subtle scale-in, no bounce. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: transitionEnter },
}

/** Card/panel hover: lift with soft shadow. */
export const hoverLift = {
  rest: { y: 0, boxShadow: '0 4px 16px -4px rgba(35, 31, 32, 0.08)' },
  hover: {
    y: -4,
    boxShadow: '0 12px 28px -8px rgba(35, 31, 32, 0.18)',
    transition: { duration: duration.fast, ease: easeOut },
  },
  tap: { y: -1, transition: { duration: duration.instant } },
} satisfies Variants

/** Plain hover scale. */
export const hoverScale = {
  rest: { scale: 1 },
  hover: { scale: 1.04, transition: { duration: duration.fast, ease: easeOut } },
  tap: { scale: 0.97, transition: { duration: duration.instant } },
} satisfies Variants

// -----------------------------------------------------------
// Performance hooks
// -----------------------------------------------------------

/**
 * useInSectionAttribute
 *
 * Sets a `data-active` attribute on the ref'd element whenever it's
 * in the viewport (using IntersectionObserver). CSS can react to that
 * attribute to play / pause animations, keeping the JS thread idle.
 *
 * Why not framer-motion's `whileInView`?
 *   - Every motion-wrapped element creates its own RAF subscription.
 *   - With dozens of elements on screen that adds up to noticeable
 *     paint jank on low-end devices.
 *   - This hook uses a single shared observer; CSS handles the actual
 *     transitions.
 *
 * Usage:
 *   const ref = useSectionActive()
 *   <section ref={ref} className="my-section">...</section>
 *   // CSS:
 *   // .my-section[data-active='true'] .thing { animation: ... }
 */
export function useSectionActive<T extends HTMLElement = HTMLElement>(
  options: { rootMargin?: string; threshold?: number | number[] } = {}
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.dataset.active = 'true'
          } else {
            el.dataset.active = 'false'
          }
        }
      },
      {
        rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
        threshold: options.threshold ?? 0.1,
      }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [options.rootMargin, options.threshold])

  return ref
}

/** Smooth page enter/exit that does NOT cause language-switch flicker. */
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: duration.page, ease: easeStandard },
  },
  exit: {
    opacity: 0,
    transition: { duration: duration.fast, ease: easeStandard },
  },
}
