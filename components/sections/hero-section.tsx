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

import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowDown } from 'lucide-react'
import type { Locale } from '@/lib/cms-types'
import { useCmsContext } from '@/lib/cms-context'

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
  const params = useParams()
  const locale = ((params.locale as string) || 'vi') as Locale
  const sectionRef = useRef<HTMLElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)

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
    (locale === 'en' ? '' : '')

  const rawTitle = (hero && pickLocalized(hero.title, locale)) || t('title') || ''
  const titleText =
    rawTitle && rawTitle !== 'EPath Education'
      ? rawTitle
      : 'LearnLocal\nReachGlobal'

  const titleLines = titleText.includes('\n')
    ? titleText.split(/[\r\n]+/)
    : [titleText]

  const ctaLabel =
    (hero && pickLocalized(hero.ctaLabel, locale)) ||
    t('cta') ||
    (locale === 'en' ? 'Learn More' : 'Tìm hiểu thêm')

  const ctaUrl = (hero?.ctaUrl as string) || '#programs'

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

  // Smooth-scroll to the section directly below the hero.
  // Resolves at click-time so the target exists in the DOM even when
  // CMS content swaps in async sections after first paint.
  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window === 'undefined') return
    const heroEl = sectionRef.current
    if (!heroEl) return
    const next = heroEl.nextElementSibling as HTMLElement | null
    if (next) {
      const headerOffset = 72
      const top = next.getBoundingClientRect().top + window.scrollY - headerOffset
      window.scrollTo({ top, behavior: 'smooth' })
    } else {
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })
    }
  }

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
        className="hero-section relative min-h-screen flex flex-col overflow-hidden is-visible"
        style={{ backgroundColor: '#e8e8e8' }}
        aria-label="Hero"
      >
        {/* ── Layer 1A: Solid gray background (bottom-most) ─────────── */}
        <div
          className="absolute inset-0 z-0 bg-[#e8e8e8]"
          aria-hidden="true"
        />

        {/* ── Layer 1B: Hero media (image / video) on top of gray ─── */}
        <div className="absolute inset-0 z-[1]">
          {videoUrl && !videoFailed ? (
            <>
              {toEmbedUrl(videoUrl).kind === 'iframe' ? (
                <iframe
                  className="absolute inset-0 w-full h-full object-cover"
                  src={toEmbedUrl(videoUrl).url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Hero background video"
                  onError={() => setVideoFailed(true)}
                />
              ) : (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={videoThumbnail}
                  onError={() => setVideoFailed(true)}
                />
              )}
            </>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={activeBackground}
              alt=""
              className="w-full h-full object-cover hero-media-fade is-loaded"
            />
          )}
        </div>

        {/* ── Layer 2: Spacer that clears the fixed header ─────────── */}
        <div className="flex-shrink-0" style={{ height: '0px' }} />

        {/* ── Layer 3: Main content ─────────────────────────────────── */}
        <div className="relative z-30 flex-1 flex items-center pt-20 sm:pt-24 pb-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="max-w-3xl">
              {/* Title */}
              {titleLines.length === 1 ? (
                <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] font-black leading-[1.08] tracking-[-0.03em] mb-4 sm:mb-6 text-[#1e3570]">
                  {titleWords.map((word, i) => (
                    <span
                      key={`t-${i}`}
                      className="inline-block mr-[0.22em] hero-word text-[#1e3570]"
                      style={{ animation: `heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: `${0.15 + i * 0.05}s` } as React.CSSProperties}
                    >
                      {word}
                    </span>
                  ))}
                </h1>
              ) : (
                <h1 className="hero-title font-black tracking-[-0.03em] mb-4 sm:mb-6 text-[#1e3570]">
                  {titleLines.map((line, lineIdx) => {
                    const words = line.trim().split(' ')
                    return (
                      <span key={`tl-${lineIdx}`} className="block">
                        {words.map((word, i) => (
                          <span
                            key={`t-${lineIdx}-${i}`}
                            className="inline-block mr-[0.22em] hero-word text-[#1e3570]"
                            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', animation: `heroFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: `${0.15 + lineIdx * 0.1 + i * 0.05}s` } as React.CSSProperties}
                          >
                            {word}
                          </span>
                        ))}
                      </span>
                    )
                  })}
                </h1>
              )}

              {/* Round CTA Learn More button directly below title */}
              <div
                className="pt-2 sm:pt-4 relative z-30"
                style={{ animation: `heroFadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards`, animationDelay: '0.35s' } as React.CSSProperties}
              >
                <a
                  href={resolveUrl(ctaUrl)}
                  role="button"
                  aria-label={ctaLabel || 'Learn More'}
                  onClick={handleScrollDown}
                  className="hero-circle-cta group/circle relative inline-flex items-center justify-center w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] cursor-pointer"
                >
                  {/* Orbiting text ring */}
                  <span
                    aria-hidden="true"
                    className="hero-circle-cta__text absolute inset-0 select-none pointer-events-none"
                  >
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full block overflow-visible"
                    >
                      <defs>
                        <path
                          id="learnMoreTextCircle"
                          d="M 100, 100 m -66, 0 a 66,66 0 1,1 132,0 a 66,66 0 1,1 -132,0"
                          fill="none"
                        />
                      </defs>
                      <text
                        className="fill-[#3a54a4] select-none uppercase tracking-[0.16em]"
                        style={{
                          fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif",
                          fontSize: '13px',
                          fontWeight: 800,
                        }}
                      >
                        <textPath href="#learnMoreTextCircle" startOffset="0%" textLength="415" lengthAdjust="spacing">
                          LEARN MORE • LEARN MORE • 
                        </textPath>
                      </text>
                    </svg>
                  </span>

                  {/* Inner green circular button with glow + ArrowDown */}
                  <span
                    aria-hidden="true"
                    className="hero-circle-cta__btn relative z-10 inline-flex items-center justify-center w-[68px] h-[68px] sm:w-[78px] sm:h-[78px] rounded-full bg-[#8bc53f] hover:bg-[#7ab332] text-white shadow-[0_8px_24px_rgba(139,197,63,0.45)] hover:shadow-[0_12px_32px_rgba(139,197,63,0.6)] transition-all duration-500 ease-out group-hover/circle:scale-105"
                  >
                    <ArrowDown className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 ease-out group-hover/circle:translate-y-1" />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ── Layer 4: Tags Marquee Strip – floating over the hero ─────
            Anchored to the bottom edge of the hero so it sits ON TOP of
            the hero media rather than splitting it into a separate
            block. No top border, no side tinting, fully transparent
            background – the pills alone carry the readability over any
            hero media. */}
        <div
          className="hero-marquee absolute inset-x-0 bottom-0 z-20 overflow-hidden select-none py-2 sm:py-2.5"
          aria-hidden="true"
        >
          {/* Marquee Track – 3× duplicated for seamless loop */}
          <div className="hero-marquee__track">
            {/* Repeat items 3 times for seamless infinite loop */}
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, idx) => (
              <div
                key={idx}
                className="inline-flex items-center mx-1.5 sm:mx-2 flex-shrink-0"
              >
                <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-md bg-white/85 hover:bg-white text-[#1e3570] font-semibold text-[11px] sm:text-xs tracking-wide shadow-[0_2px_8px_rgba(30,53,112,0.14)] hover:shadow-[0_3px_12px_rgba(30,53,112,0.22)] transition-all duration-300 cursor-default">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F] shadow-[0_0_6px_rgba(141,198,63,0.8)] shrink-0" />
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
