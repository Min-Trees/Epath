'use client'

/**
 * HeroSection – rebuild that reads all content from the CMS heroContent
 * collection (per pageId). Falls back to the i18n strings when no CMS
 * record is configured yet.
 *
 * The hero can be configured in admin → /admin/hero-content with:
 *  - welcome, title, subtitle, description
 *  - primary CTA label/url, secondary CTA label/url
 *  - videoUrl (mp4), videoThumbnail (image fallback), backgroundImage
 *
 * Uses CMS context to prevent duplicate rendering.
 */

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, ChevronDown, ImageIcon } from 'lucide-react'
import { useParams } from 'next/navigation'
import type { Locale } from '@/lib/cms-types'
import { useCmsContext } from '@/lib/cms-context'

const TIMING = {
  titleStart: 0.2,
  titleWordStep: 0.08,
  subtitleStart: 0.9,
  descriptionStart: 1.15,
  ctaStart: 1.4,
  scrollStart: 1.7,
}

function pickLocalized(
  v: unknown,
  locale: Locale
): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  if (typeof v === 'object' && v !== null) {
    const obj = v as Record<string, unknown>
    return (obj[locale] as string) || (obj.vi as string) || (obj.en as string) || ''
  }
  return ''
}

/**
 * Convert common video URLs (YouTube watch / youtu.be / Vimeo) into
 * their iframe-friendly embed form. Direct mp4/webm URLs are returned
 * unchanged so the <video> tag can play them.
 *
 * Returns null when the URL doesn't look like a recognised video host so
 * the caller can fall back to the gradient/image background.
 */
function toEmbedUrl(raw: string): { kind: 'file' | 'iframe'; url: string } | null {
  if (!raw) return null
  try {
    const u = new URL(raw)
    const host = u.hostname.toLowerCase()
    const isDirectFile = /\.(mp4|webm|ogv|mov|m4v)(\?.*)?$/i.test(u.pathname)
    if (isDirectFile) return { kind: 'file', url: raw }

    // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    if (host === 'youtu.be') {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      if (id) return { kind: 'iframe', url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1` }
    }
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname.startsWith('/embed/')) {
        return { kind: 'iframe', url: `${raw}${raw.includes('?') ? '&' : '?'}autoplay=1&mute=1` }
      }
      const id = u.searchParams.get('v')
      if (id) return { kind: 'iframe', url: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1` }
    }
    if (host.endsWith('vimeo.com')) {
      const id = u.pathname.replace(/^\//, '').split('/')[0]
      if (id && /^\d+$/.test(id)) {
        return { kind: 'iframe', url: `https://player.vimeo.com/video/${id}?autoplay=1&muted=1&background=1&loop=1` }
      }
    }
    // Already an embed URL on an unknown host - try to use it as iframe.
    if (u.pathname.startsWith('/embed/')) return { kind: 'iframe', url: raw }
    return null
  } catch {
    return null
  }
}

