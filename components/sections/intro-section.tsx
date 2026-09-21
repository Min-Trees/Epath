'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Quote,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import { duration, easeOut, inViewViewport, useSectionActive } from '@/lib/motion-presets'

export function IntroSection() {
  const locale = useLocale()
  const isVi = locale === 'vi'
  const sectionRef = useSectionActive<HTMLElement>({ threshold: 0.1 })

  return (
    <section
      ref={sectionRef}
      className="intro-section relative py-16 sm:py-20 lg:py-24 bg-white overflow-hidden"
      aria-label="About EPath Introduction"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Narrative with user's exact content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E3570]/8 text-[#1E3570] text-xs sm:text-sm font-semibold mb-4 w-fit border border-[#1E3570]/15">
              <Sparkles className="w-4 h-4 text-[#8DC63F]" />
              <span>{isVi ? 'VỀ EPATH EDUCATION' : 'ABOUT EPATH EDUCATION'}</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E3570] tracking-tight mb-6 leading-tight">
              {isVi ? (
                <>
                  EPath là gì? — Lộ trình học thuật quốc tế{' '}
                  <span className="text-[#8DC63F]">cá nhân hóa</span>
                </>
              ) : (
                <>
                  What is EPath? — A Personalized International{' '}
                  <span className="text-[#8DC63F]">Academic Pathway</span>
                </>
              )}
            </h2>

            {/* Paragraphs 1, 2, 3 */}
            <div className="space-y-4 text-[#5C6069] leading-relaxed text-sm sm:text-base mb-6">
              <p>
                {isVi ? (
                  <>
                    <strong className="text-[#1E3570] font-semibold">EPath Education</strong> là đơn vị giáo dục cung cấp giải pháp học tập cá nhân hóa từ Tiểu học đến Trung học, giúp học sinh tiếp cận nền tảng học thuật quốc tế thông qua mô hình <strong className="text-[#1E3570] font-semibold">Blended Learning</strong> (kết hợp Trực tiếp và Trực tuyến) và hệ sinh thái giáo dục toàn diện.
                  </>
                ) : (
                  <>
                    <strong className="text-[#1E3570] font-semibold">EPath Education</strong> provides personalized learning pathways from Elementary through High School, giving students access to international academic standards via our innovative <strong className="text-[#1E3570] font-semibold">Blended Learning</strong> model (online + on-site) and a comprehensive educational ecosystem.
                  </>
                )}
              </p>

              <p>
                {isVi ? (
                  <>
                    Chương trình được xây dựng theo định hướng <strong className="text-[#1E3570] font-semibold">Common Core State Standards (Mỹ)</strong>, kết hợp học liệu từ <strong className="text-[#1E3570] font-semibold">Edmentum International</strong> — tổ chức giáo dục uy tín được kiểm định bởi <strong className="text-[#1E3570] font-semibold">Cognia và WASC</strong> — nhằm phát triển năng lực học thuật, kỹ năng tự học và tư duy thế kỷ 21.
                  </>
                ) : (
                  <>
                    Our curriculum is aligned with the <strong className="text-[#1E3570] font-semibold">U.S. Common Core State Standards</strong>, incorporating accredited learning resources from <strong className="text-[#1E3570] font-semibold">Edmentum International</strong> — accredited by <strong className="text-[#1E3570] font-semibold">Cognia & WASC</strong> — to cultivate academic excellence, independent learning skills, and 21st-century critical thinking.
                  </>
                )}
              </p>

              <p>
                {isVi ? (
                  <>
                    EPath kết nối nhà trường, gia đình và các đối tác giáo dục uy tín để xây dựng lộ trình học tập rõ ràng, giúp giáo dục quốc tế chất lượng cao trở nên dễ tiếp cận hơn với các gia đình Việt Nam.
                  </>
                ) : (
                  <>
                    EPath connects schools, families, and trusted global educational partners to establish clear pathways, making high-quality international education truly accessible for Vietnamese families.
                  </>
                )}
              </p>
            </div>

            {/* Paragraph 4: Highlighted Callout / Origin Story */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F6F5F1] border-l-4 border-[#8DC63F] border-[#DEDDD6] shadow-xs mb-8 text-[#20242B] relative">
              <div className="flex items-start gap-3">
                <Quote className="w-5 h-5 text-[#8DC63F] flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-[0.9375rem] leading-relaxed text-[#20242B]">
                  {isVi ? (
                    <>
                      EPath Education được hình thành từ một câu hỏi rất thực của phụ huynh tại hệ thống Mầm non Little People sau hơn 10 năm vận hành:{' '}
                      <span className="font-semibold text-[#1E3570] italic">
                        &ldquo;Sau Mầm non, con sẽ tiếp tục học theo lộ trình nào để không bị đứt gãy?&rdquo;
                      </span>{' '}
                      Từ nhu cầu đó, EPath ra đời như một lời giải có hệ thống.
                    </>
                  ) : (
                    <>
                      EPath Education was born from a genuine question asked by parents at Little People Kindergarten after 10+ years of operation:{' '}
                      <span className="font-semibold text-[#1E3570] italic">
                        &ldquo;After Kindergarten, what pathway should our child follow so learning remains unbroken?&rdquo;
                      </span>{' '}
                      From that real need, EPath was established as a systematic, long-term solution.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Links */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1E3570] hover:bg-[#2E4A9E] text-white text-sm sm:text-base font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <span>{isVi ? 'Tìm hiểu thêm về EPath' : 'Learn More About EPath'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/${locale}/programs`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#1E3570] text-[#1E3570] hover:bg-[#1E3570]/5 text-sm sm:text-base font-semibold transition-all duration-200"
              >
                <span>{isVi ? 'Khám phá các lộ trình học' : 'Explore Learning Pathways'}</span>
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Visual Story Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={inViewViewport}
            transition={{ duration: duration.normal, ease: easeOut, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#F6F5F1]">
              <div className="aspect-[4/5] sm:aspect-[3/4] relative overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/about-story.jpg"
                  alt="EPath Education Students"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E3570]/85 via-[#1E3570]/20 to-transparent pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-white/60 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#8DC63F] animate-pulse" />
                  <span className="text-xs font-bold text-[#1E3570]">
                    {isVi ? 'Kiểm định Cognia & WASC' : 'Cognia & WASC Accredited'}
                  </span>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-lg border border-white/60 text-[#1E3570]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#8DC63F]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#8DC63F]">
                      {isVi ? 'Lộ trình xuyên suốt K–12' : 'Seamless K–12 Pathway'}
                    </span>
                  </div>
                  <p className="font-extrabold text-sm sm:text-base leading-snug text-[#1E3570]">
                    {isVi
                      ? 'Từ Mầm non đến THPT — Không lo đứt gãy kiến thức'
                      : 'From K to 12 — Zero Knowledge Gap'}
                  </p>
                  <p className="text-xs text-[#5C6069] mt-1">
                    {isVi
                      ? 'Tích hợp chuẩn Common Core & Hệ sinh thái Edmentum'
                      : 'Common Core Standards & Edmentum Ecosystem'}
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative background ambient circles */}
            <div
              className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#8DC63F]/15 blur-3xl pointer-events-none -z-10"
              aria-hidden
            />
            <div
              className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-[#1E3570]/15 blur-3xl pointer-events-none -z-10"
              aria-hidden
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
