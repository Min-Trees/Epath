'use client'

import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { Calendar, MapPin, ArrowRight, Sparkles, Users, Tag } from 'lucide-react'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { accentCycle } from '@/lib/design-tokens'
import { useCmsContext } from '@/lib/cms-context'
import { SubpageHero } from '@/components/subpages/subpage-hero'

const fallbackEvents = [
  {
    id: 'event-open-house-2025',
    title: {
      vi: 'Ngày Hội Open House: Khám Phá Lộ Trình Học Thuật Quốc Tế EPath',
      en: 'Open House Day: Discover EPath International Academic Pathways',
    },
    shortDescription: {
      vi: 'Cơ hội trải nghiệm trực tiếp mô hình lớp học Blended Learning, gặp gỡ đội ngũ Giáo viên Quốc tế và Song ngữ, đồng thời nhận đánh giá năng lực tiếng Anh học thuật miễn phí cho học sinh.',
      en: 'Experience our interactive Blended Learning classrooms, meet International & Bilingual faculty, and receive complimentary diagnostic English evaluations for students.',
    },
    startDate: '15/10/2025 · 08:30 - 11:30',
    location: 'Campus EPath Education, 38 Trần Phú, TP. Thủ Dầu Một',
    status: 'Sắp diễn ra',
    format: 'Onsite',
    target: 'Phụ huynh & Học sinh Mầm non - THPT',
    badge: 'Sự kiện nổi bật',
    imageUrl: '',
    coverImage: '',
    registerUrl: '',
  },
  {
    id: 'event-edmentum-symposium',
    title: {
      vi: 'Hội Thảo Chuyên Đề Edmentum: Lộ Trình Song Bằng & Bằng Tú Tài Mỹ',
      en: 'Edmentum Symposium: Dual Diploma & US High School Diploma Strategy',
    },
    shortDescription: {
      vi: 'Phân tích chi tiết lộ trình Dual Diploma (5 tín chỉ chuẩn + 1 tín chỉ AP) và Fulltime Homeschool (21.5 tín chỉ) cùng chuyên gia học vụ từ EdOptions Academy và EPath Education.',
      en: 'In-depth insights into the Dual Diploma (5 standard + 1 AP credit) and Fulltime Homeschool (21.5 credits) pathways with academic specialists from EdOptions Academy and EPath.',
    },
    startDate: '28/10/2025 · 14:00 - 16:30',
    location: 'Hội trường Campus EPath & Livestream Trực Tuyến',
    status: 'Đang mở đăng ký',
    format: 'Hybrid',
    target: 'Phụ huynh & Học sinh Lớp 6 - 11',
    badge: 'Hội thảo học vụ',
    imageUrl: '',
    coverImage: '',
    registerUrl: '',
  },
  {
    id: 'event-cambridge-talk',
    title: {
      vi: 'Tọa Đàm Cambridge: Chuyển Từ "Học Tiếng Anh" Sang "Học Bằng Tiếng Anh"',
      en: 'Cambridge Colloquium: Transitioning from "Learning English" to "Learning in English"',
    },
    shortDescription: {
      vi: 'Chia sẻ phương pháp phát triển năng lực ngôn ngữ theo khung Cambridge Qualifications (Starters, Movers, Flyers) và cách ứng dụng CLIL để tiếp thu Toán & Khoa học bằng tiếng Anh.',
      en: 'Strategies for mastering language competencies under the Cambridge Qualifications framework and leveraging CLIL to study Math and Science in English naturally.',
    },
    startDate: '12/11/2025 · 09:00 - 11:00',
    location: 'Campus EPath Education, 38 Trần Phú, TP. Thủ Dầu Một',
    status: 'Sắp diễn ra',
    format: 'Onsite',
    target: 'Phụ huynh có con từ 5 - 12 tuổi',
    badge: 'Định hướng phụ huynh',
    imageUrl: '',
    coverImage: '',
    registerUrl: '',
  },
  {
    id: 'event-fablab-workshop',
    title: {
      vi: 'Workshop Sáng Tạo STEAM & Robotics Tại FabLab EIU',
      en: 'STEAM & Robotics Maker Workshop at FabLab EIU',
    },
    shortDescription: {
      vi: 'Trải nghiệm chế tạo mô hình với công nghệ in 3D, cắt laser và lập trình robot dưới sự hướng dẫn của các kỹ sư công nghệ tại FabLab EIU. Phát triển tư duy giải quyết vấn đề và kỹ năng làm việc nhóm.',
      en: 'Hands-on product engineering with 3D printers, laser cutters, and robotics coding mentored by FabLab EIU technology specialists. Fosters innovation and collaborative teamwork.',
    },
    startDate: '29/11/2025 · 08:30 - 12:00',
    location: 'FabLab EIU, Trường Đại học Quốc tế Miền Đông (EIU)',
    status: 'Đang mở đăng ký',
    format: 'Trải nghiệm thực tế',
    target: 'Học sinh Lớp 3 - Lớp 10',
    badge: 'Trải nghiệm công nghệ',
    imageUrl: '',
    coverImage: '',
    registerUrl: '',
  },
]

