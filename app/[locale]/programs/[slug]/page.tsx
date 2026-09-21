'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sprout,
  Book,
  GraduationCap,
  Trophy,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Phone,
  BookOpen,
  Award,
  ShieldCheck,
  Globe2,
  Users,
  ChevronRight,
  Calendar,
  Share2,
} from 'lucide-react'

import { useCmsContext } from '@/lib/cms-context'
import type { Program, Locale } from '@/lib/cms-types'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useRegistrationModal } from '@/components/registration-modal-context'

interface LevelDef {
  id: string
  labelKey: string
  icon: typeof Sprout
  color: string
  bgColor: string
  lightBg: string
  borderColor: string
}

const levelDefs: Record<string, LevelDef> = {
  kindergarten: {
    id: 'kindergarten',
    labelKey: 'kindergarten',
    icon: Sprout,
    color: '#2E4A9E',
    bgColor: 'rgba(46, 74, 158, 0.1)',
    lightBg: '#EAEFFB',
    borderColor: '#2E4A9E',
  },
  elementary: {
    id: 'elementary',
    labelKey: 'elementary',
    icon: Book,
    color: '#5C9024',
    bgColor: 'rgba(141, 198, 63, 0.15)',
    lightBg: '#F4F9EC',
    borderColor: '#8DC63F',
  },
  middle: {
    id: 'middle',
    labelKey: 'middle',
    icon: GraduationCap,
    color: '#F26522',
    bgColor: 'rgba(242, 101, 34, 0.1)',
    lightBg: '#FEF0E9',
    borderColor: '#F26522',
  },
  high: {
    id: 'high',
    labelKey: 'high',
    icon: Trophy,
    color: '#1E3570',
    bgColor: 'rgba(30, 53, 112, 0.12)',
    lightBg: '#EAEFFB',
    borderColor: '#1E3570',
  },
}

const DEFAULT_LEVEL_IMAGES: Record<string, string> = {
  kindergarten: '/images/programs/program-kindy.jpg',
  elementary: '/images/programs/program-elementary.jpg',
  middle: '/images/programs/program-middle.jpg',
  high: '/images/programs/program-high.jpg',
}

function formatAgeRange(ageRange: string | undefined, locale: Locale): string {
  if (!ageRange) return ''
  if (locale === 'vi') return ageRange

  return ageRange
    .replace(/tuổi/gi, 'years old')
    .replace(/Lớp\s+(\d+)\s*–\s*(\d+)/gi, 'Grades $1–$2')
    .replace(/Lớp\s+(\d+)/gi, 'Grade $1')
    .replace(/Mầm non\s*–\s*Lớp\s*12/gi, 'K–12 (Kindergarten – Grade 12)')
    .replace(/Mầm non/gi, 'Kindergarten')
}

