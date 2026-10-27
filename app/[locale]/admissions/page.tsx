'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Sparkles,
  Send,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  GraduationCap,
  Award,
  BookOpen,
  UserCheck,
  FileCheck2,
  HelpCircle,
  Check,
  Laptop,
  PhoneCall,
  ListOrdered,
  Calendar,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import { getSettingLocalized } from '@/lib/settings-helpers'
import { DEFAULT_ADMISSIONS_DATA } from '@/lib/admissions-data'
import type { AdmissionsContentInput } from '@/lib/cms-types'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Coins,
  FileCheck2,
  UserCheck,
  GraduationCap,
  Award,
  BookOpen,
  Sparkles,
  Clock,
  Laptop,
  PhoneCall,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Check,
  ListOrdered,
  Calendar,
}

function resolveIcon(name?: string, defaultIcon = ShieldCheck) {
  if (!name) return defaultIcon
  return ICON_MAP[name] || defaultIcon
}

function AdmissionsContent() {
  const t = useTranslations('admissions')
  const searchParams = useSearchParams()
  const locale = useLocale()
  const isVi = locale === 'vi'

  const { data: cms } = useCmsContext()
  const admissionsHero =
    ((cms.heroContent as Record<string, Record<string, unknown> | null>).admissions as Record<
      string,
      unknown
    >) || {}
  const settings = cms.siteSettings

  // Resolve dynamic admissions page content with defaults
  const rawAdmissions = cms.admissionsContent
  const admissionsData: AdmissionsContentInput = {
    hero: {
      ...DEFAULT_ADMISSIONS_DATA.hero,
      ...(rawAdmissions?.hero || {}),
    },
    trustBadges: rawAdmissions?.trustBadges?.length
      ? rawAdmissions.trustBadges
      : DEFAULT_ADMISSIONS_DATA.trustBadges,
    stepsSection: {
      ...DEFAULT_ADMISSIONS_DATA.stepsSection,
      ...(rawAdmissions?.stepsSection || {}),
    },
    tuition: {
      ...DEFAULT_ADMISSIONS_DATA.tuition,
      ...(rawAdmissions?.tuition || {}),
      tracks: rawAdmissions?.tuition?.tracks?.length
        ? rawAdmissions.tuition.tracks
        : DEFAULT_ADMISSIONS_DATA.tuition.tracks,
    },
    financialPolicy: {
      ...DEFAULT_ADMISSIONS_DATA.financialPolicy,
      ...(rawAdmissions?.financialPolicy || {}),
      guarantees: rawAdmissions?.financialPolicy?.guarantees?.length
        ? rawAdmissions.financialPolicy.guarantees
        : DEFAULT_ADMISSIONS_DATA.financialPolicy.guarantees,
    },
    campusSection: {
      ...DEFAULT_ADMISSIONS_DATA.campusSection,
      ...(rawAdmissions?.campusSection || {}),
    },
    formSection: {
      ...DEFAULT_ADMISSIONS_DATA.formSection,
      ...(rawAdmissions?.formSection || {}),
    },
  }

  // Hero Fields
  const heroImage =
    admissionsData.hero.imageUrl ||
    (admissionsHero?.backgroundImage as string) ||
    '/images/admissions/admissions-hero.jpg'

  const welcomeText =
    admissionsData.hero.badge?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.badge?.vi ||
    (((admissionsHero?.welcomeTitle as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (isVi ? 'Tư vấn & Tuyển sinh K-12 Chuẩn Hoa Kỳ' : 'US-Standard K-12 Admissions & Advising')

  const mainTitle =
    admissionsData.hero.title?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.title?.vi ||
    (((admissionsHero?.title as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (isVi ? 'Khởi Đầu Hành Trình Học Thuật Quốc Tế Bền Vững' : 'Begin Your Global Academic Journey')

  const heroSubtitle =
    admissionsData.hero.subtitle?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.subtitle?.vi ||
    (((admissionsHero?.subtitle as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (isVi
      ? 'Lộ trình rõ ràng từ đánh giá năng lực đầu vào đến nhận Bằng Tú tài Mỹ Cognia & WASC. Tối ưu chi phí giáo dục chỉ bằng 1/3 trường quốc tế.'
      : 'A structured pathway from diagnostic testing to Cognia & WASC US High School Diploma at 1/3 of international school costs.')

  const primaryCta =
    admissionsData.hero.primaryCtaText?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.primaryCtaText?.vi ||
    (isVi ? 'Đăng ký tư vấn lộ trình ngay' : 'Register for Free Consultation')

  const secondaryCta =
    admissionsData.hero.secondaryCtaText?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.secondaryCtaText?.vi ||
    (isVi ? 'Xem gói học phí' : 'View Tuition Packages')

  const floatingBadgeTitle =
    admissionsData.hero.floatingBadgeTitle?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.floatingBadgeTitle?.vi ||
    (isVi ? 'Bằng Tú Tài Mỹ Cognia & WASC' : 'Cognia & WASC US Diploma')

  const floatingBadgeSubtitle =
    admissionsData.hero.floatingBadgeSubtitle?.[locale as 'vi' | 'en'] ||
    admissionsData.hero.floatingBadgeSubtitle?.vi ||
    (isVi ? 'Được công nhận chuyển tiếp toàn cầu' : 'Globally Recognized Credential')

  // Query parameter pre-population (e.g. /admissions?program=kindergarten)
  const initialProgram = searchParams.get('program') || ''

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentName: '',
    studentGrade: '',
    program: initialProgram,
    message: '',
  })

  useEffect(() => {
    if (initialProgram) {
      setFormData((prev) => ({ ...prev, program: initialProgram }))
    }
  }, [initialProgram])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('all')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone.trim()) return
    setIsSubmitting(true)
    try {
      await fetch('/api/public/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name || formData.studentName || 'Phụ huynh quan tâm Tuyển sinh',
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          childAge: formData.studentGrade || '',
          program: formData.program || 'Tư vấn Tuyển sinh & Lộ trình',
          message:
            formData.message ||
            `Học sinh: ${formData.studentName || 'Chưa cung cấp'}, Lớp: ${formData.studentGrade || 'Chưa cung cấp'}`,
          source: 'website',
          locale,
        }),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('Lead submit error:', err)
      setSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Smooth scroll to target section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // FAQ Categories and items
  const faqCategories = [
    { id: 'all', label: isVi ? 'Tất cả (12 câu)' : 'All FAQs (12)' },
    { id: 'diagnostic', label: isVi ? 'Khảo sát đầu vào & Xếp lớp' : 'Diagnostic & Placement' },
    { id: 'curriculum', label: isVi ? 'Bằng cấp & Chương trình Mỹ' : 'Curriculum & Diploma' },
    { id: 'tuition', label: isVi ? 'Học phí & Lịch học' : 'Tuition & Schedules' },
  ]

  const getFaqCategory = (num: number): string => {
    if ([1, 2, 8].includes(num)) return 'diagnostic'
    if ([3, 4, 7, 9, 10].includes(num)) return 'curriculum'
    return 'tuition'
  }

  const allFaqNums = Array.from({ length: 12 }, (_, i) => i + 1)
  const filteredFaqNums =
    activeFaqCategory === 'all'
      ? allFaqNums
      : allFaqNums.filter((num) => getFaqCategory(num) === activeFaqCategory)

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          1. HERO BANNER WITH TRUST-FIRST CREDIBILITY BADGES
      ─────────────────────────────────────────────────────────────── */}
      <section
        className="pt-28 sm:pt-32 pb-12 sm:pb-16 relative overflow-hidden border-b border-[#DEDDD6]"
        style={{ backgroundColor: '#F6F5F1' }}
        aria-label={mainTitle}
      >
        {/* Background visual accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(141,198,63,0.3) 0%, rgba(46,74,158,0.15) 70%, transparent 100%)',
            }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(46,74,158,0.25) 0%, rgba(240,90,40,0.1) 70%, transparent 100%)',
            }}
          />
          {heroImage && (
            <div
              className="absolute inset-0 opacity-[0.03] bg-cover bg-center mix-blend-multiply"
              style={{ backgroundImage: `url(${heroImage})` }}
            />
          )}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center max-w-6xl mx-auto">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-left">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.normal, ease: easeOut }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-[#1E3570] border border-[#DEDDD6] text-xs font-bold uppercase tracking-wider mb-4 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
                <span>{welcomeText}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, delay: 0.08, ease: easeOut }}
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3.5 tracking-tight leading-tight text-[#1E3570]"
                style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
              >
                {mainTitle}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, delay: 0.16, ease: easeOut }}
                className="text-sm sm:text-base text-[#5C6069] leading-relaxed font-normal mb-6 max-w-xl"
              >
                {heroSubtitle}
              </motion.p>

              {/* CTA Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: duration.slow, delay: 0.24, ease: easeOut }}
                className="flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => scrollTo('form-tu-van')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#F26522] hover:bg-[#C94F16] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <span>{primaryCta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('tuition')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F6F5F1] text-[#1E3570] text-xs sm:text-sm font-bold border border-[#DEDDD6] shadow-xs transition-all duration-300 cursor-pointer"
                >
                  <span>{secondaryCta}</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#8DC63F]" />
                </button>
              </motion.div>
            </div>

            {/* Hero Right Visual Showcase */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: duration.slow, delay: 0.18, ease: easeOut }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-lg border border-[#DEDDD6] bg-white aspect-[4/3] sm:aspect-[16/11]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage}
                  alt="EPath Education Admissions"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Softened gradient overlay so photo preserves crisp contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3570]/35 via-transparent to-transparent pointer-events-none" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md text-[#20242B] border border-[#DEDDD6] shadow-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8DC63F]/20 flex items-center justify-center text-[#5C9024] shrink-0 font-black text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-[#1E3570] truncate">
                      {floatingBadgeTitle}
                    </div>
                    <div className="text-[11px] text-[#5C6069] truncate">
                      {floatingBadgeSubtitle}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Above-The-Fold Trust Bar in Clean White Cards */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.slow, delay: 0.32, ease: easeOut }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto mt-10 pt-6 border-t border-[#DEDDD6]"
          >
            {admissionsData.trustBadges.map((badge, idx) => {
              const Icon = resolveIcon(badge.icon, ShieldCheck)
              const badgeTitle = badge.title?.[locale as 'vi' | 'en'] || badge.title?.vi
              const badgeDesc = badge.desc?.[locale as 'vi' | 'en'] || badge.desc?.vi
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#DEDDD6] flex items-center gap-3 text-left group hover:border-[#8DC63F]/60 hover:shadow-xs transition-all duration-200"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: `${badge.color}15`, color: badge.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E3570] truncate group-hover:text-[#5C9024] transition-colors">
                      {badgeTitle}
                    </h4>
                    <p className="text-[11px] sm:text-xs text-[#5C6069] truncate">{badgeDesc}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. FINANCIAL POLICY & SUSTAINABLE INVESTMENT (#tuition / #hoc-phi)
      ─────────────────────────────────────────────────────────────── */}
      <section id="tuition" className="py-12 sm:py-16 bg-[#F6F5F1] border-b border-[#DEDDD6] scroll-mt-20 relative">
        <div id="hoc-phi" className="absolute -top-24 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8DC63F]/20 text-[#5C9024] text-xs font-bold uppercase tracking-wider mb-2.5">
                <Coins className="w-3.5 h-3.5" />
                <span>
                  {admissionsData.tuition.badge?.[locale as 'vi' | 'en'] ||
                    admissionsData.tuition.badge?.vi}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#20242B] mb-2.5">
                {admissionsData.tuition.title?.[locale as 'vi' | 'en'] ||
                  admissionsData.tuition.title?.vi}
              </h2>
              <p className="text-[#5C6069] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                {admissionsData.tuition.subtitle?.[locale as 'vi' | 'en'] ||
                  admissionsData.tuition.subtitle?.vi}
              </p>
            </div>

            {/* 4 Flexible Tuition Tracks / Packages */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 sm:mb-12 items-stretch">
              {admissionsData.tuition.tracks.map((track) => {
                const trackTitle = track.title?.[locale as 'vi' | 'en'] || track.title?.vi
                const trackBadge = track.badge?.[locale as 'vi' | 'en'] || track.badge?.vi
                const trackTarget = track.target?.[locale as 'vi' | 'en'] || track.target?.vi
                const trackHours = track.hours?.[locale as 'vi' | 'en'] || track.hours?.vi
                const trackDesc = track.desc?.[locale as 'vi' | 'en'] || track.desc?.vi
                const trackHighlights =
                  track.highlights?.[locale as 'vi' | 'en'] || track.highlights?.vi || []

                return (
                  <div
                    key={track.id}
                    className={`bg-white rounded-3xl p-5 sm:p-6 border flex flex-col justify-between transition-all duration-300 relative group hover:shadow-md ${
                      track.popular
                        ? 'border-[#F26522] ring-2 ring-[#F26522]/20 shadow-sm'
                        : 'border-[#DEDDD6]'
                    }`}
                  >
                    {track.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#F26522] text-white shadow-xs">
                        {isVi ? 'Phổ biến nhất' : 'Most Popular'}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: track.badgeBg, color: track.badgeColor }}
                        >
                          {trackBadge}
                        </span>
                        <span className="text-[11px] font-semibold text-[#5C6069]">
                          {trackTarget}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-[#20242B] mb-1 group-hover:text-[#2E4A9E] transition-colors">
                        {trackTitle}
                      </h3>

                      <div className="inline-block px-2.5 py-1 rounded-lg bg-[#F6F5F1] text-xs font-bold text-[#1E3570] mb-3">
                        {trackHours}
                      </div>

                      <p className="text-xs text-[#5C6069] leading-relaxed mb-4">{trackDesc}</p>

                      <div className="space-y-2 pt-3 border-t border-[#DEDDD6]/60 mb-5">
                        {trackHighlights.map((h, hIdx) => (
                          <div key={hIdx} className="flex items-start gap-2 text-xs text-[#20242B]">
                            <Check className="w-3.5 h-3.5 text-[#5C9024] shrink-0 mt-0.5" />
                            <span className="leading-snug">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, program: track.programKey }))
                        scrollTo('form-tu-van')
                      }}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                        track.popular
                          ? 'bg-[#F26522] hover:bg-[#C94F16] text-white shadow-xs'
                          : 'bg-[#F6F5F1] hover:bg-[#2E4A9E] text-[#20242B] hover:text-white border border-[#DEDDD6]'
                      }`}
                    >
                      <span>{isVi ? 'Đăng ký tư vấn gói này' : 'Enquire This Track'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Two-Column Financial Policy & 5 Core Guarantees */}
            <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {/* Left Box: Value Advantage */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.normal, ease: easeOut }}
                className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-[#DEDDD6] shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Photo Accent */}
                  <div className="relative rounded-2xl overflow-hidden mb-5 border border-[#DEDDD6] aspect-[16/10] bg-[#F6F5F1]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        admissionsData.financialPolicy.leftBoxImage ||
                        '/images/admissions/admissions-consultation.jpg'
                      }
                      alt="EPath Academic Consultation"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#1E3570] text-white shadow-sm">
                      {admissionsData.financialPolicy.leftBoxBadge?.[locale as 'vi' | 'en'] ||
                        admissionsData.financialPolicy.leftBoxBadge?.vi}
                    </div>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#8DC63F]/20 text-[#5C9024] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EAEFFB] text-[#2E4A9E] mb-2.5 inline-block">
                    {admissionsData.financialPolicy.badge?.[locale as 'vi' | 'en'] ||
                      admissionsData.financialPolicy.badge?.vi}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-[#20242B] mb-3 leading-tight">
                    {admissionsData.financialPolicy.leftBoxTitle?.[locale as 'vi' | 'en'] ||
                      admissionsData.financialPolicy.leftBoxTitle?.vi}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-5">
                    {admissionsData.financialPolicy.leftBoxDesc?.[locale as 'vi' | 'en'] ||
                      admissionsData.financialPolicy.leftBoxDesc?.vi}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DEDDD6]">
                  <button
                    type="button"
                    onClick={() => scrollTo('form-tu-van')}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E4A9E] hover:bg-[#1E3570] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <span>
                      {admissionsData.financialPolicy.buttonText?.[locale as 'vi' | 'en'] ||
                        admissionsData.financialPolicy.buttonText?.vi}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>

              {/* Right Box: 5 Financial Commitments */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.normal, delay: 0.1, ease: easeOut }}
                className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-[#DEDDD6] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#2E4A9E] uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#5C9024]" />
                    <span>
                      {admissionsData.financialPolicy.rightBoxTitle?.[locale as 'vi' | 'en'] ||
                        admissionsData.financialPolicy.rightBoxTitle?.vi}
                    </span>
                  </h4>

                  <div className="space-y-3">
                    {admissionsData.financialPolicy.guarantees.map((item, i) => {
                      const gTitle = item.title?.[locale as 'vi' | 'en'] || item.title?.vi
                      const gDesc = item.desc?.[locale as 'vi' | 'en'] || item.desc?.vi
                      return (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6]/80 flex items-start gap-3 text-left"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#8DC63F]/20 text-[#5C9024] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#20242B] mb-0.5">{gTitle}</h5>
                            <p className="text-xs text-[#5C6069] leading-relaxed">{gDesc}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEDDD6]/60 flex items-center justify-between text-xs text-[#5C6069]">
                  <span>{isVi ? 'Cần tư vấn biểu phí từng lớp?' : 'Need specific grade tuition?'}</span>
                  <a
                    href={`tel:${admissionsData.campusSection.hotline.replace(/\s+/g, '')}`}
                    className="font-bold text-[#F26522] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{admissionsData.campusSection.hotline}</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. REGISTRATION FORM & CAMPUS CONTACT HUB
      ─────────────────────────────────────────────────────────────── */}
      <section id="form-tu-van" className="py-12 sm:py-16 bg-white border-b border-[#DEDDD6]">
        <div id="contact" className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start max-w-6xl mx-auto">
            {/* Form Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, ease: easeOut }}
              className="lg:col-span-7 bg-[#F6F5F1] rounded-3xl p-6 sm:p-8 border border-[#DEDDD6] shadow-sm"
            >
              <div className="mb-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAEFFB] text-[#2E4A9E] mb-2 inline-block">
                  {admissionsData.formSection.badge?.[locale as 'vi' | 'en'] ||
                    admissionsData.formSection.badge?.vi}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#20242B] mb-1.5">
                  {admissionsData.formSection.title?.[locale as 'vi' | 'en'] ||
                    admissionsData.formSection.title?.vi}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {admissionsData.formSection.description?.[locale as 'vi' | 'en'] ||
                    admissionsData.formSection.description?.vi}
                </p>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: easeOut }}
                  className="text-center py-10 bg-white rounded-2xl border border-[#DEDDD6] p-6 shadow-xs"
                >
                  <div className="w-14 h-14 bg-[#8DC63F]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-7 h-7 text-[#5C9024]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#20242B] mb-2">{t('form.success')}</h3>
                  <p className="text-[#5C6069] mb-6 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                    {t('form.successText')}
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="rounded-full px-6 py-2.5 text-xs font-bold border-[#2E4A9E] text-[#2E4A9E] hover:bg-[#2E4A9E] hover:text-white transition-all"
                  >
                    {t('form.registerMore')}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Row 1: Parent Name & Phone */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.parentName')}</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder={isVi ? 'Nguyễn Văn A' : 'John Smith'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.phone')}</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder="0912 345 678"
                      />
                    </div>
                  </div>

                  {/* Row 2: Email & Student Name */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.email')}</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder="email@example.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.studentName')}</Label>
                      <Input
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder={isVi ? 'Tên học sinh (nếu có)' : 'Student name (optional)'}
                      />
                    </div>
                  </div>

                  {/* Row 3: Grade Level & Program of Interest */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.grade')}</Label>
                      <select
                        value={formData.studentGrade}
                        onChange={(e) => setFormData({ ...formData, studentGrade: e.target.value })}
                        className="w-full rounded-xl border border-[#DEDDD6] bg-white px-3 h-10 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:outline-none focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all cursor-pointer"
                      >
                        <option value="">{t('form.selectGrade')}</option>
                        <option value="kindergarten">{isVi ? 'Mầm non (3 – 6 tuổi)' : 'Kindergarten (3–6 yrs)'}</option>
                        <option value="primary-1-2">{isVi ? 'Tiểu học Lớp 1 – 2' : 'Elementary Grade 1–2'}</option>
                        <option value="primary-3-5">{isVi ? 'Tiểu học Lớp 3 – 5' : 'Elementary Grade 3–5'}</option>
                        <option value="middle-6-8">{isVi ? 'THCS Lớp 6 – 8' : 'Middle School Grade 6–8'}</option>
                        <option value="high-9-12">{isVi ? 'THPT Lớp 9 – 12' : 'High School Grade 9–12'}</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">{t('form.program')}</Label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full rounded-xl border border-[#DEDDD6] bg-white px-3 h-10 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:outline-none focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all cursor-pointer"
                      >
                        <option value="">{t('form.selectProgram')}</option>
                        <option value="kindergarten">
                          {isVi ? 'Tiếng Anh Mầm non Song ngữ' : 'Kindergarten Bilingual English'}
                        </option>
                        <option value="elementary">
                          {isVi ? 'Tiểu học Tiêu chuẩn & Quốc tế (Edmentum)' : 'Elementary US Curriculum'}
                        </option>
                        <option value="middle">
                          {isVi ? 'THCS Tích hợp & IELTS Foundation' : 'Middle School Integrated & IELTS'}
                        </option>
                        <option value="high-dual-diploma">
                          {isVi ? 'Song bằng Tú tài Mỹ (US Dual Diploma)' : 'US Dual Diploma (5 Credits)'}
                        </option>
                        <option value="high-fulltime-homeschool">
                          {isVi ? 'Bằng THPT Mỹ Toàn phần (21.5 Tín chỉ)' : 'Fulltime US High School Diploma'}
                        </option>
                        <option value="other">
                          {isVi ? 'Tư vấn theo mục tiêu riêng của con' : 'Personalized Consultation'}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Notes / Message */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#20242B]">{t('form.message')}</Label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-[#DEDDD6] bg-white p-3 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:outline-none focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all resize-none"
                      placeholder={
                        isVi
                          ? 'Chia sẻ mong muốn của gia đình về mục tiêu học tập, thời gian dự kiến bắt đầu...'
                          : "Share your child's current level, target goals, or expected start date..."
                      }
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-[#F26522] hover:bg-[#C94F16] text-white rounded-xl h-11 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 gap-2 cursor-pointer"
                    disabled={isSubmitting}
                  >
                    <span>{isSubmitting ? t('form.submitting') : t('form.submit')}</span>
                    <Send className="w-3.5 h-3.5" />
                  </Button>

                  <p className="text-center text-[11px] text-[#5C6069] pt-1">
                    {admissionsData.formSection.confidentialityNote?.[locale as 'vi' | 'en'] ||
                      admissionsData.formSection.confidentialityNote?.vi}
                  </p>
                </form>
              )}
            </motion.div>

            {/* Contact Info Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, delay: 0.12, ease: easeOut }}
              className="lg:col-span-5 space-y-4"
            >
              {/* Campus Photo Header */}
              <div className="relative rounded-2xl overflow-hidden border border-[#DEDDD6] shadow-sm aspect-[16/9] bg-[#F6F5F1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    admissionsData.campusSection.campusImage ||
                    '/images/admissions/admissions-campus.jpg'
                  }
                  alt="EPath Campus"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Softened gradient overlay so campus photo preserves crisp contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3570]/35 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-[#8DC63F] shrink-0" />
                  <span className="truncate">
                    {admissionsData.campusSection.addressValue?.[locale as 'vi' | 'en'] ||
                      admissionsData.campusSection.addressValue?.vi}
                  </span>
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAEFFB] text-[#2E4A9E] mb-2 inline-block">
                  {admissionsData.campusSection.badge?.[locale as 'vi' | 'en'] ||
                    admissionsData.campusSection.badge?.vi}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#20242B] mb-1.5">
                  {admissionsData.campusSection.title?.[locale as 'vi' | 'en'] ||
                    admissionsData.campusSection.title?.vi}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {admissionsData.campusSection.subtitle?.[locale as 'vi' | 'en'] ||
                    admissionsData.campusSection.subtitle?.vi}
                </p>
              </div>

              {/* Campus Address Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-5 border border-[#DEDDD6] shadow-xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#2E4A9E]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <MapPin className="w-5 h-5 text-[#2E4A9E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">
                    {admissionsData.campusSection.addressLabel?.[locale as 'vi' | 'en'] ||
                      admissionsData.campusSection.addressLabel?.vi}
                  </h3>
                  <p className="text-xs font-bold text-[#1E3570] mb-0.5">EPath Education</p>
                  <p className="text-[#5C6069] text-xs leading-relaxed">
                    {admissionsData.campusSection.addressValue?.[locale as 'vi' | 'en'] ||
                      admissionsData.campusSection.addressValue?.vi}
                  </p>
                </div>
              </div>

              {/* Hotline Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-5 border border-[#DEDDD6] shadow-xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#8DC63F]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-5 h-5 text-[#5C9024]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">
                    {isVi ? 'Thông tin liên hệ' : 'Contact Information'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                    Hotline:{' '}
                    <a
                      href={`tel:${admissionsData.campusSection.hotline.replace(/\s+/g, '')}`}
                      className="text-[#1E3570] font-bold hover:text-[#F26522] transition-colors"
                    >
                      {admissionsData.campusSection.hotline}
                    </a>
                  </p>
                  <p className="text-[11px] text-[#5C6069]">
                    {admissionsData.campusSection.hotlineNote?.[locale as 'vi' | 'en'] ||
                      admissionsData.campusSection.hotlineNote?.vi}
                  </p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-5 border border-[#DEDDD6] shadow-xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#F26522]/15 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-5 h-5 text-[#F26522]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">Email</h3>
                  <a
                    href={`mailto:${admissionsData.campusSection.email}`}
                    className="text-[#5C6069] text-xs sm:text-sm hover:text-[#2E4A9E] transition-colors font-medium"
                  >
                    {admissionsData.campusSection.email}
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-5 border border-[#DEDDD6] shadow-xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#1E3570]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Clock className="w-5 h-5 text-[#1E3570]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">{t('contact.hours')}</h3>
                  <p className="text-[#5C6069] text-xs">
                    {admissionsData.campusSection.workingHours?.[locale as 'vi' | 'en'] ||
                      admissionsData.campusSection.workingHours?.vi ||
                      getSettingLocalized(settings as Record<string, unknown>, 'workingHoursVi', 'workingHoursEn', locale) ||
                      (isVi ? 'Thứ 2 – Thứ 7: 08:00 – 17:30' : 'Mon – Sat: 08:00 – 17:30')}
                  </p>
                </div>
              </div>

              {/* Campus Tour Invitation Card */}
              <div className="rounded-2xl p-5 bg-gradient-to-br from-[#EAEFFB] to-[#F4F7FD] border border-[#2E4A9E]/25 shadow-xs hover:shadow-sm transition-all text-left">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 bg-[#2E4A9E] text-white rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#1E3570] mb-1">
                      {admissionsData.campusSection.tourTitle?.[locale as 'vi' | 'en'] ||
                        admissionsData.campusSection.tourTitle?.vi}
                    </h4>
                    <p className="text-xs text-[#5C6069] leading-relaxed mb-3.5">
                      {admissionsData.campusSection.tourDesc?.[locale as 'vi' | 'en'] ||
                        admissionsData.campusSection.tourDesc?.vi}
                    </p>
                    <a
                      href={`tel:${admissionsData.campusSection.hotline.replace(/\s+/g, '')}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs font-bold shadow-xs hover:shadow transition-all duration-200"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>
                        {isVi
                          ? `Gọi đặt hẹn ngay: ${admissionsData.campusSection.hotline}`
                          : `Book via Hotline: ${admissionsData.campusSection.hotline}`}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. 12 FAQs ACCORDION WITH QUICK CATEGORY FILTERS
      ─────────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-12 sm:py-16 bg-[#F6F5F1]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-2.5">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{isVi ? 'Giải đáp thắc mắc tuyển sinh' : 'Admissions FAQ'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#20242B] mb-2.5">
              {t('faq.title')}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed max-w-xl mx-auto">
              {isVi
                ? 'Tổng hợp các câu hỏi phụ huynh thường quan tâm nhất về bài khảo sát đầu vào, bằng cấp Mỹ, học phí và mô hình học tập.'
                : 'Answers to common parent questions on diagnostics, US diploma accreditation, tuition, and blended schedules.'}
            </p>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
              {faqCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFaqCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    activeFaqCategory === cat.id
                      ? 'bg-[#1E3570] text-white shadow-xs'
                      : 'bg-white text-[#5C6069] border border-[#DEDDD6] hover:text-[#20242B] hover:border-[#2E4A9E]/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-[#DEDDD6] shadow-sm">
            <Accordion type="single" collapsible className="w-full">
              {filteredFaqNums.map((num, idx) => {
                const qKey = `faq.q${num}`
                const aKey = `faq.a${num}`
                return (
                  <AccordionItem
                    key={num}
                    value={`q${num}`}
                    className={idx === filteredFaqNums.length - 1 ? 'border-b-0' : 'border-b border-[#DEDDD6]'}
                  >
                    <AccordionTrigger className="text-left font-bold text-[#20242B] hover:text-[#2E4A9E] text-xs sm:text-sm sm:text-base py-3.5 leading-snug cursor-pointer">
                      <span className="flex items-start gap-2.5 pr-2">
                        <span className="text-[#2E4A9E] shrink-0 font-extrabold text-xs sm:text-sm">
                          {String(num).padStart(2, '0')}.
                        </span>
                        <span>{(t as unknown as (k: string) => string)(qKey)}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-[#5C6069] leading-relaxed text-xs sm:text-sm pb-4 pt-1 pl-6 sm:pl-7">
                      {(t as unknown as (k: string) => string)(aKey)}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </div>
        </div>
      </section>
    </>
  )
}

export default function AdmissionsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F5F1]" />}>
      <AdmissionsContent />
    </Suspense>
  )
}
