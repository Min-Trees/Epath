'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { ExternalLink, Award, BookOpen, Wrench, ArrowRight, Sparkles, Check } from 'lucide-react'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import type { Partner } from '@/lib/cms-types'
import { SubpageHero } from '@/components/subpages/subpage-hero'

const fallbackPartners: Partner[] = [
  {
    id: 'edmentum',
    name: 'Edmentum International & EdOptions Academy',
    logoUrl: '',
    website: 'https://www.edmentum.com',
    category: 'curriculum',
    description: {
      vi: 'Tổ chức giáo dục K-12 hàng đầu Hoa Kỳ với hơn 60 năm kinh nghiệm, phục vụ 5.2 triệu học sinh mỗi năm trên 100 quốc gia. Trường trực tuyến EdOptions Academy được kiểm định toàn diện bởi Cognia và WASC, cấp bằng Tú tài Mỹ (U.S. High School Diploma) và cung cấp hơn 400 khóa học chuẩn quốc tế gồm các môn Tín chỉ nâng cao AP® được College Board phê duyệt.',
      en: 'Leading US K-12 digital curriculum and accredited online schooling provider with 60+ years of educational excellence, serving 5.2 million students annually across 100+ countries. EdOptions Academy is fully accredited by Cognia and WASC, awarding the official U.S. High School Diploma with 400+ courses including College Board approved AP® courses.',
    },
    features: [
      { vi: 'Kiểm định chất lượng giáo dục bởi Cognia và WASC', en: 'Accredited by Cognia and WASC' },
      { vi: 'Chương trình AP® được College Board phê duyệt & NCAA công nhận', en: 'College Board approved AP® courses and NCAA eligible' },
      { vi: 'Hơn 400 khóa học chuẩn Hoa Kỳ từ lớp 6 đến lớp 12', en: '400+ US curriculum courses from Grade 6 to Grade 12' },
      { vi: '92% học sinh hoàn tất đỗ vào các trường đại học uy tín tại Hoa Kỳ', en: '92% of graduates accepted into leading universities' },
    ],
    isFeatured: true,
    order: 0,
    isActive: true,
    status: 'PUBLISHED' as const,
    rejectionReason: '',
    scheduledAt: '',
    publishedAt: '',
    createdByUid: '',
    createdByEmail: '',
    createdByName: '',
    lastReviewerUid: '',
    lastReviewerEmail: '',
    lastReviewerName: '',
    submittedAt: '',
    reviewedAt: '',
  },
  {
    id: 'cambridge',
    name: 'Cambridge Assessment English',
    logoUrl: '',
    website: 'https://www.cambridgeenglish.org',
    category: 'certification',
    description: {
      vi: 'Hội đồng Khảo thí tiếng Anh thuộc Đại học Cambridge (Vương quốc Anh) – tổ chức hàng đầu thế giới trong đánh giá năng lực ngôn ngữ. Khung năng lực Cambridge English Qualifications được tích hợp xuyên suốt tại EPath, xác định chính xác trình độ và chuẩn bị nền tảng tiếng Anh học thuật để học sinh tự tin học các môn phổ thông quốc tế.',
      en: 'World-renowned English language assessment organization part of the University of Cambridge (UK). The Cambridge English Qualifications framework is integrated throughout EPath tracks, setting clear benchmarks from Young Learners to IELTS Academic.',
    },
    features: [
      { vi: 'Đánh giá khách quan theo khung Cambridge English Qualifications', en: 'Standardized assessment on Cambridge English Qualifications' },
      { vi: 'Lộ trình chuẩn hóa từ Starters, Movers, Flyers đến IELTS', en: 'Structured progression from Young Learners to IELTS' },
      { vi: 'Xây dựng tiếng Anh học thuật như một công cụ học tập đa môn', en: 'Develops academic English as a multidisciplinary study tool' },
      { vi: 'Rút ngắn lộ trình nền tảng, tối ưu thời gian và chi phí cho gia đình', en: 'Streamlined foundational pathway saving time and investment' },
    ],
    isFeatured: true,
    order: 1,
    isActive: true,
    status: 'PUBLISHED' as const,
    rejectionReason: '',
    scheduledAt: '',
    publishedAt: '',
    createdByUid: '',
    createdByEmail: '',
    createdByName: '',
    lastReviewerUid: '',
    lastReviewerEmail: '',
    lastReviewerName: '',
    submittedAt: '',
    reviewedAt: '',
  },
  {
    id: 'fablab',
    name: 'FabLab EIU – Trường Đại học Quốc tế Miền Đông',
    logoUrl: '',
    website: 'https://eiu.edu.vn',
    category: 'lab',
    description: {
      vi: 'Không gian sáng tạo (makerspace) công nghệ cao trực thuộc Trường Đại học Quốc tế Miền Đông (EIU). EPath hợp tác cùng FabLab EIU mang đến cho học sinh môi trường thực hành sáng tạo với công nghệ in 3D, thiết kế CAD, lập trình Robotics và các dự án STEAM thực nghiệm, kết nối lý thuyết học thuật với ứng dụng thực tế.',
      en: 'State-of-the-art makerspace affiliated with Eastern International University (EIU). EPath partners with FabLab EIU to provide hands-on STEM education, 3D printing, CAD design, robotics, and applied STEAM innovation projects.',
    },
    features: [
      { vi: 'Makerspace hiện đại với máy in 3D, máy cắt laser và xưởng Robotics', en: 'Modern makerspace equipped with 3D printers and robotics labs' },
      { vi: 'Trực tiếp trải nghiệm và ứng dụng kiến thức khoa học vào thực tế', en: 'Hands-on application of scientific principles to real projects' },
      { vi: 'Phát triển tư duy sáng tạo, giải quyết vấn đề và kỹ năng thực hành', en: 'Fosters creative problem-solving and maker engineering skills' },
      { vi: 'Nuôi dưỡng năng lực công nghệ và tinh thần đổi mới sáng tạo thế kỷ 21', en: 'Nurtures 21st-century technological fluency and innovation' },
    ],
    isFeatured: true,
    order: 2,
    isActive: true,
    status: 'PUBLISHED' as const,
    rejectionReason: '',
    scheduledAt: '',
    publishedAt: '',
    createdByUid: '',
    createdByEmail: '',
    createdByName: '',
    lastReviewerUid: '',
    lastReviewerEmail: '',
    lastReviewerName: '',
    submittedAt: '',
    reviewedAt: '',
  },
  {
    id: 'cognia',
    name: 'Cognia & WASC Accreditation',
    logoUrl: '',
    website: 'https://www.cognia.org',
    category: 'certification',
    description: {
      vi: 'Hai tổ chức kiểm định giáo dục uy tín bậc nhất Hoa Kỳ và toàn cầu. Chứng nhận kiểm định đảm bảo giá trị pháp lý quốc tế của Bằng tốt nghiệp Phổ thông Mỹ (U.S. High School Diploma) và bảng điểm (transcript) để học sinh EPath được công nhận và xét tuyển thẳng vào các trường đại học hàng đầu thế giới.',
      en: 'Two of the most recognized educational accrediting organizations globally. Their accreditation guarantees full international recognition and academic rigor for the U.S. High School Diploma and transcripts for direct admission to top global universities.',
    },
    features: [
      { vi: 'Tổ chức kiểm định chất lượng giáo dục hàng đầu của Hoa Kỳ', en: 'Premier education accreditation agencies in the United States' },
      { vi: 'Bằng Tú tài Mỹ và bảng điểm được công nhận trên toàn thế giới', en: 'US High School Diploma and transcripts recognized worldwide' },
      { vi: 'Bảo đảm tính liên thông và chuẩn mực học thuật quốc tế cao nhất', en: 'Ensures highest international academic standards and transferability' },
      { vi: 'Mở rộng cơ hội săn học bổng và xét tuyển thẳng vào đại học danh tiếng', en: 'Maximizes scholarship opportunities at world-ranked universities' },
    ],
    isFeatured: false,
    order: 3,
    isActive: true,
    status: 'PUBLISHED' as const,
    rejectionReason: '',
    scheduledAt: '',
    publishedAt: '',
    createdByUid: '',
    createdByEmail: '',
    createdByName: '',
    lastReviewerUid: '',
    lastReviewerEmail: '',
    lastReviewerName: '',
    submittedAt: '',
    reviewedAt: '',
  },
]

