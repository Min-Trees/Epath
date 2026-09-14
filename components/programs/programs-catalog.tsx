'use client'

import { motion } from 'framer-motion'
import { ArrowRight, BookOpen, Clock, Eye, Sparkles, AlertCircle, RotateCcw, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import type { Program, Locale } from '@/lib/cms-types'
import type { DisplayLayout, LevelDef } from './types'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'

interface Props {
  locale: Locale
  programs: Program[]
  filteredLevels: LevelDef[]
  displayLayout?: DisplayLayout
  searchQuery: string
  onResetSearch: () => void
  onSelectProgram: (program: Program) => void
  compact?: boolean
  translations: {
    curriculum: string
    register: string
    viewDetails: string
    noProgramsFound: string
    clearFilters: string
    levels: Record<string, string>
  }
}

const DEFAULT_LEVEL_IMAGES: Record<string, string> = {
  kindergarten: '/images/programs/program-kindy.jpg',
  elementary: '/images/programs/program-elementary.jpg',
  middle: '/images/programs/program-middle.jpg',
  high: '/images/programs/program-high.jpg',
}

function formatAgeRange(ageRange: string | undefined, locale: Locale): string {
  if (!ageRange) return ''
  if (locale === 'vi') return ageRange

  return ageRange
    .replace(/tuổi/gi, 'years old')
    .replace(/Lớp\s+(\d+)\s*–\s*(\d+)/gi, 'Grades $1–$2')
    .replace(/Lớp\s+(\d+)/gi, 'Grade $1')
    .replace(/Mầm non\s*–\s*Lớp\s*12/gi, 'K–12 (Kindergarten – Grade 12)')
    .replace(/Mầm non/gi, 'Kindergarten')
}

export function ProgramsCatalog({
  locale,
  programs,
  filteredLevels,
  displayLayout = 'grid',
  searchQuery,
  onResetSearch,
  onSelectProgram,
  compact,
  translations,
}: Props) {
  const isVi = locale === 'vi'

  // Filter programs by search query
  const query = searchQuery.trim().toLowerCase()
  const filterBySearch = (list: Program[]) => {
    if (!query) return list
    return list.filter((p) => {
      const titleVi = p.title?.vi?.toLowerCase() || ''
      const titleEn = p.title?.en?.toLowerCase() || ''
      const descVi = p.shortDescription?.vi?.toLowerCase() || ''
      const descEn = p.shortDescription?.en?.toLowerCase() || ''
      const age = p.ageRange?.toLowerCase() || ''
      return (
        titleVi.includes(query) ||
        titleEn.includes(query) ||
        descVi.includes(query) ||
        descEn.includes(query) ||
        age.includes(query)
      )
    })
  }

  // Count total matching
  const totalMatching = filteredLevels.reduce((acc, lvl) => {
    const lvlProgs = programs.filter((p) => p.level === lvl.id)
    return acc + filterBySearch(lvlProgs).length
  }, 0)

  if (totalMatching === 0 && searchQuery) {
    return (
      <section className={`${compact ? 'py-12' : 'py-20'} bg-white`}>
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center p-8 bg-[#F6F5F1] rounded-3xl border border-[#DEDDD6]">
            <AlertCircle className="w-12 h-12 text-[#F26522] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#20242B] mb-2">
              {translations.noProgramsFound}
            </h3>
            <p className="text-sm text-[#5C6069] mb-6">
              {isVi
                ? `Không có kết quả nào phù hợp với từ khóa "${searchQuery}". Hãy thử tìm với từ khóa khác.`
                : `No programs matched "${searchQuery}". Try another keyword.`}
            </p>
            <button
              type="button"
              onClick={onResetSearch}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4A9E] text-white text-xs font-bold shadow-md hover:bg-[#1E3570] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{translations.clearFilters}</span>
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'} bg-white`}>
      <div className="container mx-auto px-4">
        <div className="space-y-10 sm:space-y-12 max-w-6xl mx-auto">
          {filteredLevels.map((level, levelIndex) => {
            const levelPrograms = filterBySearch(programs.filter((p) => p.level === level.id))
            if (levelPrograms.length === 0 && searchQuery) return null

            const LevelIcon = level.icon

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: levelIndex * 0.06, ease: easeOut }}
              >
                {/* Level Title Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-xs flex-shrink-0"
                    style={{ backgroundColor: level.bgColor }}
                  >
                    <LevelIcon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: level.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-[#20242B]">
                        {translations.levels[level.id] || level.id}
                      </h2>
                      <span className="px-2 py-0.2 rounded-full text-xs font-bold bg-[#F6F5F1] border border-[#DEDDD6] text-[#5C6069]">
                        {levelPrograms.length} {isVi ? 'chương trình' : 'programs'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#5C6069]">{translations.curriculum}</p>
                  </div>
                </div>

                {/* Programs List / Grid */}
                {levelPrograms.length === 0 ? (
                  <div
                    className="rounded-2xl border p-6 bg-white shadow-xs"
                    style={{ borderColor: `${level.color}30` }}
                  >
                    <h3 className="text-lg font-bold mb-1.5" style={{ color: level.color }}>
                      {translations.levels[level.id]}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C6069] mb-3">
                      {isVi
                        ? 'Chương trình học đang được cập nhật thêm môn chuyên sâu.'
                        : 'Curriculum is being updated with additional specialized subjects.'}
                    </p>
                    <Link
                      href={`/${locale}/admissions?program=${level.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold hover:gap-2.5 transition-all duration-300"
                      style={{ color: level.color }}
                    >
                      <span>{translations.register}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : displayLayout === 'grid' ? (
                  /* GRID VIEW (2 - 3 Columns) */
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {levelPrograms.map((p) => {
                      const title = p.title[locale] || p.title.vi || ''
                      const shortDesc = p.shortDescription[locale] || p.shortDescription.vi || ''
                      const cardImage = p.imageUrl || DEFAULT_LEVEL_IMAGES[p.level] || '/images/programs/program-kindy.jpg'
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-2xl border border-[#DEDDD6] hover:border-[#2E4A9E]/30 overflow-hidden transition-all duration-400 hover:shadow-lg hover:-translate-y-1 group flex flex-col justify-between"
                        >
                          {/* Top Image Banner */}
                          <div className="relative w-full h-44 sm:h-48 overflow-hidden bg-[#F6F5F1]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={cardImage}
                              alt={title}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                const fallback = DEFAULT_LEVEL_IMAGES[p.level] || '/images/programs/program-kindy.jpg'
                                if (e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback
                                }
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                            <div
                              className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs backdrop-blur-md"
                              style={{ backgroundColor: `${level.color}E6` }}
                            >
                              {translations.levels[level.id] || level.id}
                            </div>
                            {p.ageRange && (
                              <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur-xs text-[#20242B] border border-[#DEDDD6] shadow-2xs">
                                {formatAgeRange(p.ageRange, locale)}
                              </span>
                            )}
                          </div>

                          {/* Card Content */}
                          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 onClick={() => onSelectProgram(p)} className="text-base font-bold mb-1.5 text-[#20242B] group-hover:text-[#2E4A9E] transition-colors duration-300 cursor-pointer">
                                {title}
                              </h3>
                              <div className="text-[#5C6069] mb-3 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                                <RichTextRenderer html={shortDesc} compact />
                              </div>

                              {/* Highlights badges */}
                              {p.highlights && p.highlights.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {p.highlights.slice(0, 2).map((h, hi) => {
                                    const text = typeof h === 'string' ? h : (h[locale] || h.vi || h.en)
                                    if (!text) return null
                                    return (
                                      <span
                                        key={hi}
                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F6F5F1] text-[#20242B] border border-[#DEDDD6]"
                                      >
                                        <CheckCircle2 className="w-3 h-3 text-[#5C9024] shrink-0" />
                                        <span className="truncate max-w-[200px]">{text}</span>
                                      </span>
                                    )
                                  })}
                                </div>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="pt-3 border-t border-[#DEDDD6]/60 flex items-center justify-between gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => onSelectProgram(p)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EAEFFB] text-[#2E4A9E] hover:bg-[#2E4A9E] hover:text-white transition-all duration-200"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>{translations.viewDetails}</span>
                              </button>

                              <Link
                                href={`/${locale}/admissions?program=${p.slug || p.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs bg-[#FEF0E9] text-[#F26522] hover:bg-[#F26522] hover:text-white transition-all duration-200"
                              >
                                <span>{translations.register}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* LIST VIEW (Horizontal rows) */
                  <div className="space-y-3">
                    {levelPrograms.map((p) => {
                      const title = p.title[locale] || p.title.vi || ''
                      const shortDesc = p.shortDescription[locale] || p.shortDescription.vi || ''
                      const cardImage = p.imageUrl || DEFAULT_LEVEL_IMAGES[p.level] || '/images/programs/program-kindy.jpg'
                      return (
                        <div
                          key={p.id}
                          className="bg-white rounded-xl p-4 border border-[#DEDDD6] hover:border-[#2E4A9E]/30 hover:shadow-sm transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                        >
                          <div className="flex items-start gap-3.5 min-w-0 flex-1">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F6F5F1] flex-shrink-0 overflow-hidden relative border border-[#DEDDD6]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={cardImage}
                                alt={title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                                onError={(e) => {
                                  const fallback = DEFAULT_LEVEL_IMAGES[p.level] || '/images/programs/program-kindy.jpg'
                                  if (e.currentTarget.src !== fallback) {
                                    e.currentTarget.src = fallback
                                  }
                                }}
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span
                                  className="px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                  style={{ backgroundColor: level.bgColor, color: level.color }}
                                >
                                  {translations.levels[level.id]}
                                </span>
                                {p.ageRange && (
                                  <span className="text-xs text-[#5C6069] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-[#F26522]" />
                                    {formatAgeRange(p.ageRange, locale)}
                                  </span>
                                )}
                              </div>
                              <h3
                                onClick={() => onSelectProgram(p)}
                                className="text-sm sm:text-base font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors truncate cursor-pointer"
                              >
                                {title}
                              </h3>
                              <div className="text-xs text-[#5C6069] line-clamp-2">
                                <RichTextRenderer html={shortDesc} compact />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#DEDDD6]">
                            <button
                              type="button"
                              onClick={() => onSelectProgram(p)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EAEFFB] text-[#2E4A9E] hover:bg-[#2E4A9E] hover:text-white transition-all duration-200"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>{translations.viewDetails}</span>
                            </button>
                            <Link
                              href={`/${locale}/admissions?program=${p.slug || p.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF0E9] hover:bg-[#F26522] text-[#F26522] hover:text-white text-xs font-bold transition-all duration-200"
                            >
                              <span>{translations.register}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
