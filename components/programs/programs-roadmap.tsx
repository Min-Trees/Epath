'use client'

import { motion } from 'framer-motion'
import {
  Sprout,
  Book,
  GraduationCap,
  Trophy,
  Award,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import type { Locale, LocalizedString } from '@/lib/cms-types'

interface Props {
  locale: Locale
  compact?: boolean
}

const ROADMAP_STEPS = [
  {
    step: '01',
    level: 'kindergarten',
    image: '/images/programs/program-kindy.jpg',
    title: {
      vi: 'Giai đoạn Mầm non (3 – 6 tuổi)',
      en: 'Kindergarten Stage (Ages 3–6)',
    },
    subtitle: {
      vi: 'Khởi đầu tự nhiên – Thẩm thấu ngôn ngữ & Tư duy sớm',
      en: 'Natural Start – Language Immersion & Early Thinking',
    },
    color: '#2E4A9E',
    bgColor: 'rgba(46, 74, 158, 0.1)',
    icon: Sprout,
    badges: ['Cambridge English', 'Topic-based Learning', 'Early Literacy', 'Early Math'],
    modelTag: { vi: 'Mô hình: Song ngữ tương tác · Phonics & Toán sớm · Chuẩn bị Lớp 1', en: 'Model: Interactive Bilingual · Phonics & Early Math · Grade 1 Ready' },
    outcomes: {
      vi: [
        'Làm quen tiếng Anh tự nhiên như ngôn ngữ thứ hai',
        'Phát triển phát âm, ngữ âm Phonics chuẩn xác',
        'Làm quen tư duy số học, hình khối, logic cơ bản',
        'Hình thành sự tự tin trong giao tiếp môi trường song ngữ',
      ],
      en: [
        'Acquire English naturally as a second language',
        'Develop standard phonics and pronunciation',
        'Introduction to early numeracy and logical thinking',
        'Build confidence in bilingual communication',
      ],
    },
  },
  {
    step: '02',
    level: 'elementary',
    image: '/images/programs/program-elementary.jpg',
    title: {
      vi: 'Giai đoạn Tiểu học (Lớp 1 – 5)',
      en: 'Elementary Stage (Grades 1–5)',
    },
    subtitle: {
      vi: 'Nền tảng Học thuật – Toán & Khoa học bằng Tiếng Anh',
      en: 'Academic Foundation – Math & Science in English',
    },
    color: '#5C9024',
    bgColor: 'rgba(141, 198, 63, 0.15)',
    icon: Book,
    badges: ['Edmentum Core', 'Cambridge Primary', 'STEM & Robotics', 'Academic Reading'],
    modelTag: { vi: 'Mô hình: 5 giờ/tuần (Online + Onsite) · 50% GV Quốc tế + 50% GV Song ngữ', en: 'Model: 5 hrs/wk (Online + Onsite) · 50% Int\'l + 50% Bilingual Faculty' },
    outcomes: {
      vi: [
        'Tiếng Anh học thuật chuẩn khung Cambridge Primary',
        'Toán và Khoa học chuẩn Mỹ (US Common Core Standards)',
        'Phương pháp học tập độc lập & làm việc nhóm',
        'Đạt chứng chỉ Cambridge Starters / Movers / Flyers',
      ],
      en: [
        'Academic English aligned with Cambridge Primary framework',
        'US Common Core-aligned Math and Science',
        'Independent learning habits and collaborative teamwork',
        'Achieve Cambridge Starters / Movers / Flyers certifications',
      ],
    },
  },
  {
    step: '03',
    level: 'middle',
    image: '/images/programs/program-middle.jpg',
    title: {
      vi: 'Giai đoạn THCS (Lớp 6 – 8)',
      en: 'Middle School Stage (Grades 6–8)',
    },
    subtitle: {
      vi: 'Tư duy Phản biện & Kỹ năng Nghiên cứu Học thuật',
      en: 'Critical Thinking & Academic Research Skills',
    },
    color: '#F26522',
    bgColor: 'rgba(242, 101, 34, 0.1)',
    icon: GraduationCap,
    badges: ['Edmentum Middle School', 'KET / PET / IELTS Foundation', 'Critical Thinking'],
    modelTag: { vi: 'Mô hình: 5–6 giờ/tuần · Chinh phục IELTS 5.5+ · Tích lũy tín chỉ Tú tài Mỹ', en: 'Model: 5–6 hrs/wk · IELTS 5.5+ Target · Accumulate US Credits from Grade 8' },
    outcomes: {
      vi: [
        'Đọc hiểu và viết luận học thuật chuyên sâu',
        'Tư duy phản biện, giải quyết vấn đề và thuyết trình',
        'Sẵn sàng tích lũy tín chỉ THPT quốc tế',
        'Xây dựng Student Portfolio cá nhân hóa',
      ],
      en: [
        'Advanced academic reading comprehension and essay writing',
        'Critical thinking, problem-solving, and presentation skills',
        'Readiness for US high school credit accumulation',
        'Develop an individualized Student Portfolio',
      ],
    },
  },
  {
    step: '04',
    level: 'high',
    image: '/images/programs/program-high.jpg',
    title: {
      vi: 'Giai đoạn THPT (Lớp 9 – 12)',
      en: 'High School Stage (Grades 9–12)',
    },
    subtitle: {
      vi: 'Song bằng Hoa Kỳ & Định hướng Đại học Toàn cầu',
      en: 'US Dual Diploma & Global University Pathways',
    },
    color: '#1E3570',
    bgColor: 'rgba(30, 53, 112, 0.12)',
    icon: Trophy,
    badges: ['EdOptions Academy', 'US High School Diploma', 'Cognia & WASC', 'AP Courses'],
    modelTag: { vi: 'Mô hình: Bằng Tú tài Mỹ Cognia & WASC · Tín chỉ AP College Board · IELTS 7.0+', en: 'Model: Cognia & WASC US Diploma · AP College Board Credits · IELTS 7.0+' },
    outcomes: {
      vi: [
        'Nhận Bằng tốt nghiệp THPT Hoa Kỳ kiểm định Cognia & WASC',
        'Tích lũy tín chỉ đại học sớm (Advanced Placement - AP)',
        'Hồ sơ du học cạnh tranh vào các đại học hàng đầu thế giới',
        'Thành thạo phương pháp tự học và tư duy đại học chuẩn Mỹ',
      ],
      en: [
        'Earn Cognia & WASC accredited US High School Diploma',
        'Earn early college credits via Advanced Placement (AP)',
        'Competitive college applications to top global universities',
        'Master US university-level autonomous learning skills',
      ],
    },
  },
]

const LEVEL_CONFIG: Record<
  string,
  {
    color: string
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
    defaultImage: string
  }
> = {
  kindergarten: {
    color: '#2E4A9E',
    icon: Sprout,
    defaultImage: '/images/programs/program-kindy.jpg',
  },
  elementary: {
    color: '#5C9024',
    icon: Book,
    defaultImage: '/images/programs/program-elementary.jpg',
  },
  middle: {
    color: '#F26522',
    icon: GraduationCap,
    defaultImage: '/images/programs/program-middle.jpg',
  },
  high: {
    color: '#1E3570',
    icon: Trophy,
    defaultImage: '/images/programs/program-high.jpg',
  },
}

function getLocalized(val: LocalizedString | string | undefined, locale: Locale): string {
  if (!val) return ''
  if (typeof val === 'string') return val
  return val[locale] || val.vi || val.en || ''
}

function parseBadges(badges: unknown, objectives: unknown, locale: Locale): string[] {
  if (typeof badges === 'string' && badges.trim()) {
    return badges.split(',').map((s) => s.trim()).filter(Boolean)
  }
  if (Array.isArray(badges) && badges.length > 0) {
    return badges.map((b) => (typeof b === 'string' ? b : getLocalized(b as LocalizedString, locale))).filter(Boolean)
  }
  if (Array.isArray(objectives) && objectives.length > 0) {
    return objectives.map((o) => (typeof o === 'string' ? o : getLocalized(o as LocalizedString, locale))).filter(Boolean)
  }
  return []
}

function parseOutcomes(outcomes: unknown, locale: Locale): string[] {
  if (!outcomes) return []
  if (Array.isArray(outcomes)) {
    return outcomes.map((o) => (typeof o === 'string' ? o : getLocalized(o as LocalizedString, locale))).filter(Boolean)
  }
  if (typeof outcomes === 'object') {
    const raw = getLocalized(outcomes as LocalizedString, locale)
    if (raw) {
      return raw.split('\n').map((s) => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
    }
  }
  if (typeof outcomes === 'string') {
    return outcomes.split('\n').map((s) => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
  }
  return []
}

export function ProgramsRoadmap({ locale, compact }: Props) {
  const isVi = locale === 'vi'
  const { data: cms } = useCmsContext()

  const rawPathways = (cms.pathways || cms.learningPathways || [])
    .filter((p) => p.isActive !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  const steps = rawPathways.length > 0
    ? rawPathways.map((p, idx) => {
        const config = LEVEL_CONFIG[p.level] || {
          color: '#2E4A9E',
          icon: Sprout,
          defaultImage: '/images/programs/program-kindy.jpg',
        }
        const stepNum = p.step || String(idx + 1).padStart(2, '0')
        const title = getLocalized(p.title, locale)
        const subtitle = getLocalized(p.subtitle, locale) || getLocalized(p.description, locale)
        const modelTag = getLocalized(p.modelTag, locale)
        const badges = parseBadges(p.badges, p.objectives, locale)
        const outcomes = parseOutcomes(p.outcomes, locale)
        const image = p.imageUrl || config.defaultImage
        let ctaUrl = p.ctaUrl || `/${locale}/admissions?program=${p.level}`
        if (ctaUrl.startsWith('http://localhost:3000')) {
          ctaUrl = ctaUrl.replace('http://localhost:3000', '')
        }
        ctaUrl = ctaUrl.replace(/^\/(?:vi|en)\//, `/${locale}/`)

        return {
          id: p.id || stepNum,
          step: stepNum,
          level: p.level,
          title,
          subtitle,
          modelTag,
          badges,
          outcomes,
          image,
          ctaUrl,
          color: config.color,
          icon: config.icon,
        }
      })
    : ROADMAP_STEPS.map((step) => ({
        id: step.step,
        step: step.step,
        level: step.level,
        title: step.title[isVi ? 'vi' : 'en'],
        subtitle: step.subtitle[isVi ? 'vi' : 'en'],
        modelTag: step.modelTag[isVi ? 'vi' : 'en'],
        badges: step.badges,
        outcomes: step.outcomes[isVi ? 'vi' : 'en'],
        image: step.image,
        ctaUrl: `/${locale}/admissions?program=${step.level}`,
        color: step.color,
        icon: step.icon,
      }))

  return (
    <section className={`${compact ? 'py-8 sm:py-10' : 'py-10 sm:py-14'} bg-white border-b border-[#DEDDD6]`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isVi ? 'Hành trình phát triển bền vững' : 'Continuous Educational Pathway'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#20242B] mb-2">
            {isVi ? 'Lộ Trình Học Tập Xuyên Suốt' : 'Continuous Learning Pathway'}
          </h2>
          <p className="text-[#5C6069] text-xs sm:text-sm leading-relaxed">
            {isVi
              ? 'Xây dựng năng lực học thuật và kỹ năng hội nhập quốc tế từ Mầm non đến khi nhận Bằng tốt nghiệp THPT Hoa Kỳ.'
              : 'Building academic capabilities and global competency from Kindergarten to US High School Diploma.'}
          </p>
        </div>

        {/* Step Cards - 2 Column Grid */}
        <div className="grid md:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.slow, delay: idx * 0.06, ease: easeOut }}
                className="relative bg-[#F6F5F1] rounded-2xl p-5 sm:p-6 border border-[#DEDDD6] hover:border-[#2E4A9E]/40 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Step Image Banner */}
                  <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden mb-4 border border-[#DEDDD6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase backdrop-blur-md shadow-xs"
                        style={{ backgroundColor: `${step.color}E6` }}
                      >
                        {isVi ? `Bước ${step.step}` : `Step ${step.step}`}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Card Title & Subtitle */}
                  <div className="mb-3">
                    <h3 className="text-lg font-bold text-[#20242B] group-hover:text-[#2E4A9E] transition-colors leading-snug mb-1">
                      {step.title}
                    </h3>
                    {step.subtitle && (
                      <p className="text-xs sm:text-sm font-medium text-[#5C6069] leading-relaxed">
                        {step.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Feature Badges */}
                  {step.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {step.badges.map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="px-2.5 py-0.5 rounded-full bg-white border border-[#DEDDD6] text-[11px] font-semibold text-[#20242B]"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Model Tag Info */}
                  {step.modelTag && (
                    <div
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold mb-3 flex items-center gap-1.5 border"
                      style={{ backgroundColor: `${step.color}10`, borderColor: `${step.color}25`, color: step.color }}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span className="leading-snug">{step.modelTag}</span>
                    </div>
                  )}

                  {/* Outcomes Box */}
                  {step.outcomes.length > 0 && (
                    <div className="bg-white rounded-xl p-3.5 border border-[#DEDDD6] mb-4">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#20242B] mb-2 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" style={{ color: step.color }} />
                        <span>{isVi ? 'Mục tiêu & Chuẩn đầu ra:' : 'Key Outcomes:'}</span>
                      </div>
                      <div className="space-y-1.5">
                        {step.outcomes.map((outcome, oIdx) => (
                          <div
                            key={oIdx}
                            className="flex items-start gap-2 text-xs text-[#5C6069]"
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                              style={{ color: step.color }}
                            />
                            <span className="leading-tight">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer: CTA Button */}
                <div className="pt-2 border-t border-[#DEDDD6]/60">
                  <Link
                    href={step.ctaUrl}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition-all duration-300 hover:gap-3"
                    style={{ backgroundColor: `${step.color}15`, color: step.color }}
                  >
                    <span>{isVi ? 'Đăng ký tư vấn' : 'Enquire'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
