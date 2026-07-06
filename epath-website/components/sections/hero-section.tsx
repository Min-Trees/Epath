'use client'

/**
 * HeroSection – performance-tuned rebuild.
 *
 * Was: 12+ framer-motion instances (one per word, per subtitle, per
 * pulse ring...) all ticking from JS.
 *
 * Now:
 *   - All entrance + loop animations are CSS keyframes.
 *   - Video background stays the same (single DOM <video>).
 *   - Title words are styled spans; CSS handles word-by-word reveal.
 *   - Pulse rings are CSS keyframes that auto-pause if reduced-motion
 *     is requested.
 */

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useParams } from 'next/navigation'

const TIMING = {
  titleStart: 0.2,        // seconds, before first word
  titleWordStep: 0.08,    // delay between words
  subtitleStart: 0.9,
  descriptionStart: 1.15,
  ctaStart: 1.4,
  scrollStart: 1.7,
}

export function HeroSection() {
  const t = useTranslations('hero')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const sectionRef = useRef<HTMLElement>(null)

  // Hero is the first thing on the page; we don't need an IntersectionObserver.
  // Just flip the CSS class on mount so the CSS keyframes fire exactly once.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    // Defer one frame so the initial paint is the "hidden" state, then trigger.
    const id = requestAnimationFrame(() => el.classList.add('is-visible'))
    return () => cancelAnimationFrame(id)
  }, [])

  const welcomeText = t('welcome')
  const titleText = t('title')
  const subtitleText = t('subtitle')
  const descriptionText = t('description')

  // Total delay between first word of h1 and last word of h2 = both
  // word groups share the same staggered start.
  const welcomeWords = welcomeText.split(' ')
  const titleWords = titleText.split(' ')

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden hero-section">
      {/* Video background */}
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source
            src="https://www.littlepeople.edu.vn/wp-content/uploads/2024/08/Slider-169-rev.mp4"
            type="video/mp4"
          />
        </video>

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

          <p
            className="hero-subtitle text-lg md:text-xl lg:text-2xl text-white/90 font-medium leading-relaxed mb-4"
            style={{ ['--enter-delay' as string]: `${TIMING.subtitleStart}s` } as React.CSSProperties}
          >
            {subtitleText}
          </p>

          <p
            className="hero-subtitle text-base md:text-lg text-white/80 leading-relaxed max-w-2xl mx-auto"
            style={{ ['--enter-delay' as string]: `${TIMING.descriptionStart}s` } as React.CSSProperties}
          >
            {descriptionText}
          </p>

          <a
            href={`/${locale}/about`}
            className="hero-cta relative inline-flex items-center gap-3 bg-[#F05A28] hover:bg-[#E04D1A] text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl mt-10"
            style={{ ['--enter-delay' as string]: `${TIMING.ctaStart}s` } as React.CSSProperties}
          >
            {/* Pulse rings – CSS only, paused via reduced-motion. */}
            <span aria-hidden className="hero-pulse hero-pulse--solid" />
            <span aria-hidden className="hero-pulse hero-pulse--ring" />
            <span className="relative z-10 inline-flex items-center gap-3">
              {t('cta')}
              <span className="hero-arrow inline-flex">
                <ArrowRight className="w-5 h-5" />
              </span>
            </span>
          </a>
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
