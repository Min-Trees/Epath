import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SchemaMarkup } from '@/components/seo/schema-markup'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.epath.edu.vn'),
  title: {
    default: 'EPath Education - Lộ trình học thuật quốc tế',
    template: '%s | EPath Education',
  },
  description:
    'EPath Education cung cấp lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông. Blended Learning - Edmentum International (Cognia & WASC) - Cá nhân hóa lộ trình.',
  keywords: [
    'EPath Education',
    'homeschool Việt Nam',
    'giáo dục quốc tế',
    'blended learning',
    'Edmentum',
    'Cognia',
    'WASC',
    'du học Mỹ',
    'chứng chỉ SAT',
    'chứng chỉ ACT',
    'IELTS',
    'Little People',
    'Cambridge',
    'trường quốc tế Bình Dương',
    'homeschool Bình Dương',
  ],
  authors: [{ name: 'EPath Education', url: 'https://www.epath.edu.vn' }],
  creator: 'EPath Education',
  publisher: 'EPath Education',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'EPath Education - Lộ trình học thuật quốc tế',
    description:
      'Lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông. Blended Learning với Edmentum International.',
    url: 'https://www.epath.edu.vn',
    siteName: 'EPath Education',
    locale: 'vi_VN',
    type: 'website',
    images: [
      {
        url: '/epath_og.jpg',
        width: 1200,
        height: 630,
        alt: 'EPath Education - Giáo dục Quốc tế',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EPath Education - Lộ trình học thuật quốc tế',
    description: 'Lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông.',
    images: ['/epath_og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '6b77354d7548276e',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3A53A3',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Note: the [locale] layout overrides `lang` with the active locale
    // and wraps the body in the NextIntlClientProvider. We don't set
    // <html lang> here so the active locale is authoritative.
    <html suppressHydrationWarning>
      <head>
        <SchemaMarkup />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