export default function EventsPage() {
  const t = useTranslations('events')
  const locale = useLocale()
  const isVi = locale === 'vi'

  const localizeStatus = (status: string) => {
    if (isVi) return status
    const map: Record<string, string> = {
      'Sắp diễn ra': 'Upcoming',
      'Đang mở đăng ký': 'Open for Registration',
      'Đang diễn ra': 'Happening Now',
      'Đã kết thúc': 'Concluded',
    }
    return map[status] || status
  }

  const localizeBadge = (badge: string) => {
    if (isVi) return badge
    const map: Record<string, string> = {
      'Sự kiện nổi bật': 'Featured Event',
      'Hội thảo học vụ': 'Academic Symposium',
      'Định hướng phụ huynh': 'Parent Orientation',
      'Trải nghiệm công nghệ': 'Tech Workshop',
    }
    return map[badge] || badge
  }

  const localizeFormat = (format: string) => {
    if (isVi) return format
    const map: Record<string, string> = {
      'Trải nghiệm thực tế': 'Hands-on Experience',
      'Trực tiếp': 'Onsite',
      'Trực tuyến': 'Online',
      'Hybrid': 'Hybrid',
      'Onsite': 'Onsite',
      'Online': 'Online',
    }
    return map[format] || format
  }

  const localizeTarget = (target: string) => {
    if (isVi) return target
    const map: Record<string, string> = {
      'Phụ huynh & Học sinh Mầm non - THPT': 'Parents & Students (K–12)',
      'Phụ huynh & Học sinh Lớp 6 - 11': 'Parents & Students (Grades 6–11)',
      'Phụ huynh có con từ 5 - 12 tuổi': 'Parents of children aged 5–12',
      'Học sinh Lớp 3 - Lớp 10': 'Students in Grades 3–10',
    }
    return map[target] || target
  }

  const localizeLocation = (location: string) => {
    if (isVi) return location
    return location
      .replace('Campus EPath Education, 38 Trần Phú, TP. Thủ Dầu Một', 'EPath Campus, 38 Tran Phu St, Thu Dau Mot City')
      .replace('Hội trường Campus EPath & Livestream Trực Tuyến', 'EPath Hall & Online Livestream')
      .replace('FabLab EIU, Trường Đại học Quốc tế Miền Đông (EIU)', 'FabLab EIU, Eastern International University (EIU)')
  }

  const { data: cms } = useCmsContext()
  const events = cms.events && cms.events.length > 0 ? cms.events : fallbackEvents
  const eventsHero = ((cms.heroContent as Record<string, Record<string, unknown> | null>).events as Record<string, unknown>) || {}

  const heroImage = (eventsHero?.backgroundImage as string) || ''
  const welcomeText = (((eventsHero?.welcomeTitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((eventsHero?.welcomeTitle as Record<string, string | undefined>) || {})?.vi as string) || ''
  const mainTitle = (((eventsHero?.title as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((eventsHero?.title as Record<string, string | undefined>) || {})?.vi as string) || t('hero.title')
  const heroSubtitle = (((eventsHero?.subtitle as Record<string, string | undefined>) || {})[locale as 'vi' | 'en'] as string) || (((eventsHero?.subtitle as Record<string, string | undefined>) || {})?.vi as string) || t('hero.subtitle')

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          HERO BANNER – Light iSchool aesthetic matching Homepage
      ─────────────────────────────────────────────────────────────── */}
      <SubpageHero
        badge={welcomeText || (isVi ? 'Sự kiện & Hoạt động học thuật' : 'Academic Events')}
        title={locale === 'vi' ? 'Sự Kiện & Hội Thảo' : 'Academic Events'}
        highlightText={locale === 'vi' ? 'Học Thuật Quốc Tế' : '& Workshops'}
        subtitle={heroSubtitle}
        tags={[
          locale === 'vi' ? 'Hội Thảo Song Bằng' : 'Dual Diploma Symposium',
          locale === 'vi' ? 'Workshop STEAM & Robotics' : 'STEAM & Robotics Workshop',
          locale === 'vi' ? 'Tọa Đàm Cambridge' : 'Cambridge Academic Talk',
          locale === 'vi' ? 'Open House Trải Nghiệm' : 'Open House Experience',
        ]}
        backgroundImage={heroImage || '/images/about/about-story.jpg'}
      />

      {/* ─────────────────────────────────────────────────────────────
          EVENTS GRID
      ─────────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-[#F6F5F1]">
        <div className="container mx-auto px-4">
          {events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#DEDDD6] max-w-md mx-auto shadow-sm">
              <Calendar className="w-12 h-12 text-[#2E4A9E]/30 mx-auto mb-3" />
              <p className="text-[#5C6069] text-base font-medium">
                {isVi ? 'Chưa có sự kiện nào sắp diễn ra.' : 'No upcoming events currently scheduled.'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5 sm:gap-6">
              {events.map((event, index) => {
                const accent = accentCycle[index % accentCycle.length]
                const title = event.title[locale as 'vi' | 'en'] || event.title.vi
                const desc = event.shortDescription[locale as 'vi' | 'en'] || event.shortDescription.vi
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inViewViewport}
                    transition={{ duration: duration.slow, delay: index * 0.08, ease: easeOut }}
                    className="bg-white rounded-2xl border border-[#DEDDD6] shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div
                        className="aspect-video relative flex items-center justify-center overflow-hidden bg-[#F6F5F1]"
                      >
                        {event.coverImage || event.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.coverImage || event.imageUrl}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
                            loading="lazy"
                          />
                        ) : (
                          <Calendar className="w-16 h-16 text-[#2E4A9E]/20" />
                        )}
                        <span
                          className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', color: accent.color }}
                        >
                          {localizeStatus(event.status)}
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {((event as Record<string, unknown>).badge as string) && (
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                              style={{ backgroundColor: `${accent.color}15`, color: accent.color }}
                            >
                              {localizeBadge((event as Record<string, unknown>).badge as string)}
                            </span>
                          )}
                          {((event as Record<string, unknown>).format as string) && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#F6F5F1] text-[#5C6069] border border-[#DEDDD6]">
                              {localizeFormat((event as Record<string, unknown>).format as string)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-bold text-[#20242B] mb-2 group-hover:text-[#2E4A9E] transition-colors duration-300 leading-snug">
                          {title}
                        </h3>
                        {desc && (
                          <p className="text-xs sm:text-sm text-[#5C6069] mb-4 leading-relaxed line-clamp-3">{desc}</p>
                        )}

                        {((event as Record<string, unknown>).target as string) && (
                          <div className="flex items-center gap-2 text-xs text-[#2E4A9E] mb-3 font-medium">
                            <Users className="w-3.5 h-3.5 shrink-0" />
                            <span>{localizeTarget((event as Record<string, unknown>).target as string)}</span>
                          </div>
                        )}

                        <div className="space-y-2 mb-4 pt-3 border-t border-[#DEDDD6]">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#20242B] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                            <span>{event.startDate}</span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5C6069]">
                              <MapPin className="w-3.5 h-3.5 text-[#F26522] shrink-0" />
                              <span className="truncate">{localizeLocation(event.location)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                      {event.registerUrl ? (
                        <a
                          href={event.registerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#F26522] hover:bg-[#C94F16] text-white py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/btn"
                        >
                          <span>{t('register')}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </a>
                      ) : (
                        <Link
                          href={`/${locale}/admissions?event=${event.id}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-[#F26522] hover:bg-[#C94F16] text-white py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group/btn"
                        >
                          <span>{t('register')}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          BOTTOM CTA
      ─────────────────────────────────────────────────────────────── */}
      <section
        className="py-10 sm:py-14 relative overflow-hidden"
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
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2.5">{t('cta.title')}</h2>
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