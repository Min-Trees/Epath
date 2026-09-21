'use client'

import { motion } from 'framer-motion'
import { useLocale } from 'next-intl'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import {
  Compass,
  Sparkles,
  AlertCircle,
  Coins,
  MapPin,
  Clock,
  RefreshCw,
  ShieldCheck,
  GraduationCap,
  Laptop,
  Check,
  ArrowRight,
} from 'lucide-react'

interface Props {
  p1?: string
  p2?: string
  compact?: boolean
  isTop?: boolean
}

export function ProgramsIntro({ p1, p2, compact, isTop = true }: Props) {
  const locale = useLocale()
  const isVi = locale === 'vi'

  const contentP1 =
    p1 ||
    (isVi
      ? 'Tại EPath Education, chúng tôi hiểu rằng nhiều gia đình mong muốn con được tiếp cận nền giáo dục quốc tế chất lượng cao nhưng vẫn còn những rào cản về chi phí, khoảng cách địa lý, tính linh hoạt và khả năng theo học lâu dài.'
      : 'At EPath Education, we understand that many families want their children to access high-quality international education, yet still face barriers around cost, geography, flexibility and the ability to sustain long-term study.')

  const contentP2 =
    p2 ||
    (isVi
      ? 'Vì vậy, EPath lựa chọn một hướng tiếp cận bền vững hơn: xây dựng lộ trình học tập quốc tế xuyên suốt từ Mầm non đến Trung học Phổ thông, giúp học sinh từng bước phát triển nền tảng học thuật, kỹ năng học tập và năng lực hội nhập toàn cầu trước khi bước vào những lựa chọn chuyên sâu như Song bằng, Tú tài Quốc tế, du học hoặc các chương trình đại học quốc tế.'
      : "That's why EPath takes a more sustainable approach: building a continuous international learning pathway from Kindergarten to High School, helping students progressively develop academic foundations, learning skills and global integration capability before stepping into specialized choices such as Dual Diploma, International Baccalaureate, study abroad or international university programs.")

  const challenges = isVi
    ? [
        {
          icon: Coins,
          title: 'Chi phí học tập đắt đỏ',
          desc: 'Học phí trường quốc tế truyền thống 300 – 600+ triệu/năm, gây áp lực tài chính lớn cho kế hoạch 12 năm.',
        },
        {
          icon: MapPin,
          title: 'Rào cản khoảng cách địa lý',
          desc: 'Tập trung chủ yếu tại các đô thị lớn, khiến học sinh các tỉnh thành khó tiếp cận môi trường chuẩn mực.',
        },
        {
          icon: Clock,
          title: 'Thiếu tính linh hoạt',
          desc: 'Lịch học cố định, gò bó, buộc phụ huynh phải chọn hoặc 100% quốc tế hoặc 100% công lập truyền thống.',
        },
        {
          icon: RefreshCw,
          title: 'Khó duy trì theo học lâu dài',
          desc: 'Dễ đứt đoạn lộ trình khi chuyển cấp, đổi trường hoặc khi học sinh chưa chuẩn bị đủ nền tảng tự học.',
        },
      ]
    : [
        {
          icon: Coins,
          title: 'Prohibitive Tuition Costs',
          desc: 'Traditional international school tuition (300M - 600M+ VND/yr) strains family finances over 12 years.',
        },
        {
          icon: MapPin,
          title: 'Geographic Limitations',
          desc: 'Schools are concentrated in major metropolitan hubs, restricting access for students nationwide.',
        },
        {
          icon: Clock,
          title: 'Rigid & Inflexible Format',
          desc: 'Strict all-or-nothing enrollment forces families into choosing between purely local or international.',
        },
        {
          icon: RefreshCw,
          title: 'Sustainability & Retention Risks',
          desc: 'High attrition rates and transitions without an established independent academic foundation.',
        },
      ]

  const solutions = isVi
    ? [
        {
          tag: 'Lộ trình xuyên suốt K-12',
          title: 'Bồi đắp năng lực liên tục từ Mầm non đến Lớp 12',
          desc: 'Từng bước phát triển tiếng Anh học thuật, tư duy Toán & Khoa học theo chuẩn Cambridge và Edmentum, không gây quá tải.',
        },
        {
          tag: 'Tối ưu chi phí 67%',
          title: 'Chất lượng Hoa Kỳ với mức đầu tư hợp lý',
          desc: 'Mô hình Blended Learning kết hợp giáo viên quốc tế và cố vấn song ngữ 1:1, chi phí chỉ bằng 1/3 trường quốc tế.',
        },
        {
          tag: 'Đích đến chủ động & đa dạng',
          title: 'Sẵn sàng Song bằng (Dual Diploma) & Du học học bổng',
          desc: 'Học sinh sở hữu hồ sơ học thuật cạnh tranh, tích lũy tín chỉ thật để nhận bằng Tú tài Mỹ hoặc xét tuyển đại học hàng đầu.',
        },
      ]
    : [
        {
          tag: 'Continuous K-12 Pathway',
          title: 'Progressive Foundation from Kindergarten to Grade 12',
          desc: 'Step-by-step mastery of Academic English, Math and Science under Cambridge and Edmentum standards without overload.',
        },
        {
          tag: 'Save up to 67% in Costs',
          title: 'US-Accredited Quality at Accessible Investment',
          desc: 'Blended Learning combining native US teachers and 1:1 bilingual mentors at one-third the cost of traditional international schools.',
        },
        {
          tag: 'Flexible International Milestones',
          title: 'Dual Diploma, US High School Diploma & Top Scholarships',
          desc: 'Earn legitimate accredited US credits, open doors to global universities and competitive admissions with IELTS 7.0+.',
        },
      ]

  const valueMetrics = isVi
    ? [
        {
          badge: 'Kiểm định kép',
          title: 'Cognia & WASC Hoa Kỳ',
          desc: 'Giá trị bằng cấp và tín chỉ công nhận trên toàn thế giới',
          icon: ShieldCheck,
        },
        {
          badge: 'Tối ưu ngân sách',
          title: 'Tiết kiệm đến 67% chi phí',
          desc: 'Mức học phí bền vững cho kế hoạch học tập dài hạn',
          icon: Coins,
        },
        {
          badge: 'Phương pháp hiện đại',
          title: 'Blended Learning linh hoạt',
          desc: 'Học mọi lúc mọi nơi, cân bằng hoàn hảo với trường chính khóa',
          icon: Laptop,
        },
        {
          badge: 'Đầu ra uy tín',
          title: 'U.S. High School Diploma',
          desc: 'Bằng tốt nghiệp THPT Mỹ chính quy & IELTS 7.0+',
          icon: GraduationCap,
        },
      ]
    : [
        {
          badge: 'Dual Accreditation',
          title: 'Cognia & WASC Accredited',
          desc: 'Globally recognized diploma and credit transferability',
          icon: ShieldCheck,
        },
        {
          badge: 'Cost Efficient',
          title: 'Save up to 67% Tuition',
          desc: 'Sustainable investment plan for 12 years of learning',
          icon: Coins,
        },
        {
          badge: 'Modern Method',
          title: 'Flexible Blended Learning',
          desc: 'Learn anywhere, balanced alongside regular schooling',
          icon: Laptop,
        },
        {
          badge: 'Global Outcome',
          title: 'U.S. High School Diploma',
          desc: 'Official American diploma and IELTS 7.0+ readiness',
          icon: GraduationCap,
        },
      ]

  return (
    <section className={`${compact ? 'py-10 sm:py-14' : isTop ? 'pt-28 sm:pt-32 pb-14 sm:pb-20' : 'py-14 sm:py-20'} bg-[#F6F5F1] relative overflow-hidden border-b border-[#DEDDD6]`}>
      {/* Decorative ambient background accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8DC63F]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#1E3570]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#2E4A9E] text-xs font-bold uppercase tracking-wider border border-[#DEDDD6] shadow-xs mb-3">
            <Compass className="w-3.5 h-3.5 text-[#8DC63F]" />
            <span>{isVi ? 'Định hướng giáo dục bền vững' : 'Sustainable Educational Direction'}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#20242B] tracking-tight leading-[1.25] mb-3">
            {isVi ? 'Giải Pháp Tiếp Cận Giáo Dục Quốc Tế Bền Vững' : 'A Sustainable Approach to World-Class Education'}
          </h2>

          <p className="text-sm sm:text-base text-[#5C6069] leading-relaxed">
            {isVi
              ? 'Xóa bỏ rào cản chi phí và khoảng cách địa lý — Mở rộng cánh cửa học thuật chuẩn Hoa Kỳ cho mọi học sinh Việt Nam.'
              : 'Breaking down financial and geographic boundaries — Opening US-standard educational opportunities for all students.'}
          </p>
        </motion.div>

        {/* Core 2-Sided Comparison Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.slow, ease: easeOut }}
          className="bg-white rounded-3xl border border-[#DEDDD6] shadow-sm overflow-hidden mb-8 sm:mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: The Barriers / Reality */}
            <div className="lg:col-span-5 bg-[#FAF9F6] p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#DEDDD6] flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF0E9] text-[#F26522] text-xs font-bold uppercase tracking-wider mb-4 border border-[#F26522]/20">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Thách thức & Rào cản phổ biến' : 'The Everyday Obstacles'}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-[#20242B] mb-3 leading-snug">
                  {isVi ? 'Mong muốn lớn nhưng rào cản hiện hữu' : 'High Aspirations Faced with Real Barriers'}
                </h3>

                {/* The user's exact quote p1 with styling */}
                <div className="p-4 rounded-2xl bg-white border border-[#DEDDD6] mb-6 shadow-xs">
                  <p className="text-xs sm:text-sm text-[#20242B] font-medium leading-relaxed italic">
                    “{contentP1}”
                  </p>
                </div>

                {/* 4 Barrier Cards */}
                <div className="space-y-3">
                  {challenges.map((item, idx) => {
                    const Icon = item.icon
                    return (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/70 hover:bg-white border border-[#E5E4DE] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-[#FEF0E9] text-[#F26522] flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-[#20242B] mb-0.5">
                            {item.title}
                          </h4>
                          <p className="text-[11px] sm:text-xs text-[#5C6069] leading-normal">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E5E4DE] text-[11px] sm:text-xs text-[#5C6069] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26522]" />
                <span>{isVi ? 'Những yếu tố thường khiến lộ trình học tập bị gián đoạn' : 'Factors that commonly disrupt educational continuity'}</span>
              </div>
            </div>

            {/* Right Column: EPath's Sustainable Transformation */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFFB] text-[#1E3570] text-xs font-bold uppercase tracking-wider mb-4 border border-[#2E4A9E]/20">
                  <Sparkles className="w-3.5 h-3.5 text-[#8DC63F]" />
                  <span>{isVi ? 'Hướng tiếp cận bền vững từ EPath' : 'EPath Sustainable Solution'}</span>
                </div>

                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#20242B] mb-3 leading-snug">
                  {isVi
                    ? 'Lộ Trình Xuyên Suốt — Tối Ưu Đầu Tư & Khẳng Định Tương Lai'
                    : 'A Seamless Pathway — Optimized Investment & Future Readiness'}
                </h3>

                {/* The user's exact quote p2 with styling */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6] mb-6 shadow-xs">
                  <p className="text-xs sm:text-sm text-[#1E3570] font-semibold leading-relaxed">
                    {contentP2}
                  </p>
                </div>

                {/* 3 Pillar Transformation Items */}
                <div className="space-y-4">
                  {solutions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-[#DEDDD6] bg-gradient-to-r from-white to-[#F6F5F1]/50 hover:border-[#8DC63F] hover:shadow-xs transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="w-5 h-5 rounded-full bg-[#8DC63F]/20 text-[#5C9024] flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </span>
                        <span className="text-[11px] font-bold text-[#5C9024] uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-[#20242B] mb-1 pl-7">
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed pl-7">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Assurance Note */}
              <div className="mt-6 pt-4 border-t border-[#DEDDD6] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#20242B] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#8DC63F] animate-pulse" />
                  <span>{isVi ? 'Đồng hành xuyên suốt từ Mầm non đến THPT' : 'Continuous support from Kindergarten to Grade 12'}</span>
                </div>
                <div className="flex items-center gap-1 text-[#2E4A9E] font-bold text-xs">
                  <span>{isVi ? 'Khám phá 4 giai đoạn chi tiết bên dưới' : 'Explore the 4 stages below'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 4 Bottom Value Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {valueMetrics.map((metric, idx) => {
            const Icon = metric.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={inViewViewport}
                transition={{ duration: duration.normal, delay: idx * 0.05, ease: easeOut }}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-[#DEDDD6] hover:border-[#8DC63F]/60 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#F6F5F1] text-[#20242B] text-[10px] font-bold uppercase tracking-wider border border-[#DEDDD6]">
                      {metric.badge}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-[#EAEFFB] text-[#2E4A9E] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-[#20242B] mb-1 leading-snug">
                    {metric.title}
                  </h4>
                  <p className="text-xs text-[#5C6069] leading-relaxed">
                    {metric.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
