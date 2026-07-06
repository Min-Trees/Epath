'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Filter, Sprout, Book, GraduationCap, Trophy, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

const programs = [
  { id: 'kindergarten', icon: Sprout, color: '#3A53A3', bgColor: 'rgb(230, 236, 255)' },
  { id: 'elementary', icon: Book, color: '#8BC53F', bgColor: 'rgb(243, 250, 224)' },
  { id: 'middle', icon: GraduationCap, color: '#F05A28', bgColor: 'rgb(255, 243, 237)' },
  { id: 'high', icon: Trophy, color: '#3A53A3', bgColor: 'rgb(230, 236, 255)' },
]

export default function ProgramsPage() {
  const t = useTranslations('programs')
  const params = useParams()
  const locale = params.locale as string || 'vi'
  const [selectedLevel, setSelectedLevel] = useState<string>('all')

  const filteredPrograms = selectedLevel === 'all' ? programs : programs.filter(p => p.id === selectedLevel)

  return (
    <>
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#3A53A3] via-[#3A53A3] to-[#2E4389]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#6B6B6B]" />
              <span className="font-medium text-[#231F20]">{t('filter')}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant={selectedLevel === 'all' ? 'default' : 'outline'} onClick={() => setSelectedLevel('all')}>{t('all')}</Button>
              {programs.map((p) => (
                <Button key={p.id} variant={selectedLevel === p.id ? 'default' : 'outline'} onClick={() => setSelectedLevel(p.id)}>{t(`levels.${p.id}`)}</Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {filteredPrograms.map((level, levelIndex) => (
              <motion.div key={level.id} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: levelIndex * 0.08 }}>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: level.bgColor }}>
                    <level.icon className="w-8 h-8" style={{ color: level.color }} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-[#231F20]">{t(`levels.${level.id}`)}</h2>
                    <p className="text-[#6B6B6B]">{t('curriculum')}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="rounded-xl border-2 p-6 transition-all hover:shadow-lg bg-white" style={{ borderColor: level.color }}>
                    <h3 className="text-xl font-bold mb-2" style={{ color: level.color }}>Base Path</h3>
                    <p className="text-[#6B6B6B] mb-4">Program description</p>
                    <Link href={`/${locale}/admissions?program=${level.id}`} className="inline-flex items-center gap-2 font-medium" style={{ color: level.color }}>
                      {t('register')}<ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#231F20] mb-4">{t('cta.title')}</h2>
          <p className="text-[#6B6B6B] mb-8 max-w-xl mx-auto">{t('cta.subtitle')}</p>
          <Link href={`/${locale}/contact`}>
            <Button size="lg" className="bg-[#F05A28] hover:bg-[#E04D1A]">{t('cta.button')}<ArrowRight className="ml-2 w-5 h-5" /></Button>
          </Link>
        </div>
      </section>
    </>
  )
}
