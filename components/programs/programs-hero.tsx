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
      color: '#2E4A9E',
      bg: 'rgba(46,74,158,0.1)',
    },
    {
      icon: School,
      label: isVi ? 'Liên cấp Quốc tế K-12' : 'K-12 International Pathway',
      color: '#5C9024',
      bg: 'rgba(141,198,63,0.18)',
    },
    {
      icon: UserCheck,
      label: isVi ? 'Cố vấn học tập 1 kèm 1' : '1-on-1 Academic Advising',
      color: '#F26522',
      bg: 'rgba(242,101,34,0.12)',
    },
    {
      icon: Target,
      label: isVi ? 'Lộ trình cá nhân hóa' : 'Personalized Pathways',
      color: '#1E3570',
      bg: 'rgba(30,53,112,0.12)',
    },
  ]

  const bgImg = backgroundImage || '/images/programs/program-dual-diploma.jpg'

  return (
    <section
      className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden border-b border-[#DEDDD6]"
      style={{ backgroundColor: '#F6F5F1' }}
      aria-label={title}
    >
      {/* Background visual layers matching Homepage iSchool style */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(141,198,63,0.3) 0%, rgba(46,74,158,0.15) 70%, transparent 100%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(46,74,158,0.25) 0%, rgba(240,90,40,0.1) 70%, transparent 100%)' }}
        />

        {/* Diagonal chevron bands */}
        <svg
          className="absolute top-0 right-0 w-1/3 h-full opacity-[0.035] text-[#1E3570] pointer-events-none"
          viewBox="0 0 400 800"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M 100,0 L 400,0 L 300,800 L 0,800 Z" fill="currentColor" />
          <path d="M 250,0 L 400,0 L 350,800 L 200,800 Z" fill="currentColor" />
        </svg>

        {bgImg && (
          <div
            className="absolute inset-0 opacity-[0.05] bg-cover bg-center mix-blend-multiply"
            style={{ backgroundImage: `url(${bgImg})` }}
          />
        )}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-[#1E3570] border border-[#DEDDD6] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
            <span>{welcomeText}</span>
          </motion.div>

          {/* Headline with green accent matching Homepage display typography */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.08, ease: easeOut }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1E3570] tracking-tight leading-[1.14]"
            style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
          >
            {title}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, delay: 0.16, ease: easeOut }}
            className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-[#5C6069] leading-relaxed max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>

          {/* 4 Academic Highlight Badges in clean white cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, delay: 0.24, ease: easeOut }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mt-8 sm:mt-10 text-left"
          >
            {highlights.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 sm:p-3.5 rounded-xl bg-white border border-[#DEDDD6] shadow-xs hover:shadow-md hover:-translate-y-0.5 hover:border-[#8DC63F]/50 transition-all duration-300 group cursor-default"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: item.bg, color: item.color }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-[#1E3570] leading-tight group-hover:text-[#5C9024] transition-colors">
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

