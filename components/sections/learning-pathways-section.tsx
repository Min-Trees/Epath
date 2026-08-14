'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Sprout, Book, GraduationCap, Trophy } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import type { LearningPathway } from '@/lib/cms-types'

// Default pathways if CMS is empty
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

export function LearningPathwaysSection() {
  const t = useTranslations('pathways')
  const tNav = useTranslations('nav')
  const tLevels = useTranslations('programs.levels')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })
  const [pathways, setPathways] = useState<LearningPathway[]>([])

  useEffect(() => {
    fetch('/api/cms/pathways')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          setPathways(data.items.filter((p: LearningPathway) => p.isActive).sort((a: LearningPathway, b: LearningPathway) => a.order - b.order))
        }
      })
      .catch(console.error)
  }, [])

  const displayPathways = pathways.length > 0 ? pathways : defaultPathways

  return (
    <section ref={sectionRef} className="pathways-section py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 pathways-header">
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPathways.map((pathway, index) => {
            const accent = accentCycle[index % accentCycle.length]
            const level = 'level' in pathway ? pathway.level : (pathway as { id: string }).id
            const isCMS = 'title' in pathway
            const cmsPathway = pathway as LearningPathway

            const IconComponent = iconMap[level] || Sprout

            const levelTitle = isCMS && cmsPathway.title
              ? (cmsPathway.title?.vi || cmsPathway.title?.en)
              : tLevels(level as 'kindergarten' | 'elementary' | 'middle' | 'high')

            const levelLabel = isCMS && cmsPathway.title
              ? (cmsPathway.title?.vi || cmsPathway.title?.en)
              : tNav(level as 'kindergarten' | 'elementary' | 'middle' | 'high')

            const description = isCMS && cmsPathway.description
              ? (cmsPathway.description?.vi || cmsPathway.description?.en)
              : t(`${level}Desc`)

            const objectives = isCMS ? cmsPathway.objectives : []

            const pathwayKey = 'id' in pathway ? pathway.id : `default-${level}`

            return (
              <div
                key={pathwayKey}
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

                    <p className="text-sm text-[#6B6B6B] mb-4">
                      {description}
                    </p>

                    {objectives.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                          {t('curriculum')}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {objectives.slice(0, 4).map((obj, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-1 rounded-full bg-white/60"
                              style={{ color: accent.color }}
                            >
                              {typeof obj === 'string' ? obj : obj.vi || obj.en}
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
            className="inline-flex items-center gap-2 bg-[#F05A28] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#E04D1A] transition-colors duration-200"
          >
            {t('viewAll')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
