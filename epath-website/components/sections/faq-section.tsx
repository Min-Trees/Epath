'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'

const faqs = [
  { qKey: 'q1', aKey: 'a1' },
  { qKey: 'q2', aKey: 'a2' },
  { qKey: 'q3', aKey: 'a3' },
  { qKey: 'q4', aKey: 'a4' },
  { qKey: 'q5', aKey: 'a5' },
]

export function FAQSection() {
  const t = useTranslations('faq')

  return (
    <section className="py-20 surface-alt">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, delay: 0.1, ease: easeOut }}
          className="max-w-3xl mx-auto"
        >
          <Accordion
            type="single"
            collapsible
            className="w-full bg-white rounded-xl p-4 shadow-sm"
          >
            {faqs.map((faq) => (
              <AccordionItem key={faq.qKey} value={faq.qKey}>
                <AccordionTrigger className="text-left text-lg font-medium hover:text-[#3A53A3]">
                  {t(faq.qKey)}
                </AccordionTrigger>
                <AccordionContent className="leading-relaxed text-[#6B6B6B]">
                  {t(faq.aKey)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, delay: 0.2, ease: easeOut }}
          className="text-center mt-12"
        >
          <p className="text-[#6B6B6B] mb-4">{t('otherQuestion')}</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#F05A28] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#E04D1A] transition-colors duration-200"
          >
            {t('contactBtn')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
