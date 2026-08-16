import 'server-only'
import { getPageSections, type PageSection } from '@/lib/pages-repo'
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

export type SectionComponent = () => React.JSX.Element

const SECTION_RENDERERS: Record<string, SectionComponent> = {
  hero: () => <HeroSection />,
  intro: () => <HeroSection />, // intro fallback uses hero until a dedicated section is built
  coreValues: () => <CoreValuesSection />,
  learningPathways: () => <LearningPathwaysSection />,
  stepModel: () => <StepModelSection />,
  statistics: () => <StatisticsSection />,
  achievements: () => <AchievementsSection />,
  testimonials: () => <TestimonialsSection />,
  partners: () => <PartnersSection />,
  faqs: () => <FAQSection />,
  cta: () => <CTABanner />,
  // Sections without a dedicated component yet — fall back to a related one
  // so admin can still reorder freely without breaking the home page.
  vision: () => <CoreValuesSection />,
  mission: () => <CoreValuesSection />,
  whyEdmentum: () => <PartnersSection />,
  admissionSteps: () => <StepModelSection />,
  pricing: () => <CTABanner />,
  team: () => <TestimonialsSection />,
}

// Default order used when the admin hasn't configured anything yet (or when
// Firestore isn't configured at all). Keeps parity with the previous hardcoded
// layout in `app/[locale]/page.tsx`.
const DEFAULT_HOME_SECTIONS: { type: keyof typeof SECTION_RENDERERS; id: string }[] = [
  { type: 'hero', id: 'default-hero' },
  { type: 'coreValues', id: 'default-core-values' },
  { type: 'learningPathways', id: 'default-pathways' },
  { type: 'stepModel', id: 'default-steps' },
  { type: 'statistics', id: 'default-statistics' },
  { type: 'achievements', id: 'default-achievements' },
  { type: 'testimonials', id: 'default-testimonials' },
  { type: 'partners', id: 'default-partners' },
  { type: 'faqs', id: 'default-faqs' },
  { type: 'cta', id: 'default-cta' },
]

/**
 * Fetches the active page sections from Page Builder. Falls back to the
 * default order when Firestore isn't reachable or no sections have been
 * configured yet.
 */
export async function getActivePageSections(
  pageId: 'home'
): Promise<{ type: string; id: string }[]> {
  try {
    const sections = await getPageSections(pageId)
    const active = sections
      .filter((s: PageSection) => s.isActive)
      .sort((a: PageSection, b: PageSection) => a.order - b.order)
    if (active.length === 0) return DEFAULT_HOME_SECTIONS
    return active.map((s) => ({ type: s.type, id: s.id }))
  } catch (err) {
    console.warn(`[page-renderer] failed to load sections for ${pageId}:`, (err as Error).message)
    return DEFAULT_HOME_SECTIONS
  }
}

/**
 * Renders the home page sections according to Page Builder configuration.
 * Unknown / not-yet-implemented section types are silently dropped so that
 * admins can experiment without breaking the public site.
 */
export async function HomeSectionsRenderer() {
  const sections = await getActivePageSections('home')
  return (
    <>
      {sections.map(({ type, id }) => {
        const Renderer = SECTION_RENDERERS[type]
        if (!Renderer) return null
        return <Renderer key={id} />
      })}
    </>
  )
}