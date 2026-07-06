'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowRight, Sprout, Book, GraduationCap, Trophy } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'

const pathways = [
  { id: 'kindergarten', levelKey: 'kindergarten', icon: Sprout },
  { id: 'elementary', levelKey: 'elementary', icon: Book },
  { id: 'middle', levelKey: 'middle', icon: GraduationCap },
  { id: 'high', levelKey: 'high', icon: Trophy },
]

const programData: Record<
  string,
  { programs: string[]; curriculum: string; descriptionKey: 'kindergartenDesc' | 'elementaryDesc' | 'middleDesc' | 'highDesc' }
> = {
  kindergarten: {
    programs: ['Little People', 'SpeedUp English'],
    curriculum: 'Base Path',
    descriptionKey: 'kindergartenDesc',
  },
  elementary: {
    programs: ['Base Path', 'Prime Path'],
    curriculum: 'US Curriculum',
    descriptionKey: 'elementaryDesc',
  },
  middle: {
    programs: ['Base Path', 'Prime Path', 'SpeedUp English'],
    curriculum: 'US Middle School',
    descriptionKey: 'middleDesc',
  },
  high: {
    programs: ['Dual Diploma', 'US High School Diploma'],
    curriculum: 'EdOptions Academy',
    descriptionKey: 'highDesc',
  },
}

/**
 * Performance rebuild:
 *   - All framer-motion wrappers removed.
 *   - Card lift / icon swap / arrow slide handled in pure CSS.
 *   - IntersectionObserver toggles `data-active` so the stagger fade-in
 *     runs on the compositor (no JS per-frame).
 */
export function LearningPathwaysSection() {
  const t = useTranslations('pathways')
  const tNav = useTranslations('nav')
  const tLevels = useTranslations('programs.levels')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })

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
          {pathways.map((pathway, index) => {
            const accent = accentCycle[index % accentCycle.length]
            return (
              <div
                key={pathway.id}
                className="pathway-card-wrap"
                style={{ ['--reveal-delay' as string]: `${index * 0.08}s` }}
              >
                <Link
                  href={`/${locale}/programs?level=${pathway.id}`}
                  className="block h-full group"
                >
                  <div
                    className="pathway-card h-full rounded-2xl p-6 border-2 relative overflow-hidden"
                    style={
                      {
                        backgroundColor: accent.bg,
                        borderColor: accent.color,
                        ['--accent' as string]: accent.color,
                      } as React.CSSProperties
                    }
                  >
                    {/* Watermark icon */}
                    <div className="pathway-watermark absolute top-4 right-4">
                      <pathway.icon className="w-24 h-24" style={{ color: accent.color }} />
                    </div>

                    {/* Icon badge with cross-fade (default vs hover) */}
                    <div className="relative w-16 h-16 mb-4">
                      <div className="pathway-badge absolute inset-0 rounded-xl flex items-center justify-center">
                        <pathway.icon
                          className="w-8 h-8 pathway-icon-default"
                          style={{ color: accent.color }}
                        />
                      </div>
                      <div className="pathway-badge-hover absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none">
                        <pathway.icon
                          className="w-8 h-8 pathway-icon-hover"
                          style={{ color: accent.color }}
                        />
                      </div>
                    </div>

                    <div className="mb-2 relative">
                      <span className="text-2xl font-bold" style={{ color: accent.color }}>
                        {tLevels(pathway.levelKey as 'kindergarten' | 'elementary' | 'middle' | 'high')}
                      </span>
                      <span className="block text-sm opacity-70">
                        {tNav(pathway.levelKey as 'kindergarten' | 'elementary' | 'middle' | 'high')}
                      </span>
                    </div>

                    <p className="text-sm text-[#6B6B6B] mb-4">
                      {t(programData[pathway.id].descriptionKey)}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="text-xs font-semibold uppercase tracking-wide opacity-70">
                        {t('curriculum')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {programData[pathway.id].programs.map((program) => (
                          <span
                            key={program}
                            className="text-xs px-2 py-1 rounded-full bg-white/60"
                            style={{ color: accent.color }}
                          >
                            {program}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-current/20">
                      <div className="text-xs opacity-70">{t('curriculum')}</div>
                      <div className="font-semibold text-sm" style={{ color: accent.color }}>
                        {programData[pathway.id].curriculum}
                      </div>
                    </div>

                    <div className="pathway-arrow absolute bottom-4 right-4">
                      <ArrowRight className="w-6 h-6" style={{ color: accent.color }} />
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
