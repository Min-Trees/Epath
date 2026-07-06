'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { ExternalLink, Award, BookOpen, Wrench, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'

const partners = [
  { name: 'Edmentum International', logo: 'Ed', link: 'https://www.edmentum.com' },
  { name: 'Cambridge Assessment', logo: 'Cam', link: 'https://www.cambridgeenglish.org' },
  { name: 'Cognia', logo: 'Cog', link: 'https://www.cognia.org' },
]

export default function PartnersPage() {
  const t = useTranslations('partnersPage')
  const tFeature = useTranslations('partnersPage.featureList')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'

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

      <section className="py-12 surface-alt">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#3A53A3]/10 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-[#3A53A3]" />
              </div>
              <div>
                <h3 className="font-bold text-[#231F20] mb-1">{t('curriculum.title')}</h3>
                <p className="text-sm text-[#6B6B6B]">{t('curriculum.desc')}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#8BC53F]/10 rounded-lg flex items-center justify-center shrink-0">
                <Award className="w-6 h-6 text-[#8BC53F]" />
              </div>
              <div>
                <h3 className="font-bold text-[#231F20] mb-1">{t('certification.title')}</h3>
                <p className="text-sm text-[#6B6B6B]">{t('certification.desc')}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F05A28]/10 rounded-lg flex items-center justify-center shrink-0">
                <Wrench className="w-6 h-6 text-[#F05A28]" />
              </div>
              <div>
                <h3 className="font-bold text-[#231F20] mb-1">{t('lab.title')}</h3>
                <p className="text-sm text-[#6B6B6B]">{t('lab.desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {partners.map((partner, index) => {
              const accent = accentCycle[index % accentCycle.length]
              return (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.normal, ease: easeOut }}
                  className={`grid lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div
                      className="w-32 h-32 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: accent.bg }}
                    >
                      <span
                        className="text-2xl font-bold"
                        style={{ color: accent.color }}
                      >
                        {partner.logo}
                      </span>
                    </div>
                    <h2 className="text-3xl font-bold text-[#231F20] mb-4">
                      {partner.name}
                    </h2>
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[#3A53A3] font-medium hover:text-[#2E4389] transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {t('visitWebsite')}
                    </a>
                  </div>
                  <div
                    className={`rounded-2xl p-8 ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                    style={{ backgroundColor: accent.bg }}
                  >
                    <h3 className="font-bold mb-4" style={{ color: accent.color }}>
                      {t('features')}
                    </h3>
                    <ul className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: accent.color }}
                          >
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-[#6B6B6B]">
                            {tFeature(`f${i}` as 'f1' | 'f2' | 'f3' | 'f4')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-[#F05A28] hover:bg-[#E04D1A]">
              {t('cta.button')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
