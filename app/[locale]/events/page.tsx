'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { usePublicCms } from '@/lib/use-public-cms'
import type { CmsEvent } from '@/lib/cms-types'

export default function EventsPage() {
  const t = useTranslations('events')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const cms = usePublicCms()
  const events = cms.events

  return (
    <>
      <section
        className="pt-32 pb-20"
        style={{ background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)' }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-20 surface-alt">
        <div className="container mx-auto px-4">
          {events.length === 0 ? (
            <p className="text-center text-[#6B6B6B] py-12">Chưa có sự kiện nào.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {events.map((event, index) => {
                const accent = accentCycle[index % accentCycle.length]
                const title = event.title[locale as 'vi' | 'en'] || event.title.vi
                const desc = event.shortDescription[locale as 'vi' | 'en'] || event.shortDescription.vi
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewViewport}
                    transition={{ duration: duration.normal, delay: index * 0.08, ease: easeOut }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow duration-200"
                  >
                    <div
                      className="aspect-video flex items-center justify-center"
                      style={{ backgroundColor: accent.bg }}
                    >
                      <Calendar className="w-16 h-16" style={{ color: accent.color, opacity: 0.3 }} />
                    </div>
                    <div className="p-6">
                      <span
                        className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-3"
                        style={{ backgroundColor: accent.bg, color: accent.color }}
                      >
                        {event.status}
                      </span>
                      <h3 className="text-xl font-bold text-[#231F20] mb-3">
                        {title}
                      </h3>
                      {desc && (
                        <p className="text-sm text-[#6B6B6B] mb-3 line-clamp-3">{desc}</p>
                      )}
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                          <Calendar className="w-4 h-4 text-[#8BC53F]" />
                          <span>{event.startDate}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2 text-sm text-[#6B6B6B]">
                            <MapPin className="w-4 h-4 text-[#F05A28]" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                      {event.registerUrl ? (
                        <a href={event.registerUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-[#F05A28] hover:bg-[#E04D1A]">
                            {t('register')}
                          </Button>
                        </a>
                      ) : (
                        <Button className="w-full bg-[#F05A28] hover:bg-[#E04D1A]">
                          {t('register')}
                        </Button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#231F20] mb-4">{t('cta.title')}</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-[#3A53A3] hover:bg-[#2E4389]">
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}