'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Sparkles } from 'lucide-react'
import { duration, easeOut } from '@/lib/motion-presets'
import { semanticColors } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import { useParams } from 'next/navigation'
import type { Locale } from '@/lib/cms-types'

/**
 * CTABanner – performance-tuned version.
 *
 * Old problems:
 *   - 5 `motion.div` rendered as `blur-3xl` (96px+ blur radius) each
 *     running an infinite x/y loop independently.
 *     -> 5 separate compositor layers, 5 GPU paint passes per frame.
 *
 * Optimisations applied:
 *   - Down to 3 orbs (still visually rich, half the GPU work).
 *   - Blur radius dropped from `blur-3xl` (64px) to `blur-2xl` (40px).
 *   - Animations PAUSE when the section is off-screen via
 *     `animation-play-state: paused` toggled by IntersectionObserver,
 *     so a user scrolling past at the bottom of the page drops these
 *     layers to zero GPU cost.
 *   - Orbs use the CSS `cta-orb` class (see globals.css) so animations
 *     run on the compositor thread at native 60 fps, no JS overhead.
 *   - `prefers-reduced-motion` users get static gradients instead.
 */
export function CTABanner() {
  const t = useTranslations('cta')
  const { data: cms } = useCmsContext()
  const params = useParams()
  const locale = ((params.locale as string) || 'vi') as Locale
  const orbContainerRef = useRef<HTMLDivElement>(null)

  const settings = cms.siteSettings
  const title = (settings?.ctaTitle?.[locale as 'vi' | 'en']) || (settings?.ctaTitle?.vi) || t('title')
  const subtitle = (settings?.ctaSubtitle?.[locale as 'vi' | 'en']) || (settings?.ctaSubtitle?.vi) || t('subtitle')
  const primaryLabel = (settings?.ctaPrimaryLabel?.[locale as 'vi' | 'en']) || (settings?.ctaPrimaryLabel?.vi) || t('primary')
  const primaryUrl = settings?.ctaPrimaryUrl || '/admissions'
  const secondaryLabel = (settings?.ctaSecondaryLabel?.[locale as 'vi' | 'en']) || (settings?.ctaSecondaryLabel?.vi) || t('secondary')
  const secondaryUrl = settings?.ctaSecondaryUrl || '/contact'
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
      className="cta-banner py-16 relative overflow-hidden"
      style={{
        background: bgImage
          ? `linear-gradient(135deg, rgba(58,83,163,0.85) 0%, rgba(46,67,137,0.85) 100%), url(${bgImage}) center/cover`
          : `linear-gradient(135deg, ${semanticColors.primary} 0%, ${semanticColors.primaryDark} 100%)`,
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
            <a href={primaryUrl} className="cta-btn-primary">
              {primaryLabel}
              <span className="ml-2 cta-arrow-anim">
                <ArrowRight className="w-5 h-5" />
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
