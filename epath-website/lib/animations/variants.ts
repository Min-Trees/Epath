/**
 * EPath Animation System - Variants
 * Reusable animation variants for common patterns
 */

import { Variants } from 'framer-motion'
import { ANIMATION_DURATION, STAGGER_DELAY } from './config'

// ============================================
// ENTRANCE ANIMATIONS
// ============================================

/**
 * Fade in from below
 * Most common entrance animation
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Fade in from above
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Fade in from left
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Fade in from right
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Simple fade in (no movement)
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION_DURATION.normal, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Scale in from center
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: ANIMATION_DURATION.normal, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Scale in with bounce
 */
export const scaleInBounce: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 15 }
  },
}

// ============================================
// STAGGER CONTAINER VARIANTS
// ============================================

/**
 * Stagger fade in up - for lists/grids
 * Items appear one after another from below
 */
export const staggerFadeInUp = (delay?: number): Variants => ({
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: [0, 0, 0.2, 1],
      staggerChildren: delay ?? STAGGER_DELAY.normal,
    },
  },
})

/**
 * Stagger fade in - for simple staggered lists
 */
export const staggerFadeIn = (delay?: number): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      staggerChildren: delay ?? STAGGER_DELAY.fast,
    },
  },
})

/**
 * Stagger scale in - for card grids
 */
export const staggerScaleIn = (delay?: number): Variants => ({
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.normal,
      ease: [0, 0, 0.2, 1],
      staggerChildren: delay ?? STAGGER_DELAY.normal,
    },
  },
})

/**
 * Stagger from left - for horizontal lists
 */
export const staggerFadeInLeft = (delay?: number): Variants => ({
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: [0, 0, 0.2, 1],
      staggerChildren: delay ?? STAGGER_DELAY.normal,
    },
  },
})

/**
 * Stagger from right - for horizontal lists
 */
export const staggerFadeInRight = (delay?: number): Variants => ({
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.slow,
      ease: [0, 0, 0.2, 1],
      staggerChildren: delay ?? STAGGER_DELAY.normal,
    },
  },
})

// ============================================
// SLIDE VARIANTS (for carousels/sliders)
// ============================================

/**
 * Slide in from right (for carousels)
 */
export const slideInFromRight: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
}

/**
 * Slide in from bottom
 */
export const slideInFromBottom: Variants = {
  hidden: { y: '100%' },
  visible: { 
    y: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Slide in from top
 */
export const slideInFromTop: Variants = {
  hidden: { y: '-100%' },
  visible: { 
    y: 0,
    transition: { duration: ANIMATION_DURATION.slow, ease: [0, 0, 0.2, 1] }
  },
}

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================

/**
 * Standard page enter/exit
 */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATION.normal, ease: [0, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: ANIMATION_DURATION.fast, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Page enter with scale
 */
export const pageTransitionScale: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: ANIMATION_DURATION.normal, ease: [0, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0,
    scale: 1.02,
    transition: { duration: ANIMATION_DURATION.fast, ease: [0, 0, 0.2, 1] }
  },
}

// ============================================
// HOVER/TAP VARIANTS
// ============================================

/**
 * Hover scale up
 */
export const hoverScaleUp: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

/**
 * Hover scale down
 */
export const hoverScaleDown: Variants = {
  rest: { scale: 1 },
  hover: { scale: 0.95 },
  tap: { scale: 1.02 },
}

/**
 * Hover lift (translate up)
 */
export const hoverLift: Variants = {
  rest: { y: 0, boxShadow: '0 0 0 0 transparent' },
  hover: { 
    y: -4, 
    boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)',
    transition: { duration: ANIMATION_DURATION.fast, ease: [0, 0, 0.2, 1] }
  },
  tap: { y: -2 },
}

/**
 * Button hover effect
 */
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
}

// ============================================
// LOOP/AMBIENT ANIMATIONS
// ============================================

/**
 * Gentle float (for floating elements)
 */
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Gentle pulse
 */
export const pulse: Variants = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.9, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Gentle rotation wiggle
 */
export const wiggle: Variants = {
  animate: {
    rotate: [-2, 2, -2],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Bounce (for scroll indicators, etc.)
 */
export const bounce: Variants = {
  animate: {
    y: [0, 8, 0],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

/**
 * Subtle glow pulse
 */
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(58, 83, 163, 0.3)',
      '0 0 40px rgba(58, 83, 163, 0.5)',
      '0 0 20px rgba(58, 83, 163, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

// ============================================
// MODAL/OVERLAY VARIANTS
// ============================================

/**
 * Modal entrance from center
 */
export const modalIn: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: ANIMATION_DURATION.normal, ease: [0, 0, 0.2, 1] }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: ANIMATION_DURATION.fast, ease: [0, 0, 0.2, 1] }
  },
}

/**
 * Backdrop fade
 */
export const backdropIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

// ============================================
// TYPE EXPORTS
// ============================================

export type AnimationVariant = Variants
