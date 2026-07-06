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
        // EPath Brand Colors - Xanh dương chính (học thuật, tin cậy)
        'epath-blue': '#3A53A3',
        'epath-blue-light': '#4B63B3',
        'epath-blue-dark': '#2E4389',
        // Xanh lá (phát triển, năng lượng)
        'epath-green': '#8BC53F',
        'epath-green-light': '#B7D333',
        'epath-green-dark': '#9BB52A',
        // Cam (sáng tạo, CTA)
        'epath-orange': '#F05A28',
        'epath-orange-light': '#F26A42',
        // Đen xám (chữ, nội dung)
        'epath-dark': '#231F20',
        'epath-gray': '#4A4A4A',
        'epath-gray-light': '#6B6B6B',
        // Nền
        'epath-bg': '#FFFFFF',
        'epath-bg-alt': '#F8F9FA',
        // Legacy colors for backwards compatibility
        'navy': '#3A53A3',
        'gold': '#B7D333',
        'green-growth': '#8BC53F',
        'light-bg': '#F8F9FA',
        'dark-text': '#231F20',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out forwards',
        'page-exit': 'page-exit 0.15s ease-out forwards',
        'page-enter': 'page-enter 0.2s ease-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
