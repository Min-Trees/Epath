'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { ArrowRight, Route, Award, Laptop, Shield, FileText, Network, BookOpen } from 'lucide-react'
import { useParams } from 'next/navigation'
import { duration, easeOut, staggerContainer, useSectionActive } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'

const coreValues = [
  { number: '01', key: 'continuousPath', icon: Route },
  { number: '02', key: 'usStandard', icon: Award },
  { number: '03', key: 'blended', icon: Laptop },
  { number: '04', key: 'parentsRelax', icon: Shield },
  { number: '05', key: 'portfolio', icon: FileText },
  { number: '06', key: 'ecosystem', icon: Network },
]

/**
 * Performance-tuned rebuild of core values.
 *
 *   - 1 framer-motion wrapper per card (entrance only). Internal elements
 *     (number / icon) animate via CSS keyframes triggered by the parent
 *     `[data-active]` attribute.
 *   - Hover handled in CSS via the .hover-card utility so transitions
 *     stay on the compositor.
 *
 * Previously each card had 4 nested motion components, hitting ~24
 * framer-motion instances per page render.
 */

export function CoreValuesSection() {
  const t = useTranslations('values')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.15 })

  return (
    <section ref={sectionRef} className="values-section py-20 surface-alt">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {coreValues.map((value, index) => {
            const accent = accentCycle[index % accentCycle.length]
            return (
              <motion.div
                key={value.number}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: duration.slow, ease: easeOut },
                  },
                }}
                style={{
                  backgroundColor: accent.bg,
                  borderColor: accent.color,
                  // CSS variables used by the inner animated children
                  ['--accent' as string]: accent.color,
                  ['--reveal-delay' as string]: `${0.08 * index}s`,
                }}
                className="values-card group p-6 rounded-xl border-2 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="values-icon w-14 h-14 rounded-lg flex items-center justify-center shrink-0">
                    <value.icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="values-number text-sm font-semibold mb-1">
                      {value.number}
                    </div>
                    <h3 className="text-xl font-semibold text-[#231F20] mb-2">
                      {t(value.key)}
                    </h3>
                    <p className="values-desc text-sm leading-relaxed">
                      {t(`${value.key}Desc`)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 values-cta opacity-0 group-hover:opacity-100">
                  <span className="text-sm font-medium">{t('learnMore')}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        <div className="text-center mt-12">
          <a
            href={`/${locale}/programs`}
            className="inline-flex items-center gap-2 text-[#3A53A3] font-semibold hover:text-[#2E4389] transition-colors duration-200"
          >
            <BookOpen className="w-5 h-5" />
            {t('viewAll')}
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  )
}
