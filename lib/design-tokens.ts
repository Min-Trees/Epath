/**
 * EPath Design Tokens
 * Single source of truth for colors, shadows, and visual constants.
 * Updated to Official Navy & Vibrant Eco/Orange Theme
 */

export const brandColors = {
  // Navy chính (#2E4A9E) & Navy đậm (#1E3570)
  navy: {
    50: '#EAEFFB',
    100: '#D5DFFA',
    500: '#2E4A9E',
    600: '#1E3570',
    700: '#15254F',
  },
  // Xanh lá (#8DC63F) & Xanh lá đậm (#5C9024)
  green: {
    50: '#F4F9EC',
    100: '#E6F3D4',
    500: '#8DC63F',
    600: '#5C9024',
    700: '#466E1B',
  },
  // Cam (#F26522) & Cam đậm (#C94F16)
  orange: {
    50: '#FEF0E9',
    100: '#FDDDCF',
    500: '#F26522',
    600: '#C94F16',
    700: '#A33E10',
  },
  // Backward compatibility alias for purple (mapped to navy)
  purple: {
    50: '#EAEFFB',
    100: '#D5DFFA',
    500: '#2E4A9E',
    600: '#1E3570',
    700: '#15254F',
  },
  // Backward compatibility alias for mint (mapped to green)
  mint: {
    50: '#F4F9EC',
    100: '#E6F3D4',
    500: '#8DC63F',
    600: '#5C9024',
    700: '#466E1B',
  },
  // Backward compatibility alias for pink (mapped to orange)
  pink: {
    50: '#FEF0E9',
    100: '#FDDDCF',
    500: '#F26522',
    600: '#C94F16',
    700: '#A33E10',
  },
  // Backward compatibility alias for yellow
  yellow: {
    50: '#FEF0E9',
    100: '#FDDDCF',
    500: '#F26522',
    600: '#C94F16',
    700: '#A33E10',
  },
  // Nền & bề mặt
  lavender: '#F6F5F1',
  surface: '#FFFFFF',
  surface1: '#F6F5F1', // Xám nhạt (nền section)
  surface2: '#EDEDE8', // Xám card
  surface3: '#EDEDE8',
  border: '#DEDDD6',   // Viền (border)
  numberMuted: '#DEDDD6',
  // Chữ
  dark: '#20242B',     // Chữ tiêu đề
  gray: {
    400: '#5C6069',    // Chữ phụ/mô tả
    500: '#5C6069',
    600: '#20242B',
  },
  bg: {
    DEFAULT: '#FFFFFF',
    alt: '#F6F5F1',
  },
} as const

/**
 * Semantic tokens - these are the *only* colors components should use
 * in their tailwind className strings. Pair with brandColors hex codes
 * when you need inline style (e.g. for dynamic per-item coloring).
 */
export const semanticColors = {
  primary: '#2E4A9E',       // Navy chính
  primaryDark: '#1E3570',   // Navy đậm (header/footer/CTA)
  primaryLight: '#4B6BC7',
  primaryBg: '#EAEFFB',

  accent: '#F26522',        // Cam
  accentDark: '#C94F16',    // Cam đậm
  accentLight: '#F5824C',
  accentBg: '#FEF0E9',

  secondary: '#8DC63F',     // Xanh lá
  secondaryDark: '#5C9024', // Xanh lá đậm
  secondaryLight: '#A3D45F',
  secondaryBg: '#F4F9EC',

  tertiary: '#2E4A9E',
  tertiaryDark: '#1E3570',
  tertiaryLight: '#4B6BC7',
  tertiaryBg: '#EAEFFB',

  highlight: '#F26522',
  highlightDark: '#C94F16',
  highlightLight: '#F5824C',
  highlightBg: '#FEF0E9',

  text: '#20242B',          // Chữ tiêu đề
  textMuted: '#5C6069',     // Chữ phụ/mô tả

  surface: '#FFFFFF',       // Trắng
  surfaceAlt: '#F6F5F1',    // Xám nhạt (nền section)
  surface2: '#EDEDE8',      // Xám card
  surface3: '#EDEDE8',
  border: '#DEDDD6',        // Viền (border)
  numberMuted: '#DEDDD6',

  // CTA helpers for admin compatibility
  cta: '#1E3570',
  ctaBg: '#F26522',
} as const

/**
 * Cycle order used by core-values, statistics, learning-pathways
 * and step-model sections. Index 0..4 repeat for accent variety.
 */
export const accentCycle = [
  { color: '#2E4A9E', bg: '#EAEFFB' }, // Navy chính
  { color: '#8DC63F', bg: '#F4F9EC' }, // Xanh lá
  { color: '#F26522', bg: '#FEF0E9' }, // Cam
  { color: '#5C9024', bg: '#F4F9EC' }, // Xanh lá đậm
  { color: '#1E3570', bg: '#EAEFFB' }, // Navy đậm
] as const

export const shadows = {
  card: '0 4px 16px -4px rgba(30, 53, 112, 0.08)',
  cardHover: '0 12px 28px -8px rgba(30, 53, 112, 0.16)',
  nav: '0 1px 8px -2px rgba(30, 53, 112, 0.06)',
  cta: '0 8px 20px -6px rgba(242, 101, 34, 0.45)',
  glow: '0 0 24px rgba(46, 74, 158, 0.35)',
} as const

export const radius = {
  sm: '0.875rem',  // 14px - icon feature
  md: '1rem',       // 16px
  lg: '1.25rem',    // 20px - cards
  xl: '1.5rem',     // 24px
  '2xl': '1.75rem', // 28px - large blocks
  full: '9999px',   // buttons, pills, badges
} as const