const partnerImages: Record<string, string> = {
  edmentum: '/images/partners/partner-edmentum.jpg',
  cambridge: '/images/partners/partner-cambridge.jpg',
  fablab: '/images/partners/partner-fablab.jpg',
  cognia: '/images/partners/partner-cognia.jpg',
}

const partnerBadges: Record<string, { label: { vi: string; en: string }; bg: string }> = {
  edmentum: {
    label: { vi: 'Chương Trình Chuẩn Hoa Kỳ', en: 'Accredited US Curriculum' },
    bg: '#2E4A9E',
  },
  cambridge: {
    label: { vi: 'Khảo Thí Tiếng Anh Quốc Tế', en: 'Cambridge English Qualifications' },
    bg: '#5C9024',
  },
  fablab: {
    label: { vi: 'Không Gian Đổi Mới Sáng Tạo STEAM', en: 'STEAM Makerspace & Robotics' },
    bg: '#F26522',
  },
  cognia: {
    label: { vi: 'Kiểm Định Giáo Dục Toàn Cầu', en: 'Global Educational Accreditation' },
    bg: '#1E3570',
  },
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
}

function getPartnerKey(partner: Partner): 'edmentum' | 'cambridge' | 'fablab' | 'cognia' {
  const raw = `${partner.id || ''} ${partner.name || ''}`.toLowerCase()
  if (raw.includes('edmentum') || raw.includes('edoptions')) return 'edmentum'
  if (raw.includes('cambridge') || raw.includes('esol')) return 'cambridge'
  if (raw.includes('fablab') || raw.includes('eiu')) return 'fablab'
  if (raw.includes('cognia') || raw.includes('wasc')) return 'cognia'
  return 'edmentum'
}

