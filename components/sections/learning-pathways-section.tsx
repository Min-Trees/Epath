'use client'

import { useTranslations, useLocale } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Sprout, Book, GraduationCap, Trophy } from 'lucide-react'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { LearningPathway, Locale } from '@/lib/cms-types'

const defaultPathways: Array<{ id: string; level: string }> = [
  { id: 'kindergarten', level: 'kindergarten' },
  { id: 'elementary', level: 'elementary' },
  { id: 'middle', level: 'middle' },
  { id: 'high', level: 'high' },
]

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  kindergarten: Sprout,
  elementary: Book,
  middle: GraduationCap,
  high: Trophy,
}

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function LearningPathwaysSection() {
  const t = useTranslations('pathways')
  const tNav = useTranslations('nav')
  const tLevels = useTranslations('programs.levels')
  const locale = useLocale() as Locale
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })
  const { data: cms } = useCmsContext()
  const pathways = (cms.pathways || cms.learningPathways || [])
    .filter((p) => p.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  // Use ONLY ONE data source: CMS if available, otherwise fallback
  const displayPathways = pathways.length > 0 ? pathways : defaultPathways

  return (
    <section ref={sectionRef} className="pathways-section py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 pathways-header">
          <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPathways.map((pathway, index) => {
            const accent = accentCycle[index % accentCycle.length]
            const cmsPathway = pathway as LearningPathway
            const isCMS = 'title' in pathway && (pathway as LearningPathway).title !== undefined

            const level = isCMS
              ? cmsPathway.level
              : (pathway as { level: string }).level

            const IconComponent = iconMap[level] || Sprout

            const levelTitle = isCMS
              ? pick(cmsPathway.title, locale)
              : tLevels(level as 'kindergarten' | 'elementary' | 'middle' | 'high')

            const levelLabel = isCMS
              ? pick(cmsPathway.title, locale)
              : tNav(level as 'kindergarten' | 'elementary' | 'middle' | 'high')

            const description = isCMS
              ? pick(cmsPathway.subtitle, locale) || pick(cmsPathway.description, locale)
              : t(`${level}Desc`)

            const badgesList: string[] = isCMS
              ? (typeof cmsPathway.badges === 'string' && cmsPathway.badges.trim()
                  ? cmsPathway.badges.split(',').map((s) => s.trim()).filter(Boolean)
                  : Array.isArray(cmsPathway.badges) && cmsPathway.badges.length > 0
                  ? (cmsPathway.badges as string[])
                  : (cmsPathway.objectives || []).map((o) => (typeof o === 'string' ? o : pick(o, locale))).filter(Boolean))
              : []
            const pathwayImage = isCMS ? cmsPathway.imageUrl : ''

            return (
              <div
                key={isCMS ? cmsPathway.id : `default-${level}`}
                className="pathway-card-wrap"
                style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              >
                <Link
                  href={`/${locale}/programs?level=${level}`}
                  className="block h-full group"
                >
                  <div
                    className="pathway-card h-full rounded-2xl p-6 border-2 relative overflow-hidden"
                    style={{
                      backgroundColor: accent.bg,
                      borderColor: accent.color,
                    }}
                  >
                    {/* Watermark icon */}
                    <div className="pathway-watermark absolute top-4 right-4" style={{ color: accent.color }}>
                      <IconComponent className="w-24 h-24" />
                    </div>

                    {/* Optional CMS image */}
                    {pathwayImage && (
                      <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pathwayImage}
                          alt={levelTitle}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Icon badge */}
                    <div className="relative w-16 h-16 mb-4">
                      <div className="pathway-badge absolute inset-0 rounded-xl flex items-center justify-center" style={{ color: accent.color }}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                    </div>

                    <div className="mb-2 relative">
                      <span className="text-2xl font-bold" style={{ color: accent.color }}>
                        {levelTitle}
                      </span>
                      <span className="block text-sm opacity-70">
                        {levelLabel}
                      </span>
                    </div>

                    <p className="text-sm text-[#5C6069] mb-4">
                      {description}
                    </p>

                    {badgesList.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                          {t('curriculum')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {badgesList.slice(0, 4).map((text, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-white/60"
                              style={{ color: accent.color }}
                            >
                              {text}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pathway-arrow absolute bottom-4 right-4" style={{ color: accent.color }}>
                      <ArrowRight className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}/programs`}
            className="inline-flex items-center gap-2 bg-[#F26522] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#C94F16] transition-all duration-200 hover:-translate-y-1 shadow-lg"
            style={{ boxShadow: '0 8px 20px -6px rgba(242, 101, 34, 0.45)' }}
          >
            {t('viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
