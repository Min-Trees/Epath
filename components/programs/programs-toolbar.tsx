'use client'

import { Filter } from 'lucide-react'
import type { LevelDef } from './types'
import type { Locale } from '@/lib/cms-types'

interface Props {
  locale: Locale
  selectedLevel: string
  onChangeSelectedLevel: (level: string) => void
  searchQuery?: string
  onChangeSearchQuery?: (query: string) => void
  levelDefs: LevelDef[]
  translations: {
    all: string
    filter: string
    searchPlaceholder?: string
    levels: Record<string, string>
  }
}

export function ProgramsToolbar({
  locale,
  selectedLevel,
  onChangeSelectedLevel,
  levelDefs,
  translations,
}: Props) {
  const isVi = locale === 'vi'

  return (
    <section className="py-2.5 sm:py-3 bg-[#F6F5F1] border-b border-[#DEDDD6]">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-bold text-[#5C6069] mr-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-[#2E4A9E]" />
            <span>{translations.filter.replace(/:+$/, '')}:</span>
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
      </div>
    </section>
  )
}
