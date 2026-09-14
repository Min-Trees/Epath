'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { Compass, Sparkles } from 'lucide-react'

interface Props {
  p1: string
  p2: string
  compact?: boolean
}

export function ProgramsIntro({ p1, p2, compact }: Props) {
  const locale = useLocale()
  const isVi = locale === 'vi'

  return (
    <section className={`${compact ? 'py-6 sm:py-8' : 'py-8 sm:py-12'} bg-white border-b border-[#DEDDD6]`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="max-w-3xl mx-auto space-y-3 text-[#5C6069] leading-relaxed text-center"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3 h-3" />
            <span>{isVi ? 'Định hướng giáo dục bền vững' : 'Sustainable Educational Direction'}</span>
          </div>
          <p className="font-semibold text-[#20242B] text-base sm:text-lg leading-snug">
            {p1}
          </p>
          <p className="text-sm sm:text-base text-[#5C6069] leading-relaxed">
            {p2}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
