'use client'

/**
 * CoreValuesSection – iSchool template implementation.
 * Matches: "Online Courses – iSchool.html" (Features / sc_icons section)
 *
 * Characteristics:
 * - Transparent / borderless column layout on #F6F5F1 background (no card borders/box fills)
 * - Large subtle watermark numbers (01..06) behind the icon + title header
 * - Colorful icon box + bold title
 * - Clean description text
 * - Interactive round arrow button with expanding "Tìm hiểu thêm" / "Read More" label on hover
 */

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Route, Award, Laptop, Shield, FileText, Network, type LucideIcon } from 'lucide-react'
import { duration, easeOut, inViewViewport, staggerContainer, useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Locale } from '@/lib/cms-types'

const iconMap: Record<string, LucideIcon> = {
  Route,
  Award,
  Laptop,
  Shield,
  FileText,
  Network,
}

const fallbackValues = [
  { number: '01', key: 'continuousPath', icon: Route },
  { number: '02', key: 'usStandard', icon: Award },
  { number: '03', key: 'blended', icon: Laptop },
  { number: '04', key: 'parentsRelax', icon: Shield },
  { number: '05', key: 'portfolio', icon: FileText },
  { number: '06', key: 'ecosystem', icon: Network },
]

function pick(v: { vi?: string; en?: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function CoreValuesSection() {
  const t = useTranslations('values')
  const locale = useLocale() as Locale
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })
  const { data: cms } = useCmsContext()

  // Use CMS core values if available, otherwise use fallback (capped at 6 items to match iSchool 3x2 grid)
  const cmsValues = (cms.coreValues || []).filter((v) => v.isActive !== false)
  const isUsingCMS = cmsValues.length >= 6
  const displayValues = isUsingCMS ? cmsValues.slice(0, 6) : fallbackValues

  return (
    <section
      ref={sectionRef}
      id="core-values"
      className="py-20 sm:py-24 bg-[#F6F5F1] relative overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header – Left-aligned matching iSchool */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="mb-14 sm:mb-16"
        >
          <span className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2E4A9E] mb-2 sm:mb-3">
            {locale === 'en' ? 'Features' : 'Giá trị cốt lõi'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#20242B] tracking-tight max-w-3xl leading-[1.15]">
            {t('title')}
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#5C6069] max-w-2xl">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* 3-Column Grid matching iSchool sc_icons */}
        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={inViewViewport}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-x-8 lg:gap-x-12 gap-y-12 sm:gap-y-16"
        >
          {displayValues.map((value, index) => {
            const accent = accentCycle[index % accentCycle.length]
            const isCMSItem = isUsingCMS && 'title' in value
            const cmsItem = isCMSItem ? (value as { id?: string; icon?: string; title?: { vi?: string; en?: string }; description?: { vi?: string; en?: string } }) : null
            const fallbackItem = !isCMSItem ? (value as typeof fallbackValues[0]) : null

            const IconComponent = isCMSItem && cmsItem?.icon && iconMap[cmsItem.icon]
              ? iconMap[cmsItem.icon]
              : fallbackItem?.icon || Route

            const title = isCMSItem && cmsItem?.title
              ? pick(cmsItem.title, locale)
              : fallbackItem ? t(fallbackItem.key) : ''

            const description = isCMSItem && cmsItem?.description
              ? pick(cmsItem.description, locale)
              : fallbackItem ? t(`${fallbackItem.key}Desc`) : ''

            const numStr = String(index + 1).padStart(2, '0')
            const itemKey = isCMSItem && cmsItem?.id ? cmsItem.id : `core-val-${index}`

            return (
              <motion.div
                key={itemKey}
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: duration.normal, ease: easeOut },
                  },
                }}
                className="relative group cursor-pointer h-full flex flex-col justify-between"
              >
                {/* Giant watermark number sitting behind icon + title */}
                <span
                  className="absolute -top-8 sm:-top-10 lg:-top-12 -left-1 text-[5.5rem] sm:text-[7rem] lg:text-[8rem] xl:text-[9rem] font-black leading-none tracking-tighter select-none pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    color: accent.color,
                    opacity: 0.1,
                  }}
                  aria-hidden="true"
                >
                  {numStr}
                </span>

                {/* Content top area: fills space so arrow button anchors to bottom */}
                <div className="flex-1 flex flex-col">
                  {/* Header row: Icon + Title */}
                  <div className="relative z-10 flex items-center gap-4 mb-3.5 min-h-[3.5rem]">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
                      style={{
                        backgroundColor: accent.bg,
                        color: accent.color,
                      }}
                    >
                      <IconComponent className="w-7 h-7" />
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors duration-300 tracking-tight">
                      {title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="relative z-10 text-[#5C6069] text-sm sm:text-base leading-relaxed mb-4 flex-1 min-h-[3.25rem]">
                    {description}
                  </p>
                </div>

                {/* iSchool expanding More button – anchored to bottom baseline */}
                <div className="relative z-10 mt-auto pt-2 flex items-center">
                  <Link
                    href={`/${locale}/about#values`}
                    className="inline-flex items-center text-sm font-semibold text-[#20242B]"
                  >
                    <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-500 ease-out group-hover:max-w-[140px] group-hover:opacity-100 group-hover:mr-2 text-[#2E4A9E]">
                      {locale === 'en' ? 'More' : 'Tìm hiểu thêm'}
                    </span>
                    <span
                      className="w-9 h-9 rounded-full border border-[#DEDDD6] bg-white/70 flex items-center justify-center text-[#20242B] transition-all duration-500 ease-out group-hover:bg-[#2E4A9E] group-hover:border-[#2E4A9E] group-hover:text-white group-hover:scale-105 shadow-sm shrink-0"
                    >
                      <ArrowRight className="w-4 h-4 transition-transform duration-500 ease-out group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
