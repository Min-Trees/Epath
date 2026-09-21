'use client'

import { Target, Eye, Heart, Users, BookOpen, Sparkles, GraduationCap, Award, ArrowRight, CheckCircle2, Globe2, Trophy, Cpu, ShieldCheck, Compass } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { useRegistrationModal } from '@/components/registration-modal-context'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Locale } from '@/lib/cms-types'


// Fallback Faculty & Academic Board
const fallbackFaculty = [
  {
    id: 'international-teachers',
    name: { vi: '50% Giáo viên Quốc tế', en: '50% International Teachers' },
    tag: { vi: 'Giảng dạy bằng Tiếng Anh 100%', en: '100% English Instruction' },
    role: { vi: 'Giáo viên Quốc tế', en: 'International Faculty' },
    bio: {
      vi: 'Ưu tiên có bằng Cử nhân Giáo dục Tiểu học hoặc Trung học (Elementary / Secondary Education), dày dặn kinh nghiệm giảng dạy các môn học thuật (Academic Subjects) theo chuẩn giáo dục Hoa Kỳ và Cambridge.',
      en: 'Prioritised with Bachelor of Elementary or Secondary Education, extensive experience teaching academic subjects under US and Cambridge standards.',
    },
    point1: {
      vi: 'Trực tiếp giảng dạy các tiết học trực tuyến và trực tiếp về Toán, Khoa học, Ngữ văn Anh (ELA).',
      en: 'Directly teaches online and in-person lessons in Math, Science, and English Language Arts (ELA).',
    },
    point2: {
      vi: 'Hình thành phản xạ ngôn ngữ tự nhiên, ngữ âm chuẩn xác và tư duy phản biện cho học sinh.',
      en: 'Cultivates natural language reflexes, accurate phonics, and critical thinking skills for students.',
    },
    avatarUrl: '/images/about/faculty-international.jpg',
    order: 0,
    isActive: true,
  },
  {
    id: 'bilingual-teachers',
    name: { vi: '50% Giáo viên Song ngữ', en: '50% Bilingual Teachers' },
    tag: { vi: 'IELTS 7.0+ & Chuyên môn Sư phạm', en: 'IELTS 7.0+ & Pedagogical Expertise' },
    role: { vi: 'Giáo viên Song ngữ', en: 'Bilingual Faculty' },
    bio: {
      vi: 'Đội ngũ thầy cô Việt Nam sở hữu chứng chỉ IELTS từ 7.0 trở lên, có năng lực tiếng Anh học thuật xuất sắc và thấu hiểu sâu sắc đặc điểm tâm lý, rào cản ngôn ngữ của học sinh Việt Nam.',
      en: "Vietnamese faculty holding IELTS 7.0+, possessing excellent academic English proficiency and deep empathy for Vietnamese learners' language barriers.",
    },
    point1: {
      vi: 'Đồng hành hướng dẫn, giải thích các khái niệm học thuật khó và củng cố kiến thức cho từng bạn.',
      en: 'Accompanies learners, explains complex academic concepts, and reinforces key knowledge.',
    },
    point2: {
      vi: 'Hỗ trợ cá nhân hóa việc học, tổ chức các buổi phụ đạo (tutor) nhằm lấp đầy lỗ hổng kiến thức kịp thời.',
      en: 'Supports personalised learning, providing tutoring sessions to bridge knowledge gaps promptly.',
    },
    avatarUrl: '/images/about/faculty-bilingual.jpg',
    order: 1,
    isActive: true,
  },
  {
    id: 'academic-advisors',
    name: { vi: 'Cố vấn Học thuật (Academic Advisor)', en: 'Academic Advisors' },
    tag: { vi: 'Đồng hành Cá nhân hóa 1:1', en: '1:1 Personalised Mentorship' },
    role: { vi: 'Cố vấn Học thuật', en: 'Academic Advisor' },
    bio: {
      vi: 'Mỗi học sinh tại EPath được phân công riêng một Cố vấn Học thuật theo sát toàn bộ quá trình học tập, quản lý tiến độ hoàn thành bài học trên hệ thống Edmentum, và là cầu nối vững chắc với phụ huynh.',
      en: 'Each EPath student is assigned a dedicated Academic Advisor to oversee their learning pathway, manage Edmentum progress, and maintain close partnership with parents.',
    },
    point1: {
      vi: 'Đánh giá năng lực định kỳ, phát hiện điểm mạnh và tư vấn lựa chọn môn học / môn AP phù hợp.',
      en: 'Periodic capability assessments, identifying strengths, and advising on course / AP subject selection.',
    },
    point2: {
      vi: 'Đại diện phụ huynh theo dõi tiến trình học thuật và xây dựng hồ sơ ứng tuyển đại học quốc tế.',
      en: 'Represents parents in tracking academic milestones and crafting competitive global university portfolios.',
    },
    avatarUrl: '/images/about/faculty-advisors.jpg',
    order: 2,
    isActive: true,
  },
]

