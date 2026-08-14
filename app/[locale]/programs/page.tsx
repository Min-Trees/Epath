'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Filter, Sprout, Book, GraduationCap, Trophy, ArrowRight, BookOpen, Sparkles, Award, Globe2, GraduationCap as CapIcon, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { usePublicCms } from '@/lib/use-public-cms'
import type { Program } from '@/lib/cms-types'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'

interface ProgramsPageProps {
  // unused; kept for backward compatibility
}

const levelDefs = [
  { id: 'kindergarten', icon: Sprout, color: '#3A53A3', bgColor: 'rgb(230, 236, 255)' },
  { id: 'elementary', icon: Book, color: '#8BC53F', bgColor: 'rgb(243, 250, 224)' },
  { id: 'middle', icon: GraduationCap, color: '#F05A28', bgColor: 'rgb(255, 243, 237)' },
  { id: 'high', icon: Trophy, color: '#3A53A3', bgColor: 'rgb(230, 236, 255)' },
]

export default function ProgramsPage(_: ProgramsPageProps) {
  const t = useTranslations('programs')
  const params = useParams()
  const locale = params.locale as string || 'vi'
  const cms = usePublicCms()
  const cmsPrograms = cms.programs

  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const filteredLevels = selectedLevel === 'all'
    ? levelDefs
    : levelDefs.filter((p) => p.id === selectedLevel)

  function programsForLevel(levelId: string): Program[] {
    return cmsPrograms.filter((p) => p.level === levelId)
  }

  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#3A53A3] via-[#3A53A3] to-[#2E4389]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-4xl mx-auto space-y-4 text-[#6B6B6B] leading-relaxed"
          >
            <p>{t('pathwayIntro.p1')}</p>
            <p>{t('pathwayIntro.p2')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#6B6B6B]" />
              <span className="font-medium text-[#231F20]">{t('filter')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedLevel === 'all' ? 'default' : 'outline'} onClick={() => setSelectedLevel('all')}>{t('all')}</Button>
              {levelDefs.map((p) => (
                <Button key={p.id} variant={selectedLevel === p.id ? 'default' : 'outline'} onClick={() => setSelectedLevel(p.id)}>{t(`levels.${p.id}`)}</Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-4xl mx-auto mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#3A53A3]/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#3A53A3]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#231F20]">
                {t('foundationStage.title')}
              </h2>
            </div>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              {t('foundationStage.desc')}
            </p>
            <p className="text-sm font-semibold text-[#231F20] mb-3">
              {t('foundationStage.goalsTitle')}
            </p>
            <ul className="grid sm:grid-cols-2 gap-2 mb-4">
              {(['g1', 'g2', 'g3', 'g4', 'g5'] as const).map((_, idx) => {
                const goals = t.raw('foundationStage.goals') as string[]
                const goal = goals[idx]
                return (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#6B6B6B]">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3A53A3] flex-shrink-0" />
                    <span>{goal}</span>
                  </li>
                )
              })}
            </ul>
            <p className="text-[#6B6B6B] leading-relaxed mb-4">
              {t('foundationStage.platformDesc')}
            </p>
            <div className="flex items-start gap-2 p-4 rounded-lg bg-[#3A53A3]/5 border-l-4 border-[#3A53A3] text-sm text-[#231F20]">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#3A53A3]" />
              <span>{t('foundationStage.note')}</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F05A28]/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#F05A28]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#231F20]">
                {t('advancedStage.title')}
              </h2>
            </div>
            <p className="text-[#6B6B6B] leading-relaxed">
              {t('advancedStage.desc')}
            </p>
          </motion.div>

          <div className="space-y-20">
            {filteredLevels.map((level, levelIndex) => {
              const levelPrograms = programsForLevel(level.id)
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.normal, delay: levelIndex * 0.08, ease: easeOut }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: level.bgColor }}>
                      <level.icon className="w-8 h-8" style={{ color: level.color }} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-[#231F20]">{t(`levels.${level.id}`)}</h2>
                      <p className="text-[#6B6B6B]">{t('curriculum')}</p>
                    </div>
                  </div>
                  {levelPrograms.length === 0 ? (
                    <div className="rounded-xl border-2 p-6 bg-white" style={{ borderColor: level.color }}>
                      <h3 className="text-xl font-bold mb-2" style={{ color: level.color }}>Base Path</h3>
                      <p className="text-[#6B6B6B] mb-4">Program description</p>
                      <Link href={`/${locale}/admissions?program=${level.id}`} className="inline-flex items-center gap-2 font-medium" style={{ color: level.color }}>
                        {t('register')}<ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {levelPrograms.map((p) => (
                        <div key={p.id} className="rounded-xl border-2 p-6 transition-all hover:shadow-lg bg-white" style={{ borderColor: level.color }}>
                          <h3 className="text-xl font-bold mb-2" style={{ color: level.color }}>
                            {p.title[locale as 'vi' | 'en'] || p.title.vi}
                          </h3>
                          <div className="text-[#6B6B6B] mb-4 line-clamp-3">
                            <RichTextRenderer html={p.shortDescription[locale as 'vi' | 'en'] || p.shortDescription.vi} compact />
                          </div>
                          <Link href={`/${locale}/admissions?program=${p.slug}`} className="inline-flex items-center gap-2 font-medium" style={{ color: level.color }}>
                            {t('register')}<ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
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
            className="text-center mb-12 text-white"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-sm font-medium mb-4">
              <Award className="w-4 h-4" />
              {t('edoptions.subtitle')}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('edoptions.title')}
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-[#3A53A3]/10 text-[#3A53A3] text-xs font-semibold tracking-wider mb-4">
                {t('edoptions.dual.label')}
              </div>
              <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                {t('edoptions.dual.title')}
              </h3>
              <div className="space-y-3 text-[#6B6B6B] leading-relaxed">
                <p>{t('edoptions.dual.desc')}</p>
                <p>{t('edoptions.dual.p2')}</p>
                <div className="my-4">
                  <p className="text-sm font-semibold text-[#231F20] mb-2">
                    {t('edoptions.dual.diplomasTitle')}
                  </p>
                  <ul className="space-y-2">
                    {(['d1', 'd2'] as const).map((_, idx) => {
                      const diplomas = t.raw('edoptions.dual.diplomas') as string[]
                      const accent = accentCycle[idx % accentCycle.length]
                      return (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[#231F20]">
                          <Award className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: accent.color }} />
                          <span>{diplomas[idx]}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <p>{t('edoptions.dual.p3')}</p>
                <p>{t('edoptions.dual.p4')}</p>
              </div>
              <div className="mt-6 flex items-start gap-2 p-4 rounded-lg bg-[#8BC53F]/10 border-l-4 border-[#8BC53F] text-sm text-[#231F20]">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#1A7F5A]" />
                <span>{t('edoptions.dual.note')}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: 0.1, ease: easeOut }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="inline-block px-3 py-1 rounded-full bg-[#F05A28]/10 text-[#F05A28] text-xs font-semibold tracking-wider mb-4">
                {t('edoptions.fulltime.label')}
              </div>
              <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                {t('edoptions.fulltime.title')}
              </h3>
              <div className="space-y-3 text-[#6B6B6B] leading-relaxed">
                <p>{t('edoptions.fulltime.desc')}</p>
                <p>{t('edoptions.fulltime.p2')}</p>
                <div className="my-4">
                  <p className="text-sm font-semibold text-[#231F20] mb-2">
                    {t('edoptions.fulltime.fitTitle')}
                  </p>
                  <ul className="space-y-2">
                    {(['f1', 'f2', 'f3', 'f4'] as const).map((_, idx) => {
                      const fit = t.raw('edoptions.fulltime.fit') as string[]
                      const accent = accentCycle[(idx + 1) % accentCycle.length]
                      return (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[#231F20]">
                          <span
                            className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: accent.color }}
                          />
                          <span>{fit[idx]}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
                <p>{t('edoptions.fulltime.p3')}</p>
                <p>{t('edoptions.fulltime.p4')}</p>
              </div>
            </motion.div>
          </div>

          <div className="text-center mt-12">
            <Link href={`/${locale}/admissions`}>
              <Button size="lg" className="bg-[#F05A28] hover:bg-[#E04D1A] text-white">
                {t('cta.button')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-[#8BC53F]/10 flex items-center justify-center">
                <Globe2 className="w-6 h-6 text-[#1A7F5A]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#231F20]">
                {t('personalized.title')}
              </h2>
            </div>
            <p className="text-[#6B6B6B] leading-relaxed mb-6">
              {t('personalized.desc')}
            </p>
            <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
              <p className="text-sm font-semibold text-[#231F20] mb-3">
                {t('personalized.goalsTitle')}
              </p>
              <ul className="space-y-2">
                {(['g1', 'g2', 'g3', 'g4'] as const).map((_, idx) => {
                  const goals = t.raw('personalized.goals') as string[]
                  const accent = accentCycle[idx % accentCycle.length]
                  return (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#231F20]">
                      <span
                        className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: accent.color }}
                      />
                      <span>{goals[idx]}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <p className="text-[#6B6B6B] leading-relaxed">
              {t('personalized.p2')}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#231F20] mb-4">{t('cta.title')}</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-[#F05A28] hover:bg-[#E04D1A]">
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}