'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Sparkles, Sprout, Book, GraduationCap, Trophy, Compass } from 'lucide-react'

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
    id: 'breakthrough-english',
    labelKey: 'breakthrough-english',
    icon: Sparkles,
    color: '#2E4A9E',
    bgColor: 'rgba(46, 74, 158, 0.1)',
    lightBg: '#EAEFFB',
    borderColor: '#2E4A9E',
  },
  {
    id: 'science-foundation',
    labelKey: 'science-foundation',
    icon: Sprout,
    color: '#5C9024',
    bgColor: 'rgba(141, 198, 63, 0.15)',
    lightBg: '#F4F9EC',
    borderColor: '#8DC63F',
  },
  {
    id: 'elementary',
    labelKey: 'elementary',
    icon: Book,
    color: '#2E4A9E',
    bgColor: 'rgba(46, 74, 158, 0.1)',
    lightBg: '#EAEFFB',
    borderColor: '#2E4A9E',
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
  {
    id: 'personal-development',
    labelKey: 'personal-development',
    icon: Compass,
    color: '#7C3AED',
    bgColor: 'rgba(124, 58, 237, 0.1)',
    lightBg: '#F5F3FF',
    borderColor: '#7C3AED',
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

  const isRoadmapVisible =
    pc?.showRoadmap !== false && pc?.roadmap?.isActive !== false

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. CONTINUOUS K-12 ROADMAP INFOGRAPHIC (Toggleable via Admin)
      ─────────────────────────────────────────────────────────────── */}
      {isRoadmapVisible && (
        <ProgramsRoadmap locale={locale} isTop={true} />
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. CURRICULUM CATALOG SHOWCASE (Cards grouped by 6 categories)
      ─────────────────────────────────────────────────────────────── */}
      <ProgramsCatalog
        locale={locale}
        isTop={!isRoadmapVisible}
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
            'breakthrough-english': isVi ? '1. Chương trình Tiếng Anh Bứt Phá' : '1. SpeedUp English Programs',
            'science-foundation': isVi ? '2. Khóa học Nền tảng Khoa học Quốc tế (Mầm non, Grade 1 & 2)' : '2. International Science & Academic Foundation',
            elementary: isVi ? '3. Chương trình Tiểu học (Lớp 3 – 5: Tiêu chuẩn & Quốc tế)' : '3. Elementary Programs (Grades 3–5)',
            middle: isVi ? '4. Chương trình Trung học Cơ sở (Lớp 6 – 8: Foundation & U.S. Middle School)' : '4. Middle School Programs (Grades 6–8)',
            high: isVi ? '5. Chương trình Trung học Phổ thông (Lớp 9 – 12: Dual Diploma & U.S. Diploma)' : '5. High School Programs (Grades 9–12)',
            'personal-development': isVi ? '6. Phát triển Năng lực Cá nhân (Personal Development & FabLab EIU)' : '6. Personal Development & Extracurriculars',
            kindergarten: isVi ? 'Mầm non' : 'Kindergarten',
          },
        }}
      />

      {/* ─────────────────────────────────────────────────────────────
          5. SPOTLIGHT: US DUAL DIPLOMA & EDOPTIONS ACADEMY
      ─────────────────────────────────────────────────────────────── */}
      {(() => {
        const dualProgram = programs.find((p) => p.slug === 'high-dual-diploma' || p.slug === 'high-dual')
        const fulltimeProgram = programs.find((p) => p.slug === 'high-fulltime-homeschool' || p.slug === 'high-fulltime')
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
          6. PERSONALIZED LEARNING & ACADEMIC ADVISOR ECOSYSTEM
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
          7. OUTSTANDING ACHIEVEMENTS & EDUCATIONAL OUTCOMES
      ─────────────────────────────────────────────────────────────── */}
      {pc?.showAchievements !== false && (
        <AchievementsOverviewSection
          titleOverride={pc?.achievementsTitle?.[locale]}
          subtitleOverride={pc?.achievementsSubtitle?.[locale]}
        />
      )}

      {/* ─────────────────────────────────────────────────────────────
          8. BOTTOM CTA BANNER
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
