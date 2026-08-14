// Server-side data fetch for public pages. Falls back to static data
// (the existing hardcoded arrays and messages JSON) when Firestore is
// not configured, so the website keeps working during setup.
import 'server-only'
import {
  FaqsRepo,
  CoreValuesRepo,
  PathwaysRepo,
  ProgramsRepo,
  PartnersRepo,
  EventsRepo,
  AdmissionStepsRepo,
  AchievementsRepo,
  TeamMembersRepo,
} from './cms-repo'
import { getPageSections, type PageSection } from './pages-repo'
import type { Locale } from './cms-types'

export interface CmsBundle {
  configured: boolean
  faqs: Awaited<ReturnType<typeof FaqsRepo.listActive>>
  coreValues: Awaited<ReturnType<typeof CoreValuesRepo.listActive>>
  pathways: Awaited<ReturnType<typeof PathwaysRepo.listActive>>
  programs: Awaited<ReturnType<typeof ProgramsRepo.listActive>>
  partners: Awaited<ReturnType<typeof PartnersRepo.listActive>>
  events: Awaited<ReturnType<typeof EventsRepo.listActive>>
  admissionSteps: Awaited<ReturnType<typeof AdmissionStepsRepo.listActive>>
  achievements: Awaited<ReturnType<typeof AchievementsRepo.listActive>>
  teamMembers: Awaited<ReturnType<typeof TeamMembersRepo.listActive>>
}

export async function loadCmsBundle(): Promise<CmsBundle> {
  try {
    const [
      faqs,
      coreValues,
      pathways,
      programs,
      partners,
      events,
      admissionSteps,
      achievements,
      teamMembers,
    ] = await Promise.all([
      FaqsRepo.listActive(),
      CoreValuesRepo.listActive(),
      PathwaysRepo.listActive(),
      ProgramsRepo.listActive(),
      PartnersRepo.listActive(),
      EventsRepo.listActive(),
      AdmissionStepsRepo.listActive(),
      AchievementsRepo.listActive(),
      TeamMembersRepo.listActive(),
    ])
    return {
      configured: true,
      faqs,
      coreValues,
      pathways,
      programs,
      partners,
      events,
      admissionSteps,
      achievements,
      teamMembers,
    }
  } catch {
    return {
      configured: false,
      faqs: [],
      coreValues: [],
      pathways: [],
      programs: [],
      partners: [],
      events: [],
      admissionSteps: [],
      achievements: [],
      teamMembers: [],
    }
  }
}

export async function loadPageSections(pageId: string): Promise<PageSection[]> {
  try {
    return (await getPageSections(pageId as Parameters<typeof getPageSections>[0])).filter(
      (s) => s.isActive
    )
  } catch {
    return []
  }
}

/** Helper to pick a localized string. */
export function t(localized: { vi: string; en: string } | undefined, locale: Locale) {
  if (!localized) return ''
  return localized[locale] || localized.vi
}