/**
 * EPath Design Tokens
 * Single source of truth for colors, shadows, and visual constants.
 * Use these instead of hardcoded hex values across components.
 */

export const brandColors = {
  // Xanh dương chính (học thuật, tin cậy)
  blue: {
    50: '#E6ECFF',
    100: '#D4DDF7',
    500: '#3A53A3',
    600: '#2E4389',
    700: '#243569',
  },
  // Xanh lá (phát triển, năng lượng)
  green: {
    50: '#F3FAE0',
    100: '#E8F4C4',
    500: '#8BC53F',
    600: '#B7D333',
    700: '#9BB52A',
  },
  // Cam (sáng tạo, CTA)
  orange: {
    50: '#FFF3ED',
    100: '#FFE0CF',
    500: '#F05A28',
    600: '#E04D1A',
    700: '#C03F12',
  },
  // Neutral
  dark: '#231F20',
  gray: {
    400: '#6B6B6B',
    500: '#4A4A4A',
    600: '#3A3A3A',
  },
  bg: {
    DEFAULT: '#FFFFFF',
    alt: '#F8F9FA',
  },
} as const

/**
 * Semantic tokens - these are the *only* colors components should use
 * in their tailwind className strings. Pair with brandColors hex codes
 * when you need inline style (e.g. for dynamic per-item coloring).
 */
export const semanticColors = {
  primary: '#3A53A3',
  primaryDark: '#2E4389',
  primaryLight: '#4B63B3',
  primaryBg: '#E6ECFF',

  accent: '#8BC53F',
  accentDark: '#9BB52A',
  accentLight: '#B7D333',
  accentBg: '#F3FAE0',

  cta: '#F05A28',
  ctaDark: '#E04D1A',
  ctaLight: '#F26A42',
  ctaBg: '#FFF3ED',

  text: '#231F20',
  textMuted: '#6B6B6B',

  surface: '#FFFFFF',
  surfaceAlt: '#F8F9FA',
} as const

/**
 * Cycle order used by core-values, statistics, learning-pathways
 * and step-model sections. Index 0..2 repeat.
 */
export const accentCycle = [
  { color: semanticColors.primary, bg: semanticColors.primaryBg },
  { color: semanticColors.accent, bg: semanticColors.accentBg },
  { color: semanticColors.cta, bg: semanticColors.ctaBg },
] as const

export const shadows = {
  card: '0 4px 16px -4px rgba(35, 31, 32, 0.08)',
  cardHover: '0 12px 28px -8px rgba(35, 31, 32, 0.18)',
  nav: '0 1px 8px -2px rgba(35, 31, 32, 0.06)',
  cta: '0 8px 20px -6px rgba(240, 90, 40, 0.45)',
  glow: '0 0 24px rgba(58, 83, 163, 0.35)',
} as const

export const radius = {
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.25rem',
  full: '9999px',
} as const
