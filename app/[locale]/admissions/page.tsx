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
  PhoneCall,
  Laptop,
  Check,
  ClipboardCheck,
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
import { getSettingLocalized, getSettingStr } from '@/lib/settings-helpers'

function AdmissionsContent() {
  const t = useTranslations('admissions')
  const tFooter = useTranslations('footer')
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

  const heroImage = (admissionsHero?.backgroundImage as string) || ''
  const welcomeText =
    (((admissionsHero?.welcomeTitle as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (((admissionsHero?.welcomeTitle as Record<string, string | undefined>) || {})?.vi as string) ||
    (isVi ? 'Tư vấn & Tuyển sinh K-12 Chuẩn Hoa Kỳ' : 'US-Standard K-12 Admissions & Advising')

  const mainTitle =
    (((admissionsHero?.title as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (((admissionsHero?.title as Record<string, string | undefined>) || {})?.vi as string) ||
    (isVi ? 'Khởi Đầu Hành Trình Học Thuật Quốc Tế Bền Vững' : 'Begin Your Global Academic Journey')

  const heroSubtitle =
    (((admissionsHero?.subtitle as Record<string, string | undefined>) || {})[
      locale as 'vi' | 'en'
    ] as string) ||
    (((admissionsHero?.subtitle as Record<string, string | undefined>) || {})?.vi as string) ||
    (isVi
      ? 'Lộ trình rõ ràng từ đánh giá năng lực đầu vào đến nhận Bằng Tú tài Mỹ Cognia & WASC. Tối ưu chi phí giáo dục chỉ bằng 1/3 trường quốc tế.'
      : 'A structured pathway from diagnostic testing to Cognia & WASC US High School Diploma at 1/3 of international school costs.')

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

  // Update program if searchParams change
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
          message: formData.message || `Học sinh: ${formData.studentName || 'Chưa cung cấp'}, Lớp: ${formData.studentGrade || 'Chưa cung cấp'}`,
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

  // Trust highlight badges above-the-fold
  const trustBadges = [
    {
      icon: ShieldCheck,
      color: '#2E4A9E',
      title: isVi ? 'Kiểm Định Kép Hoa Kỳ' : 'US Dual Accreditation',
      desc: isVi ? 'Cognia & WASC công nhận' : 'Cognia & WASC Certified',
    },
    {
      icon: Coins,
      color: '#5C9024',
      title: isVi ? 'Chi Phí Bền Vững' : '1/3 Tuition Advantage',
      desc: isVi ? 'Bằng 1/3 trường quốc tế' : 'Save 67% vs Int\'l Schools',
    },
    {
      icon: FileCheck2,
      color: '#F26522',
      title: isVi ? 'Khảo Sát Chuẩn Xác' : 'Diagnostic Assessment',
      desc: isVi ? 'Test Exact Path miễn phí' : 'Exact Path Benchmark',
    },
    {
      icon: UserCheck,
      color: '#1E3570',
      title: isVi ? 'Cố Vấn 1:1 Đồng Hành' : '1:1 Academic Advisor',
      desc: isVi ? 'Theo sát & báo cáo định kỳ' : 'Weekly Progress Reports',
    },
  ]

  // Default fallback admission steps
  const defaultAdmissionSteps = [
    {
      step: '01',
      icon: PhoneCall,
      turnaround: isVi ? 'Phản hồi trong 24h' : 'Within 24 hours',
      title: isVi ? 'Tiếp Nhận & Tư Vấn Định Hướng' : 'Enquiry & Initial Consultation',
      desc: isVi
        ? 'Chuyên viên học vụ lắng nghe mục tiêu của gia đình, phân tích nguyện vọng học thuật và gợi ý lộ trình phù hợp theo từng độ tuổi.'
        : 'Advisors understand family academic goals and recommend tailored educational pathways for each age group.',
      outcome: isVi ? 'Xác định mục tiêu học tập rõ ràng' : 'Clear academic goals established',
      color: '#2E4A9E',
    },
    {
      step: '02',
      icon: FileCheck2,
      turnaround: isVi ? 'Khảo sát 45 - 60 phút' : '45-60 min test',
      title: isVi ? 'Đánh Giá Năng Lực Chuẩn Quốc Tế' : 'International Diagnostic Test',
      desc: isVi
        ? 'Học sinh thực hiện bài khảo sát năng lực (Exact Path Diagnostic) đo lường chính xác trình độ tiếng Anh học thuật và tư duy số học chuẩn Mỹ.'
        : 'Learners complete the Exact Path test objectively measuring academic English and US Common Core mathematics.',
      outcome: isVi ? 'Báo cáo chi tiết điểm mạnh & lỗ hổng' : 'Comprehensive strength & gap report',
      color: '#5C9024',
    },
    {
      step: '03',
      icon: GraduationCap,
      turnaround: isVi ? 'Kế hoạch cá nhân hóa' : 'Personalized Plan',
      title: isVi ? 'Thiết Kế Lộ Trình & Thời Khóa Biểu' : 'Curriculum & Schedule Customization',
      desc: isVi
        ? 'Ban học vụ xây dựng thời khóa biểu kết hợp (Online + Onsite Campus), cân đối số giờ học, phân bổ môn học và chọn chứng chỉ mục tiêu.'
        : 'Academic Board plans an optimal blended schedule balancing school subjects, workload, and credential targets.',
      outcome: isVi ? 'Lịch học linh hoạt, không quá tải' : 'Balanced, non-overloading timetable',
      color: '#F26522',
    },
    {
      step: '04',
      icon: Laptop,
      turnaround: isVi ? 'Kích hoạt tức thì' : 'Instant Activation',
      title: isVi ? 'Học Thử & Kích Hoạt Tài Khoản' : 'Campus Trial & Account Activation',
      desc: isVi
        ? 'Trải nghiệm lớp học tương tác thực tế cùng giáo viên, đồng thời nhận tài khoản Edmentum International 12 tháng với hơn 400 khóa học chuẩn Mỹ.'
        : 'Experience interactive campus classes and receive 12-month licensed access to 400+ US Common Core courses.',
      outcome: isVi ? 'Học sinh tự tin trước khi nhập học' : 'Student confidence before enrollment',
      color: '#1E3570',
    },
    {
      step: '05',
      icon: Award,
      turnaround: isVi ? 'Đồng hành dài hạn' : 'Long-term Mentorship',
      title: isVi ? 'Nhập Học & Cố Vấn Đồng Hành 1:1' : 'Enrollment & 1:1 Academic Mentorship',
      desc: isVi
        ? 'Học sinh chính thức bắt đầu lộ trình với sự kèm cặp của Cố vấn học vụ 1:1, theo dõi tiến độ hàng tuần và báo cáo định kỳ cho phụ huynh.'
        : 'Formal enrollment backed by weekly 1:1 advisor tracking, milestone check-ins, and parent transparency reports.',
      outcome: isVi ? 'Tích lũy tín chỉ & bằng Tú tài Mỹ' : 'Accredited credits & US Diploma',
      color: '#5C9024',
    },
  ]

  // Dynamic admission steps mapped from CMS (deduplicated by key)
  const rawCmsSteps = (cms.admissionSteps || [])
    .filter((s) => s.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const seenStepKeys = new Set<string>()
  const cmsSteps = rawCmsSteps.filter((s) => {
    const key = `${s.stepNumber || ''}_${(s.title?.vi || s.title?.en || '').toLowerCase().trim()}`
    if (!key || seenStepKeys.has(key)) return false
    seenStepKeys.add(key)
    return true
  })

  const iconMapping: Record<string, typeof PhoneCall> = {
    PhoneCall,
    FileCheck2,
    GraduationCap,
    Laptop,
    Award,
    ClipboardCheck,
    MapPin,
    Clock,
    BookOpen,
  }

  const stepColors = ['#2E4A9E', '#5C9024', '#F26522', '#1E3570', '#5C9024']

  const admissionSteps = cmsSteps.length > 0
    ? cmsSteps.map((s, idx) => {
        const fallback = defaultAdmissionSteps[idx] || defaultAdmissionSteps[0]
        const rawIcon = s.icon && iconMapping[s.icon] ? iconMapping[s.icon] : fallback.icon
        const rawTitle = (isVi ? s.title?.vi : s.title?.en) || s.title?.vi || s.title?.en || fallback.title
        const rawDesc = (isVi ? s.description?.vi : s.description?.en) || s.description?.vi || s.description?.en || fallback.desc
        return {
          step: String(s.stepNumber || idx + 1).padStart(2, '0'),
          icon: rawIcon,
          turnaround: fallback.turnaround,
          title: rawTitle,
          desc: rawDesc,
          outcome: fallback.outcome,
          color: stepColors[idx % stepColors.length],
        }
      })
    : defaultAdmissionSteps

  // FAQ Categories and items
  const faqCategories = [
    { id: 'all', label: isVi ? 'Tất cả (12 câu)' : 'All FAQs (12)' },
    { id: 'diagnostic', label: isVi ? 'Khảo sát đầu vào & Xếp lớp' : 'Diagnostic & Placement' },
    { id: 'curriculum', label: isVi ? 'Bằng cấp & Chương trình Mỹ' : 'Curriculum & Diploma' },
    { id: 'tuition', label: isVi ? 'Học phí & Lịch học' : 'Tuition & Schedules' },
  ]

  // Mapping FAQ items to category filters
  const getFaqCategory = (num: number): string => {
    if ([1, 2, 8].includes(num)) return 'diagnostic'
    if ([3, 4, 7, 9, 10].includes(num)) return 'curriculum'
    return 'tuition' // 5, 6, 11, 12
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
            style={{ background: 'radial-gradient(circle, rgba(141,198,63,0.3) 0%, rgba(46,74,158,0.15) 70%, transparent 100%)' }}
          />
          <div
            className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(46,74,158,0.25) 0%, rgba(240,90,40,0.1) 70%, transparent 100%)' }}
          />
          {heroImage && (
            <div
              className="absolute inset-0 opacity-[0.04] bg-cover bg-center mix-blend-multiply"
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
                  <span>{isVi ? 'Đăng ký tư vấn lộ trình ngay' : 'Register for Free Consultation'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => scrollTo('quy-trinh-tuyen-sinh')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white hover:bg-[#F6F5F1] text-[#1E3570] text-xs sm:text-sm font-bold border border-[#DEDDD6] shadow-xs transition-all duration-300 cursor-pointer"
                >
                  <span>{isVi ? 'Khám phá quy trình 5 bước' : 'Explore 5-Step Process'}</span>
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
                  src="/images/admissions/admissions-hero.jpg"
                  alt="EPath Education Admissions"
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3570]/80 via-transparent to-transparent" />

                {/* Floating Badge on Image */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 backdrop-blur-md text-[#20242B] border border-[#DEDDD6] shadow-md flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#8DC63F]/20 flex items-center justify-center text-[#5C9024] shrink-0 font-black text-xs">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-[#1E3570] truncate">
                      {isVi ? 'Bằng Tú Tài Mỹ Cognia & WASC' : 'Cognia & WASC US Diploma'}
                    </div>
                    <div className="text-[11px] text-[#5C6069] truncate">
                      {isVi ? 'Được công nhận chuyển tiếp toàn cầu' : 'Globally Recognized Credential'}
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
            {trustBadges.map((badge, idx) => {
              const Icon = badge.icon
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
                    <h4 className="text-xs sm:text-sm font-bold text-[#1E3570] truncate group-hover:text-[#5C9024] transition-colors">{badge.title}</h4>
                    <p className="text-[11px] sm:text-xs text-[#5C6069] truncate">{badge.desc}</p>
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. INTERACTIVE 5-STEP ADMISSION STEPPER
      ─────────────────────────────────────────────────────────────── */}
      <section id="quy-trinh-tuyen-sinh" className="py-12 sm:py-16 bg-white border-b border-[#DEDDD6]">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isVi ? 'Hành trình nhập học minh bạch' : '5-Step Admission Journey'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#20242B] mb-2.5">
              {isVi ? 'Quy Trình Tuyển Sinh & Đồng Hành 5 Bước' : '5-Step Admission & Mentorship Journey'}
            </h2>
            <p className="text-[#5C6069] text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              {isVi
                ? 'Mỗi học sinh đều có xuất phát điểm và mục tiêu riêng. EPath chuẩn hóa quy trình 5 bước nhằm đánh giá khách quan và xây dựng lộ trình thành công nhất.'
                : 'Standardized 5-step admissions flow ensuring objective assessment and a personalized success roadmap.'}
            </p>
          </div>

          {/* Stepper Cards */}
          <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
            {admissionSteps.map((step, idx) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.normal, delay: idx * 0.06, ease: easeOut }}
                  className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-6 border border-[#DEDDD6] hover:border-[#2E4A9E]/40 hover:bg-white hover:shadow-md transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                >
                  {/* Step Left: Badge & Icon */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundColor: step.color }}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider"
                          style={{ backgroundColor: `${step.color}15`, color: step.color }}
                        >
                          {isVi ? `Bước ${step.step}` : `Step ${step.step}`}
                        </span>

                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-[#DEDDD6] text-[11px] font-semibold text-[#5C6069]">
                          <Clock className="w-3 h-3 text-[#F26522]" />
                          <span>{step.turnaround}</span>
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors mb-1.5 leading-snug">
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  {/* Step Right: Key Outcome Badge */}
                  <div className="md:w-64 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#DEDDD6]/60 flex items-center md:justify-end">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DEDDD6] text-xs font-semibold text-[#20242B] shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                      <span className="truncate">{step.outcome}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Stepper Bottom Action */}
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => scrollTo('form-tu-van')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4A9E] hover:bg-[#1E3570] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span>{isVi ? 'Bắt đầu Bước 01: Nhận tư vấn ngay' : 'Start Step 01: Get Consultation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. FINANCIAL POLICY & SUSTAINABLE INVESTMENT
      ─────────────────────────────────────────────────────────────── */}
      {/* ─────────────────────────────────────────────────────────────
          3. FINANCIAL POLICY & SUSTAINABLE INVESTMENT (#tuition / #hoc-phi)
      ─────────────────────────────────────────────────────────────── */}
      <section id="tuition" className="py-12 sm:py-16 bg-[#F6F5F1] border-b border-[#DEDDD6] scroll-mt-20 relative">
        <div id="hoc-phi" className="absolute -top-24 pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8DC63F]/20 text-[#5C9024] text-xs font-bold uppercase tracking-wider mb-2.5">
                <Coins className="w-3.5 h-3.5" />
                <span>{isVi ? 'Đầu tư giáo dục bền vững' : 'Sustainable Investment'}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#20242B] mb-2.5">
                {isVi
                  ? 'Gói Học Phí & Chính Sách Tài Chính Minh Bạch'
                  : 'Tuition Packages & Transparent Financial Policy'}
              </h2>
              <p className="text-[#5C6069] text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
                {isVi
                  ? 'EPath cung cấp các lộ trình học tập linh hoạt theo năng lực và mục tiêu từng học sinh, tối ưu ngân sách gia đình với chất lượng quốc tế được kiểm định.'
                  : "EPath offers flexible learning tracks tailored to each student's goals, optimizing family investment with accredited US quality."}
              </p>
            </div>

            {/* 4 Flexible Tuition Tracks / Packages */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10 sm:mb-12 items-stretch">
              {[
                {
                  id: 'foundation',
                  programKey: 'kindergarten',
                  badge: isVi ? 'Mầm non & Khởi đầu' : 'Early Foundation',
                  title: isVi ? 'Foundation Track' : 'Foundation Track',
                  target: isVi ? 'Mầm non & Lớp 1 – 2' : 'Kindy & Grade 1–2',
                  hours: isVi ? '3 – 5 giờ / tuần' : '3 – 5 hrs / week',
                  desc: isVi
                    ? 'Thẩm thấu tiếng Anh tự nhiên qua Cambridge Phonics, Early Math và học tập tương tác đa giác quan.'
                    : 'Natural English phonics, early math thinking, and topic-based interactive learning.',
                  highlights: [
                    isVi ? 'Giáo viên quốc tế & song ngữ' : 'International & bilingual faculty',
                    isVi ? 'Chuẩn Cambridge English' : 'Official Cambridge English standard',
                    isVi ? 'Sĩ số nhỏ, tương tác liên tục' : 'Small class size with high engagement',
                  ],
                  popular: false,
                  badgeBg: '#EAEFFB',
                  badgeColor: '#2E4A9E',
                },
                {
                  id: 'standard',
                  programKey: 'elementary',
                  badge: isVi ? 'Tiểu học & THCS' : 'Elementary & Middle',
                  title: isVi ? 'Standard & Advanced' : 'Standard & Advanced',
                  target: isVi ? 'Lớp 3 – Lớp 8' : 'Grade 3 – Grade 8',
                  hours: isVi ? '5 – 7 giờ / tuần' : '5 – 7 hrs / week',
                  desc: isVi
                    ? 'Toán & Khoa học bằng Tiếng Anh chuẩn Edmentum US Common Core kết hợp phát triển IELTS học thuật.'
                    : 'US Common Core Math & Science via Edmentum plus Cambridge/IELTS academic preparation.',
                  highlights: [
                    isVi ? 'Tài khoản Edmentum 12 tháng' : '12-month licensed Edmentum access',
                    isVi ? 'Học song song trường công' : 'Flexible schedule alongside school',
                    isVi ? 'Cố vấn 1:1 kèm cặp tiến độ' : '1:1 mentor tracking & skill tutoring',
                  ],
                  popular: false,
                  badgeBg: '#EDF7E2',
                  badgeColor: '#5C9024',
                },
                {
                  id: 'dual-diploma',
                  programKey: 'high-dual-diploma',
                  badge: isVi ? 'Song bằng Hoa Kỳ' : 'US Dual Diploma',
                  title: isVi ? 'Dual Diploma Pathway' : 'US Dual Diploma',
                  target: isVi ? 'Lớp 9 – Lớp 12' : 'Grade 9 – Grade 12',
                  hours: isVi ? '5 Tín chỉ Mỹ tích lũy' : '5 US Credits earned',
                  desc: isVi
                    ? 'Hoàn thành 5 tín chỉ Mỹ với EdOptions Academy, nhận đồng thời Bằng THPT Việt Nam và Tú tài Mỹ.'
                    : 'Complete 5 required US credits with EdOptions Academy to earn both VN and US diplomas.',
                  highlights: [
                    isVi ? 'Bằng Tú tài Mỹ Cognia & WASC' : 'Cognia & WASC accredited US Diploma',
                    isVi ? 'Lợi thế vượt trội xét tuyển ĐH' : 'Significant edge for university admissions',
                    isVi ? 'Chương trình song bằng phổ biến' : 'Most popular high school pathway',
                  ],
                  popular: true,
                  badgeBg: '#FDF0EA',
                  badgeColor: '#F26522',
                },
                {
                  id: 'fulltime-homeschool',
                  programKey: 'high-fulltime-homeschool',
                  badge: isVi ? 'Homeschool Toàn phần' : 'Fulltime Homeschool',
                  title: isVi ? 'Fulltime US Diploma' : 'Fulltime US Diploma',
                  target: isVi ? 'Lớp 9 – Lớp 12' : 'Grade 9 – Grade 12',
                  hours: isVi ? '21.5 Tín chỉ chuẩn Hoa Kỳ' : '21.5 US Common Core Credits',
                  desc: isVi
                    ? 'Học toàn thời gian với tư cách học sinh chính thức của trường phổ thông Mỹ trực thuộc Edmentum International.'
                    : 'Fulltime enrollment as an official US high school student under Edmentum International.',
                  highlights: [
                    isVi ? 'Bảng điểm & Bằng Tú tài Mỹ 100%' : '100% official US transcripts & diploma',
                    isVi ? 'Cố vấn chuẩn bị hồ sơ du học' : 'Comprehensive 1:1 college counseling',
                    isVi ? 'Chuyển tiếp thẳng đại học quốc tế' : 'Direct pathway to global universities',
                  ],
                  popular: false,
                  badgeBg: '#EAEFFB',
                  badgeColor: '#1E3570',
                },
              ].map((track) => (
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
                        {track.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-[#5C6069]">
                        {track.target}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#20242B] mb-1 group-hover:text-[#2E4A9E] transition-colors">
                      {track.title}
                    </h3>

                    <div className="inline-block px-2.5 py-1 rounded-lg bg-[#F6F5F1] text-xs font-bold text-[#1E3570] mb-3">
                      {track.hours}
                    </div>

                    <p className="text-xs text-[#5C6069] leading-relaxed mb-4">
                      {track.desc}
                    </p>

                    <div className="space-y-2 pt-3 border-t border-[#DEDDD6]/60 mb-5">
                      {track.highlights.map((h, hIdx) => (
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
              ))}
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
                      src="/images/admissions/admissions-consultation.jpg"
                      alt="EPath Academic Consultation"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full text-[11px] font-black bg-[#1E3570] text-white shadow-sm">
                      {isVi ? 'Kiểm định Cognia & WASC' : 'Cognia & WASC Certified'}
                    </div>
                  </div>

                  <div className="w-11 h-11 rounded-2xl bg-[#8DC63F]/20 text-[#5C9024] flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#EAEFFB] text-[#2E4A9E] mb-2.5 inline-block">
                    {isVi ? 'Mô hình Blended Learning tối ưu' : 'Blended Learning Model'}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-black text-[#20242B] mb-3 leading-tight">
                    {isVi
                      ? 'Vì sao lộ trình tại EPath tối ưu ngân sách cho gia đình?'
                      : 'Why is EPath the most cost-efficient pathway for families?'}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-5">
                    {isVi
                      ? 'Thông qua mô hình học tập kết hợp (Blended Learning) trên nền tảng số hóa của Edmentum International cùng sự đồng hành của đội ngũ giáo viên tại Campus, EPath loại bỏ những chi phí cơ sở vật chất cồng kềnh không cần thiết, tập trung toàn bộ nguồn lực vào chất lượng giảng dạy, cố vấn học thuật 1:1 và chứng nhận quốc tế.'
                      : "By leveraging Edmentum's digital curriculum and campus-based teachers, EPath eliminates bloated campus overheads and invests directly in faculty excellence, 1:1 mentorship, and accredited diploma credentials."}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DEDDD6]">
                  <button
                    type="button"
                    onClick={() => scrollTo('form-tu-van')}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E4A9E] hover:bg-[#1E3570] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <span>{isVi ? 'Nhận Bảng Báo Học Phí Chi Tiết' : 'Request Detailed Tuition Plan'}</span>
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
                    <span>{isVi ? '5 Cam Kết Quyền Lợi Tài Chính Minh Bạch:' : '5 Core Financial Guarantees:'}</span>
                  </h4>

                  <div className="space-y-3">
                    {[
                      {
                        title: isVi ? 'Biểu phí minh bạch, không chi phí ẩn' : 'Transparent Agreement, Zero Hidden Fees',
                        desc: isVi
                          ? 'Toàn bộ chi phí đào tạo và bản quyền học liệu được nêu rõ trước niên khóa, cam kết không phát sinh bất kỳ khoản phụ phí nào.'
                          : 'Clear fee schedule with zero surprise costs throughout the academic school year.',
                      },
                      {
                        title: isVi ? 'Tài khoản Edmentum bản quyền 12 tháng' : '12-Month Licensed Edmentum Account',
                        desc: isVi
                          ? 'Kho bài giảng số hóa không giới hạn với hơn 400 môn học chuẩn Common Core và chứng nhận Cognia & WASC.'
                          : 'Full access to 400+ digital courses aligned with US Common Core and accredited by Cognia & WASC.',
                      },
                      {
                        title: isVi ? 'Khảo sát đầu vào & Tư vấn 1:1 miễn phí' : 'Free Diagnostic Test & 1:1 Consultation',
                        desc: isVi
                          ? 'Hoàn toàn miễn phí bài khảo sát Exact Path Diagnostic và buổi phân tích báo cáo cùng chuyên gia.'
                          : 'Complimentary diagnostic testing and personalized roadmap strategy consultation.',
                      },
                      {
                        title: isVi ? 'Học bổng học thuật cho học sinh xuất sắc' : 'Merit Scholarships for High Achievers',
                        desc: isVi
                          ? 'Chính sách học bổng khuyến học dành cho các học sinh đạt thành tích cao trong học tập và các kỳ thi quốc tế.'
                          : 'Scholarships awarded to students demonstrating exceptional academic and Olympiad performance.',
                      },
                      {
                        title: isVi ? 'Chi phí bền vững, hiệu quả dài hạn' : 'Sustainable & Long-Term Efficiency',
                        desc: isVi
                          ? 'Thụ hưởng giáo dục Hoa Kỳ đẳng cấp với mức đầu tư hợp lý, hoàn thành trọn vẹn lộ trình học tập từ K–12.'
                          : 'Access elite US education at optimal cost, ensuring smooth academic progression from K to 12.',
                      },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6]/80 flex items-start gap-3 text-left"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#8DC63F]/20 text-[#5C9024] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h5 className="text-xs sm:text-sm font-bold text-[#20242B] mb-0.5">{item.title}</h5>
                          <p className="text-xs text-[#5C6069] leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#DEDDD6]/60 flex items-center justify-between text-xs text-[#5C6069]">
                  <span>{isVi ? 'Cần tư vấn biểu phí từng lớp?' : 'Need specific grade tuition?'}</span>
                  <a
                    href="tel:0937514896"
                    className="font-bold text-[#F26522] hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>0937 514 896</span>
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
                  {isVi ? 'Tiếp nhận hồ sơ tuyển sinh' : 'Admissions Form'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#20242B] mb-1.5">
                  {t('form.title')}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {isVi
                    ? 'Vui lòng điền thông tin bên dưới. Chuyên viên học vụ EPath sẽ liên hệ tư vấn lộ trình học tập miễn phí và xếp lịch khảo sát cho con trong vòng 24 giờ.'
                    : 'Please submit your details below. An EPath advisor will contact you within 24 hours to arrange your diagnostic test and consultation.'}
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
                  <h3 className="text-xl font-bold text-[#20242B] mb-2">
                    {t('form.success')}
                  </h3>
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
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.parentName')}
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        className="rounded-xl border-[#DEDDD6] bg-white focus:border-[#2E4A9E] focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all h-10 text-xs sm:text-sm"
                        placeholder={isVi ? 'Nguyễn Văn A' : 'John Smith'}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.phone')}
                      </Label>
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
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.email')}
                      </Label>
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
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.studentName')}
                      </Label>
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
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.grade')}
                      </Label>
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
                      <Label className="text-xs font-bold text-[#20242B]">
                        {t('form.program')}
                      </Label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full rounded-xl border border-[#DEDDD6] bg-white px-3 h-10 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:outline-none focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all cursor-pointer"
                      >
                        <option value="">{t('form.selectProgram')}</option>
                        <option value="kindergarten">{isVi ? 'Tiếng Anh Mầm non Song ngữ' : 'Kindergarten Bilingual English'}</option>
                        <option value="elementary">{isVi ? 'Tiểu học Tiêu chuẩn & Quốc tế (Edmentum)' : 'Elementary US Curriculum'}</option>
                        <option value="middle">{isVi ? 'THCS Tích hợp & IELTS Foundation' : 'Middle School Integrated & IELTS'}</option>
                        <option value="high-dual-diploma">{isVi ? 'Song bằng Tú tài Mỹ (US Dual Diploma)' : 'US Dual Diploma (5 Credits)'}</option>
                        <option value="high-fulltime-homeschool">{isVi ? 'Bằng THPT Mỹ Toàn phần (21.5 Tín chỉ)' : 'Fulltime US High School Diploma'}</option>
                        <option value="other">{isVi ? 'Tư vấn theo mục tiêu riêng của con' : 'Personalized Consultation'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 4: Notes / Message */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#20242B]">
                      {t('form.message')}
                    </Label>
                    <textarea
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-[#DEDDD6] bg-white p-3 text-xs sm:text-sm text-[#20242B] focus:border-[#2E4A9E] focus:outline-none focus:ring-2 focus:ring-[#2E4A9E]/20 transition-all resize-none"
                      placeholder={
                        isVi
                          ? 'Chia sẻ mong muốn của gia đình về mục tiêu học tập, thời gian dự kiến bắt đầu...'
                          : 'Share your child\'s current level, target goals, or expected start date...'
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
                    {isVi
                      ? '🔒 EPath cam kết bảo mật 100% thông tin phụ huynh và học sinh.'
                      : '🔒 EPath commits to 100% confidentiality of your contact details.'}
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
                  src="/images/admissions/admissions-campus.jpg"
                  alt="EPath Campus"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3570]/70 via-transparent to-transparent" />
                <div className="absolute bottom-2.5 left-3 right-3 text-white text-xs font-bold flex items-center gap-1.5 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-[#8DC63F] shrink-0" />
                  <span className="truncate">
                    {isVi
                      ? 'Campus EPath · 38 Trần Phú, Thủ Dầu Một, Bình Dương'
                      : 'EPath Campus · 38 Tran Phu St, Thu Dau Mot, Binh Duong'}
                  </span>
                </div>
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EAEFFB] text-[#2E4A9E] mb-2 inline-block">
                  {isVi ? 'Địa chỉ & Hotline chính thức' : 'Official Campus & Contact'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#20242B] mb-1.5">
                  {t('contact.title')}
                </h2>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {isVi
                    ? 'Phụ huynh luôn được chào đón đến thăm quan cơ sở vật chất và trao đổi trực tiếp cùng ban giám đốc học thuật.'
                    : 'Parents are always welcome to tour our campus and meet our academic leadership team.'}
                </p>
              </div>

              {/* Campus Address Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-4.5 border border-[#DEDDD6] shadow-2xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#2E4A9E]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <MapPin className="w-5 h-5 text-[#2E4A9E]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">{t('contact.address')}</h3>
                  <p className="text-[#5C6069] text-xs leading-relaxed">
                    {getSettingLocalized(settings as Record<string, unknown>, 'addressVi', 'addressEn', locale) ||
                      tFooter('contact.address') ||
                      (isVi
                        ? '38 Trần Phú, Phường Chánh Nghĩa, TP. Thủ Dầu Một, Bình Dương'
                        : '38 Tran Phu Street, Chanh Nghia Ward, Thu Dau Mot City, Binh Duong')}
                  </p>
                </div>
              </div>

              {/* Hotline Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-4.5 border border-[#DEDDD6] shadow-2xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#8DC63F]/20 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Phone className="w-5 h-5 text-[#5C9024]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">{t('contact.hotline')}</h3>
                  <a
                    href="tel:0937514896"
                    className="text-[#20242B] text-xs sm:text-sm font-bold hover:text-[#F26522] transition-colors"
                  >
                    {getSettingStr(settings as Record<string, unknown>, 'hotline') || '0937 514 896'}
                  </a>
                  <p className="text-[11px] text-[#5C6069]">{isVi ? 'Hỗ trợ tư vấn học vụ 24/7' : '24/7 Academic Support'}</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-4.5 border border-[#DEDDD6] shadow-2xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#F26522]/15 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Mail className="w-5 h-5 text-[#F26522]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">{t('contact.emailLabel')}</h3>
                  <a
                    href="mailto:infor@epath.edu.vn"
                    className="text-[#5C6069] text-xs sm:text-sm hover:text-[#2E4A9E] transition-colors"
                  >
                    {getSettingStr(settings as Record<string, unknown>, 'contactEmail') || 'infor@epath.edu.vn'}
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-[#F6F5F1] rounded-2xl p-4 sm:p-4.5 border border-[#DEDDD6] shadow-2xs hover:shadow-sm transition-all group flex items-start gap-3.5">
                <div className="w-10 h-10 bg-[#1E3570]/10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Clock className="w-5 h-5 text-[#1E3570]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#20242B] text-xs sm:text-sm mb-0.5">{t('contact.hours')}</h3>
                  <p className="text-[#5C6069] text-xs">
                    {getSettingLocalized(settings as Record<string, unknown>, 'workingHoursVi', 'workingHoursEn', locale) ||
                      (isVi ? 'Thứ 2 – Thứ 7: 08:00 – 17:30' : 'Mon – Sat: 08:00 – 17:30')}
                  </p>
                </div>
              </div>

              {/* Campus Tour Invitation Card */}
              <div className="rounded-2xl p-4.5 bg-[#EAEFFB] border border-[#2E4A9E]/20 text-left">
                <h4 className="text-xs font-bold text-[#2E4A9E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#2E4A9E]" />
                  <span>{isVi ? 'Hẹn Lịch Thăm Quan Campus' : 'Schedule a Campus Tour'}</span>
                </h4>
                <p className="text-xs text-[#20242B] leading-relaxed mb-3">
                  {isVi
                    ? 'Trải nghiệm không gian học tập thực tế và trao đổi 1:1 với Ban Giám Đốc Học Vụ.'
                    : 'Tour our modern classrooms and speak directly with academic directors.'}
                </p>
                <a
                  href="tel:0937514896"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E4A9E] hover:underline"
                >
                  <span>{isVi ? 'Gọi đặt hẹn ngay: 0937 514 896' : 'Book via Hotline: 0937 514 896'}</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
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
