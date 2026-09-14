'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'

export function FAQSection() {
  const t = useTranslations('faq')
  const locale = useLocale()
  const { data: cms } = useCmsContext()
  const faqs = cms.faqs

  // Merge static (i18n) and CMS faqs. CMS takes priority if present.
  const staticFaqs = [
    { qKey: 'q1', aKey: 'a1' },
    { qKey: 'q2', aKey: 'a2' },
    { qKey: 'q3', aKey: 'a3' },
    { qKey: 'q4', aKey: 'a4' },
    { qKey: 'q5', aKey: 'a5' },
  ]

  if (faqs.length === 0) {
    return (
      <section className="py-20 bg-[#F6F5F1]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
              {t('title')}
            </h2>
            <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
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
              className="w-full bg-white rounded-2xl p-4 shadow-md border border-[#DEDDD6]"
              style={{ boxShadow: '0 8px 24px -8px rgba(30, 53, 112, 0.08)' }}
            >
              {staticFaqs.map((faq) => (
                <AccordionItem key={faq.qKey} value={faq.qKey}>
                  <AccordionTrigger className="text-left text-lg font-medium text-[#20242B] hover:text-[#2E4A9E]">
                    {t(faq.qKey)}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-[#5C6069]">
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
            <p className="text-[#5C6069] mb-4">{t('otherQuestion')}</p>
            <a
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-[#F26522] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#C94F16] transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg"
              style={{ boxShadow: '0 8px 20px -6px rgba(242, 101, 34, 0.45)' }}
            >
              {t('contactBtn')}
            </a>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      className="py-20 bg-[#F6F5F1] relative overflow-hidden"
      style={
        faqs.length > 0 && faqs[0]?.imageUrl
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(246, 245, 241, 0.94), rgba(246, 245, 241, 0.94)), url(${faqs[0].imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : undefined
      }
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
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
            className="w-full bg-white rounded-2xl p-4 shadow-md border border-[#DEDDD6]"
            style={{ boxShadow: '0 8px 24px -8px rgba(30, 53, 112, 0.08)' }}
          >
            {faqs.map((faq, idx) => {
              const qText = (locale === 'en' ? faq.question?.en : faq.question?.vi) || faq.question?.vi || faq.question?.en || ''
              const aText = (locale === 'en' ? faq.answer?.en : faq.answer?.vi) || faq.answer?.vi || faq.answer?.en || ''
              return (
                <AccordionItem key={faq.id ?? `cms-faq-${idx}`} value={faq.id ?? `cms-faq-${idx}`}>
                  <AccordionTrigger className="text-left text-lg font-medium text-[#20242B] hover:text-[#2E4A9E]">
                    {qText}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-[#5C6069]">
                    <RichTextRenderer html={aText} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, delay: 0.2, ease: easeOut }}
          className="text-center mt-12"
        >
          <p className="text-[#5C6069] mb-4">{t('otherQuestion')}</p>
          <a
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-[#F26522] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#C94F16] transition-all duration-300 ease-out hover:-translate-y-1 shadow-lg"
            style={{ boxShadow: '0 8px 20px -6px rgba(242, 101, 34, 0.45)' }}
          >
            {t('contactBtn')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}