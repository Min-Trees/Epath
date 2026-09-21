'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { ClipboardCheck, Map, Laptop, MessageCircle, Award, ListChecks } from 'lucide-react'
import { duration, easeOut, inViewViewport, useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { AdmissionStep, Locale } from '@/lib/cms-types'

// Icon mapping for admission steps
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardCheck: ClipboardCheck,
  Map: Map,
  Laptop: Laptop,
  MessageCircle: MessageCircle,
  Award: Award,
  ListChecks: ListChecks,
}

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

// Fallback steps
const fallbackSteps = [
  { number: 1, titleKey: 'assessment', descKey: 'assessmentDesc', icon: ClipboardCheck },
  { number: 2, titleKey: 'pathway', descKey: 'pathwayDesc', icon: Map },
  { number: 3, titleKey: 'blended', descKey: 'blendedDesc', icon: Laptop },
  { number: 4, titleKey: 'advising', descKey: 'advisingDesc', icon: MessageCircle },
  { number: 5, titleKey: 'achievement', descKey: 'achievementDesc', icon: Award },
]

export function StepModelSection() {
  const t = useTranslations('steps')
  const locale = useLocale() as Locale
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.15 })
  const { data: cms } = useCmsContext()
  const rawSteps = (cms.admissionSteps || [])
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  // Deduplicate steps by stepNumber or title
  const uniqueSteps = rawSteps.reduce<typeof rawSteps>((acc, step) => {
    const key = (step.stepNumber !== undefined ? `num-${step.stepNumber}` : null) ||
                (step.title?.vi || step.title?.en || '').trim().toLowerCase() ||
                `order-${step.order}`
    if (!acc.some((s) => {
      const sKey = (s.stepNumber !== undefined ? `num-${s.stepNumber}` : null) ||
                   (s.title?.vi || s.title?.en || '').trim().toLowerCase() ||
                   `order-${s.order}`
      return sKey === key
    })) {
      acc.push(step)
    }
    return acc
  }, [])

  const steps = uniqueSteps.slice(0, 5)
  const displaySteps = steps.length > 0 ? steps : fallbackSteps

  return (
    <section
      ref={sectionRef}
      id="step-timeline"
      className="py-20 bg-[#F6F5F1] overflow-hidden step-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="relative">
          {/* Desktop timeline */}
          <div className="hidden lg:block">
            <div className="step-grid">
              {displaySteps.map((step, idx) => {
                const accent = accentCycle[idx % accentCycle.length]
                const isLast = idx === displaySteps.length - 1
                const isFromCMS = steps.length > 0
                const cmsStep = step as AdmissionStep
                const fallbackStep = step as typeof fallbackSteps[0]

                // Get icon: from CMS (string) or fallback (component)
                const IconComponent = isFromCMS
                  ? (iconMap[cmsStep.icon] || ListChecks)
                  : fallbackStep.icon

                const stepNumber = isFromCMS ? idx + 1 : fallbackStep.number
                const stepTitle = isFromCMS
                  ? pick(cmsStep.title, locale) || pick(cmsStep.title, 'vi' as Locale)
                  : t(fallbackStep.titleKey)
                const stepDesc = isFromCMS
                  ? pick(cmsStep.description, locale) || pick(cmsStep.description, 'vi' as Locale)
                  : t(fallbackStep.descKey)

                return (
                  <div key={isFromCMS ? cmsStep.id : stepNumber} className="step-col">
                    {!isLast && (
                      <span
                        className="step-connector"
                        style={
                          {
                            '--from': accent.color,
                            '--to': accentCycle[(idx + 1) % accentCycle.length].color,
                            '--delay': `${idx * 0.18}s`,
                          } as React.CSSProperties
                        }
                      />
                    )}

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={inViewViewport}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.08,
                      }}
                      className="step-icon-wrap relative"
                      style={{ backgroundColor: accent.color }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={inViewViewport}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.08 + 0.04,
                      }}
                      className="step-card relative overflow-hidden"
                      style={{ backgroundColor: accent.bg }}
                    >
                      {isFromCMS && cmsStep.imageUrl && (
                        <div className="w-full h-24 -mx-px -mt-px mb-3 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={cmsStep.imageUrl}
                            alt={stepTitle}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="text-4xl font-bold mb-2" style={{ color: accent.color }}>
                        {stepNumber}
                      </div>
                      <div className="font-bold text-lg mb-1" style={{ color: accent.color }}>
                        {stepTitle}
                      </div>
                      <p className="text-sm" style={{ color: accent.color }}>
                        {stepDesc}
                      </p>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile timeline */}
          <div className="lg:hidden">
            <div className="step-mobile-rail" aria-hidden />
            <div className="step-mobile-grid">
              {displaySteps.map((step, idx) => {
                const accent = accentCycle[idx % accentCycle.length]
                const isLast = idx === displaySteps.length - 1
                const isFromCMS = steps.length > 0
                const cmsStep = step as AdmissionStep
                const fallbackStep = step as typeof fallbackSteps[0]

                // Get icon: from CMS (string) or fallback (component)
                const IconComponent = isFromCMS
                  ? (iconMap[cmsStep.icon] || ListChecks)
                  : fallbackStep.icon

                const stepNumber = isFromCMS ? idx + 1 : fallbackStep.number
                const stepTitle = isFromCMS
                  ? pick(cmsStep.title, locale) || pick(cmsStep.title, 'vi' as Locale)
                  : t(fallbackStep.titleKey)
                const stepDesc = isFromCMS
                  ? pick(cmsStep.description, locale) || pick(cmsStep.description, 'vi' as Locale)
                  : t(fallbackStep.descKey)

                return (
                  <div key={isFromCMS ? cmsStep.id : stepNumber} className="step-mobile-row">
                    {!isLast && (
                      <span
                        className="step-mobile-connector"
                        style={
                          {
                            '--color': accent.color,
                            '--delay': `${idx * 0.18}s`,
                          } as React.CSSProperties
                        }
                      />
                    )}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={inViewViewport}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.08,
                      }}
                      className="step-icon-mobile"
                      style={{ backgroundColor: accent.color }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={inViewViewport}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.08 + 0.04,
                      }}
                      className="step-card-mobile"
                      style={{ backgroundColor: accent.bg }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className="text-2xl font-bold"
                          style={{ color: accent.color }}
                        >
                          {stepNumber}
                        </span>
                        <div className="font-bold" style={{ color: accent.color }}>
                          {stepTitle}
                        </div>
                      </div>
                      <p className="text-sm" style={{ color: accent.color }}>
                        {stepDesc}
                      </p>
                    </motion.div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm border border-[#DEDDD6]">
            <div className="text-right">
              <p className="text-[#20242B] font-medium">{t('ctaText')}</p>
              <p className="text-sm text-[#5C6069]">{t('ctaSubtext')}</p>
            </div>
            <a
              href="/admissions"
              className="inline-flex items-center justify-center bg-[#F26522] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap hover:bg-[#C94F16] hover:-translate-y-0.5"
            >
              {t('register')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
