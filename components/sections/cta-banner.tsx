'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, Sparkles } from 'lucide-react'
import { duration, easeOut } from '@/lib/motion-presets'
import { semanticColors } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Locale } from '@/lib/cms-types'

/**
 * CTABanner – performance-tuned version.
 *
 * Design: Purple gradient background with white orbs,
 * orange CTA buttons with fully rounded style.
 */
export function CTABanner() {
  const t = useTranslations('cta')
  const { data: cms } = useCmsContext()
  const locale = useLocale() as Locale
  const orbContainerRef = useRef<HTMLDivElement>(null)

  const settings = cms.siteSettings
  const title = (settings?.ctaTitle?.[locale as 'vi' | 'en']) || (settings?.ctaTitle?.vi) || t('title')
  const subtitle = (settings?.ctaSubtitle?.[locale as 'vi' | 'en']) || (settings?.ctaSubtitle?.vi) || t('subtitle')
  const primaryLabel = (settings?.ctaPrimaryLabel?.[locale as 'vi' | 'en']) || (settings?.ctaPrimaryLabel?.vi) || t('primary')
  const secondaryLabel = (settings?.ctaSecondaryLabel?.[locale as 'vi' | 'en']) || (settings?.ctaSecondaryLabel?.vi) || t('secondary')

  const resolveUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('#')) return url
    return url.startsWith(`/${locale}`) ? url : `/${locale}${url.startsWith('/') ? '' : '/'}${url}`
  }
  const primaryUrl = resolveUrl(settings?.ctaPrimaryUrl || '/admissions')
  const secondaryUrl = resolveUrl(settings?.ctaSecondaryUrl || '/contact')
  const bgImage = settings?.ctaBackgroundImage || ''

  // IntersectionObserver toggles a `data-active` attribute the CSS uses
  // to play / pause the orb animations.
  useEffect(() => {
    const el = orbContainerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          el.dataset.active = entry.isIntersecting ? 'true' : 'false'
        }
      },
      { rootMargin: '200px 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      className="cta-banner py-20 md:py-24 relative overflow-hidden"
      style={{
        background: bgImage
          ? `linear-gradient(135deg, rgba(30, 53, 112, 0.92) 0%, rgba(46, 74, 158, 0.88) 100%), url(${bgImage}) center/cover`
          : `linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)`,
      }}
    >
      {/* 3 CSS-driven orbs, paused when off-screen */}
      <div
        ref={orbContainerRef}
        data-active="true"
        aria-hidden
        className="absolute inset-0 pointer-events-none"
      >
        <span className="cta-orb cta-orb--1" />
        <span className="cta-orb cta-orb--2" />
        <span className="cta-orb cta-orb--3" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: duration.slow, ease: easeOut }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            <a href={primaryUrl} className="cta-btn-primary pulse-ripple-btn pulse-ripple-btn--orange relative">
              <span className="pulse-ripple-ring ring-1" aria-hidden="true" />
              <span className="pulse-ripple-ring ring-2" aria-hidden="true" />
              <span className="relative z-10 inline-flex items-center">
                {primaryLabel}
                <span className="ml-2 cta-arrow-anim">
                  <ArrowRight className="w-5 h-5" />
                </span>
              </span>
            </a>
            <a href={secondaryUrl} className="cta-btn-outline">
              {secondaryLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
