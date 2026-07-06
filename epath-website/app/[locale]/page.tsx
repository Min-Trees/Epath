import { getTranslations } from 'next-intl/server'
import { HeroSection } from '@/components/sections/hero-section'
import { CoreValuesSection } from '@/components/sections/core-values-section'
import { LearningPathwaysSection } from '@/components/sections/learning-pathways-section'
import { StepModelSection } from '@/components/sections/step-model-section'
import { StatisticsSection } from '@/components/sections/statistics-section'
import { TestimonialsSection } from '@/components/sections/testimonials-section'
import { PartnersSection } from '@/components/sections/partners-section'
import { FAQSection } from '@/components/sections/faq-section'
import { CTABanner } from '@/components/sections/cta-banner'

export default async function HomePage() {
  return (
    <>
      <HeroSection />
      <CoreValuesSection />
      <LearningPathwaysSection />
      <StepModelSection />
      <StatisticsSection />
      <TestimonialsSection />
      <PartnersSection />
      <FAQSection />
      <CTABanner />
    </>
  )
}
