'use client'

import { motion } from 'framer-motion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import type { Locale } from '@/lib/cms-types'

function pick(v: { vi: string; en: string } | undefined, locale: Locale): string {
  if (!v) return ''
  return v[locale] || v.vi || v.en || ''
}

export function AchievementsSection() {
  const t = useTranslations('common')
  const { data: cms } = useCmsContext()
  const params = useParams()
  const locale = ((params.locale as string) || 'vi') as Locale
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
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {/* Bilingual title – prefer CMS over i18n */}
            {cms.aboutContent?.introTitle
              ? pick(cms.aboutContent.introTitle, locale) + ' — Thành tích'
              : 'Thành tích vượt trội'}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            Những thành tích học sinh EPath đã đạt được trong các kỳ thi và chứng chỉ quốc tế.
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
                className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white"
              >
                {imageUrl && (
                  <div
                    className="aspect-video bg-cover bg-center"
                    style={{ backgroundImage: `url(${imageUrl})` }}
                  />
                )}
                <div className="p-5">
                  <h3 className="font-bold text-[#231F20] mb-2">{title}</h3>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-3">{desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
