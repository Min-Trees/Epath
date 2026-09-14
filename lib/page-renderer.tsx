import 'server-only'
import { getPageSections, type PageSection, type PageSlug } from '@/lib/pages-repo'
import { loadHeroContentForPage } from '@/lib/cms-data'
import { HeroSection } from '@/components/sections/hero-section'
import { CoreValuesSection } from '@/components/sections/core-values-section'
import { LearningPathwaysSection } from '@/components/sections/learning-pathways-section'
import { StepModelSection } from '@/components/sections/step-model-section'
import { StatisticsSection } from '@/components/sections/statistics-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { PartnersSection } from '@/components/sections/partners-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABanner } from '@/components/sections/cta-banner'
import { AchievementsSection } from '@/components/sections/achievements-section'

type SectionComponent = (props: { initialHero?: Record<string, unknown> | null }) => React.JSX.Element

// Map each section type to its underlying component. We expose a single
// canonical component per visual block so duplicate section types (e.g.
// 'hero' + 'intro', 'vision' + 'mission', 'whyEdmentum') automatically
// share the same renderer and dedupe correctly downstream.
const SECTION_COMPONENT: Record<string, SectionComponent> = {
  hero: ({ initialHero }) => <HeroSection initialHero={initialHero ?? null} />,
  intro: ({ initialHero }) => <HeroSection initialHero={initialHero ?? null} />,
  coreValues: () => <CoreValuesSection />,
  learningPathways: () => <LearningPathwaysSection />,
  stepModel: () => <StepModelSection />,
  statistics: () => <StatisticsSection />,
  achievements: () => <AchievementsSection />,
  testimonials: () => <TestimonialsSection />,
  partners: () => <PartnersSection />,
  faqs: () => <FAQSection />,
  cta: () => <CTABanner />,
  vision: () => <CoreValuesSection />,
  mission: () => <CoreValuesSection />,
  whyEdmentum: () => <PartnersSection />,
  admissionSteps: () => <StepModelSection />,
  pricing: () => <CTABanner />,
  team: () => <TestimonialsSection />,
}

// Canonical key for each visual block. Multiple section types that share
// the same renderer collapse to the same key.
const SECTION_DEDUP_KEY: Record<string, string> = {
  hero: 'hero',
  intro: 'hero',
  coreValues: 'coreValues',
  vision: 'coreValues',
  mission: 'coreValues',
  learningPathways: 'learningPathways',
  stepModel: 'stepModel',
  admissionSteps: 'stepModel',
  statistics: 'statistics',
  achievements: 'achievements',
  testimonials: 'testimonials',
  team: 'testimonials',
  partners: 'partners',
  whyEdmentum: 'partners',
  faqs: 'faqs',
  cta: 'cta',
  pricing: 'cta',
}

const DEFAULT_SECTIONS: Record<PageSlug, string[]> = {
  home: [
    'hero',
    'coreValues',
    'learningPathways',
    'stepModel',
    'statistics',
    'achievements',
    'testimonials',
    'partners',
    'faqs',
    'cta',
  ],
  about: ['hero', 'coreValues', 'statistics', 'cta'],
  programs: ['hero', 'learningPathways', 'testimonials', 'faq' as never, 'cta'],
  partners: ['hero', 'partners', 'testimonials', 'cta'],
  admissions: ['hero', 'stepModel', 'faqs', 'cta'],
  events: ['hero', 'cta'],
}

/**
 * Fetches the active page sections from Page Builder. Falls back to the
 * default order when Firestore isn't reachable or no sections have been
 * configured yet.
 */
export async function getActivePageSections(pageId: PageSlug): Promise<string[]> {
  try {
    const sections = await getPageSections(pageId)
    const active = sections
      .filter((s: PageSection) => s.isActive)
      .sort((a: PageSection, b: PageSection) => a.order - b.order)
    if (active.length === 0) return DEFAULT_SECTIONS[pageId] ?? []
    return active.map((s) => s.type)
  } catch (err) {
    console.warn(`[page-renderer] failed to load sections for ${pageId}:`, (err as Error).message)
    return DEFAULT_SECTIONS[pageId] ?? []
  }
}

/**
 * Generic renderer. Unknown section types are silently dropped so admins
 * can experiment without breaking the public site.
 *
 * IMPORTANT: To prevent duplicate sections (e.g., multiple HeroSections or
 * CoreValuesSections), we deduplicate by the *visual block key*. This
 * collapses aliases that point at the same component, e.g.:
 *   - 'hero' and 'intro' both render HeroSection
 *   - 'vision' and 'mission' both render CoreValuesSection
 *   - 'whyEdmentum' renders PartnersSection
 *   - 'admissionSteps' renders StepModelSection
 *   - 'team' renders TestimonialsSection
 *   - 'pricing' renders CTABanner
 */
export async function PageSectionsRenderer({ pageId }: { pageId: PageSlug }) {
  const types = await getActivePageSections(pageId)

  // Pre-fetch hero content server-side so the HeroSection renders with
  // the correct video/image on the first paint instead of flashing the
  // gradient fallback while the client-side CMS context catches up.
  const hasHero = types.some(
    (t) => SECTION_DEDUP_KEY[t] === 'hero'
  )
  const initialHero = hasHero ? await loadHeroContentForPage(pageId) : null

  const seenKeys = new Set<string>()
  const uniqueTypes: string[] = []

  for (const type of types) {
    const Renderer = SECTION_COMPONENT[type]
    if (!Renderer) continue
    const dedupKey = SECTION_DEDUP_KEY[type] ?? type
    if (seenKeys.has(dedupKey)) continue
    seenKeys.add(dedupKey)
    uniqueTypes.push(type)
  }

  return (
    <>
      {uniqueTypes.map((type, idx) => {
        const Renderer = SECTION_COMPONENT[type]
        if (!Renderer) return null
        return <Renderer key={`${pageId}-${type}-${idx}`} initialHero={initialHero} />
      })}
    </>
  )
}

/**
 * Backwards-compatible alias for the home page.
 */
export async function HomeSectionsRenderer() {
  return <PageSectionsRenderer pageId="home" />
}