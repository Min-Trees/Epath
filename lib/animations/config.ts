/**
 * EPath Animation System - Configuration
 * Centralized animation settings for consistent motion across the entire application
 */

// Timing presets (in seconds)
export const ANIMATION_DURATION = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
  slower: 0.5,
} as const

// Easing presets
export const ANIMATION_EASE = {
  // Standard easing
  default: [0.4, 0, 0.2, 1] as const,
  easeOut: [0, 0, 0.2, 1] as const,
  easeIn: [0.4, 0, 1, 1] as const,
  easeInOut: [0.4, 0, 0.2, 1] as const,
  
  // Bounce/spring
  spring: { type: 'spring', stiffness: 300, damping: 30 } as const,
  springBounce: { type: 'spring', stiffness: 400, damping: 15 } as const,
  springSoft: { type: 'spring', stiffness: 200, damping: 25 } as const,
  
  // Custom
  smooth: [0.25, 0.1, 0.25, 1] as const,
  snappy: [0.68, -0.55, 0.265, 1.55] as const,
} as const

// Stagger delays for list animations (in seconds)
export const STAGGER_DELAY = {
  fastest: 0.03,
  fast: 0.05,
  normal: 0.08,
  slow: 0.12,
  slowest: 0.15,
} as const

// Scroll reveal threshold
export const SCROLL_VIEWPORT = {
  once: true,
  margin: '-50px',
} as const

// Counter animation settings
export const COUNTER_CONFIG = {
  duration: 1500, // ms
  steps: 50,
} as const

// Page transition settings
export const PAGE_TRANSITION = {
  duration: 0.2,
  exitDuration: 0.15,
  yOffset: 8,
  ease: 'easeOut' as const,
} as const

// Animation type definitions
export type AnimationDuration = keyof typeof ANIMATION_DURATION
export type AnimationEase = keyof typeof ANIMATION_EASE
export type StaggerDelay = keyof typeof STAGGER_DELAY

// Helper function to get transition props
export function getTransition(
  duration: AnimationDuration = 'normal',
  ease: AnimationEase = 'default',
  delay: number = 0
) {
  const easeValue = ANIMATION_EASE[ease]
  
  return {
    duration: ANIMATION_DURATION[duration],
    delay,
    ease: typeof easeValue === 'object' && 'type' in easeValue 
      ? easeValue 
      : easeValue,
  }
}

// Helper function to create spring transition
export function getSpring(
  stiffness: keyof typeof ANIMATION_EASE = 'spring',
  damping?: number
) {
  const springConfig = ANIMATION_EASE[stiffness]
  if (damping !== undefined && 'type' in springConfig) {
    return { ...springConfig, damping }
  }
  return springConfig
}