export default function ProgramDetailPage() {
  const params = useParams()
  const slug = params?.slug as string
  const locale = useLocale() as Locale
  const isVi = locale === 'vi'
  const t = useTranslations('programs')
  const { openRegistrationModal } = useRegistrationModal()

  const { data: cms } = useCmsContext()
  const programs: Program[] =
    cms.programs && cms.programs.length > 0 ? cms.programs : (DEFAULT_PROGRAMS as Program[])

  // Find program by slug or ID
  const program = programs.find((p) => p.slug === slug || p.id === slug)

  if (!program) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center py-20 px-4 bg-[#F6F5F1]">
        <div className="max-w-md text-center bg-white p-8 sm:p-10 rounded-3xl border border-[#DEDDD6] shadow-sm">
          <BookOpen className="w-12 h-12 text-[#2E4A9E] mx-auto mb-4" />
          <h1 className="text-xl sm:text-2xl font-black text-[#1E3570] mb-2">
            {isVi ? 'Không tìm thấy khóa học' : 'Program Not Found'}
          </h1>
          <p className="text-sm text-[#5C6069] mb-6">
            {isVi
              ? 'Khóa học bạn đang tìm kiếm không tồn tại hoặc đã được cập nhật đường dẫn mới.'
              : 'The program you are looking for does not exist or has been moved.'}
          </p>
          <Link
            href={`/${locale}/programs`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2E4A9E] text-white text-xs font-bold shadow-md hover:bg-[#1E3570] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Quay lại danh sách chương trình' : 'Back to Programs'}</span>
          </Link>
        </div>
      </div>
    )
  }

  const levelDef = levelDefs[program.level] || levelDefs.elementary
  const LevelIcon = levelDef.icon

  const title = program.title?.[locale] || program.title?.vi || ''
  const shortDesc = program.shortDescription?.[locale] || program.shortDescription?.vi || ''
  const content = program.content?.[locale] || program.content?.vi || ''
  const objectives = program.objectives || []
  const highlights = program.highlights || []
  const bannerImage =
    program.imageUrl || DEFAULT_LEVEL_IMAGES[program.level] || '/images/programs/program-kindy.jpg'

  // Safe string helper for localized items
  const getItemText = (item: unknown): string => {
    if (!item) return ''
    if (typeof item === 'string') return item
    if (typeof item === 'object') {
      const obj = item as Record<string, string | undefined>
      return obj[locale] || obj.vi || obj.en || ''
    }
    return String(item)
  }

  // Related programs in the same level
  const relatedPrograms = programs
    .filter((p) => p.level === program.level && p.id !== program.id && p.slug !== program.slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-white">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS & TOP NAV
      ─────────────────────────────────────────────────────────────── */}
      <div className="bg-[#F6F5F1] border-b border-[#DEDDD6]">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 max-w-7xl">
          <nav className="flex items-center gap-2 text-xs text-[#5C6069] flex-wrap">
            <Link href={`/${locale}`} className="hover:text-[#2E4A9E] transition-colors">
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <Link href={`/${locale}/programs`} className="hover:text-[#2E4A9E] transition-colors">
              {isVi ? 'Chương trình đào tạo' : 'Programs'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <span
              className="px-2 py-0.5 rounded-md font-semibold text-[11px]"
              style={{ backgroundColor: levelDef.lightBg, color: levelDef.color }}
            >
              {t(`levels.${levelDef.id}`)}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <span className="text-[#20242B] font-bold truncate max-w-[260px] sm:max-w-none">
              {title}
            </span>
          </nav>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. HERO HEADER SECTION
      ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F6F5F1] to-white py-10 sm:py-14 border-b border-[#DEDDD6]/60">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="max-w-4xl">
            {/* Badges row */}
            <div className="flex items-center gap-2.5 flex-wrap mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-xs"
                style={{ backgroundColor: levelDef.bgColor, color: levelDef.color }}
              >
                <LevelIcon className="w-3.5 h-3.5" />
                <span>{t(`levels.${levelDef.id}`)}</span>
              </span>

              {program.ageRange && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DEDDD6] text-[#20242B] shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-[#F26522]" />
                  <span>{formatAgeRange(program.ageRange, locale)}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAEFFB] text-[#2E4A9E] border border-[#2E4A9E]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E4A9E]" />
                <span>Cognia & Cambridge Standards</span>
              </span>
            </div>

            {/* Program Title */}
            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E3570] mb-4 leading-tight tracking-tight"
              style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
            >
              {title}
            </h1>

            {/* Short Description */}
            {shortDesc && (
              <div className="text-sm sm:text-base lg:text-lg text-[#5C6069] leading-relaxed mb-6 max-w-3xl">
                <RichTextRenderer html={shortDesc} />
              </div>
            )}

            {/* Hero Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <button
                type="button"
                onClick={() =>
                  openRegistrationModal({
                    program: program.slug || program.id,
                    title,
                    source: 'program-detail-hero',
                  })
                }
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F26522] hover:bg-[#D95314] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <span>{isVi ? 'Đăng ký tư vấn lộ trình' : 'Consult This Pathway'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="tel:0937514896"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#DEDDD6] hover:border-[#2E4A9E] text-[#1E3570] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <Phone className="w-4 h-4 text-[#2E4A9E]" />
                <span>Hotline: 0937 514 896</span>
              </a>

              <Link
                href={`/${locale}/programs`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F6F5F1] border border-[#DEDDD6] hover:border-[#2E4A9E] text-[#1E3570] hover:text-[#2E4A9E] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 text-[#2E4A9E] group-hover:-translate-x-1 transition-transform duration-200" />
                <span>{isVi ? 'Tất cả chương trình' : 'All Programs'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT GRID: 2 COLUMNS (CONTENT + SIDEBAR)
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-start">
            {/* ───────── MAIN COLUMN (8 cols) ───────── */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-10">
              {/* Program Featured Showcase Banner */}
              <div className="relative w-full h-64 sm:h-96 rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F5F1] border border-[#DEDDD6] shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bannerImage}
                  alt={title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const fallback =
                      DEFAULT_LEVEL_IMAGES[program.level] || '/images/programs/program-kindy.jpg'
                    if (e.currentTarget.src !== fallback) {
                      e.currentTarget.src = fallback
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs"
                      style={{ backgroundColor: `${levelDef.color}E6` }}
                    >
                      {t(`levels.${levelDef.id}`)}
                    </span>
                    {program.ageRange && (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 backdrop-blur-md text-[#20242B]">
                        {formatAgeRange(program.ageRange, locale)}
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold bg-black/40 backdrop-blur-md px-3 py-1 rounded-full hidden sm:inline-block">
                    EPath Academic Pathway
                  </span>
                </div>
              </div>

              {/* Curriculum & Detailed Content */}
              {content && (
                <div className="bg-[#F6F5F1]/70 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DEDDD6]">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#DEDDD6]">
                    <div className="w-9 h-9 rounded-xl bg-[#2E4A9E]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#2E4A9E]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3570]">
                        {isVi ? 'Nội dung & Cấu trúc chương trình' : 'Curriculum & Course Structure'}
                      </h2>
                      <p className="text-xs text-[#5C6069]">
                        {isVi
                          ? 'Chuẩn hóa học thuật quốc tế kết hợp thực nghiệm toàn diện'
                          : 'International academic standards with comprehensive hands-on practice'}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#20242B] text-sm sm:text-base leading-relaxed space-y-4">
                    <RichTextRenderer html={content} />
                  </div>
                </div>
              )}

              {/* Learning Objectives & Outcomes */}
              {objectives.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#DEDDD6]">
                    <div className="w-9 h-9 rounded-xl bg-[#8DC63F]/15 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#5C9024]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3570]">
                        {isVi ? 'Mục tiêu đào tạo & Chuẩn đầu ra' : 'Learning Objectives & Outcomes'}
                      </h2>
                      <p className="text-xs text-[#5C6069]">
                        {isVi
                          ? 'Những năng lực học thuật và kỹ năng học sinh đạt được'
                          : 'Academic competencies and real-world skills learners will achieve'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {objectives.map((obj, i) => {
                      const text = getItemText(obj)
                      if (!text) return null
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-4 rounded-xl bg-[#F6F5F1]/70 border border-[#EBEAE4] text-xs sm:text-sm text-[#20242B] hover:border-[#8DC63F]/60 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#5C9024] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug font-medium">{text}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Program Highlights & Advantages */}
              {highlights.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#DEDDD6]">
                    <div className="w-9 h-9 rounded-xl bg-[#F26522]/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-[#F26522]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3570]">
                        {isVi ? 'Ưu thế & Điểm nổi bật' : 'Key Advantages & Highlights'}
                      </h2>
                      <p className="text-xs text-[#5C6069]">
                        {isVi
                          ? 'Giá trị khác biệt chỉ có tại lộ trình EPath Education'
                          : 'Distinctive values delivered exclusively by EPath Education'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    {highlights.map((hl, i) => {
                      const text = getItemText(hl)
                      if (!text) return null
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#FEF0E9]/60 border border-[#FDDDCF] text-xs sm:text-sm text-[#20242B]"
                        >
                          <Sparkles className="w-4 h-4 text-[#F26522] shrink-0 mt-0.5" />
                          <span className="font-semibold text-[#C94F16] leading-snug">{text}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Ecosystem & Faculty Pillar Callout */}
              <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#1E3570] to-[#2E4A9E] text-white shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-[#8DC63F]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold">
                      {isVi
                        ? 'Hệ sinh thái đồng hành học thuật 3 bên'
                        : 'Three-Way Academic Mentorship Ecosystem'}
                    </h3>
                    <p className="text-xs text-white/80">
                      {isVi
                        ? 'Nhà trường – Gia đình – Cố vấn học thuật 1:1 theo sát lộ trình'
                        : 'School – Family – Dedicated 1:1 Academic Advisor'}
                    </p>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-white/90 leading-relaxed mb-4">
                  {isVi
                    ? 'Mỗi học sinh tại EPath được đội ngũ 50% Giáo viên Quốc tế bản ngữ giảng dạy 100% bằng tiếng Anh, 50% Giáo viên Song ngữ IELTS 7.0+ tháo gỡ rào cản khái niệm khó, và 1 Cố vấn Học thuật riêng theo sát kết quả từng bài học trên hệ thống Edmentum.'
                    : 'Each EPath student benefits from 50% International native faculty, 50% Bilingual teachers (IELTS 7.0+), and a dedicated Academic Advisor managing day-to-day progress on Edmentum.'}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-white/90 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Đánh giá định kỳ khách quan' : 'Objective Periodic Assessment'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Phụ đạo 1:1 lấp lỗ hổng' : '1:1 Tutoring Interventions'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Báo cáo học tập minh bạch' : 'Transparent Progress Reporting'}
                  </span>
                </div>
              </div>
            </div>

            {/* ───────── SIDEBAR COLUMN (4 cols) ───────── */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Quick Specs Card */}
              <div className="bg-[#F6F5F1] rounded-2xl sm:rounded-3xl p-6 border border-[#DEDDD6]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3570] mb-4 pb-2 border-b border-[#DEDDD6]">
                  {isVi ? 'Tổng quan khóa học' : 'Program Overview'}
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DEDDD6]/60">
                    <span className="text-[#5C6069]">{isVi ? 'Cấp học:' : 'Level:'}</span>
                    <span
                      className="font-bold px-2.5 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: levelDef.lightBg, color: levelDef.color }}
                    >
                      {t(`levels.${levelDef.id}`)}
                    </span>
                  </div>

                  {program.ageRange && (
                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DEDDD6]/60">
                      <span className="text-[#5C6069]">{isVi ? 'Độ tuổi / Cấp lớp:' : 'Age / Grade:'}</span>
                      <span className="font-bold text-[#20242B]">
                        {formatAgeRange(program.ageRange, locale)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DEDDD6]/60">
                    <span className="text-[#5C6069]">{isVi ? 'Hình thức học:' : 'Format:'}</span>
                    <span className="font-bold text-[#20242B]">
                      Blended Learning (Online & Onsite)
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DEDDD6]/60">
                    <span className="text-[#5C6069]">{isVi ? 'Giáo trình:' : 'Curriculum:'}</span>
                    <span className="font-bold text-[#1E3570] text-right">
                      Edmentum & Cambridge
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#DEDDD6]/60">
                    <span className="text-[#5C6069]">{isVi ? 'Kiểm định:' : 'Accreditation:'}</span>
                    <span className="font-bold text-[#5C9024] text-right">
                      Cognia & WASC
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[#5C6069]">{isVi ? 'Cố vấn 1:1:' : 'Advisor:'}</span>
                    <span className="font-bold text-[#F26522]">
                      {isVi ? 'Đồng hành riêng' : 'Dedicated'}
                    </span>
                  </div>
                </div>

                {/* Primary CTA */}
                <div className="mt-6 pt-5 border-t border-[#DEDDD6] space-y-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      openRegistrationModal({
                        program: program.slug || program.id,
                        title,
                        source: 'program-detail-sidebar',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 text-center cursor-pointer"
                  >
                    <span>{isVi ? 'Đăng ký tư vấn ngay' : 'Apply for Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="tel:0937514896"
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-[#DEDDD6] hover:border-[#2E4A9E] text-[#1E3570] text-xs font-bold transition-all duration-300 text-center"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#F26522]" />
                    <span>0937 514 896</span>
                  </a>
                </div>
              </div>

              {/* Related Programs in Same Level */}
              {relatedPrograms.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#DEDDD6] shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3570] mb-4 pb-2 border-b border-[#DEDDD6]">
                    {isVi ? 'Cùng cấp học này' : 'Related Programs'}
                  </h3>

                  <div className="space-y-3">
                    {relatedPrograms.map((rel) => {
                      const relTitle = rel.title?.[locale] || rel.title?.vi || ''
                      const relImage =
                        rel.imageUrl || DEFAULT_LEVEL_IMAGES[rel.level] || '/images/programs/program-kindy.jpg'
                      return (
                        <Link
                          key={rel.id}
                          href={`/${locale}/programs/${rel.slug || rel.id}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F5F1] transition-colors border border-transparent hover:border-[#DEDDD6] group"
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#F6F5F1] shrink-0 border border-[#DEDDD6]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={relImage}
                              alt={relTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-xs sm:text-sm font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors truncate">
                              {relTitle}
                            </h4>
                            {rel.ageRange && (
                              <p className="text-[11px] text-[#5C6069] flex items-center gap-1 mt-0.5">
                                <Clock className="w-3 h-3 text-[#F26522]" />
                                <span>{formatAgeRange(rel.ageRange, locale)}</span>
                              </p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8E939E] group-hover:text-[#2E4A9E] shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM CONSULTATION BANNER
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F6F5F1] border-t border-[#DEDDD6]">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#2E4A9E]" />
            <span>{isVi ? 'Đồng Hành Cùng Con' : 'Partnering With Your Child'}</span>
          </div>
          <h2
            className="text-2xl sm:text-3xl font-black text-[#1E3570] mb-3 tracking-tight"
            style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
          >
            {isVi
              ? 'Bắt đầu lộ trình học thuật quốc tế ngay hôm nay'
              : 'Start Your International Academic Journey Today'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed max-w-2xl mx-auto mb-6">
            {isVi
              ? 'Đội ngũ chuyên gia học vụ của EPath Education sẵn sàng tư vấn 1:1, đánh giá năng lực ban đầu và xây dựng kế hoạch học tập tối ưu cho từng học sinh.'
              : 'Our academic advisory team is ready to provide 1:1 consultation, baseline diagnostic assessment, and tailored study plans for every student.'}
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() =>
                openRegistrationModal({
                  program: program.slug || program.id,
                  title,
                  source: 'program-detail-bottom',
                })
              }
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>{isVi ? 'Đăng ký nhận lộ trình 1:1' : 'Get 1:1 Pathway Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              href={`/${locale}/programs`}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-[#DEDDD6] hover:border-[#2E4A9E] text-[#1E3570] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{isVi ? 'Xem tất cả chương trình' : 'Explore All Programs'}</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
