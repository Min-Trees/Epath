'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { duration, easeOut, inViewViewport, useSectionActive } from '@/lib/motion-presets'
import {
  DEFAULT_FEATURED_COURSES_DATA,
  type FeaturedCoursesSectionData,
  type FeaturedCourseItemData,
} from '@/lib/featured-courses-data'
import { useCmsContext } from '@/lib/cms-context'

function pickText(
  val: { vi?: string; en?: string } | string | undefined | null,
  locale: string,
  fallback = ''
): string {
  if (!val) return fallback
  if (typeof val === 'string') return val
  return (locale === 'en' ? val.en || val.vi : val.vi || val.en) || fallback
}

function pickPoints(
  points: { vi?: string[]; en?: string[] } | string[] | undefined | null,
  locale: string,
  fallback: string[] = []
): string[] {
  if (!points) return fallback
  if (Array.isArray(points)) return points
  const list = locale === 'en' ? points.en || points.vi : points.vi || points.en
  return Array.isArray(list) && list.length > 0 ? list : fallback
}

function resolveLink(link: string | undefined, locale: string): string {
  if (!link) return `/${locale}/programs`
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('#')) {
    return link
  }
  const clean = link.startsWith('/') ? link : `/${link}`
  if (clean.startsWith(`/${locale}/`)) return clean
  return `/${locale}${clean}`
}

export interface FeaturedCoursesSectionProps {
  initialData?: FeaturedCoursesSectionData | null
}

export function FeaturedCoursesSection({ initialData }: FeaturedCoursesSectionProps) {
  const locale = useLocale()
  const isVi = locale === 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })

  // Support CMS Context if updated client-side, fallback to initialData, fallback to defaults
  const { data: cms } = useCmsContext()
  const cmsData = (cms as unknown as { featuredCourses?: FeaturedCoursesSectionData }).featuredCourses
  const data: FeaturedCoursesSectionData = cmsData || initialData || DEFAULT_FEATURED_COURSES_DATA

  const badgeText = pickText(
    data.badge,
    locale,
    isVi ? 'CHƯƠNG TRÌNH ĐÀO TẠO TIÊU BIỂU' : 'FEATURED LEARNING PROGRAMS'
  )
  const titleText = pickText(
    data.title,
    locale,
    isVi ? 'Các khóa học nổi bật tại EPath' : 'Featured Programs at EPath'
  )
  const subtitleText = pickText(
    data.subtitle,
    locale,
    isVi
      ? 'Lộ trình học thuật chuẩn quốc tế được cá nhân hóa cho từng giai đoạn phát triển của học sinh từ Mầm non đến Trung học Phổ thông.'
      : 'Accredited international academic pathways personalized for each developmental stage from Kindergarten through High School.'
  )
  const ctaText = pickText(
    data.ctaText,
    locale,
    isVi ? 'Xem tất cả chương trình học K–12' : 'View All K–12 Academic Programs'
  )
  const ctaLink = resolveLink(data.ctaLink || '/programs', locale)

  const rawCourses = data.courses && data.courses.length > 0
    ? data.courses
    : (DEFAULT_FEATURED_COURSES_DATA.courses || [])

  return (
    <section
      ref={sectionRef}
      className="featured-courses-section relative py-16 sm:py-20 lg:py-24 bg-[#F6F5F1] border-y border-[#DEDDD6] overflow-hidden"
      aria-label="Featured Programs and Courses"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.fast, ease: easeOut }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#1E3570] text-xs sm:text-sm font-semibold mb-4 shadow-xs border border-[#DEDDD6]"
          >
            <Sparkles className="w-4 h-4 text-[#8DC63F]" />
            <span>{badgeText}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3570] tracking-tight mb-4 leading-tight"
          >
            {titleText}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut, delay: 0.05 }}
            className="text-base sm:text-lg text-[#5C6069] leading-relaxed"
          >
            {subtitleText}
          </motion.p>
        </div>

        {/* Courses 4-in-1-Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 mb-10 sm:mb-12">
          {rawCourses.map((course: FeaturedCourseItemData, idx: number) => {
            const courseTitle = pickText(course.title, locale)
            const courseLevel = pickText(course.levelBadge, locale)
            const courseDesc = pickText(course.desc, locale)
            const coursePoints = pickPoints(course.points, locale)
            const courseLink = resolveLink(course.link, locale)
            const badgesList = Array.isArray(course.badges)
              ? course.badges
              : typeof course.badges === 'string'
                ? (course.badges as string).split(',').map((s) => s.trim()).filter(Boolean)
                : []

            return (
              <motion.div
                key={course.id || `featured-course-${idx}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.normal, ease: easeOut, delay: idx * 0.08 }}
                className="bg-white rounded-lg overflow-hidden border border-[#DEDDD6] hover:border-[#1E3570]/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full"
              >
                {/* Card Image Header */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image || '/images/programs/program-high.jpg'}
                    alt={courseTitle}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Soft bottom overlay to ensure text contrast without muting the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                  {/* Level / Age Tag */}
                  {courseLevel && (
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#1E3570] shadow-xs border border-white/60">
                        <Clock className="w-3 h-3 text-[#8DC63F]" />
                        {courseLevel}
                      </span>
                    </div>
                  )}

                  {/* Badges on Image */}
                  {badgesList.length > 0 && (
                    <div className="absolute bottom-2.5 left-3 right-3 flex flex-wrap gap-1">
                      {badgesList.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-[10px] font-medium text-white border border-white/20 truncate"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-2 group-hover:text-[#2E4A9E] transition-colors line-clamp-2 min-h-[2.75rem] leading-snug">
                      {courseTitle}
                    </h3>

                    <p className="text-[#5C6069] text-xs sm:text-[13px] leading-relaxed mb-4 line-clamp-3 min-h-[3.3rem]">
                      {courseDesc}
                    </p>

                    {/* Bullet Points */}
                    {coursePoints.length > 0 && (
                      <div className="space-y-2 mb-5 pt-3 border-t border-[#DEDDD6]/60">
                        {coursePoints.map((pt, ptIdx) => (
                          <div key={ptIdx} className="flex items-start gap-2 text-xs text-[#20242B] leading-tight">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#8DC63F] flex-shrink-0 mt-0.5" />
                            <span className="line-clamp-2">{pt}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer Button */}
                  <div className="pt-2">
                    <Link
                      href={courseLink}
                      className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-md bg-[#F6F5F1] hover:bg-[#1E3570] text-[#1E3570] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn border border-[#DEDDD6] hover:border-[#1E3570]"
                    >
                      <span>{isVi ? 'Khám phá chi tiết' : 'Explore Details'}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA to all programs */}
        <div className="text-center">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1E3570] hover:bg-[#2E4A9E] text-white font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
