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
            'breakthrough-english': isVi ? 'Chương trình Tiếng Anh Bứt Phá' : 'SpeedUp English Programs',
            'science-foundation': isVi ? 'Khóa học Nền tảng Khoa học Quốc tế (Mầm non, Grade 1 & 2)' : 'International Science & Academic Foundation (PreK – Grade 2)',
            elementary: isVi ? 'Chương trình Tiểu học (Lớp 3 – 5: Tiêu chuẩn & Quốc tế)' : 'Elementary Programs (Grades 3–5)',
            middle: isVi ? 'Chương trình Trung học Cơ sở (Lớp 6 – 8: Foundation & U.S. Middle School)' : 'Middle School Programs (Grades 6–8)',
            high: isVi ? 'Chương trình Trung học Phổ thông (Lớp 9 – 12: Dual Diploma & U.S. Diploma)' : 'High School Programs (Grades 9–12)',
            'personal-development': isVi ? 'Phát triển Năng lực Cá nhân (Personal Development & FabLab EIU)' : 'Personal Development & Extracurriculars',
            kindergarten: isVi ? 'Mầm non' : 'Kindergarten',
          },
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
