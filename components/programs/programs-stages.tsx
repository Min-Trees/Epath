'use client'

import { motion } from 'framer-motion'
import { BookOpen, Sparkles, Info, CheckCircle2 } from 'lucide-react'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'

interface Props {
  foundation: {
    title: string
    desc: string
    goalsTitle: string
    goals: string[]
    platformDesc: string
    note: string
  }
  advanced: {
    title: string
    desc: string
  }
  compact?: boolean
}

export function ProgramsStages({ foundation, advanced, compact }: Props) {
  return (
    <section className={`${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'} bg-[#F6F5F1] border-b border-[#DEDDD6]`}>
      <div className="container mx-auto px-4">
        {/* Foundation Stage Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.slow, ease: easeOut }}
          className={`max-w-3xl mx-auto ${compact ? 'mb-6 p-5' : 'mb-8 p-6 sm:p-7'} bg-white rounded-2xl border border-[#DEDDD6] shadow-xs hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#2E4A9E]/10 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-[#2E4A9E]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E4A9E]">
                Giai đoạn 01
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#20242B]">
                {foundation.title}
              </h2>
            </div>
          </div>

          <p className="text-[#5C6069] leading-relaxed mb-4 text-sm sm:text-base">
            {foundation.desc}
          </p>

          <p className="text-xs font-bold uppercase tracking-wider text-[#20242B] mb-2.5">
            {foundation.goalsTitle}
          </p>

          <ul className="grid sm:grid-cols-2 gap-2 mb-4">
            {foundation.goals.map((goal, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-[#F6F5F1] text-xs sm:text-sm text-[#20242B]"
              >
                <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 text-[#2E4A9E] flex-shrink-0" />
                <span className="font-medium">{goal}</span>
              </li>
            ))}
          </ul>

          <p className="text-[#5C6069] leading-relaxed mb-3 text-xs sm:text-sm">
            {foundation.platformDesc}
          </p>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#2E4A9E]/5 border-l-3 border-[#2E4A9E] text-xs sm:text-sm text-[#20242B]">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#2E4A9E]" />
            <span>{foundation.note}</span>
          </div>
        </motion.div>

        {/* Advanced Stage Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.slow, delay: 0.1, ease: easeOut }}
          className={`max-w-3xl mx-auto ${compact ? 'p-5' : 'p-6 sm:p-7'} bg-white rounded-2xl border border-[#DEDDD6] shadow-xs hover:shadow-md transition-shadow`}
        >
          <div className="flex items-center gap-3 mb-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F26522]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-[#F26522]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522]">
                Giai đoạn 02
              </span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#20242B]">
                {advanced.title}
              </h2>
            </div>
          </div>

          <p className="text-[#5C6069] leading-relaxed text-sm sm:text-base">
            {advanced.desc}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
