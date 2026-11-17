'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Phone,
  BookOpen,
  Award,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Users,
  ChevronRight,
  Gift,
  Calendar,
  GraduationCap,
} from 'lucide-react'

import { usePublicCms } from '@/lib/cms-context'
import { DEFAULT_ADMISSIONS_DATA } from '@/lib/admissions-data'
import { useRegistrationModal } from '@/components/registration-modal-context'
import { RichTextRenderer } from '@/components/admin/rich-text-renderer'
import { duration, easeOut } from '@/lib/motion-presets'
import type { AdmissionPromotionFlyer } from '@/lib/cms-types'

export default function PromotionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const locale = (useLocale() || 'vi') as 'vi' | 'en'
  const isVi = locale === 'vi'
  const { openRegistrationModal } = useRegistrationModal()
  const cms = usePublicCms()

  // Resolve promotions list with CMS fallback
  const rawPromotions = cms.admissionsContent?.promotions
  const allFlyers: AdmissionPromotionFlyer[] =
    rawPromotions?.flyers && rawPromotions.flyers.length > 0
      ? rawPromotions.flyers
      : DEFAULT_ADMISSIONS_DATA.promotions?.flyers || []

  const flyerId = params?.id as string
  const flyer =
    allFlyers.find((f) => f.id === flyerId) ||
    allFlyers.find((f) => f.id.toLowerCase() === (flyerId || '').toLowerCase()) ||
    allFlyers[0]

  if (!flyer) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-[#1E3570] mb-3">
          {isVi ? 'Không tìm thấy chương trình ưu đãi' : 'Promotion Not Found'}
        </h1>
        <p className="text-sm text-[#5C6069] mb-6">
          {isVi
            ? 'Chương trình ưu đãi này có thể đã kết thúc hoặc không tồn tại.'
            : 'This offer may have expired or does not exist.'}
        </p>
        <Link
          href={`/${locale}/admissions#promotions`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#F26522] text-white font-bold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isVi ? 'Xem các ưu đãi khác' : 'View Other Offers'}</span>
        </Link>
      </div>
    )
  }

  const title = flyer.title?.[locale] || flyer.title?.vi || ''
  const subtitle = flyer.subtitle?.[locale] || flyer.subtitle?.vi || ''
  const badge = flyer.badge?.[locale] || flyer.badge?.vi || (isVi ? 'ƯU ĐÃI ĐẶC QUYỀN' : 'SPECIAL OFFER')
  const ctaText = flyer.ctaText?.[locale] || flyer.ctaText?.vi || (isVi ? 'Đăng ký nhận ưu đãi' : 'Claim Offer')
  const content = flyer.content?.[locale] || flyer.content?.vi || ''
  const applicableFor =
    flyer.applicableFor?.[locale] ||
    flyer.applicableFor?.vi ||
    (isVi
      ? 'Học sinh từ Mầm non đến Lớp 12 trên toàn quốc đăng ký lộ trình học thuật EPath.'
      : 'K-12 students nationwide enrolling in EPath academic pathways.')
  const validUntil =
    flyer.validUntil?.[locale] ||
    flyer.validUntil?.vi ||
    (isVi ? 'Áp dụng trong tháng tuyển sinh hiện tại' : 'Valid during the current admissions intake')

  const benefits =
    flyer.benefits?.[locale] ||
    flyer.benefits?.vi ||
    (isVi
      ? [
          'Ưu đãi trực tiếp vào gói học phí khi ghi danh sớm',
          'Miễn phí 100% bài khảo sát năng lực chuẩn Edmentum Exact Path trị giá 2.500.000 VNĐ',
          'Cố vấn học thuật 1 kèm 1 theo sát phân tích kết quả và thiết kế lộ trình cá nhân hóa',
          'Tặng tài khoản học trực tuyến Edmentum bản quyền Hoa Kỳ',
        ]
      : [
          'Direct tuition deduction upon early enrollment',
          '100% Free US Edmentum Exact Path diagnostic assessment (2,500,000 VND value)',
          '1-on-1 Academic Advisor analyzing benchmarks & building custom roadmaps',
          'Complimentary 1-year licensed US Edmentum online learning account',
        ])

  const otherFlyers = allFlyers.filter((f) => f.id !== flyer.id && f.isActive !== false)

  const handleOpenRegistration = () => {
    openRegistrationModal({
      program: flyer.targetProgram || flyer.id,
      title,
      source: 'promotion-detail-page',
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─────────────────────────────────────────────────────────────
          1. BREADCRUMBS
      ─────────────────────────────────────────────────────────────── */}
      <div className="bg-[#F6F5F1] border-b border-[#DEDDD6]">
        <div className="container mx-auto px-4 sm:px-6 py-3.5 max-w-7xl">
          <nav className="flex items-center gap-2 text-xs text-[#5C6069] flex-wrap">
            <Link href={`/${locale}`} className="hover:text-[#2E4A9E] transition-colors">
              {isVi ? 'Trang chủ' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <Link href={`/${locale}/admissions`} className="hover:text-[#2E4A9E] transition-colors">
              {isVi ? 'Tuyển sinh' : 'Admissions'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <Link
              href={`/${locale}/admissions#promotions`}
              className="hover:text-[#2E4A9E] transition-colors"
            >
              {isVi ? 'Chương trình Ưu Đãi' : 'Special Offers'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#8E939E]" />
            <span className="text-[#20242B] font-bold truncate max-w-[240px] sm:max-w-none">
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
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#F26522]/15 text-[#C94F16] border border-[#F26522]/30 shadow-xs">
                <Gift className="w-3.5 h-3.5 text-[#F26522]" />
                <span>{badge}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DEDDD6] text-[#20242B] shadow-xs">
                <Clock className="w-3.5 h-3.5 text-[#F26522]" />
                <span>{validUntil}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAEFFB] text-[#2E4A9E] border border-[#2E4A9E]/20">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2E4A9E]" />
                <span>{isVi ? 'Chứng nhận Edmentum & Cognia' : 'Edmentum & Cognia Certified'}</span>
              </span>
            </div>

            {/* Offer Title */}
            <h1
              className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E3570] mb-4 leading-tight tracking-tight"
              style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
            >
              {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
              <p className="text-sm sm:text-base lg:text-lg text-[#5C6069] leading-relaxed mb-6 max-w-3xl">
                {subtitle}
              </p>
            )}

            {/* Hero Quick Actions */}
            <div className="flex items-center gap-3 flex-wrap pt-2">
              <button
                type="button"
                onClick={handleOpenRegistration}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F26522] hover:bg-[#D95314] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>{ctaText}</span>
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
                href={`/${locale}/admissions#promotions`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F6F5F1] border border-[#DEDDD6] hover:border-[#2E4A9E] text-[#1E3570] hover:text-[#2E4A9E] text-xs sm:text-sm font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <ArrowLeft className="w-4 h-4 text-[#2E4A9E] group-hover:-translate-x-1 transition-transform duration-200" />
                <span>{isVi ? 'Tất cả ưu đãi' : 'All Offers'}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. MAIN CONTENT GRID (8 cols Main + 4 cols Sticky Sidebar)
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 items-start">
            {/* ───────── MAIN COLUMN (8 cols) ───────── */}
            <div className="lg:col-span-8 space-y-8 sm:space-y-10">
              {/* Flyer PNG Showcase Container */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#F6F5F1] border border-[#DEDDD6] shadow-md group">
                <picture className="w-full h-auto block">
                  {flyer.mobileImageUrl && (
                    <source media="(max-width: 640px)" srcSet={flyer.mobileImageUrl} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={flyer.desktopImageUrl || '/images/admissions/admissions-hero.jpg'}
                    alt={title}
                    className="w-full h-auto object-cover max-h-[600px] mx-auto"
                    loading="eager"
                  />
                </picture>

                {/* Floating Badge */}
                {badge && (
                  <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-[#F26522] text-white shadow-lg">
                    {badge}
                  </div>
                )}
              </div>

              {/* Detailed Description / Terms */}
              {content && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs">
                  <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-[#DEDDD6]">
                    <div className="w-9 h-9 rounded-xl bg-[#2E4A9E]/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-[#2E4A9E]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3570]">
                        {isVi
                          ? 'Chi tiết chương trình & Thể lệ áp dụng'
                          : 'Program Details & Eligibility Terms'}
                      </h2>
                      <p className="text-xs text-[#5C6069]">
                        {isVi
                          ? 'Chính sách ưu đãi và cơ chế tài trợ từ EPath Education'
                          : 'Scholarship terms and grant mechanism by EPath Education'}
                      </p>
                    </div>
                  </div>

                  <div className="text-[#20242B] text-sm sm:text-base leading-relaxed space-y-4">
                    <RichTextRenderer html={content} />
                  </div>
                </div>
              )}

              {/* Benefits & Value List */}
              {benefits.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs">
                  <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-[#DEDDD6]">
                    <div className="w-9 h-9 rounded-xl bg-[#8DC63F]/15 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-[#5C9024]" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-[#1E3570]">
                        {isVi
                          ? 'Quyền lợi & Giá trị học bổng nhận được'
                          : 'Student Benefits & Value Package'}
                      </h2>
                      <p className="text-xs text-[#5C6069]">
                        {isVi
                          ? 'Đặc quyền học thuật dành riêng cho học sinh tham gia chương trình'
                          : 'Academic privileges exclusively granted to enrolled candidates'}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    {benefits.map((b, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 py-2 text-xs sm:text-sm text-[#20242B]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#5C9024] flex-shrink-0 mt-0.5" />
                        <span className="leading-snug font-medium">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Linked Academic Pathway Banner */}
              {flyer.targetProgram && (
                <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-[#F6F5F1] border border-[#DEDDD6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-[#2E4A9E] text-white mb-2">
                      {isVi ? 'Lộ trình đào tạo liên kết' : 'Linked Pathway'}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-1">
                      {isVi
                        ? 'Khám phá chi tiết chương trình học thuật chuẩn Hoa Kỳ'
                        : 'Explore The Full US Academic Curriculum'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5C6069]">
                      {isVi
                        ? 'Xem cấu trúc môn học, đầu ra và chuẩn kiểm định Cognia & WASC.'
                        : 'Review curriculum, learning outcomes, and Cognia accreditation.'}
                    </p>
                  </div>

                  <Link
                    href={`/${locale}/programs`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#2E4A9E] hover:text-white text-[#1E3570] text-xs sm:text-sm font-bold border border-[#DEDDD6] hover:border-[#2E4A9E] shadow-xs transition-all duration-200 shrink-0"
                  >
                    <span>{isVi ? 'Xem lộ trình' : 'View Pathway'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Ecosystem Callout (Three-Way Partnership) */}
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
                    ? 'Mỗi học sinh tham gia chương trình ưu đãi đều được cam kết bảo toàn quyền lợi học thuật trọn vẹn: 50% giáo viên quốc tế bản ngữ, 50% giáo viên song ngữ IELTS 7.0+, và 1 cố vấn chuyên trách theo sát từng cột mốc trên nền tảng Edmentum.'
                    : 'Every student claiming this offer is guaranteed complete academic mentorship: 50% international native teachers, 50% bilingual faculty (IELTS 7.0+), and a dedicated Advisor tracking continuous growth.'}
                </p>
                <div className="flex items-center gap-4 text-xs font-semibold text-white/90 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Đánh giá định kỳ khách quan' : 'Objective Periodic Assessments'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Phụ đạo 1:1 lấp lỗ hổng' : '1:1 Tutoring Interventions'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    {isVi ? 'Báo cáo minh bạch định kỳ' : 'Transparent Progress Reporting'}
                  </span>
                </div>
              </div>
            </div>

            {/* ───────── SIDEBAR COLUMN (4 cols) ───────── */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              {/* Quick Specs Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#DEDDD6] shadow-xs">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3570] mb-4 pb-2 border-b border-[#DEDDD6]">
                  {isVi ? 'Thông tin nhanh ưu đãi' : 'Quick Offer Specs'}
                </h3>

                <dl className="space-y-3.5 text-xs sm:text-sm">
                  <div>
                    <dt className="text-[#8E939E] font-medium mb-1">
                      {isVi ? 'Mức ưu đãi / Hình thức' : 'Grant Value / Type'}
                    </dt>
                    <dd className="font-bold text-[#F26522] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#F26522]" />
                      <span>{badge}</span>
                    </dd>
                  </div>

                  <div>
                    <dt className="text-[#8E939E] font-medium mb-1">
                      {isVi ? 'Đối tượng áp dụng' : 'Eligible Candidates'}
                    </dt>
                    <dd className="font-semibold text-[#20242B] leading-snug">{applicableFor}</dd>
                  </div>

                  <div>
                    <dt className="text-[#8E939E] font-medium mb-1">
                      {isVi ? 'Thời hạn hiệu lực' : 'Validity'}
                    </dt>
                    <dd className="font-semibold text-[#20242B] leading-snug">{validUntil}</dd>
                  </div>

                  <div>
                    <dt className="text-[#8E939E] font-medium mb-1">
                      {isVi ? 'Hình thức học tập' : 'Learning Mode'}
                    </dt>
                    <dd className="font-semibold text-[#20242B]">
                      {isVi
                        ? 'Trực tuyến Edmentum + Cố vấn học thuật tại Campus'
                        : 'Edmentum Online + Campus Advisory'}
                    </dd>
                  </div>
                </dl>

                {/* Primary CTA */}
                <div className="pt-5 mt-5 border-t border-[#DEDDD6] space-y-3">
                  <button
                    type="button"
                    onClick={handleOpenRegistration}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#F26522] hover:bg-[#C94F16] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>{ctaText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="tel:0937514896"
                    className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F6F5F1] text-[#1E3570] font-bold text-xs sm:text-sm border border-[#DEDDD6] hover:border-[#2E4A9E] transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#2E4A9E]" />
                    <span>0937 514 896</span>
                  </a>
                </div>
              </div>

              {/* Other Hot Offers List */}
              {otherFlyers.length > 0 && (
                <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-[#DEDDD6] shadow-xs">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[#1E3570] mb-4 pb-2 border-b border-[#DEDDD6]">
                    {isVi ? 'Ưu đãi nổi bật khác' : 'Other Featured Offers'}
                  </h3>

                  <div className="space-y-3">
                    {otherFlyers.map((other) => {
                      const otherTitle = other.title?.[locale] || other.title?.vi || ''
                      const otherBadge = other.badge?.[locale] || other.badge?.vi || ''

                      return (
                        <Link
                          key={other.id}
                          href={`/${locale}/admissions/promotions/${other.id}`}
                          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F6F5F1] border border-transparent hover:border-[#DEDDD6] transition-all duration-200 group"
                        >
                          <div className="w-16 h-12 rounded-lg overflow-hidden bg-[#F6F5F1] shrink-0 border border-[#DEDDD6]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={other.desktopImageUrl || '/images/admissions/admissions-hero.jpg'}
                              alt={otherTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            {otherBadge && (
                              <span className="text-[10px] font-bold text-[#F26522] uppercase tracking-wider block mb-0.5">
                                {otherBadge}
                              </span>
                            )}
                            <h4 className="text-xs sm:text-sm font-bold text-[#1E3570] group-hover:text-[#F26522] transition-colors truncate">
                              {otherTitle}
                            </h4>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8E939E] group-hover:text-[#F26522] group-hover:translate-x-0.5 transition-all shrink-0" />
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
    </div>
  )
}
