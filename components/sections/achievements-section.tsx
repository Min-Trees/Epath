'use client'

import { motion } from 'framer-motion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { useTranslations, useLocale } from 'next-intl'
import type { Locale } from '@/lib/cms-types'

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function AchievementsSection() {
  const t = useTranslations('common')
  const { data: cms } = useCmsContext()
  const locale = useLocale() as Locale
  const isVi = locale === 'vi'
  const items = cms.achievements

  if (items.length === 0) return null

  const cover = (item: { images: string[]; coverImage?: string }) =>
    item.coverImage && item.coverImage.length > 0 ? item.coverImage : item.images[0] || ''

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
            {/* Bilingual title – prefer CMS over i18n */}
            {cms.aboutContent?.introTitle
              ? pick(cms.aboutContent.introTitle, locale) + (isVi ? ' — Thành tích' : ' — Achievements')
              : (isVi ? 'Thành tích vượt trội' : 'Outstanding Achievements')}
          </h2>
          <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
            {isVi
              ? 'Những thành tích học sinh EPath đã đạt được trong các kỳ thi và chứng chỉ quốc tế.'
              : 'Outstanding achievements EPath students have attained in international examinations and certifications.'}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => {
            const title = pick(item.title, locale)
            const desc = pick(item.description, locale)
            const imageUrl = cover(item)
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.normal, delay: idx * 0.08, ease: easeOut }}
                className="rounded-2xl overflow-hidden shadow-md border border-[#DEDDD6] bg-white hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out"
                style={{ boxShadow: '0 8px 24px -8px rgba(30, 53, 112, 0.08)' }}
              >
                {imageUrl && (
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-[#20242B] mb-2">{title}</h3>
                  <p className="text-sm text-[#5C6069] leading-relaxed line-clamp-3">{desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
