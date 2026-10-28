'use client'

import { motion } from 'framer-motion'
import { Trophy, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { useLocale } from 'next-intl'
import type { Locale } from '@/lib/cms-types'
import { DEFAULT_ACHIEVEMENTS_CONTENT } from '@/lib/achievements-data'

const METRIC_COLORS = ['#2E4A9E', '#5C9024', '#F26522', '#1E3570']

interface Props {
  id?: string
  className?: string
  titleOverride?: string
  subtitleOverride?: string
}

export function AchievementsOverviewSection({ id = 'achievements', className = '', titleOverride, subtitleOverride }: Props) {
  const locale = useLocale() as Locale
  const isVi = locale === 'vi'
  const { data: cms } = useCmsContext()

  const data = cms.achievementsContent || DEFAULT_ACHIEVEMENTS_CONTENT

  const badge =
    data.badge?.[locale] ||
    data.badge?.vi ||
    (isVi ? 'Dấu ấn xuất sắc' : 'Verified Excellence')
  const title =
    titleOverride ||
    data.title?.[locale] ||
    data.title?.vi ||
    (isVi ? 'Thành tích Vượt trội & Kết quả Đào tạo' : 'Outstanding Achievements & Outcomes')
  const subtitle =
    subtitleOverride ||
    data.subtitle?.[locale] ||
    data.subtitle?.vi ||
    (isVi
      ? 'Minh chứng cho chất lượng đào tạo chuẩn hóa và năng lực hội nhập toàn cầu của học sinh EPath'
      : "Demonstrating our standardized academic rigor and students' global readiness")

  const metrics = data.metrics?.length ? data.metrics : DEFAULT_ACHIEVEMENTS_CONTENT.metrics
  const olympiad = data.olympiad || DEFAULT_ACHIEVEMENTS_CONTENT.olympiad

  const olympiadTag =
    olympiad.tag?.[locale] ||
    olympiad.tag?.vi ||
    (isVi ? 'Dấu Ấn Xuất Sắc' : 'Outstanding Milestone')
  const olympiadTitle =
    olympiad.title?.[locale] ||
    olympiad.title?.vi ||
    (isVi ? 'Đấu trường Học thuật & Trải nghiệm Công nghệ' : 'Academic Olympiads & Applied Innovation')
  const olympiadDesc =
    olympiad.desc?.[locale] ||
    olympiad.desc?.vi ||
    (isVi
      ? 'Học sinh EPath thường xuyên thử thách và đạt giải cao tại các kỳ thi Olympic quốc tế như IMEC, STEMCO, GMEC, TIMO; đồng thời trực tiếp sáng tạo các dự án Robotics, thiết kế in 3D thực nghiệm tại Makerspace FabLab EIU.'
      : 'EPath learners regularly earn honors in global competitions (IMEC, STEMCO, GMEC, TIMO) and build applied robotics and 3D printing engineering projects at FabLab EIU.')
  const ctaText =
    olympiad.ctaText?.[locale] ||
    olympiad.ctaText?.vi ||
    (isVi ? 'Xem Lộ Trình Học Thuật' : 'Explore Academic Pathways')

  const targetUrl = olympiad.ctaLink || '/programs'
  const finalCtaLink = targetUrl.startsWith('/')
    ? `/${locale}${targetUrl.startsWith(`/${locale}`) ? targetUrl.replace(`/${locale}`, '') : targetUrl}`
    : targetUrl

  return (
    <section id={id} className={`py-12 sm:py-16 bg-white scroll-mt-20 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-10 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F26522]/10 text-[#F26522] text-xs font-semibold mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">{title}</h2>
          <p className="text-sm sm:text-base text-[#5C6069] leading-relaxed">{subtitle}</p>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* 4 Major Academic Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {metrics.map((metric, idx) => {
              const color = METRIC_COLORS[idx % METRIC_COLORS.length]
              const label = metric.label?.[locale] || metric.label?.vi || ''
              const desc = metric.desc?.[locale] || metric.desc?.vi || ''
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.slow, delay: 0.05 * (idx + 1), ease: easeOut }}
                  className="bg-[#F6F5F1] rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#2E4A9E]/40 hover:shadow-md transition-all text-center flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="text-3xl sm:text-4xl font-black mb-1"
                      style={{ color }}
                    >
                      {metric.number}
                    </div>
                    <h4 className="font-bold text-[#20242B] text-sm mb-1">{label}</h4>
                    <p className="text-xs text-[#5C6069] leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Olympiad & STEAM Maker Highlight Banner with Image */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, delay: 0.25, ease: easeOut }}
            className="rounded-3xl border border-[#2E4A9E]/20 bg-gradient-to-br from-[#1E3570]/5 via-white to-[#8DC63F]/5 shadow-md overflow-hidden grid md:grid-cols-12 gap-0 items-stretch"
          >
            <div className="md:col-span-5 relative min-h-[220px] md:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={olympiad.imageUrl || '/images/about/about-achievements.jpg'}
                alt={olympiadTitle}
                className="w-full h-full object-cover absolute inset-0"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
              {olympiad.badge && (
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#20242B] text-xs font-bold shadow-md">
                  <Trophy className="w-4 h-4 text-[#F26522]" />
                  <span>{olympiad.badge}</span>
                </div>
              )}
            </div>

            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold mb-3 w-fit">
                <Trophy className="w-3.5 h-3.5 text-[#2E4A9E]" />
                <span>{olympiadTag}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#20242B] mb-2.5 leading-snug">
                {olympiadTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-6">
                {olympiadDesc}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href={finalCtaLink}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4A9E] text-white font-bold text-xs shadow-md hover:bg-[#1E3570] transition-colors"
                >
                  <span>{ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
