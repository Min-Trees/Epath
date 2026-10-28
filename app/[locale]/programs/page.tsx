'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Sprout, Book, GraduationCap, Trophy } from 'lucide-react'

import { useCmsContext } from '@/lib/cms-context'
import type { Program, Locale } from '@/lib/cms-types'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import {
  ProgramsRoadmap,
  ProgramsCatalog,
  ProgramsEdOptions,
  ProgramsPersonalized,
  ProgramsCta,
  type LevelDef,
} from '@/components/programs'
import { AchievementsOverviewSection } from '@/components/sections/achievements-overview-section'

const levelDefs: LevelDef[] = [
  {
    id: 'kindergarten',
    labelKey: 'kindergarten',
    icon: Sprout,
    color: '#2E4A9E',
    bgColor: 'rgba(46, 74, 158, 0.1)',
    lightBg: '#EAEFFB',
    borderColor: '#2E4A9E',
  },
  {
    id: 'elementary',
    labelKey: 'elementary',
    icon: Book,
    color: '#5C9024',
    bgColor: 'rgba(141, 198, 63, 0.15)',
    lightBg: '#F4F9EC',
    borderColor: '#8DC63F',
  },
  {
    id: 'middle',
    labelKey: 'middle',
    icon: GraduationCap,
    color: '#F26522',
    bgColor: 'rgba(242, 101, 34, 0.1)',
    lightBg: '#FEF0E9',
    borderColor: '#F26522',
  },
  {
    id: 'high',
    labelKey: 'high',
    icon: Trophy,
    color: '#1E3570',
    bgColor: 'rgba(30, 53, 112, 0.12)',
    lightBg: '#EAEFFB',
    borderColor: '#1E3570',
  },
]

