'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { usePublicCms } from '@/lib/use-public-cms'

export function AchievementsSection() {
  const t = useTranslations('common')
  const cms = usePublicCms()
  const items = cms.achievements

  if (items.length === 0) return null

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
            Thành tích vượt trội
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
            Những thành tích học sinh EPath đã đạt được trong các kỳ thi và chứng chỉ quốc tế.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: idx * 0.08, ease: easeOut }}
              className="rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white"
            >
              {item.images.length > 0 && (
                <div
                  className="aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${item.images[0]})` }}
                />
              )}
              <div className="p-5">
                <h3 className="font-bold text-[#231F20] mb-2">{item.title.vi}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed line-clamp-3">
                  {item.description.vi}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}