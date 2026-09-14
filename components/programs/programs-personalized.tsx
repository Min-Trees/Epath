'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Globe2, CheckCircle2 } from 'lucide-react'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'

interface Props {
  compact?: boolean
  translations: {
    title: string
    desc: string
    goalsTitle: string
    goals: string[]
    p2: string
  }
}

export function ProgramsPersonalized({ compact, translations }: Props) {
  const locale = useLocale()
  const isVi = locale === 'vi'

  return (
    <section className={`${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'} bg-[#F6F5F1] border-b border-[#DEDDD6]`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.slow, ease: easeOut }}
          className={`max-w-5xl mx-auto bg-white rounded-2xl ${
            compact ? 'p-5 sm:p-6' : 'p-6 sm:p-8'
          } border border-[#DEDDD6] shadow-xs hover:shadow-md transition-all duration-400`}
        >
          <div className="grid md:grid-cols-12 gap-6 items-stretch">
            {/* Advisor Image Column */}
            <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px] rounded-xl overflow-hidden border border-[#DEDDD6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/about/faculty-advisors.jpg"
                alt={isVi ? 'Đội ngũ Cố vấn học thuật EPath' : 'EPath Academic Advisory Team'}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8DC63F] block mb-0.5">
                  {isVi ? 'Đồng hành 1 kèm 1' : '1-on-1 Mentorship'}
                </span>
                <span className="text-xs font-semibold text-white/95 leading-snug block">
                  {isVi ? 'Cố vấn chuyên môn theo sát lộ trình và năng lực từng học sinh' : 'Dedicated academic advisors closely tracking each student\'s pathway'}
                </span>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#8DC63F]/15 flex items-center justify-center flex-shrink-0">
                    <Globe2 className="w-5 h-5 text-[#5C9024]" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C9024]">
                      {isVi ? 'Cố vấn học thuật' : 'Academic Advisory'}
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold text-[#20242B]">
                      {translations.title}
                    </h2>
                  </div>
                </div>

                <p className="text-[#5C6069] leading-relaxed mb-3 text-xs sm:text-sm">
                  {translations.desc}
                </p>

                <div className="bg-[#F6F5F1] rounded-xl p-3.5 sm:p-4 border border-[#DEDDD6] mb-3">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#20242B] mb-2">
                    {translations.goalsTitle}
                  </p>
                  <ul className="space-y-1.5">
                    {translations.goals.map((goal, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-[#20242B] font-medium">
                        <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 rounded-full flex-shrink-0 text-[#5C9024]" />
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <p className="text-[#5C6069] leading-relaxed text-xs">
                {translations.p2}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
