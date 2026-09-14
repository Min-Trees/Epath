import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-gilroy)', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // EPath Official Brand Colors
        // Navy chính (#2E4A9E) & Navy đậm (#1E3570)
        'epath-navy': '#2E4A9E',
        'epath-navy-dark': '#1E3570',
        'epath-navy-light': '#4B6BC7',
        // Xanh lá (#8DC63F) & Xanh lá đậm (#5C9024)
        'epath-green': '#8DC63F',
        'epath-green-dark': '#5C9024',
        'epath-green-light': '#A3D45F',
        // Cam (#F26522) & Cam đậm (#C94F16)
        'epath-orange': '#F26522',
        'epath-orange-dark': '#C94F16',
        'epath-orange-light': '#F5824C',
        // Bảng màu nền & viền
        'epath-border': '#DEDDD6',
        'epath-surface-1': '#F6F5F1',
        'epath-surface-2': '#EDEDE8',
        'epath-surface-3': '#EDEDE8',
        'epath-surface-card': '#EDEDE8',
        'epath-number-muted': '#DEDDD6',
        // Chữ đậm tiêu đề & Chữ phụ mô tả
        'epath-dark': '#20242B',
        'epath-gray': '#5C6069',
        // Nền
        'epath-bg': '#FFFFFF',
        'epath-bg-alt': '#F6F5F1',
        // Backward compatibility mappings
        'epath-purple': '#2E4A9E',
        'epath-purple-dark': '#1E3570',
        'epath-purple-light': '#4B6BC7',
        'epath-mint': '#8DC63F',
        'epath-pink': '#F26522',
        'epath-yellow': '#F26522',
        'epath-lavender': '#F6F5F1',
        // Legacy colors
        'navy': '#2E4A9E',
        'gold': '#8DC63F',
        'green-growth': '#8DC63F',
        'light-bg': '#F6F5F1',
        'dark-text': '#20242B',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1.5rem',
        '2xl': '1.75rem',
        full: '9999px',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'page-exit': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'page-enter': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'accordion-up': 'accordion-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up': 'fade-in-up 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'page-exit': 'page-exit 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'page-enter': 'page-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
