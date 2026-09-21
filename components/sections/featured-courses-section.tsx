'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  Award,
  BookOpen,
} from 'lucide-react'
import { duration, easeOut, inViewViewport, useSectionActive } from '@/lib/motion-presets'

interface CourseItem {
  id: string
  title: string
  levelBadge: string
  badges: string[]
  desc: string
  points: string[]
  image: string
  link: string
  accentColor: string
  badgeColor: string
}

export function FeaturedCoursesSection() {
  const locale = useLocale()
  const isVi = locale === 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })

  const courses: CourseItem[] = isVi
    ? [
        {
          id: 'dual-diploma',
          title: 'Song bằng Tú tài Mỹ (Dual Diploma)',
          levelBadge: 'Lớp 9 – 12 (14–18 tuổi)',
          badges: ['EdOptions Academy', 'Cognia & WASC', 'College Board AP'],
          desc: 'Học sinh học song song với trường THPT tại Việt Nam, hoàn thành 6 tín chỉ Mỹ trực tuyến để nhận bằng Tú tài Mỹ chính quy (U.S. High School Diploma) được công nhận toàn cầu.',
          points: [
            'Cấp bằng U.S. High School Diploma chính quy',
            'Tích hợp môn Tín chỉ nâng cao AP® (College Board)',
            'Tiết kiệm đến 67% chi phí so với du học nội trú',
          ],
          image: '/images/programs/program-high.jpg',
          link: `/${locale}/programs?level=high`,
          accentColor: '#1E3570',
          badgeColor: 'bg-[#1E3570]',
        },
        {
          id: 'homeschooling',
          title: 'Homeschooling Quốc tế Toàn thời gian',
          levelBadge: 'Mầm non – Lớp 12 (5–18 tuổi)',
          badges: ['Chuẩn K-12 Mỹ', 'Toàn thời gian', 'Cố vấn 1:1'],
          desc: 'Chương trình phổ thông Hoa Kỳ toàn diện 100% bằng tiếng Anh. Học sinh nhận học bạ chuẩn Mỹ, được cố vấn học vụ 1:1 đồng hành sát sao và xây dựng hồ sơ ứng tuyển đại học quốc tế.',
          points: [
            '400+ khóa học chuẩn Mỹ, linh hoạt thời gian & địa điểm',
            '50% giáo viên quốc tế & cố vấn học thuật song ngữ theo sát',
            'Lộ trình cá nhân hóa theo năng lực và tốc độ của từng em',
          ],
          image: '/images/programs/program-elementary.jpg',
          link: `/${locale}/programs?level=high`,
          accentColor: '#5C9024',
          badgeColor: 'bg-[#8DC63F]',
        },
        {
          id: 'cambridge-bilingual',
          title: 'Tiểu học & THCS Song ngữ chuẩn Cambridge',
          levelBadge: 'Lớp 1 – 8 (6–14 tuổi)',
          badges: ['Cambridge English', 'Toán & Khoa học Mỹ', 'Blended Learning'],
          desc: 'Xây dựng phản xạ tiếng Anh học thuật tự nhiên kết hợp Toán và Khoa học theo chuẩn Cambridge & Edmentum. Giúp học sinh vững vàng kiến thức nền tảng trước khi bước vào cấp học cao hơn.',
          points: [
            'Nền tảng thi các chứng chỉ Cambridge (Starters, Movers, Flyers, KET, PET)',
            'Phương pháp Active Learning kích thích tư duy logic và phản biện',
            'Phụ đạo cá nhân hóa lấp đầy lỗ hổng kiến thức kịp thời',
          ],
          image: '/images/programs/program-middle.jpg',
          link: `/${locale}/programs?level=elementary`,
          accentColor: '#F26522',
          badgeColor: 'bg-[#F26522]',
        },
        {
          id: 'kindergarten',
          title: 'Tiền tiểu học & Mầm non Little People',
          levelBadge: '3 – 6 tuổi',
          badges: ['Little People', 'Song ngữ sớm', 'Active Learning'],
          desc: 'Kế thừa hơn 10 năm kinh nghiệm từ hệ thống Mầm non Little People, chương trình trang bị nền tảng ngữ âm (phonics), kỹ năng tự lập và tư duy khám phá, giúp trẻ tự tin vào lớp 1 quốc tế.',
          points: [
            'Môi trường tương tác song ngữ tự nhiên chuẩn bản ngữ',
            'Phát triển trí tuệ cảm xúc (SEL) và tính tự lập từ sớm',
            'Lộ trình liên thông sẵn sàng bước vào chương trình phổ thông',
          ],
          image: '/images/programs/program-kindy.jpg',
          link: `/${locale}/programs?level=kindergarten`,
          accentColor: '#3A54A4',
          badgeColor: 'bg-[#3A54A4]',
        },
      ]
    : [
        {
          id: 'dual-diploma',
          title: 'U.S. Dual Diploma Program',
          levelBadge: 'Grades 9 – 12 (Age 14–18)',
          badges: ['EdOptions Academy', 'Cognia & WASC', 'College Board AP'],
          desc: 'Study simultaneously with local high school, earning 6 accredited U.S. credits online to receive an official U.S. High School Diploma accepted worldwide.',
          points: [
            'Official U.S. High School Diploma awarded',
            'Includes College Board approved AP® courses',
            'Saves up to 67% compared to boarding school abroad',
          ],
          image: '/images/programs/program-high.jpg',
          link: `/${locale}/programs?level=high`,
          accentColor: '#1E3570',
          badgeColor: 'bg-[#1E3570]',
        },
        {
          id: 'homeschooling',
          title: 'Full-time International Homeschooling',
          levelBadge: 'K – 12 (Age 5–18)',
          badges: ['U.S. K-12 Standard', 'Full-time', '1:1 Mentorship'],
          desc: 'Comprehensive 100% English American curriculum. Students receive official U.S. transcripts, dedicated 1:1 academic advisory, and competitive college portfolio preparation.',
          points: [
            '400+ U.S. courses with flexible schedule & location',
            '50% international faculty & bilingual academic mentors',
            'Tailored learning pace adapted to individual capability',
          ],
          image: '/images/programs/program-elementary.jpg',
          link: `/${locale}/programs?level=high`,
          accentColor: '#5C9024',
          badgeColor: 'bg-[#8DC63F]',
        },
        {
          id: 'cambridge-bilingual',
          title: 'Bilingual Cambridge Primary & Middle School',
          levelBadge: 'Grades 1 – 8 (Age 6–14)',
          badges: ['Cambridge English', 'U.S. Math & Science', 'Blended Learning'],
          desc: 'Developing natural academic English reflexes integrated with Cambridge & Edmentum Math and Science, establishing a strong foundation before advanced programs.',
          points: [
            'Prepares for Cambridge Qualifications (Starters to PET)',
            'Active Learning fosters critical thinking and curiosity',
            'Personalized tutoring bridges learning gaps promptly',
          ],
          image: '/images/programs/program-middle.jpg',
          link: `/${locale}/programs?level=elementary`,
          accentColor: '#F26522',
          badgeColor: 'bg-[#F26522]',
        },
        {
          id: 'kindergarten',
          title: 'Little People Kindergarten & Early Learning',
          levelBadge: 'Age 3 – 6',
          badges: ['Little People', 'Early Bilingual', 'Active Learning'],
          desc: 'Leveraging 10+ years of Little People kindergarten expertise, building solid phonics foundations, independent habits, and confidence to transition seamlessly into Grade 1.',
          points: [
            'Immersive native bilingual classroom environment',
            'Nurtures social-emotional learning (SEL) & independence',
            'Seamless continuum preparing for international schooling',
          ],
          image: '/images/programs/program-kindy.jpg',
          link: `/${locale}/programs?level=kindergarten`,
          accentColor: '#3A54A4',
          badgeColor: 'bg-[#3A54A4]',
        },
      ]

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
            <span>{isVi ? 'CHƯƠNG TRÌNH ĐÀO TẠO TIÊU BIỂU' : 'FEATURED LEARNING PROGRAMS'}</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3570] tracking-tight mb-4 leading-tight"
          >
            {isVi ? 'Các khóa học nổi bật tại EPath' : 'Featured Programs at EPath'}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut, delay: 0.05 }}
            className="text-base sm:text-lg text-[#5C6069] leading-relaxed"
          >
            {isVi
              ? 'Lộ trình học thuật chuẩn quốc tế được cá nhân hóa cho từng giai đoạn phát triển của học sinh từ Mầm non đến Trung học Phổ thông.'
              : 'Accredited international academic pathways personalized for each developmental stage from Kindergarten through High School.'}
          </motion.p>
        </div>

        {/* Courses 4-in-1-Row Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5 mb-10 sm:mb-12">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut, delay: idx * 0.08 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#DEDDD6] hover:border-[#1E3570]/30 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col group h-full"
            >
              {/* Card Image Header */}
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                {/* Level / Age Tag */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#1E3570] shadow-xs border border-white/60">
                    <Clock className="w-3 h-3 text-[#8DC63F]" />
                    {course.levelBadge}
                  </span>
                </div>

                {/* Badges on Image */}
                <div className="absolute bottom-2.5 left-3 right-3 flex flex-wrap gap-1">
                  {course.badges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-2 py-0.5 rounded bg-black/50 backdrop-blur-md text-[10px] font-medium text-white border border-white/20 truncate"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1E3570] mb-2 group-hover:text-[#2E4A9E] transition-colors line-clamp-2 min-h-[2.75rem] leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-[#5C6069] text-xs sm:text-[13px] leading-relaxed mb-4 line-clamp-3 min-h-[3.3rem]">
                    {course.desc}
                  </p>

                  {/* Bullet Points */}
                  <div className="space-y-2 mb-5 pt-3 border-t border-[#DEDDD6]/60">
                    {course.points.map((pt, ptIdx) => (
                      <div key={ptIdx} className="flex items-start gap-2 text-xs text-[#20242B] leading-tight">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#8DC63F] flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="pt-2">
                  <Link
                    href={course.link}
                    className="inline-flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-[#F6F5F1] hover:bg-[#1E3570] text-[#1E3570] hover:text-white font-semibold text-xs sm:text-sm transition-all duration-200 group/btn border border-[#DEDDD6] hover:border-[#1E3570]"
                  >
                    <span>{isVi ? 'Khám phá chi tiết' : 'Explore Details'}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA to all programs */}
        <div className="text-center">
          <Link
            href={`/${locale}/programs`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1E3570] hover:bg-[#2E4A9E] text-white font-semibold text-base transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]"
          >
            <span>{isVi ? 'Xem tất cả chương trình học K–12' : 'View All K–12 Academic Programs'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
