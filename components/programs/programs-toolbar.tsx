'use client'

import { Search, X, Filter } from 'lucide-react'
import type { LevelDef } from './types'
import type { Locale } from '@/lib/cms-types'

interface Props {
  locale: Locale
  selectedLevel: string
  onChangeSelectedLevel: (level: string) => void
  searchQuery: string
  onChangeSearchQuery: (query: string) => void
  levelDefs: LevelDef[]
  translations: {
    all: string
    filter: string
    searchPlaceholder: string
    levels: Record<string, string>
  }
}

export function ProgramsToolbar({
  locale,
  selectedLevel,
  onChangeSelectedLevel,
  searchQuery,
  onChangeSearchQuery,
  levelDefs,
  translations,
}: Props) {
  const isVi = locale === 'vi'

  return (
    <section className="py-2.5 sm:py-3 bg-[#F6F5F1]/95 sticky top-[68px] sm:top-[74px] z-30 backdrop-blur-md border-b border-[#DEDDD6] shadow-xs">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Level Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            <div className="flex items-center gap-1 text-xs font-bold text-[#5C6069] mr-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5 text-[#2E4A9E]" />
              <span className="hidden md:inline">{translations.filter}:</span>
            </div>

            <button
              type="button"
              onClick={() => onChangeSelectedLevel('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                selectedLevel === 'all'
                  ? 'bg-[#1E3570] text-white shadow-xs'
                  : 'bg-white text-[#5C6069] border border-[#DEDDD6] hover:text-[#20242B] hover:border-[#2E4A9E]/40'
              }`}
            >
              {translations.all}
            </button>

            {levelDefs.map((lvl) => {
              const isSelected = selectedLevel === lvl.id
              const LevelIcon = lvl.icon
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => onChangeSelectedLevel(lvl.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 flex-shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-[#1E3570] text-white shadow-xs'
                      : 'bg-white text-[#5C6069] border border-[#DEDDD6] hover:text-[#20242B] hover:border-[#2E4A9E]/40'
                  }`}
                >
                  <LevelIcon
                    className="w-3.5 h-3.5"
                    style={{ color: isSelected ? '#8DC63F' : lvl.color }}
                  />
                  <span>{translations.levels[lvl.id] || lvl.id}</span>
                </button>
              )
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-64 max-w-xs flex-shrink-0">
            <Search className="w-3.5 h-3.5 text-[#5C6069] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              placeholder={translations.searchPlaceholder}
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-[#DEDDD6] rounded-full text-xs text-[#20242B] placeholder:text-[#5C6069]/70 focus:outline-none focus:border-[#2E4A9E] focus:ring-1 focus:ring-[#2E4A9E]/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onChangeSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-black/5 text-[#5C6069]"
                aria-label="Xóa tìm kiếm"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