export function HeroSection({ pageId = 'home' as 'home' | 'about' | 'programs' | 'partners' | 'admissions' | 'events' }) {
  const t = useTranslations('hero')
  const { data: cms } = useCmsContext()
  const params = useParams()
  const locale = ((params.locale as string) || 'vi') as Locale
  const sectionRef = useRef<HTMLElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)

  // Pull the matching hero content for the page from the CMS bundle.
  // The bundle is now keyed by pageId, so each page can have its own
  // hero config (home / about / programs / partners / admissions / events).
  const heroByPage = cms.heroContent || {}
  const hero =
    (heroByPage as Record<string, Record<string, unknown> | null>)[pageId] ||
    (heroByPage as Record<string, Record<string, unknown> | null>).home ||
    null

  // i18n fallbacks when CMS is empty
  const welcomeText = hero ? pickLocalized(hero.welcome, locale) || t('welcome') : t('welcome')
  const titleText = hero ? pickLocalized(hero.title, locale) || t('title') : t('title')
  const subtitleText = hero ? pickLocalized(hero.subtitle, locale) || t('subtitle') : t('subtitle')
  const descriptionText = hero ? pickLocalized(hero.description, locale) || t('description') : t('description')
  const ctaLabel = hero ? pickLocalized(hero.ctaLabel, locale) || t('cta') : t('cta')
  const ctaUrl = (hero?.ctaUrl as string) || '#programs'
  const secondaryCtaLabel = hero ? pickLocalized(hero.secondaryCtaLabel, locale) : ''
  const secondaryCtaUrl = (hero?.secondaryCtaUrl as string) || '#contact'
  const videoUrl = (hero?.videoUrl as string) || ''
  const backgroundImage = (hero?.backgroundImage as string) || ''
  const videoThumbnail = (hero?.videoThumbnail as string) || ''

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const id = requestAnimationFrame(() => el.classList.add('is-visible'))
    return () => cancelAnimationFrame(id)
  }, [])

  const welcomeWords = welcomeText.split(' ')
  const titleWords = titleText.split(' ')

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden hero-section"
    >
      {/* Background: video → image → CSS gradient fallback (all CMS-driven) */}
      <div className="absolute inset-0">
        {(() => {
          const video = videoUrl ? toEmbedUrl(videoUrl) : null
          if (video && !videoFailed) {
            if (video.kind === 'iframe') {
              return (
                <iframe
                  src={video.url}
                  title="Hero background video"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ border: 0 }}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                />
              )
            }
            return (
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster={videoThumbnail || backgroundImage || undefined}
                className="w-full h-full object-cover"
                onError={() => setVideoFailed(true)}
              >
                <source src={video.url} type="video/mp4" />
              </video>
            )
          }
          if (backgroundImage) {
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={backgroundImage}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                }}
              />
            )
          }
          return <div className="w-full h-full bg-gradient-to-br from-[#3A53A3] via-[#3A53A3] to-[#2E4389]" />
        })()}

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center max-w-4xl">
          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {welcomeWords.map((word, i) => (
              <span
                key={`w-${i}`}
                className="inline-block mr-[0.25em] hero-word"
                style={
                  {
                    ['--word-delay' as string]: `${TIMING.titleStart + i * TIMING.titleWordStep}s`,
                  } as React.CSSProperties
                }
              >
                {word}
              </span>
            ))}
          </h1>

          <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-[#8BC53F] mb-8">
            {titleWords.map((word, i) => (
              <span
                key={`t-${i}`}
                className="inline-block mr-[0.25em] hero-word hero-word--green"
                style={
                  {
                    ['--word-delay' as string]: `${TIMING.titleStart + (welcomeWords.length + i) * TIMING.titleWordStep}s`,
                  } as React.CSSProperties
                }
              >
                {word}
              </span>
            ))}
          </h1>

          {subtitleText && (
            <p
              className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-4"
              style={{ ['--enter-delay' as string]: `${TIMING.subtitleStart}s` } as React.CSSProperties}
            >
              {subtitleText}
            </p>
          )}

          {descriptionText && (
            <p
              className="hero-subtitle text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
              style={{ ['--enter-delay' as string]: `${TIMING.descriptionStart}s` } as React.CSSProperties}
            >
              {descriptionText}
            </p>
          )}

          <div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ ['--enter-delay' as string]: `${TIMING.ctaStart}s` } as React.CSSProperties}
          >
            {ctaLabel && (
              <a
                href={ctaUrl.startsWith('#') ? `/${locale}${ctaUrl === '#programs' ? '/programs' : ctaUrl === '#contact' ? '/contact' : ctaUrl}` : ctaUrl}
                className="hero-cta relative inline-flex items-center gap-3 bg-[#F05A28] hover:bg-[#E04D1A] text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl"
              >
                <span aria-hidden className="hero-pulse hero-pulse--solid" />
                <span aria-hidden className="hero-pulse hero-pulse--ring" />
                <span className="relative z-10 inline-flex items-center gap-3">
                  {ctaLabel}
                  <span className="hero-arrow inline-flex">
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </span>
              </a>
            )}
            {secondaryCtaLabel && (
              <a
                href={
                  secondaryCtaUrl.startsWith('#')
                    ? `/${locale}${secondaryCtaUrl === '#contact' ? '/contact' : secondaryCtaUrl === '#programs' ? '/programs' : secondaryCtaUrl}`
                    : secondaryCtaUrl
                }
                className="inline-flex items-center gap-2 border-2 border-white/70 hover:border-white text-white px-8 py-3 rounded-full text-base font-medium hover:bg-white/10 transition"
              >
                {secondaryCtaLabel}
              </a>
            )}
          </div>

          {!videoUrl && !backgroundImage && !videoFailed && (
            <div className="mt-8 flex items-center justify-center gap-2 text-white/60 text-xs">
              <ImageIcon className="w-4 h-4" />
              <span>Thêm ảnh/video nền trong Admin → /admin/hero-content</span>
            </div>
          )}
        </div>
      </div>

      <div
        className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ ['--enter-delay' as string]: `${TIMING.scrollStart}s` } as React.CSSProperties}
      >
        <span className="text-white/50 text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="hero-bounce w-6 h-6 text-white/60" />
      </div>
    </section>
  )
}
