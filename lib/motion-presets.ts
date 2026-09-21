/**
 * EPath Motion Presets
 * Single source of truth for all motion in the app.
 * Every component should use these tokens (or `ease`/`duration`
 * constants from here) to ensure consistent, smooth, non-jittery motion.
 */
import type { Variants, Transition } from 'framer-motion'
import { useEffect, useRef } from 'react'

// -----------------------------------------------------------
// Easing curves – buttery smooth, organic, luxury deceleration
// -----------------------------------------------------------

/** Ultra-smooth deceleration curve (quintic ease-out, Apple/Stripe standard). */
export const easeOut: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Symmetric ease-in-out, ideal for ambient / loop animations. */
export const easeInOut: [number, number, number, number] = [0.65, 0, 0.35, 1]

/** Soft deceleration for non-jarring entrances. */
export const easeStandard: [number, number, number, number] = [0.25, 1, 0.5, 1]

// -----------------------------------------------------------
// Durations (seconds) – relaxed, elegant, non-abrupt timing
// -----------------------------------------------------------

export const duration = {
  instant: 0.12,
  fast: 0.25,
  normal: 0.48,
  slow: 0.62,
  slower: 0.8,
  page: 0.35,
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

/** Physics-based spring transitions for organic, bounce-free settle. */
export const springGentle: Transition = {
  type: 'spring',
  damping: 24,
  stiffness: 100,
  mass: 0.8,
}

export const springSmooth: Transition = {
  type: 'spring',
  damping: 28,
  stiffness: 90,
  mass: 1,
}

// -----------------------------------------------------------
// Reusable variants
// -----------------------------------------------------------

/** Default viewport settings for in-view scroll animations.
 * amount: 0.06 ensures animations start immediately as elements enter the view.
 * margin buffer avoids late pop-ins.
 */
export const inViewViewport = {
  once: true,
  amount: 0.06,
  margin: '0px 0px -40px 0px',
} as const

/** Container that staggers its direct children with fluid cascade. */
export const staggerContainer = (stagger = 0.06, delay = 0.02): Variants => ({
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

/** Fade + translate from below with smooth organic settle. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: duration.normal,
      ease: easeOut,
    },
  },
}

/** Fade + translate from above. */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -16 },
  visible: { opacity: 1, y: 0, transition: transitionEnter },
}

/** Fade + translate from left. */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: transitionEnter },
}

/** Fade + translate from right. */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 16 },
  visible: { opacity: 1, x: 0, transition: transitionEnter },
}

/** Subtle scale-in, smooth settle. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: transitionEnter },
}

/** Card/panel hover: smooth floating lift with soft shadow. */
export const hoverLift = {
  rest: {
    y: 0,
    boxShadow: '0 4px 16px -4px rgba(30, 53, 112, 0.06)',
    transition: { duration: 0.3, ease: easeOut },
  },
  hover: {
    y: -4,
    boxShadow: '0 16px 32px -8px rgba(30, 53, 112, 0.14)',
    transition: { duration: 0.3, ease: easeOut },
  },
  tap: { y: -1, transition: { duration: 0.12 } },
} satisfies Variants

/** Plain hover scale with organic spring. */
export const hoverScale = {
  rest: { scale: 1, transition: { duration: 0.4, ease: easeOut } },
  hover: { scale: 1.04, transition: { duration: 0.4, ease: easeOut } },
  tap: { scale: 0.98, transition: { duration: 0.15 } },
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