function pick(v: { vi?: string; en?: string } | string | undefined, locale: Locale): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v[locale] || v.vi || v.en || ''
}

export default function AboutPage() {
  const t = useTranslations('about')
  const locale = useLocale() as Locale
  const isVi = locale === 'vi'
  const { openRegistrationModal } = useRegistrationModal()

  const { data: cms } = useCmsContext()
  const aboutContent = cms.aboutContent
  const coreValues = cms.coreValues

  // Intro paragraphs
  const introText = pick(aboutContent?.introContent, locale)
  const introParagraphs = introText
    ? introText.split('\n\n').filter(Boolean)
    : [t('intro.p1'), t('intro.p2'), t('intro.p3'), t('intro.p4'), t('intro.p5')]

  // Deduplicate and cap CMS core values to the canonical 6 values
  const uniqueCoreValues = (coreValues || [])
    .filter((v) => v.isActive !== false)
    .reduce<typeof coreValues>((acc, curr) => {
      const title = (curr.title?.vi || curr.title?.en || '').trim().toLowerCase()
      if (!acc.some((item) => (item.title?.vi || item.title?.en || '').trim().toLowerCase() === title)) {
        acc.push(curr)
      }
      return acc
    }, [])
    .slice(0, 6)

  const displayValues = uniqueCoreValues.length > 0 ? uniqueCoreValues : []
  const heroImage = aboutContent?.heroImage || ''

  // Team / Faculty members from CMS
  const teamMembers = (cms.teamMembers || []).filter(m => m.isActive !== false)
  const displayFaculty = teamMembers.length > 0 ? teamMembers : fallbackFaculty
  const facultySectionTitle = pick(aboutContent?.facultyTitle, locale) || t('faculty.title')
  const facultySectionSubtitle = pick(aboutContent?.facultySubtitle, locale) || t('faculty.subtitle')

  const facultyIcons = [Globe2, GraduationCap, ShieldCheck]
  const facultyAccents = [
    { color: '#2E4A9E', borderHover: 'hover:border-[#2E4A9E]/40', badgeBg: 'bg-[#2E4A9E]' },
    { color: '#5C9024', borderHover: 'hover:border-[#8DC63F]/50', badgeBg: 'bg-[#8DC63F]' },
    { color: '#F26522', borderHover: 'hover:border-[#F26522]/40', badgeBg: 'bg-[#F26522]' },
  ]

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          INTRO & STATS – Interactive cards & image zoom
      ─────────────────────────────────────────────────────────────── */}
      <section id="about" className="pt-28 sm:pt-32 pb-12 sm:pb-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, ease: easeOut }}
            >
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-semibold mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                {t('intro.title')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-4 leading-tight">
                {pick(aboutContent?.introTitle, locale) || t('hero.title')}
              </h2>
              <div className="space-y-3 text-[#5C6069] leading-relaxed text-sm sm:text-base">
                {introParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6">
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className="bg-[#F6F5F1] rounded-xl p-3.5 text-center border border-[#DEDDD6] shadow-xs hover:shadow-sm hover:border-[#2E4A9E]/30 transition-all cursor-default"
                >
                  <div className="text-3xl sm:text-4xl font-black text-[#2E4A9E] mb-0.5">10+</div>
                  <div className="text-xs font-medium text-[#5C6069]">{t('stats.years')}</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className="bg-[#F6F5F1] rounded-xl p-3.5 text-center border border-[#DEDDD6] shadow-xs hover:shadow-sm hover:border-[#8DC63F]/50 transition-all cursor-default"
                >
                  <div className="text-3xl sm:text-4xl font-black text-[#5C9024] mb-0.5">4</div>
                  <div className="text-xs font-medium text-[#5C6069]">{t('stats.levels')}</div>
                </motion.div>
                <motion.div
                  whileHover={{ y: -3, scale: 1.02 }}
                  transition={{ duration: 0.35, ease: easeOut }}
                  className="bg-[#F6F5F1] rounded-xl p-3.5 text-center border border-[#DEDDD6] shadow-xs hover:shadow-sm hover:border-[#F26522]/30 transition-all cursor-default"
                >
                  <div className="text-3xl sm:text-4xl font-black text-[#F26522] mb-0.5">60+</div>
                  <div className="text-xs font-medium text-[#5C6069]">{t('stats.edmentum')}</div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, ease: easeOut }}
              className="relative group max-w-md mx-auto lg:max-w-none"
            >
              <div className="aspect-4/3 sm:aspect-square rounded-2xl shadow-lg overflow-hidden border border-[#DEDDD6] relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroImage || '/images/about/about-story.jpg'}
                  alt={pick(aboutContent?.introTitle, locale) || t('hero.title')}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.35, ease: easeOut }}
                className="absolute -bottom-4 -right-4 bg-[#F26522] hover:bg-[#C94F16] text-white rounded-xl p-4 shadow-xl transition-colors duration-300"
              >
                <div className="text-2xl sm:text-3xl font-black">60+</div>
                <div className="text-xs font-medium">{t('stats.edmentum')}</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          VISION & MISSION – Compact & Wide in 1 section
      ─────────────────────────────────────────────────────────────── */}
      <section id="vision" className="py-10 sm:py-12 bg-[#F6F5F1]">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-6 sm:mb-8 max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-2 shadow-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>{isVi ? 'Định hướng phát triển' : 'Strategic Foundation'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#20242B] mb-2 leading-tight">
              {isVi ? 'Tầm Nhìn & Sứ Mệnh EPath Education' : 'Vision & Mission of EPath Education'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed max-w-2xl mx-auto">
              {isVi
                ? 'Kim chỉ nam định hướng mọi giải pháp học thuật và hoạt động đồng hành, xây dựng bệ phóng vững chắc để học sinh Việt Nam tự tin vươn ra thế giới.'
                : 'Guiding all academic solutions and partnerships, creating a sustainable launchpad for Vietnamese students to confidently integrate into the world.'}
            </p>
          </motion.div>

          {/* Cards Grid - Wider max-w-7xl and Compact */}
          <div className="grid md:grid-cols-2 gap-5 lg:gap-6 items-stretch">
            {/* 1. VISION CARD */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, ease: easeOut }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs border border-[#DEDDD6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="w-10 h-10 bg-[#2E4A9E]/10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-108 shadow-xs">
                    <Eye className="w-5 h-5 text-[#2E4A9E]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#2E4A9E]/10 text-[#2E4A9E] border border-[#2E4A9E]/20">
                    {isVi ? 'Tầm nhìn chiến lược' : 'Strategic Vision'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#1E3570] mb-1">
                  {pick(aboutContent?.visionTitle, locale) || t('vision')}
                </h3>
                <p className="text-xs font-semibold text-[#2E4A9E] mb-3">
                  {isVi ? 'Kiến tạo nền tảng giáo dục quốc tế bền vững' : 'Building a Sustainable Global Education Pathway'}
                </p>

                {/* Lead Quote */}
                <div className="p-3 rounded-xl bg-[#F6F5F1] border-l-3 border-[#2E4A9E] mb-4">
                  <p className="text-xs sm:text-sm text-[#20242B] font-medium leading-relaxed">
                    “{pick(aboutContent?.visionContent, locale) || t('visionText')}”
                  </p>
                </div>

                {/* Key Strategic Pillars */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-[11px] font-bold text-[#1E3570] uppercase tracking-wider">
                    {isVi ? 'Trụ Cột Phát Triển Dài Hạn' : 'Key Strategic Pillars'}
                  </h4>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <Globe2 className="w-4 h-4 text-[#2E4A9E] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Tiếp cận toàn cầu: ' : 'Global access: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Xóa bỏ rào cản tài chính & địa lý, mang bằng cấp chuẩn Mỹ đến mọi học sinh.' : 'Accessible US-accredited diplomas for all students.'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <BookOpen className="w-4 h-4 text-[#2E4A9E] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Lộ trình K–12: ' : 'K-12 pathway: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Hành trình xuyên suốt từ Mầm non đến THPT, đảm bảo liên tục không đứt gãy.' : 'Continuous seamless journey from Kindergarten through High School.'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <Sparkles className="w-4 h-4 text-[#2E4A9E] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Tư duy suốt đời: ' : 'Lifelong mindset: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Nuôi dưỡng niềm say mê tri thức, tự tin hội nhập và thích ứng toàn cầu.' : 'Fostering intellectual passion and global adaptability.'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Bottom Box */}
              <div className="p-2.5 rounded-xl bg-[#2E4A9E]/5 border border-[#2E4A9E]/20 mt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2E4A9E] shrink-0" />
                  <p className="text-xs text-[#20242B] font-medium truncate">
                    {t('visionHighlight')}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* 2. MISSION CARD */}
            <motion.div
              id="mission"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.slow, delay: 0.08, ease: easeOut }}
              className="bg-white rounded-2xl p-5 sm:p-6 lg:p-7 shadow-xs border border-[#DEDDD6] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Header Badge & Icon */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="w-10 h-10 bg-[#8DC63F]/15 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-108 shadow-xs">
                    <Target className="w-5 h-5 text-[#5C9024]" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#8DC63F]/15 text-[#5C9024] border border-[#8DC63F]/30">
                    {isVi ? 'Sứ mệnh hành động' : 'Action Mission'}
                  </span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#1E3570] mb-1">
                  {pick(aboutContent?.missionTitle, locale) || t('mission')}
                </h3>
                <p className="text-xs font-semibold text-[#5C9024] mb-3">
                  {isVi ? 'Đồng hành toàn diện cùng học sinh & gia đình' : 'Comprehensive Partnership with Learners & Families'}
                </p>

                {/* Lead Quote */}
                <div className="p-3 rounded-xl bg-[#F6F5F1] border-l-3 border-[#8DC63F] mb-4">
                  <p className="text-xs sm:text-sm text-[#20242B] font-medium leading-relaxed">
                    “{pick(aboutContent?.missionContent, locale) || t('missionText')}”
                  </p>
                </div>

                {/* Key Mission Pillars */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-[11px] font-bold text-[#1E3570] uppercase tracking-wider">
                    {isVi ? 'Trụ Cột Hành Động Cốt Lõi' : 'Core Action Pillars'}
                  </h4>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <Users className="w-4 h-4 text-[#5C9024] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Đồng hành 3 bên: ' : 'Tripartite partnership: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Cố vấn học thuật 1:1 đồng hành cùng phụ huynh và học sinh từng giai đoạn.' : '1:1 Academic mentorship guiding student and parent progress.'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <GraduationCap className="w-4 h-4 text-[#5C9024] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Chuẩn hóa quốc tế: ' : 'Standardized excellence: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Tích hợp Edmentum K-12, khảo thí Cambridge và thực nghiệm FabLab EIU.' : 'Combining Edmentum K-12, Cambridge ESOL, and FabLab EIU.'}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#F6F5F1]/70 border border-[#EBEAE4]">
                    <Award className="w-4 h-4 text-[#5C9024] shrink-0" />
                    <p className="text-xs text-[#20242B]">
                      <strong className="font-bold">{isVi ? 'Năng lực toàn diện: ' : '21st Century skills: '}</strong>
                      <span className="text-[#5C6069]">{isVi ? 'Rèn luyện tự học, tư duy phản biện và xây dựng Student Portfolio cạnh tranh.' : 'Self-directed learning, critical thinking, and global portfolios.'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Highlight Bottom Box */}
              <div className="p-2.5 rounded-xl bg-[#8DC63F]/10 border border-[#8DC63F]/30 mt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                  <p className="text-xs text-[#20242B] font-medium truncate">
                    {t('missionP2')}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          CORE VALUES – Staggered interactive cards
      ─────────────────────────────────────────────────────────────── */}
      <section id="values" className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8DC63F]/15 text-[#5C9024] text-xs font-semibold mb-3">
              <Award className="w-3.5 h-3.5" />
              {t('coreValues.title')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">
              {t('coreValues.title')}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6069]">
              {t('coreValues.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {(displayValues.length > 0
              ? displayValues
              : [0, 1, 2, 3, 4, 5].map((idx) => ({
                  id: `v-${idx}`,
                  title: { vi: t(`coreValues.items.v${idx + 1}.title`), en: t(`coreValues.items.v${idx + 1}.title`) },
                  description: { vi: t(`coreValues.items.v${idx + 1}.desc`), en: t(`coreValues.items.v${idx + 1}.desc`) },
                }))
            ).map((value, index) => {
              const accent = accentCycle[index % accentCycle.length]
              const valTitle = pick(value.title, locale)
              const valDesc = pick(value.description, locale)

              return (
                <motion.div
                  key={value.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.slow, delay: index * 0.06, ease: easeOut }}
                  className="bg-[#F6F5F1] hover:bg-white rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#2E4A9E]/30 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="flex items-start gap-3.5">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-108 shadow-xs"
                      style={{ backgroundColor: accent.bg }}
                    >
                      <Award className="w-5 h-5" style={{ color: accent.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span
                          className="text-[11px] font-black tracking-wider uppercase"
                          style={{ color: accent.color }}
                        >
                          0{index + 1}
                        </span>
                        <h3 className="text-base font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors duration-300">
                          {valTitle}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                        {valDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          EPATH LEARNING PATHWAY – Foundation Stage (K-8)
      ─────────────────────────────────────────────────────────────── */}
      <section id="pathway" className="py-10 sm:py-14 bg-[#F6F5F1] border-t border-[#DEDDD6]">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-8 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1E3570]/10 text-[#1E3570] text-xs font-bold uppercase tracking-wider mb-2.5">
              <BookOpen className="w-3.5 h-3.5 text-[#8DC63F]" />
              <span>{locale === 'vi' ? 'Giai đoạn Nền tảng Học thuật' : 'Foundation Academic Stage'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E3570] mb-2">
              {locale === 'vi' ? 'Xây Dựng Năng Lực Học Thuật & Tư Duy Quốc Tế (Mầm non – Lớp 8)' : 'Building Core Academic & Global Competencies (K–8)'}
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
              {locale === 'vi'
                ? 'Mục tiêu quan trọng nhất trong giai đoạn nền tảng không phải bằng cấp mà là xây dựng năng lực cốt lõi: tiếng Anh học thuật, tư duy Toán – Khoa học, kỹ năng học độc lập và phản biện.'
                : 'The foundation priority is building core capabilities: academic English, Math/Science reasoning, independent study, and critical thinking.'}
            </p>
          </motion.div>

          {/* Stage 1: Foundation - Centered Wide Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.slow, ease: easeOut }}
            className="bg-white rounded-2xl p-6 sm:p-8 border border-[#DEDDD6] hover:border-[#1E3570]/30 shadow-xs hover:shadow-md transition-all"
          >
            <div className="grid sm:grid-cols-3 gap-3.5 mb-6">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F6F5F1] border border-[#EBEAE4]">
                <CheckCircle2 className="w-4 h-4 text-[#8DC63F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#20242B]">
                    {locale === 'vi' ? 'Phản Xạ Ngôn Ngữ' : 'Language Reflex'}
                  </h4>
                  <p className="text-xs text-[#5C6069] mt-0.5">
                    {locale === 'vi' ? 'Phát triển phản xạ tiếng Anh tự nhiên & chuẩn bị nền tảng IELTS 5.5+.' : 'Natural English reflexes & early IELTS 5.5+ preparation.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F6F5F1] border border-[#EBEAE4]">
                <CheckCircle2 className="w-4 h-4 text-[#8DC63F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#20242B]">
                    {locale === 'vi' ? 'Toán & Khoa Học' : 'Math & Science'}
                  </h4>
                  <p className="text-xs text-[#5C6069] mt-0.5">
                    {locale === 'vi' ? 'Tiếp cận Toán & Khoa học chuẩn US Common Core & Cambridge.' : 'US Common Core Math & Science plus Cambridge English.'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F6F5F1] border border-[#EBEAE4]">
                <CheckCircle2 className="w-4 h-4 text-[#8DC63F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#20242B]">
                    {locale === 'vi' ? 'Tích Lũy Tín Chỉ Sớm' : 'Early Credits'}
                  </h4>
                  <p className="text-xs text-[#5C6069] mt-0.5">
                    {locale === 'vi' ? 'Lớp 8 trải nghiệm 1–2 môn tích lũy tín chỉ cùng EdOptions Academy.' : 'Grade 8 credit-bearing course trial with EdOptions Academy.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#DEDDD6]/60">
              <p className="text-xs text-[#5C6069]">
                {locale === 'vi' ? 'Tìm hiểu toàn diện các lộ trình học tập từ Mầm non đến THPT tại trang Chương trình.' : 'Explore continuous pathways from Kindergarten to High School on our Programs page.'}
              </p>
              <Link
                href={`/${locale}/programs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E3570] hover:bg-[#2E4A9E] text-white text-xs sm:text-sm font-bold shadow-xs transition-all shrink-0"
              >
                <span>{locale === 'vi' ? 'Xem chi tiết chương trình học' : 'View Academic Programs'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          FACULTY & ACADEMIC BOARD – 50/50 Model + Academic Advisors
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F6F5F1]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-semibold mb-3">
              <Users className="w-3.5 h-3.5" />
              {facultySectionTitle}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">
              {facultySectionTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6069]">
              {facultySectionSubtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {displayFaculty.map((item, idx) => {
              const IconComponent = facultyIcons[idx % facultyIcons.length] || Users
              const theme = facultyAccents[idx % facultyAccents.length] || facultyAccents[0]

              const cardTitle = pick(item.name as { vi?: string; en?: string } | string, locale)
              const cardTag = pick(item.tag as { vi?: string; en?: string } | string, locale) ||
                pick(item.role as { vi?: string; en?: string } | string, locale)
              const cardBio = pick(item.bio as { vi?: string; en?: string } | string, locale)
              const cardP1 = pick(item.point1 as { vi?: string; en?: string } | string, locale)
              const cardP2 = pick(item.point2 as { vi?: string; en?: string } | string, locale)
              const cardImg = item.avatarUrl || (
                idx === 0 ? '/images/about/faculty-international.jpg' :
                idx === 1 ? '/images/about/faculty-bilingual.jpg' :
                '/images/about/faculty-advisors.jpg'
              )

              return (
                <motion.div
                  key={item.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.slow, delay: 0.06 * idx, ease: easeOut }}
                  className={`bg-white rounded-2xl border border-[#DEDDD6] ${theme.borderHover} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
                >
                  <div>
                    <div className="h-44 sm:h-48 w-full overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cardImg}
                        alt={cardTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div
                        className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-sm"
                        style={{ color: theme.color }}
                      >
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {cardTag && (
                        <span className={`absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${theme.badgeBg} text-white shadow-xs`}>
                          {cardTag}
                        </span>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#20242B] mb-2.5">
                        {cardTitle}
                      </h3>
                      {cardBio && (
                        <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-4">
                          {cardBio}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <div className="space-y-2 pt-4 border-t border-[#DEDDD6]/60">
                      {cardP1 && (
                        <div className="flex items-start gap-2 text-xs text-[#20242B]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.color }} />
                          <span>{cardP1}</span>
                        </div>
                      )}
                      {cardP2 && (
                        <div className="flex items-start gap-2 text-xs text-[#20242B]">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: theme.color }} />
                          <span>{cardP2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          ACHIEVEMENTS – Verified Academic Metrics & Olympiad Records
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#F26522]/10 text-[#F26522] text-xs font-semibold mb-3">
              <Trophy className="w-3.5 h-3.5" />
              {t('achievements.title')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">
              {t('achievements.title')}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6069]">
              {t('achievements.subtitle')}
            </p>
          </motion.div>

          <div className="max-w-6xl mx-auto space-y-8">
            {/* 4 Major Academic Metrics */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: 0.05, ease: easeOut }}
                className="bg-[#F6F5F1] rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#2E4A9E]/30 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#2E4A9E] mb-1">
                  {t('achievements.stat1Number')}
                </div>
                <h4 className="font-bold text-[#20242B] text-sm mb-1">
                  {t('achievements.stat1Label')}
                </h4>
                <p className="text-xs text-[#5C6069] leading-relaxed">
                  {t('achievements.stat1Desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: 0.1, ease: easeOut }}
                className="bg-[#F6F5F1] rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#5C9024]/40 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#5C9024] mb-1">
                  {t('achievements.stat2Number')}
                </div>
                <h4 className="font-bold text-[#20242B] text-sm mb-1">
                  {t('achievements.stat2Label')}
                </h4>
                <p className="text-xs text-[#5C6069] leading-relaxed">
                  {t('achievements.stat2Desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: 0.15, ease: easeOut }}
                className="bg-[#F6F5F1] rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#F26522]/30 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#F26522] mb-1">
                  {t('achievements.stat3Number')}
                </div>
                <h4 className="font-bold text-[#20242B] text-sm mb-1">
                  {t('achievements.stat3Label')}
                </h4>
                <p className="text-xs text-[#5C6069] leading-relaxed">
                  {t('achievements.stat3Desc')}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: 0.2, ease: easeOut }}
                className="bg-[#F6F5F1] rounded-2xl p-5 border border-[#DEDDD6] hover:border-[#1E3570]/30 hover:shadow-md transition-all text-center"
              >
                <div className="text-3xl sm:text-4xl font-black text-[#1E3570] mb-1">
                  {t('achievements.stat4Number')}
                </div>
                <h4 className="font-bold text-[#20242B] text-sm mb-1">
                  {t('achievements.stat4Label')}
                </h4>
                <p className="text-xs text-[#5C6069] leading-relaxed">
                  {t('achievements.stat4Desc')}
                </p>
              </motion.div>
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
                  src="/images/about/about-achievements.jpg"
                  alt={t('achievements.olympiadTitle')}
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#20242B] text-xs font-bold shadow-md">
                  <Trophy className="w-4 h-4 text-[#F26522]" />
                  <span>SASMO • AMC • TIMO • Vanda</span>
                </div>
              </div>
              <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-bold mb-3 w-fit">
                  <Trophy className="w-3.5 h-3.5 text-[#2E4A9E]" />
                  <span>{locale === 'vi' ? 'Dấu Ấn Xuất Sắc' : 'Outstanding Milestone'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#20242B] mb-2.5 leading-snug">
                  {t('achievements.olympiadTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-6">
                  {t('achievements.olympiadDesc')}
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/${locale}/programs`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#2E4A9E] text-white font-bold text-xs shadow-md hover:bg-[#1E3570] transition-colors"
                  >
                    <span>{locale === 'vi' ? 'Xem Lộ Trình Học Thuật' : 'Explore Academic Pathways'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM CTA
      ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-12 sm:py-16"
        style={{ background: 'linear-gradient(135deg, #1E3570 0%, #2E4A9E 100%)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-lg mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2.5">{t('cta.title')}</h2>
            <p className="text-white/85 text-sm sm:text-base mb-6 leading-relaxed">{t('cta.subtitle')}</p>
            <button
              type="button"
              onClick={() => openRegistrationModal({ source: 'about-bottom-cta' })}
              className="inline-flex items-center gap-2.5 bg-[#F26522] hover:bg-[#C94F16] text-white px-7 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>{t('cta.button')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </>
  )
}
