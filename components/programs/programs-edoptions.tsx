'use client'

import { motion } from 'framer-motion'
import { Award, Info, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'
import Link from 'next/link'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import type { Locale } from '@/lib/cms-types'

interface Props {
  locale: Locale
  compact?: boolean
  dualImage?: string
  fulltimeImage?: string
  translations: {
    title: string
    subtitle: string
    dual: {
      label: string
      title: string
      desc: string
      p2: string
      diplomasTitle: string
      diplomas: string[]
      p3: string
      p4: string
      note: string
    }
    fulltime: {
      label: string
      title: string
      desc: string
      p2: string
      fitTitle: string
      fit: string[]
      p3: string
      p4: string
    }
    ctaButton: string
  }
}

export function ProgramsEdOptions({ locale, compact, dualImage, fulltimeImage, translations }: Props) {
  const isVi = locale === 'vi'
  return (
    <section
      className={`${compact ? 'py-10' : 'py-12 sm:py-16'} relative overflow-hidden`}
      style={{ background: 'linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)' }}
    >
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#8DC63F]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-8 sm:mb-10 text-white max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-xs font-medium mb-3 border border-white/20">
            <Award className="w-3.5 h-3.5 text-[#8DC63F]" />
            <span>{translations.subtitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 tracking-tight">
            {translations.title}
          </h2>
        </motion.div>

        {/* 2 Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Dual Diploma */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, ease: easeOut }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-white/20 hover:-translate-y-1 transition-all duration-400 group flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-4 border border-[#DEDDD6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dualImage || "/images/programs/program-dual-diploma.jpg"}
                  alt={translations.dual.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#2E4A9E] text-white text-[11px] font-bold tracking-wider uppercase">
                  {translations.dual.label}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#20242B] mb-3 group-hover:text-[#2E4A9E] transition-colors duration-300">
                {translations.dual.title}
              </h3>
              <div className="space-y-2.5 text-[#5C6069] leading-relaxed text-xs sm:text-sm">
                <p>{translations.dual.desc}</p>
                <p>{translations.dual.p2}</p>

                <div className="my-3.5 p-3.5 rounded-xl bg-[#F6F5F1] border border-[#DEDDD6]">
                  <p className="text-xs font-bold text-[#20242B] mb-2 uppercase tracking-wider">
                    {translations.dual.diplomasTitle}
                  </p>
                  <ul className="space-y-1.5">
                    {translations.dual.diplomas.map((diploma, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#20242B] font-medium">
                        <Award className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#8DC63F]" />
                        <span>{diploma}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>{translations.dual.p3}</p>
                <p>{translations.dual.p4}</p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-[#8DC63F]/15 border-l-3 border-[#5C9024] text-xs text-[#20242B]">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#5C9024]" />
              <span>{translations.dual.note}</span>
            </div>
          </motion.div>

          {/* Card 2: Fulltime Homeschool */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, delay: 0.1, ease: easeOut }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-white/20 hover:-translate-y-1 transition-all duration-400 group flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-36 sm:h-40 rounded-xl overflow-hidden mb-4 border border-[#DEDDD6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fulltimeImage || "/images/programs/program-high.jpg"}
                  alt={translations.fulltime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <span className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#F26522] text-white text-[11px] font-bold tracking-wider uppercase">
                  {translations.fulltime.label}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#20242B] mb-3 group-hover:text-[#F26522] transition-colors duration-300">
                {translations.fulltime.title}
              </h3>
              <div className="space-y-2.5 text-[#5C6069] leading-relaxed text-xs sm:text-sm">
                <p>{translations.fulltime.desc}</p>
                <p>{translations.fulltime.p2}</p>

                <div className="my-3.5 p-3.5 rounded-xl bg-[#F6F5F1] border border-[#DEDDD6]">
                  <p className="text-xs font-bold text-[#20242B] mb-2 uppercase tracking-wider">
                    {translations.fulltime.fitTitle}
                  </p>
                  <ul className="space-y-1.5">
                    {translations.fulltime.fit.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-[#20242B]">
                        <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 text-[#F26522]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p>{translations.fulltime.p3}</p>
                <p>{translations.fulltime.p4}</p>
              </div>
            </div>

            <div className="mt-5 flex items-start gap-2 p-3 rounded-xl bg-[#F26522]/10 border-l-3 border-[#F26522] text-xs text-[#20242B]">
              <Globe2 className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#F26522]" />
              <span>{isVi ? 'Chương trình hoàn toàn bằng tiếng Anh và tích lũy tín chỉ trực tiếp với Hoa Kỳ.' : 'Delivered fully in English with direct US high school credit accumulation.'}</span>
            </div>
          </motion.div>
        </div>

        {/* Accreditation Trust Badges */}
        <div className="mt-8 pt-6 border-t border-white/15 max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-white/85 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Kiểm định chất lượng giáo dục bởi ' : 'Educational quality accredited by '}<strong className="text-white font-bold">Cognia™</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Phê duyệt bởi Hiệp hội ' : 'Approved by '}<strong className="text-white font-bold">{isVi ? 'NCAA Hoa Kỳ' : 'US NCAA'}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Mã trường khảo thí ' : 'Test center school code '}<strong className="text-white font-bold">College Board (AP®)</strong></span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Link
            href={`/${locale}/admissions?program=high`}
            className="inline-flex items-center gap-2.5 bg-[#F26522] hover:bg-[#C94F16] text-white px-7 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <span>{translations.ctaButton}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
