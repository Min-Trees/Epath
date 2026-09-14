'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { Sparkles, GraduationCap, School, UserCheck, Target } from 'lucide-react'
import { duration, easeOut } from '@/lib/motion-presets'

interface Props {
  welcomeText: string
  title: string
  subtitle: string
  backgroundImage?: string
}

export function ProgramsHero({ welcomeText, title, subtitle, backgroundImage }: Props) {
  const locale = useLocale()
  const isVi = locale === 'vi'

  const highlights = [
    {
      icon: GraduationCap,
      label: isVi ? 'Bằng Tú tài Mỹ Cognia' : 'Cognia US Diploma',
    },
    {
      icon: School,
      label: isVi ? 'Liên cấp Quốc tế K-12' : 'K-12 International Pathway',
    },
    {
      icon: UserCheck,
      label: isVi ? 'Cố vấn học tập 1 kèm 1' : '1-on-1 Academic Advising',
    },
    {
      icon: Target,
      label: isVi ? 'Lộ trình cá nhân hóa' : 'Personalized Pathways',
    },
  ]

  const bgImg = backgroundImage || '/images/programs/program-dual-diploma.jpg'

  return (
    <section
      className="pt-24 sm:pt-28 pb-10 sm:pb-14 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(30,53,112,0.92) 0%, rgba(46,74,158,0.88) 100%), url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8DC63F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-xs uppercase tracking-wider mb-3 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
            {welcomeText}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, delay: 0.1, ease: easeOut }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 tracking-tight leading-tight text-white"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, delay: 0.2, ease: easeOut }}
            className="text-sm sm:text-base text-white/90 leading-relaxed font-normal max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            {subtitle}
          </motion.p>

          {/* 4 Academic Highlight Badges */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, delay: 0.3, ease: easeOut }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-3xl mx-auto"
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left transition-all duration-300 hover:bg-white/15"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#8DC63F]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#8DC63F]" />
                  </div>
                  <span className="text-xs font-semibold text-white/95 leading-tight">
                    {item.label}
                  </span>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

