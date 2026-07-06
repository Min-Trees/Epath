/**
 * EPath Motion System - Main Export
 * Central export point for all animation utilities
 */

export {
  easeOut,
  easeInOut,
  easeStandard,
  duration,
  transitionEnter,
  transitionSlowEnter,
  transitionPage,
  inViewViewport,
  staggerContainer,
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  hoverLift,
  hoverScale,
  pageVariants,
} from '../motion-presets'

// Design tokens (colors, shadows, radii)
export {
  brandColors,
  semanticColors,
  accentCycle,
  shadows,
  radius,
} from '../design-tokens'

// Config exports
export {
  ANIMATION_DURATION,
  ANIMATION_EASE,
  STAGGER_DELAY,
  SCROLL_VIEWPORT,
  COUNTER_CONFIG,
  PAGE_TRANSITION,
  getTransition,
  getSpring,
} from './config'
export type { AnimationDuration, AnimationEase, StaggerDelay } from './config'

// Variants exports
export {
  // Entrance
  fadeInUp as fadeInUpLegacy,
  fadeInDown as fadeInDownLegacy,
  fadeInLeft as fadeInLeftLegacy,
  fadeInRight as fadeInRightLegacy,
  fadeIn as fadeInLegacy,
  scaleIn as scaleInLegacy,
  scaleInBounce,

  // Stagger
  staggerFadeInUp,
  staggerFadeIn,
  staggerScaleIn,
  staggerFadeInLeft,
  staggerFadeInRight,

  // Slide
  slideInFromRight,
  slideInFromBottom,
  slideInFromTop,

  // Page Transition
  pageTransition,
  pageTransitionScale,

  // Hover/Tap
  hoverScaleUp,
  hoverScaleDown,
  hoverLift as hoverLiftLegacy,
  buttonHover,

  // Loop/Ambient
  float,
  pulse,
  wiggle,
  bounce,
  glowPulse,

  // Modal
  modalIn,
  backdropIn,
} from './variants'
export type { AnimationVariant } from './variants'

// Hooks exports
export {
  useScrollReveal,
  useStaggerContainer,
  useCounter,
  useSpringCounter,
  useHoverScale,
} from './hooks'
export type {
  UseStaggerResult,
  UseCounterResult,
} from './hooks'