export default function PartnersPage() {
  const t = useTranslations('partnersPage')
  const tFeature = useTranslations('partnersPage.featureList')
  const locale = useLocale()
  const { data: cms } = useCmsContext()
  const partnersHero = ((cms.heroContent as Record<string, Record<string, unknown> | null>).partners as Record<string, unknown>) || {}

  // Deduplicate partners by semantic key to guarantee no repeated entries
  const rawPartners: Partner[] = cms.partners.length > 0 ? cms.partners : fallbackPartners
  const partners: Partner[] = rawPartners
    .filter((p) => p.isActive !== false)
    .filter((p, index, self) => {
      const key = getPartnerKey(p)
      return index === self.findIndex((o) => getPartnerKey(o) === key)
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const heroPartnersImage = (partnersHero?.backgroundImage as string) || ''
  const heroWelcomeText = (((partnersHero?.welcomeTitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((partnersHero?.welcomeTitle as Record<string, string | undefined>) || {})?.vi as string) || ''
  const heroBadge = heroWelcomeText || t('hero.badge')
  const heroMainTitle = (((partnersHero?.title as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((partnersHero?.title as Record<string, string | undefined>) || {})?.vi as string) || t('hero.title')
  const heroSubtitle = (((partnersHero?.subtitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((partnersHero?.subtitle as Record<string, string | undefined>) || {})?.vi as string) || t('hero.subtitle')

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          HERO BANNER – Light iSchool aesthetic matching Homepage
      ─────────────────────────────────────────────────────────────── */}
      <SubpageHero
        badge={heroBadge}
        title={locale === 'vi' ? 'Đối Tác Học Thuật' : 'Global Academic'}
        highlightText={locale === 'vi' ? 'Quốc Tế & Kiểm Định' : 'Partners & Accreditation'}
        subtitle={heroSubtitle}
        tags={[
          'Cognia & WASC Accreditation',
          'Edmentum International',
          'Cambridge Assessment',
          'FabLab EIU Makerspace',
        ]}
        backgroundImage={heroPartnersImage || '/images/partners/partner-edmentum.jpg'}
      />

      {/* ─────────────────────────────────────────────────────────────
          3 PILLARS OF GLOBAL ACADEMIC COLLABORATION
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-[#F6F5F1] border-b border-[#DEDDD6]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-center mb-10 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              {t('pillarsBadge')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">
              {t('pillarsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-[#5C6069]">
              {t('pillarsSubtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6 max-w-6xl mx-auto">
            {/* Pillar 1: US Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DEDDD6] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              <span className="absolute -top-6 -right-3 text-7xl font-black text-[#2E4A9E]/[0.05] pointer-events-none select-none font-mono">
                01
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#2E4A9E]/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <BookOpen className="w-6 h-6 text-[#2E4A9E]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#2E4A9E] block mb-1">
                  {t('pillar1.title')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-2">
                  {t('pillar1.partner')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {t('pillar1.desc')}
                </p>
              </div>
            </motion.div>

            {/* Pillar 2: British Assessment */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: 0.08, ease: easeOut }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DEDDD6] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              <span className="absolute -top-6 -right-3 text-7xl font-black text-[#8DC63F]/[0.08] pointer-events-none select-none font-mono">
                02
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#8DC63F]/15 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Award className="w-6 h-6 text-[#5C9024]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C9024] block mb-1">
                  {t('pillar2.title')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-2">
                  {t('pillar2.partner')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {t('pillar2.desc')}
                </p>
              </div>
            </motion.div>

            {/* Pillar 3: High-Tech Innovation */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: 0.16, ease: easeOut }}
              className="bg-white rounded-2xl p-6 sm:p-7 border border-[#DEDDD6] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between relative overflow-hidden"
            >
              <span className="absolute -top-6 -right-3 text-7xl font-black text-[#F26522]/[0.05] pointer-events-none select-none font-mono">
                03
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 bg-[#F26522]/10 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Wrench className="w-6 h-6 text-[#F26522]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F26522] block mb-1">
                  {t('pillar3.title')}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-2">
                  {t('pillar3.partner')}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed">
                  {t('pillar3.desc')}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          PARTNER SHOWCASE ROWS
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="space-y-12 sm:space-y-16 max-w-6xl mx-auto">
            {partners.map((partner, index) => {
              const accent = accentCycle[index % accentCycle.length]
              const partnerName =
                locale !== 'vi' && partner.name.includes('Trường Đại học Quốc tế Miền Đông')
                  ? partner.name.replace('Trường Đại học Quốc tế Miền Đông', 'Eastern International University')
                  : partner.name
              const desc = partner.description[locale as 'vi' | 'en'] || partner.description.vi
              const pKey = getPartnerKey(partner)
              const partnerImg = partnerImages[pKey] || '/images/partners/partner-edmentum.jpg'
              const badge = partnerBadges[pKey] || {
                label: { vi: 'Đối Tác Học Thuật', en: 'Academic Partner' },
                bg: accent.color,
              }
              const badgeLabel = badge.label[locale as 'vi' | 'en'] || badge.label.vi

              return (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={inViewViewport}
                  transition={{ duration: duration.slow, ease: easeOut }}
                  className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
                >
                  {/* Visual Image Card with Badge & Branding */}
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''} flex flex-col`}>
                    <div className="relative rounded-2xl overflow-hidden border border-[#DEDDD6] shadow-sm hover:shadow-lg transition-all duration-500 group h-64 sm:h-72 lg:h-full min-h-[260px] bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={partnerImg}
                        alt={partnerName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                      {/* Top Category Badge */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <span
                          className="px-3 py-1 rounded-full text-[11px] font-bold text-white shadow-md tracking-wide"
                          style={{ backgroundColor: badge.bg }}
                        >
                          {badgeLabel}
                        </span>
                      </div>

                      {/* Bottom Info on Image */}
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-white/95 backdrop-blur-md p-1.5 flex items-center justify-center shrink-0 shadow-md">
                            {partner.logoUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={partner.logoUrl} alt={partnerName} className="w-full h-full object-contain" />
                            ) : (
                              <span className="font-black text-sm" style={{ color: accent.color }}>
                                {initials(partnerName)}
                              </span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-bold text-white drop-shadow-sm block truncate">
                              {badgeLabel}
                            </span>
                            <span className="text-[11px] text-white/80 block uppercase tracking-wider">
                              {partner.category.toUpperCase()} • EPATH VERIFIED
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Partner Details & Features */}
                  <div
                    className={`lg:col-span-7 bg-[#F6F5F1] hover:bg-white rounded-2xl p-6 sm:p-8 border border-[#DEDDD6] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${index % 2 === 1 ? 'lg:order-1' : ''}`}
                  >
                    {/* Watermark Numeral */}
                    <span className="absolute -top-6 -right-2 text-7xl sm:text-8xl font-black text-[#1E3570]/[0.04] pointer-events-none select-none font-mono">
                      0{index + 1}
                    </span>

                    <div className="relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                        <h2
                          className="text-xl sm:text-2xl font-black text-[#1E3570] group-hover:text-[#2E4A9E] transition-colors"
                          style={{ fontFamily: "'SVN-Gilroy', var(--font-gilroy), system-ui, sans-serif" }}
                        >
                          {partnerName}
                        </h2>
                        {partner.website && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[#1E3570] hover:text-[#8DC63F] font-bold text-xs sm:text-sm hover:underline shrink-0 pt-1 transition-colors"
                          >
                            <span>{t('visitWebsite')}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>

                      {desc && (
                        <p className="text-[#5C6069] text-xs sm:text-sm leading-relaxed mb-5">{desc}</p>
                      )}

                      <div className="pt-4 border-t border-[#DEDDD6]">
                        <h3 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accent.color }}>
                          <Award className="w-4 h-4" />
                          <span>{t('features')}</span>
                        </h3>
                        <ul className="space-y-2.5">
                          {(partner.features.length > 0
                            ? partner.features
                            : [1, 2, 3, 4].map((i) => ({ vi: tFeature(`f${i}` as 'f1' | 'f2' | 'f3' | 'f4'), en: tFeature(`f${i}` as 'f1' | 'f2' | 'f3' | 'f4') }))
                          ).map((feat, i) => (
                            <li key={i} className="flex items-start gap-2.5">
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-white text-[10px]"
                                style={{ backgroundColor: accent.color }}
                              >
                                <Check className="w-2.5 h-2.5" />
                              </div>
                              <span className="text-[#20242B] text-xs sm:text-sm font-medium leading-relaxed">
                                {feat[locale as 'vi' | 'en'] || feat.vi || feat.en}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM CTA
      ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-12 sm:py-16 relative overflow-hidden"
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
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2.5 bg-[#F26522] hover:bg-[#C94F16] text-white px-7 py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{t('cta.button')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}