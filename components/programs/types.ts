import type { ComponentType } from 'react'

export type ViewMode = 'roadmap' | 'catalog' | 'dual'

export type DisplayLayout = 'grid' | 'list'

export type LayoutDensity = 'comfortable' | 'compact'

export interface SectionVisibility {
  intro: boolean
  stages: boolean
  catalog: boolean
  roadmap: boolean
  edoptions: boolean
  personalized: boolean
  cta: boolean
}

export interface LevelDef {
  id: string
  labelKey: string
  icon: ComponentType<{ className?: string; style?: React.CSSProperties }>
  color: string
  bgColor: string
  lightBg: string
  borderColor: string
}

export interface ProgramsLayoutConfig {
  viewMode: ViewMode
  displayLayout: DisplayLayout
  layoutDensity: LayoutDensity
  sections: SectionVisibility
}

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  intro: true,
  stages: true,
  catalog: true,
  roadmap: true,
  edoptions: true,
  personalized: true,
  cta: true,
}

export const DEFAULT_LAYOUT_CONFIG: ProgramsLayoutConfig = {
  viewMode: 'catalog',
  displayLayout: 'grid',
  layoutDensity: 'comfortable',
  sections: DEFAULT_SECTION_VISIBILITY,
}