export default function ProgramsPage() {
  const t = useTranslations('programs')
  const locale = useLocale() as Locale

  const { data: cms } = useCmsContext()
  const pc = cms.programsContent

  // Fallback to DEFAULT_PROGRAMS if cms.programs is empty
  const programs: Program[] = cms.programs && cms.programs.length > 0 ? cms.programs : (DEFAULT_PROGRAMS as Program[])

  // Interactive Filter & Search States
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filtered levels based on user selection
  const filteredLevels =
    selectedLevel === 'all'
      ? levelDefs
      : levelDefs.filter((lvl) => lvl.id === selectedLevel)

  const isVi = locale === 'vi'

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. CONTINUOUS K-12 ROADMAP INFOGRAPHIC
      ─────────────────────────────────────────────────────────────── */}
      <ProgramsRoadmap locale={locale} />

      {/* ─────────────────────────────────────────────────────────────
          2. CURRICULUM CATALOG SHOWCASE (Cards with View Details & Register)
      ─────────────────────────────────────────────────────────────── */}
      <ProgramsCatalog
        locale={locale}
        programs={programs}
        filteredLevels={filteredLevels}
        searchQuery={searchQuery}
        onResetSearch={() => {
          setSearchQuery('')
          setSelectedLevel('all')
        }}
        translations={{
          curriculum: t('curriculum'),
          register: t('register'),
          viewDetails: isVi ? 'Xem chi tiết' : 'View Details',
          noProgramsFound:
            isVi ? 'Không tìm thấy chương trình phù hợp' : 'No matching programs found',
          clearFilters: isVi ? 'Xóa bộ lọc & tìm kiếm' : 'Clear filters',
          levels: {
            kindergarten: t('levels.kindergarten'),
            elementary: t('levels.elementary'),
            middle: t('levels.middle'),
            high: t('levels.high'),
          },
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          3. SPOTLIGHT: US DUAL DIPLOMA & EDOPTIONS ACADEMY
      ─────────────────────────────────────────────────────────────── */}
      {(() => {
        const dualProgram = programs.find((p) => p.slug === 'high-dual-diploma')
        const fulltimeProgram = programs.find((p) => p.slug === 'high-fulltime-homeschool')
        const dualTitle =
          pc?.edoptions?.dual?.title?.[locale] ||
          (dualProgram?.title as Record<string, string>)?.[locale] ||
          (dualProgram?.title as Record<string, string>)?.vi ||
          (dualProgram?.title as unknown as string) ||
          t('edoptions.dual.title')
        const fulltimeTitle =
          pc?.edoptions?.fulltime?.title?.[locale] ||
          (fulltimeProgram?.title as Record<string, string>)?.[locale] ||
          (fulltimeProgram?.title as Record<string, string>)?.vi ||
          (fulltimeProgram?.title as unknown as string) ||
          t('edoptions.fulltime.title')

        const dualImage = pc?.edoptions?.dual?.imageUrl || dualProgram?.imageUrl
        const fulltimeImage = pc?.edoptions?.fulltime?.imageUrl || fulltimeProgram?.imageUrl

        const dualDiplomas = pc?.edoptions?.dual?.diplomas?.[locale]?.length
          ? pc.edoptions.dual.diplomas[locale]
          : (t.raw('edoptions.dual.diplomas') as string[])

        const fulltimeFit = pc?.edoptions?.fulltime?.fit?.[locale]?.length
          ? pc.edoptions.fulltime.fit[locale]
          : (t.raw('edoptions.fulltime.fit') as string[])

        return (
          <ProgramsEdOptions
            locale={locale}
            dualImage={dualImage}
            fulltimeImage={fulltimeImage}
            translations={{
              title: pc?.edoptions?.title?.[locale] || t('edoptions.title'),
              subtitle: pc?.edoptions?.subtitle?.[locale] || t('edoptions.subtitle'),
              dual: {
                label: pc?.edoptions?.dual?.label?.[locale] || t('edoptions.dual.label'),
                title: dualTitle,
                desc: pc?.edoptions?.dual?.desc?.[locale] || t('edoptions.dual.desc'),
                p2: pc?.edoptions?.dual?.p2?.[locale] || t('edoptions.dual.p2'),
                diplomasTitle: pc?.edoptions?.dual?.diplomasTitle?.[locale] || t('edoptions.dual.diplomasTitle'),
                diplomas: dualDiplomas,
                p3: t('edoptions.dual.p3'),
                p4: t('edoptions.dual.p4'),
                note: t('edoptions.dual.note'),
              },
              fulltime: {
                label: pc?.edoptions?.fulltime?.label?.[locale] || t('edoptions.fulltime.label'),
                title: fulltimeTitle,
                desc: pc?.edoptions?.fulltime?.desc?.[locale] || t('edoptions.fulltime.desc'),
                p2: pc?.edoptions?.fulltime?.p2?.[locale] || t('edoptions.fulltime.p2'),
                fitTitle: pc?.edoptions?.fulltime?.fitTitle?.[locale] || t('edoptions.fulltime.fitTitle'),
                fit: fulltimeFit,
                p3: t('edoptions.fulltime.p3'),
                p4: t('edoptions.fulltime.p4'),
              },
              ctaButton: t('cta.button'),
            }}
          />
        )
      })()}

      {/* ─────────────────────────────────────────────────────────────
          4. PERSONALIZED LEARNING & ACADEMIC ADVISOR ECOSYSTEM
      ─────────────────────────────────────────────────────────────── */}
      <ProgramsPersonalized
        translations={{
          title: pc?.personalized?.title?.[locale] || t('personalized.title'),
          desc: pc?.personalized?.desc?.[locale] || t('personalized.desc'),
          goalsTitle: pc?.personalized?.goalsTitle?.[locale] || t('personalized.goalsTitle'),
          goals: pc?.personalized?.goals?.[locale]?.length
            ? pc.personalized.goals[locale]
            : (t.raw('personalized.goals') as string[]),
          p2: pc?.personalized?.p2?.[locale] || t('personalized.p2'),
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          5. OUTSTANDING ACHIEVEMENTS & EDUCATIONAL OUTCOMES
      ─────────────────────────────────────────────────────────────── */}
      {pc?.showAchievements !== false && (
        <AchievementsOverviewSection
          titleOverride={pc?.achievementsTitle?.[locale]}
          subtitleOverride={pc?.achievementsSubtitle?.[locale]}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. BOTTOM CTA BANNER
      ─────────────────────────────────────────────────────────────── */}
      <ProgramsCta
        locale={locale}
        translations={{
          title: pc?.cta?.title?.[locale] || t('cta.title'),
          subtitle: pc?.cta?.subtitle?.[locale] || t('cta.subtitle'),
          button: pc?.cta?.buttonText?.[locale] || t('cta.button'),
        }}
      />
    </>
  )
}
