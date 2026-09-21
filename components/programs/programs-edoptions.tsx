'use client'

import { motion } from 'framer-motion'
import { Award, Info, ArrowRight, CheckCircle2, Globe2 } from 'lucide-react'
import Link from 'next/link'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import type { Locale } from '@/lib/cms-types'
import { useRegistrationModal } from '@/components/registration-modal-context'

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
  const { openRegistrationModal } = useRegistrationModal()

  return (
    <section
      className={`${compact ? 'py-8' : 'py-10 sm:py-12'} relative overflow-hidden bg-[#F6F5F1] border-y border-[#DEDDD6]`}
    >
      <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-6 sm:mb-8 text-[#1E3570] max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
            <Award className="w-3.5 h-3.5 text-[#2E4A9E]" />
            <span>{isVi ? 'Chương trình THPT Hoa Kỳ' : 'US High School Program'}</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-[#1E3570]"
            style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
          >
            {translations.title}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed max-w-2xl mx-auto">
            {translations.subtitle}
          </p>
        </motion.div>

        {/* 2 Comparison Cards - Wider and Compact */}
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-6 items-stretch">
          {/* Card 1: Dual Diploma */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, ease: easeOut }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-lg border border-[#DEDDD6] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Image Banner - Compact & Wide */}
              <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-4 border border-[#DEDDD6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={dualImage || "/images/programs/program-dual-diploma.jpg"}
                  alt={translations.dual.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#2E4A9E] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                    {translations.dual.label}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold drop-shadow flex items-center justify-between">
                  <span>{isVi ? 'Song Bằng Mỹ' : 'US Dual Diploma'}</span>
                  <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">Cognia & WASC</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#1E3570] mb-1.5 group-hover:text-[#2E4A9E] transition-colors duration-300">
                {translations.dual.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-3.5 line-clamp-2">
                {translations.dual.desc}
              </p>

              {/* 4 Quick Spec Badges in 1 Row on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🎓 Văn bằng:' : '🎓 Diploma:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? 'Bằng VN + Mỹ' : 'VN & US'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '⏱️ Tín chỉ:' : '⏱️ Credits:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? '5 tín chỉ Mỹ' : '5 US Credits'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🏫 Hình thức:' : '🏫 Mode:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? 'Song song' : 'Concurrent'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🏛️ Kiểm định:' : '🏛️ Accredit:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    Cognia & WASC
                  </span>
                </div>
              </div>

              {/* Diplomas & Benefits Box */}
              <div className="p-3 rounded-xl bg-[#EAEFFB]/60 border border-[#2E4A9E]/20 mb-3">
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-xs text-[#20242B] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#2E4A9E]" />
                    <span>
                      {isVi
                        ? 'Nhận 2 bằng chính quy: THPT Việt Nam & Tú tài Mỹ (EdOptions Academy).'
                        : 'Receive 2 formal diplomas: Vietnamese High School & US High School.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#20242B] font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#2E4A9E]" />
                    <span>
                      {isVi
                        ? 'Làm quen phương pháp học quốc tế, phát triển kỹ năng tự học & tiếng Anh học thuật.'
                        : 'Adapt to international methods, developing self-study and academic English skills.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-1 space-y-2.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#8DC63F]/15 border-l-2 border-[#5C9024] text-[11px] text-[#20242B]">
                <Info className="w-3.5 h-3.5 flex-shrink-0 text-[#5C9024]" />
                <span className="truncate">{translations.dual.note}</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  openRegistrationModal({
                    program: 'dual-diploma',
                    title: translations.dual.title,
                    source: 'edoptions-dual',
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <span>{isVi ? 'Đăng ký tư vấn Song bằng Mỹ' : 'Enquire Dual Diploma'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>

          {/* Card 2: Fulltime Homeschool */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, delay: 0.08, ease: easeOut }}
            className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-lg border border-[#DEDDD6] hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
          >
            <div>
              {/* Image Banner - Compact & Wide */}
              <div className="relative w-full h-32 sm:h-36 rounded-xl overflow-hidden mb-4 border border-[#DEDDD6]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={fulltimeImage || "/images/programs/program-high.jpg"}
                  alt={translations.fulltime.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#F26522] text-white text-[11px] font-bold tracking-wider uppercase shadow-xs">
                    {translations.fulltime.label}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-semibold drop-shadow flex items-center justify-between">
                  <span>{isVi ? 'Tú Tài Mỹ Toàn Phần' : 'Full-Time US Diploma'}</span>
                  <span className="text-[11px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-full">Cognia & WASC</span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-[#1E3570] mb-1.5 group-hover:text-[#F26522] transition-colors duration-300">
                {translations.fulltime.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-3.5 line-clamp-2">
                {translations.fulltime.desc}
              </p>

              {/* 4 Quick Spec Badges in 1 Row on sm+ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🎓 Văn bằng:' : '🎓 Diploma:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? 'Bằng Tú tài Mỹ' : 'US Diploma'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '⏱️ Tín chỉ:' : '⏱️ Credits:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? '21.5 tín chỉ' : '21.5 Credits'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🏫 Hình thức:' : '🏫 Mode:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    {isVi ? 'Online 100%' : 'Full-time Online'}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-[#F6F5F1] border border-[#EBEAE4]">
                  <span className="text-[10px] font-bold text-[#5C6069] block mb-0.5">
                    {isVi ? '🏛️ Kiểm định:' : '🏛️ Accredit:'}
                  </span>
                  <span className="text-[11px] sm:text-xs font-bold text-[#1E3570] leading-tight block truncate">
                    Cognia & NCAA
                  </span>
                </div>
              </div>

              {/* Fit & Benefits Box */}
              <div className="p-3 rounded-xl bg-[#FEF0E9]/60 border border-[#F26522]/20 mb-3">
                <ul className="space-y-1.5">
                  <li className="flex items-start gap-2 text-xs text-[#20242B] font-medium">
                    <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 text-[#F26522]" />
                    <span>
                      {isVi
                        ? 'Giảng dạy 100% tiếng Anh bởi giáo viên Mỹ, tích lũy 21.5 tín chỉ chuẩn Hoa Kỳ.'
                        : '100% English instruction by US teachers, earning 21.5 US credits.'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-[#20242B] font-medium">
                    <CheckCircle2 className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 text-[#F26522]" />
                    <span>
                      {isVi
                        ? 'Tiết kiệm 70% chi phí so với du học, xét tuyển thẳng vào các đại học hàng đầu.'
                        : 'Save 70% costs compared to studying abroad, direct admission to top universities.'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-1 space-y-2.5">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F26522]/10 border-l-2 border-[#F26522] text-[11px] text-[#20242B]">
                <Globe2 className="w-3.5 h-3.5 flex-shrink-0 text-[#F26522]" />
                <span className="truncate">
                  {isVi
                    ? 'Học sinh học trực tuyến toàn phần, tích lũy tín chỉ trực tiếp cùng EdOptions Academy.'
                    : 'Full-time online study with direct US high school credit accumulation.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  openRegistrationModal({
                    program: 'fulltime',
                    title: translations.fulltime.title,
                    source: 'edoptions-fulltime',
                  })
                }
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F26522] hover:bg-[#C94F16] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all duration-200 cursor-pointer"
              >
                <span>{isVi ? 'Đăng ký tư vấn Tú tài Mỹ toàn phần' : 'Enquire Full-Time Diploma'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Accreditation Trust Badges - Compact */}
        <div className="mt-6 pt-5 border-t border-[#DEDDD6] max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2.5 sm:gap-5 text-[#5C6069] text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DEDDD6] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Kiểm định bởi ' : 'Accredited by '}<strong className="text-[#1E3570] font-bold">Cognia™ & WASC</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DEDDD6] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Phê duyệt bởi ' : 'Approved by '}<strong className="text-[#1E3570] font-bold">{isVi ? 'NCAA Hoa Kỳ' : 'US NCAA'}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DEDDD6] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#8DC63F]" />
            <span>{isVi ? 'Mã trường ' : 'School code '}<strong className="text-[#1E3570] font-bold">College Board (AP®)</strong></span>
          </div>
        </div>
      </div>
    </section>
  )
}
