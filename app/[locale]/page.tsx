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

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <CoreValuesSection />
      <LearningPathwaysSection />
      <StepModelSection />
      <StatisticsSection />
      <AchievementsSection />
      <TestimonialsSection />
      <PartnersSection />
      <FAQSection />
      <CTABanner />
    </>
  )
}