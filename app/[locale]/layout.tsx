import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ChatbotMount } from '@/components/chatbot-mount'
import { CmsLayoutWrapper } from '@/components/cms-layout-wrapper'

interface LocaleLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale?: string }> | { locale?: string }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale?: string }> | { locale?: string }
}): Promise<Metadata> {
  const resolved = await params
  const rawLocale = resolved?.locale
  const locale = rawLocale && ['vi', 'en'].includes(rawLocale) ? rawLocale : 'vi'
  const isVi = locale === 'vi'

  return {
    title: {
      default: isVi
        ? 'EPath Education - Lộ trình học thuật quốc tế'
        : 'EPath Education - International Academic Pathways',
      template: '%s | EPath Education',
    },
    description: isVi
      ? 'EPath Education cung cấp lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông. Blended Learning - Edmentum International (Cognia & WASC) - Cá nhân hóa lộ trình.'
      : 'EPath Education provides comprehensive international academic pathways from Elementary to High School. Blended Learning - Edmentum International (Cognia & WASC) - Personalized learning.',
    openGraph: {
      title: isVi
        ? 'EPath Education - Lộ trình học thuật quốc tế'
        : 'EPath Education - International Academic Pathways',
      description: isVi
        ? 'Lộ trình học thuật quốc tế xuyên suốt từ Tiểu học đến Trung học Phổ thông. Blended Learning với Edmentum International.'
        : 'Comprehensive international academic pathways from Elementary to High School. Blended Learning with Edmentum International.',
      locale: isVi ? 'vi_VN' : 'en_US',
    },
    alternates: {
      languages: {
        vi: '/vi',
        en: '/en',
      },
    },
  }
}

/**
 * LocaleLayout
 *
 * The Footer is a server component (rendered with the current locale
 * on the server) so that switching locale causes the entire page to
 * re-render atomically - the footer text never lingers on the old
 * language while the URL is already on the new one.
 *
 * The Header stays a client component because it owns the scroll
 * state and the mobile menu; but it lives OUTSIDE the
 * SmoothPageTransition wrapper so it never re-mounts on route /
 * locale changes either.
 *
 * The main element is wrapped in a <Suspense> so the Header and
 * Footer can stream in / paint immediately while the page content
 * is still being prepared.
 *
 * ChatbotMount is rendered at the layout level (not inside page.tsx)
 * so the floating chat bubble survives navigations without re-mount,
 * and so it is lazy-loaded once instead of being part of every page's
 * JS bundle. This is the main fix for the perceived "delay when
 * switching pages".
 *
 * CmsLayoutWrapper provides a Context-based CMS data layer to avoid
 * duplicate fetches across multiple components on the same page.
 */
export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolved = await params
  const rawLocale = resolved?.locale
  const locale = rawLocale && ['vi', 'en'].includes(rawLocale) ? rawLocale : 'vi'
  const messages = await getMessages({ locale })

  return (
    <NextIntlClientProvider locale={locale} messages={messages} key={locale}>
      <CmsLayoutWrapper>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} />
          <ChatbotMount />
        </div>
      </CmsLayoutWrapper>
    </NextIntlClientProvider>
  )
}
