'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import type { Locale } from '@/lib/cms-types'

interface Props {
  locale: Locale
  compact?: boolean
  translations: {
    title: string
    subtitle: string
    button: string
  }
}

export function ProgramsCta({ locale, compact, translations }: Props) {
  return (
    <section className={`${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'} bg-white border-t border-[#DEDDD6]`}>
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF0E9] text-[#C94F16] text-xs font-bold uppercase tracking-wider mb-3 border border-[#FDDDCF]">
            <Sparkles className="w-3.5 h-3.5 text-[#F26522]" />
            <span>{locale === 'vi' ? 'Đồng hành cùng tương lai con' : 'Partnering in Your Child’s Future'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2.5 tracking-tight">
            {translations.title}
          </h2>

          <p className="text-[#5C6069] mb-6 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
            {translations.subtitle}
          </p>

          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2.5 bg-[#F26522] hover:bg-[#C94F16] text-white px-7 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>{translations.button}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
