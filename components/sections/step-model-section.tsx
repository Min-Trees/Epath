'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ClipboardCheck, Map, Laptop, MessageCircle, Award, ListChecks } from 'lucide-react'
import { duration, easeOut, useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import type { AdmissionStep } from '@/lib/cms-types'

// Icon mapping for admission steps
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ClipboardCheck: ClipboardCheck,
  Map: Map,
  Laptop: Laptop,
  MessageCircle: MessageCircle,
  Award: Award,
  ListChecks: ListChecks,
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
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.15 })
  const [steps, setSteps] = useState<AdmissionStep[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/admission-steps')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setSteps(data.items.filter((s: AdmissionStep) => s.isActive).sort((a: AdmissionStep, b: AdmissionStep) => a.order - b.order))
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const displaySteps = steps.length > 0 ? steps : fallbackSteps

  return (
    <section
      ref={sectionRef}
      id="step-timeline"
      className="py-20 surface-alt overflow-hidden step-section"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
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
                  ? cmsStep.title?.vi || cmsStep.title?.en
                  : t(fallbackStep.titleKey)
                const stepDesc = isFromCMS
                  ? cmsStep.description?.vi || cmsStep.description?.en
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
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: duration.slow,
                        ease: easeOut,
                        delay: idx * 0.12,
                      }}
                      className="step-icon-wrap"
                      style={{ backgroundColor: accent.color }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: duration.slow,
                        ease: easeOut,
                        delay: idx * 0.12 + 0.1,
                      }}
                      className="step-card"
                      style={{ backgroundColor: accent.bg }}
                    >
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
                  ? cmsStep.title?.vi || cmsStep.title?.en
                  : t(fallbackStep.titleKey)
                const stepDesc = isFromCMS
                  ? cmsStep.description?.vi || cmsStep.description?.en
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
                      initial={{ opacity: 0, scale: 0.6 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.12,
                      }}
                      className="step-icon-mobile"
                      style={{ backgroundColor: accent.color }}
                    >
                      <IconComponent className="w-5 h-5 text-white" />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{
                        duration: duration.normal,
                        ease: easeOut,
                        delay: idx * 0.12 + 0.1,
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
          <div className="inline-flex items-center gap-4 bg-white rounded-xl p-6 shadow-sm">
            <div className="text-right">
              <p className="text-[#231F20] font-medium">{t('ctaText')}</p>
              <p className="text-sm text-[#6B6B6B]">{t('ctaSubtext')}</p>
            </div>
            <a
              href="/admissions"
              className="inline-flex items-center justify-center bg-[#F05A28] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 whitespace-nowrap hover:bg-[#E04D1A] hover:-translate-y-0.5"
            >
              {t('register')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
