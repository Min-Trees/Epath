'use client'

import { useEffect, useState } from 'react'
import { Target, Eye, Heart, Users, BookOpen, Sparkles, GraduationCap, Compass, Layers, Award, Network } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import type { CoreValue, AboutContent } from '@/lib/cms-types'

interface MilestoneItem {
  year: string
  title: { vi: string; en: string }
  description: { vi: string; en: string }
}

// Fallback milestones
const fallbackMilestones = [
  { year: '2014', titleKey: 'm1Title', descKey: 'm1Desc' },
  { year: '2018', titleKey: 'm2Title', descKey: 'm2Desc' },
  { year: '2020', titleKey: 'm3Title', descKey: 'm3Desc' },
  { year: '2022', titleKey: 'm4Title', descKey: 'm4Desc' },
  { year: '2024', titleKey: 'm5Title', descKey: 'm5Desc' },
]

export default function AboutPage() {
  const t = useTranslations('about')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'

  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [coreValues, setCoreValues] = useState<CoreValue[]>([])
  const [milestones, setMilestones] = useState<MilestoneItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/cms/about-content').then((r) => r.json()),
      fetch('/api/cms/core-values').then((r) => r.json()),
    ])
      .then(([aboutData, coreValuesData]) => {
        if (aboutData.items && aboutData.items.length > 0) {
          const item = aboutData.items[0]
          setAboutContent(item)
          try {
            const parsedMilestones = JSON.parse(item.milestones || '[]')
            if (parsedMilestones.length > 0) {
              setMilestones(parsedMilestones)
            }
          } catch {
            // Use fallback milestones
          }
        }
        if (coreValuesData.items && coreValuesData.items.length > 0) {
          setCoreValues(coreValuesData.items.filter((v: CoreValue) => v.isActive).sort((a: CoreValue, b: CoreValue) => a.order - b.order))
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  // Intro paragraphs
  const introParagraphs = aboutContent?.introContent?.vi?.split('\n\n').filter(Boolean) ||
    aboutContent?.introContent?.en?.split('\n\n').filter(Boolean) ||
    [t('intro.p1'), t('intro.p2'), t('intro.p3'), t('intro.p4'), t('intro.p5')]

  // Use CMS milestones or fallback
  const displayMilestones = milestones.length > 0 ? milestones : fallbackMilestones.map(m => ({
    year: m.year,
    title: { vi: t(m.titleKey), en: t(m.titleKey) },
    description: { vi: t(m.descKey), en: t(m.descKey) },
  }))

  // Use CMS core values or i18n fallback
  const displayValues = coreValues.length > 0 ? coreValues : []

  return (
    <>
      <section
        className="pt-32 pb-20"
        style={{ background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)' }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {aboutContent?.introTitle?.vi || aboutContent?.introTitle?.en || t('hero.title')}
            </h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A53A3]/10 text-[#3A53A3] text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                {t('intro.title')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-6">
                {aboutContent?.introTitle?.vi || aboutContent?.introTitle?.en || t('hero.title')}
              </h2>
              <div className="space-y-4 text-[#6B6B6B] leading-relaxed">
                {introParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 mt-8">
                <div className="surface-alt rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#3A53A3]">10+</div>
                  <div className="text-sm text-[#6B6B6B]">{t('stats.years')}</div>
                </div>
                <div className="surface-alt rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#8BC53F]">4</div>
                  <div className="text-sm text-[#6B6B6B]">{t('stats.levels')}</div>
                </div>
                <div className="surface-alt rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-[#F05A28]">60+</div>
                  <div className="text-sm text-[#6B6B6B]">{t('stats.edmentum')}</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-[#3A53A3]/10 to-[#8BC53F]/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-32 h-32 text-[#3A53A3]/20" />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#F05A28] text-white rounded-xl p-6 shadow-lg">
                <div className="text-4xl font-bold">60+</div>
                <div className="text-sm">{t('stats.edmentum')}</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="vision" className="py-20 surface-alt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="w-16 h-16 bg-[#3A53A3]/10 rounded-xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-[#3A53A3]" />
              </div>
              <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                {aboutContent?.visionTitle?.vi || aboutContent?.visionTitle?.en || t('vision')}
              </h3>
              <div className="space-y-3 text-[#6B6B6B] leading-relaxed">
                <p>{aboutContent?.visionContent?.vi || aboutContent?.visionContent?.en || t('visionText')}</p>
                <p>{t('visionP2')}</p>
                <p className="p-4 rounded-lg bg-[#3A53A3]/5 border-l-4 border-[#3A53A3] text-[#231F20]">
                  <strong>{t('vision')}: </strong>
                  {t('visionHighlight')}
                </p>
              </div>
            </motion.div>
            <motion.div
              id="mission"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: 0.1, ease: easeOut }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="w-16 h-16 bg-[#8BC53F]/10 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-[#8BC53F]" />
              </div>
              <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                {aboutContent?.missionTitle?.vi || aboutContent?.missionTitle?.en || t('mission')}
              </h3>
              <div className="space-y-3 text-[#6B6B6B] leading-relaxed">
                <p>{aboutContent?.missionContent?.vi || aboutContent?.missionContent?.en || t('missionText')}</p>
                <p>{t('missionP2')}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="values" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8BC53F]/10 text-[#1A7F5A] text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              {t('coreValues.title')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
              {t('coreValues.title')}
            </h2>
            <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
              {t('coreValues.subtitle')}
            </p>
          </motion.div>

          {displayValues.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayValues.map((value, index) => {
                const accent = accentCycle[index % accentCycle.length]
                return (
                  <motion.div
                    key={value.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewViewport}
                    transition={{ duration: duration.normal, delay: index * 0.06, ease: easeOut }}
                    className="surface-alt rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: accent.bg }}
                      >
                        <Award className="w-6 h-6" style={{ color: accent.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span
                            className="text-xs font-bold tracking-wider uppercase"
                            style={{ color: accent.color }}
                          >
                            0{index + 1}
                          </span>
                          <h3 className="text-lg font-bold text-[#231F20]">
                            {value.title?.vi || value.title?.en}
                          </h3>
                        </div>
                        <p className="text-sm text-[#6B6B6B] leading-relaxed">
                          {value.description?.vi || value.description?.en}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3, 4, 5].map((index) => {
                const accent = accentCycle[index % accentCycle.length]
                const valueKeys = ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'] as const
                const key = valueKeys[index]
                return (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewViewport}
                    transition={{ duration: duration.normal, delay: index * 0.06, ease: easeOut }}
                    className="surface-alt rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: accent.bg }}
                      >
                        <Award className="w-6 h-6" style={{ color: accent.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span
                            className="text-xs font-bold tracking-wider uppercase"
                            style={{ color: accent.color }}
                          >
                            0{index + 1}
                          </span>
                          <h3 className="text-lg font-bold text-[#231F20]">
                            {t(`coreValues.items.${key}.title`)}
                          </h3>
                        </div>
                        <p className="text-sm text-[#6B6B6B] leading-relaxed">
                          {t(`coreValues.items.${key}.desc`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)' }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('milestones.title')}
            </h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('milestones.subtitle')}
            </p>
          </motion.div>
          <div className="grid md:grid-cols-5 gap-4">
            {displayMilestones.map((milestone, index) => {
              const accent = accentCycle[index % accentCycle.length]
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.normal, delay: index * 0.08, ease: easeOut }}
                  className="text-center"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: accent.color }}
                  >
                    <span className="text-white font-bold">{milestone.year}</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">{milestone.title?.vi || milestone.title?.en}</h4>
                  <p className="text-sm text-white/70">{milestone.description?.vi || milestone.description?.en}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-20 surface-alt">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F05A28]/10 text-[#F05A28] text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                {t('achievements.title')}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
                {t('achievements.title')}
              </h2>
              <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
                {t('achievements.subtitle')}
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border-2 border-[#3A53A3]/10">
              <p className="text-[#231F20] leading-relaxed mb-6">{t('achievements.desc')}</p>
              <div className="rounded-xl border-2 border-dashed border-[#3A53A3]/30 bg-gradient-to-br from-[#3A53A3]/5 to-[#8BC53F]/5 p-10 text-center">
                <div className="flex justify-center gap-4 mb-3">
                  <Users className="w-12 h-12 text-[#3A53A3]/40" />
                  <Heart className="w-12 h-12 text-[#F05A28]/40" />
                  <GraduationCap className="w-12 h-12 text-[#8BC53F]/40" />
                </div>
                <p className="text-sm text-[#6B6B6B] italic">{t('achievements.imageNote')}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #F05A28 0%, #E04D1A 100%)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-white/90 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-white text-[#F05A28] hover:bg-white/90">
              {t('cta.button')}
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
