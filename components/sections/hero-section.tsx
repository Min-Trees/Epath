'use client'

/**
 * HeroSection – Rebuilt according to iSchool Online Courses standard:
 * https://ischool.themerex.net/online-courses/
 *
 * Design features:
 *  - Authentic iSchool student photography / video background with official navy (#1E3570)
 *    and diagonal geometric shapes (rhombus / chevron bands).
 *  - High-impact display typography (6vw+ on desktop, tight line-height, brand green accent).
 *  - Signature bottom-right spinning text badge (anim-icon-text.svg) with centered
 *    navy (#2E4A9E) circular down-scroll button.
 *  - Smooth tags ticker / marquee strip below the hero with pill chips (.tag style)
 *    highlighting key program benefits.
 *  - Robust fallbacks so content is NEVER missing regardless of CMS data status.
 *  - 100% visible on first paint with smooth non-blocking entrance animations.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight, ArrowDown } from 'lucide-react'
import type { Locale } from '@/lib/cms-types'
import { useCmsContext } from '@/lib/cms-context'

const TIMING = {
  welcomeStart: 0.05,
  titleStart: 0.15,
  titleWordStep: 0.05,
  subtitleStart: 0.35,
  descriptionStart: 0.5,
  ctaStart: 0.65,
  badgeStart: 0.75,
}

function pickLocalized(v: unknown, locale: Locale): string {
  if (!v) return ''
  if (typeof v === 'string') return v.trim()
  if (typeof v === 'object' && v !== null) {
    const obj = v as Record<string, unknown>
    const val = (obj[locale] as string) || (obj.vi as string) || (obj.en as string) || ''
    return typeof val === 'string' ? val.trim() : ''
  }
  return ''
}

function toEmbedUrl(raw: string): { kind: 'iframe' | 'video'; url: string } {
  if (!raw) return { kind: 'video', url: '' }
  const yt = raw.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (yt) {
    return {
      kind: 'iframe',
      url: `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&loop=1&playlist=${yt[1]}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1`,
    }
  }
  return { kind: 'video', url: raw }
}

const MARQUEE_ITEMS_VI = [
  'Chương trình Song bằng Chuẩn Mỹ',
  'Chứng nhận Kiểm định Cognia & WASC',
  'Mô hình Blended Learning (Online & Onsite)',
  'Học phần STEM & Khoa học Ứng dụng',
  'Hồ sơ Năng lực Cá nhân (Student Portfolio)',
  'Đội ngũ Giáo viên Quốc tế Giàu Kinh nghiệm',
  'Lộ trình Học tập Toàn diện K-12',
  'Cố vấn Học thuật & Hướng nghiệp Toàn cầu',
]

const MARQUEE_ITEMS_EN = [
  'US Standard Dual Diploma Program',
  'Cognia & WASC Accredited Curriculum',
  'Blended Learning (Online & Onsite)',
  'STEM & Applied Sciences Modules',
  'Personalized Student Portfolio',
  'Experienced International Faculty',
  'Comprehensive K-12 Pathway',
  'Global Academic & Career Advising',
]

export function HeroSection({
  pageId = 'home',
  initialHero = null,
}: {
  pageId?: 'home' | 'about' | 'programs' | 'partners' | 'admissions' | 'events'
  initialHero?: Record<string, unknown> | null
}) {
  const t = useTranslations('hero')
  const { data: cms } = useCmsContext()
  const locale = useLocale() as Locale
  const sectionRef = useRef<HTMLElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)
  const [isMarqueeHovered, setIsMarqueeHovered] = useState(false)
  const [marqueeOffset, setMarqueeOffset] = useState(0)

  const heroByPage = cms.heroContent || {}
  const contextHero =
    (heroByPage as Record<string, Record<string, unknown> | null>)[pageId] ||
    (heroByPage as Record<string, Record<string, unknown> | null>).home ||
    null
  const hero = contextHero ?? initialHero

  // Content – CMS driven with robust bilingual fallbacks so content is NEVER lost
  const welcomeText =
    (hero && pickLocalized(hero.welcome, locale)) ||
    t('welcome') ||
    (locale === 'en' ? 'Welcome to' : 'Chào mừng đến với')

  const titleText =
    (hero && pickLocalized(hero.title, locale)) ||
    t('title') ||
    'EPath Education'

  const subtitleText =
    (hero && pickLocalized(hero.subtitle, locale)) ||
    t('subtitle') ||
    (locale === 'en'
      ? 'Bringing high-quality international education closer to Vietnamese families'
      : 'Đưa giáo dục quốc tế chất lượng cao đến gần hơn với gia đình Việt')

  const descriptionText =
    (hero && pickLocalized(hero.description, locale)) ||
    t('description') ||
    (locale === 'en'
      ? 'Personalised learning aligned with US Common Core standards via the Edmentum International ecosystem — accredited by Cognia & WASC. Students can also access Cambridge ESOL, FabLab EIU and the Dual Diploma pathway from Kindergarten through Grade 12.'
      : 'Chương trình học cá nhân hóa theo chuẩn Common Core (Mỹ) thông qua hệ sinh thái Edmentum International — được kiểm định bởi Cognia & WASC. Tiếp cận Cambridge ESOL, FabLab EIU và lộ trình Dual Diploma toàn diện từ Mầm non đến THPT.')

  const ctaLabel =
    (hero && pickLocalized(hero.ctaLabel, locale)) ||
    t('cta') ||
    (locale === 'en' ? 'Learn More' : 'Tìm hiểu thêm')

  const ctaUrl = (hero?.ctaUrl as string) || '#programs'

  const secondaryCtaLabel =
    (hero && pickLocalized(hero.secondaryCtaLabel, locale)) ||
    (locale === 'en' ? 'Free Consultation' : 'Liên hệ tư vấn')

  const secondaryCtaUrl = (hero?.secondaryCtaUrl as string) || '#contact'

  // Background media
  const videoUrl = (hero?.videoUrl as string) || ''
  const videoThumbnail = (hero?.videoThumbnail as string) || ''
  const backgroundImage = (hero?.backgroundImage as string) || ''
  const activeBackground = backgroundImage || '/images/hero/hero-bg.jpg'

  // Marquee items according to current locale
  const marqueeItems = locale === 'en' ? MARQUEE_ITEMS_EN : MARQUEE_ITEMS_VI

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    el.classList.add('is-visible')
  }, [])

  // Smooth continuous Marquee animation
  useEffect(() => {
    let raf: number
    let last = 0
    const speed = isMarqueeHovered ? 0.08 : 0.45 // slows down on hover

    const tick = (ts: number) => {
      if (last === 0) last = ts
      const delta = ts - last
      last = ts
      setMarqueeOffset((prev) => {
        const total = marqueeItems.length * 280
        return (prev + (speed * delta) / 16) % total
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [isMarqueeHovered, marqueeItems.length])

  // Resolve CTA URL helper
  const resolveUrl = (url: string) => {
    if (url.startsWith('#')) {
      const map: Record<string, string> = {
        '#programs': '/programs',
        '#contact': '/contact',
        '#about': '/about',
        '#admissions': '/admissions',
      }
      return `/${locale}${map[url] || url.slice(1)}`
    }
    return url
  }

  // Handle smooth scroll down when clicking the iSchool circle badge
  const handleScrollDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    const heroEl = sectionRef.current
    const tickerEl = heroEl?.nextElementSibling as HTMLElement | null
    const targetSection = tickerEl?.nextElementSibling as HTMLElement | null

    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' })
    } else if (heroEl) {
      window.scrollTo({
        top: heroEl.offsetTop + heroEl.offsetHeight,
        behavior: 'smooth',
      })
    }
  }, [])

  const titleWords = titleText.split(' ')

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          HERO SECTION – iSchool Online Courses Style
          Background: Student photography / video with official Navy (#1E3570)
          Typography: Giant 6vw+ display headline with brand green accent
          Interactive: Signature spinning badge with Navy circle scroll button
      ─────────────────────────────────────────────────────────────── */}
      <section
        ref={sectionRef}
        className="hero-section is-visible relative min-h-[85vh] lg:min-h-[88vh] flex flex-col justify-between overflow-hidden bg-[#1E3570]"
      >
        {/* Background media: video -> image fallback */}
        <div className="absolute inset-0 z-0">
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
                  poster={videoThumbnail || activeBackground}
                  className="w-full h-full object-cover"
                  onError={() => setVideoFailed(true)}
                >
                  <source src={video.url} type="video/mp4" />
                </video>
              )
            }
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeBackground}
                alt=""
                className="w-full h-full object-cover hero-media-fade is-loaded"
              />
            )
          })()}

          {/* Navy brand gradient overlay for crystal-clear readability */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1E3570] via-[#1E3570]/70 to-[#1E3570]/40 lg:from-[#1E3570]/90 lg:via-[#1E3570]/50 lg:to-[#1E3570]/30"
            aria-hidden="true"
          />
        </div>

        {/* Top Spacer to account for fixed navbar */}
        <div className="w-full h-20 sm:h-24 lg:h-28" aria-hidden="true" />

        {/* Main Content Container */}
        <div className="relative z-10 w-full flex-grow flex items-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-6 w-full pb-8 sm:pb-12 lg:pb-14">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
              
              {/* Left Column: Text & CTAs (shifted left, elegant sizing) */}
              <div className="lg:col-span-8 xl:col-span-8 text-left">
                
                {/* Welcome Eyebrow Pill */}
                {welcomeText && (
                  <div
                    className="hero-title inline-block mb-3 sm:mb-4"
                    style={{ ['--enter-delay' as string]: `${TIMING.welcomeStart}s` } as React.CSSProperties}
                  >
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-[#8DC63F] animate-pulse" />
                      {welcomeText}
                    </span>
                  </div>
                )}

                {/* Title – Refined size, clean & comfortable brilliant white */}
                <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-black leading-[1.08] tracking-[-0.03em] mb-3 sm:mb-4 text-white">
                  {titleWords.map((word, i) => (
                    <span
                      key={`t-${i}`}
                      className="inline-block mr-[0.22em] hero-word text-white"
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

                {/* Subtitle */}
                {subtitleText && (
                  <p
                    className="hero-subtitle text-base sm:text-lg md:text-xl text-white/95 font-semibold leading-relaxed mb-3 sm:mb-4 max-w-2xl"
                    style={{ ['--enter-delay' as string]: `${TIMING.subtitleStart}s` } as React.CSSProperties}
                  >
                    {subtitleText}
                  </p>
                )}

                {/* Description */}
                {descriptionText && (
                  <p
                    className="hero-subtitle text-sm sm:text-base md:text-lg text-white/85 leading-relaxed mb-6 sm:mb-8 max-w-2xl"
                    style={{ ['--enter-delay' as string]: `${TIMING.descriptionStart}s` } as React.CSSProperties}
                  >
                    {descriptionText}
                  </p>
                )}

                {/* Call To Action Buttons */}
                <div
                  className="flex flex-wrap items-center gap-3 sm:gap-4"
                  style={{ ['--enter-delay' as string]: `${TIMING.ctaStart}s` } as React.CSSProperties}
                >
                  {ctaLabel && (
                    <a
                      href={resolveUrl(ctaUrl)}
                      className="hero-cta group/cta pulse-ripple-btn relative inline-flex items-center gap-3 bg-[#5C9024] hover:bg-[#4D7C1E] text-white px-8 py-3.5 sm:px-10 sm:py-4 rounded-full text-base sm:text-lg font-bold shadow-[0_4px_16px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:scale-105 transition-all duration-400 ease-out"
                    >
                      <span className="pulse-ripple-ring ring-1" aria-hidden="true" />
                      <span className="pulse-ripple-ring ring-2" aria-hidden="true" />
                      <span className="relative z-10 inline-flex items-center gap-2.5">
                        {ctaLabel}
                        <ArrowRight className="hero-cta__arrow w-5 h-5 transition-transform duration-400 ease-out group-hover/cta:translate-x-1" />
                      </span>
                    </a>
                  )}

                  {secondaryCtaLabel && (
                    <a
                      href={resolveUrl(secondaryCtaUrl)}
                      className="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white text-white hover:bg-white/10 px-8 py-3.5 sm:px-9 sm:py-4 rounded-full text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-400 ease-out hover:scale-105"
                    >
                      {secondaryCtaLabel}
                    </a>
                  )}
                </div>
              </div>

              {/* Right Column: Signature iSchool Spinning Scroll Badge */}
              <div className="lg:col-span-4 xl:col-span-4 flex justify-start lg:justify-end items-end pt-4 lg:pt-0">
                <div
                  className="relative flex items-center justify-center"
                  style={{ ['--enter-delay' as string]: `${TIMING.badgeStart}s` } as React.CSSProperties}
                >
                  {/* Rotating Circular Text SVG Ring */}
                  <div className="relative w-[110px] h-[110px] sm:w-[124px] sm:h-[124px] flex items-center justify-center select-none pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/hero/anim-icon-text.svg"
                      alt=""
                      className="w-full h-full ischool-rotate-infinite"
                      aria-hidden="true"
                    />
                  </div>

                  {/* Centered Circle Button with Down Arrow */}
                  <a
                    href="#anchor"
                    onClick={handleScrollDown}
                    className="absolute w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2E4A9E] hover:bg-[#1E3570] text-white flex items-center justify-center border-2 border-white/30 shadow-[0_8px_24px_rgba(46,74,158,0.5)] hover:shadow-[0_12px_32px_rgba(46,74,158,0.7)] hover:scale-110 active:scale-95 transition-all duration-300 z-10 group"
                    aria-label="Scroll to next content section"
                  >
                    <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-transform duration-300 group-hover:translate-y-1" />
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          TAGS TICKER / MARQUEE STRIP
          iSchool signature horizontal marquee with keyword tag pills (.tag)
          Smooth continuous scroll with left/right fade edges
      ─────────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-[#1E3570] border-t border-b border-white/15 py-3 sm:py-4 select-none"
        onMouseEnter={() => setIsMarqueeHovered(true)}
        onMouseLeave={() => setIsMarqueeHovered(false)}
        aria-hidden="true"
      >
        {/* Edge Fade Gradients */}
        <div
          className="absolute inset-y-0 left-0 z-10 pointer-events-none w-16 sm:w-24 bg-gradient-to-r from-[#1E3570] to-transparent"
        />
        <div
          className="absolute inset-y-0 right-0 z-10 pointer-events-none w-16 sm:w-24 bg-gradient-to-l from-[#1E3570] to-transparent"
        />

        {/* Marquee Track */}
        <div
          className="flex whitespace-nowrap will-change-transform"
          style={{
            transform: `translateX(-${marqueeOffset}px)`,
            transition: 'none',
          }}
        >
          {/* Repeat items 3 times for seamless infinite loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div
              key={idx}
              className="inline-flex items-center mx-2 sm:mx-3 flex-shrink-0"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium text-xs sm:text-sm tracking-wide shadow-sm backdrop-blur-sm transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-[#8DC63F] shadow-[0_0_8px_rgba(141,198,63,0.8)]" />
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
