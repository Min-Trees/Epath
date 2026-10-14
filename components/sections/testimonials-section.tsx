'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { duration, easeOut } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import type { Testimonial } from '@/lib/cms-types'
import { stripHtml } from '@/components/admin/rich-text-renderer'

interface TestimonialData {
  name: string
  role: string
  quote: string
  rating: number
  avatarUrl?: string
}

export function TestimonialsSection() {
  const t = useTranslations('testimonials')
  const locale = useLocale()
  const [current, setCurrent] = useState(0)
  const { data: cms } = useCmsContext()

  const rawTestimonials = (cms.testimonials || [])
    .filter((t) => t.isActive !== false)
    .sort((a, b) => {
      if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
      return (a.order ?? 0) - (b.order ?? 0)
    })

  // Deduplicate testimonials by name or ID
  const uniqueTestimonials = rawTestimonials.reduce<typeof rawTestimonials>((acc, curr) => {
    const key = (curr.name || '').trim().toLowerCase()
    if (!acc.some((t) => (t.name || '').trim().toLowerCase() === key)) {
      acc.push(curr)
    }
    return acc
  }, [])

  const testimonials = uniqueTestimonials.map((item) => ({
    name: item.name,
    role: item.role || (locale === 'en' ? 'Parent of an EPath learner' : 'Phụ huynh học sinh'),
    quote: (locale === 'en' ? item.content?.en : item.content?.vi) || item.content?.vi || item.content?.en || '',
    rating: item.rating || 5,
    avatarUrl: item.avatarUrl,
  }))

  // Use i18n fallback if CMS is empty
  const i18nRaw = (t.raw('list') as Array<{ name: string; quote: string; rating?: number; location?: string; role?: string }>) || []
  const i18nList: TestimonialData[] = i18nRaw.map((item) => ({
    name: item.name,
    role: item.role || item.location || (locale === 'en' ? 'Parent of an EPath learner' : 'Phụ huynh học sinh'),
    quote: item.quote,
    rating: item.rating || 5,
  }))
  const list = testimonials.length > 0 ? testimonials : i18nList

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const next = () => {
    setCurrent((prev) => (prev + 1) % list.length)
  }

  const prev = () => {
    setCurrent((p) => (p === 0 ? list.length - 1 : p - 1))
  }

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      next()
    } else if (distance < -minSwipeDistance) {
      prev()
    }
  }

  return (
    <section className="py-20 bg-[#F6F5F1] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#20242B] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#5C6069] max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {list.length > 0 && (
          <div className="relative max-w-4xl mx-auto px-2 md:px-0">
            {/* Carousel track window with top padding so the floating quote badge is not clipped */}
            <div className="overflow-hidden pt-8 pb-4 -mt-6">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `translateX(-${current * 100}%)`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {list.map((item, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2 md:px-4">
                    <div
                      className="bg-white rounded-xl p-8 md:p-12 relative shadow-lg border border-[#DEDDD6] w-full min-h-[380px] md:min-h-[340px] flex flex-col justify-between"
                      style={{ boxShadow: '0 12px 40px -12px rgba(30, 53, 112, 0.12)' }}
                    >
                      {/* Floating Quote Badge */}
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-[#1E3570] rounded-full flex items-center justify-center shadow-md">
                        <Quote className="w-6 h-6 text-white" />
                      </div>

                      <div className="text-center flex-1 flex flex-col justify-center">
                        {/* Avatar */}
                        {item.avatarUrl ? (
                          <img
                            src={item.avatarUrl}
                            alt={item.name}
                            className="w-20 h-20 mx-auto mb-6 rounded-lg object-cover"
                          />
                        ) : (
                          <div
                            className="w-20 h-20 mx-auto mb-6 rounded-lg flex items-center justify-center text-white text-2xl font-bold shadow-sm"
                            style={{ background: 'linear-gradient(135deg, #1E3570 0%, #F26522 100%)' }}
                          >
                            {item.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(-2)
                              .join('')}
                          </div>
                        )}

                        {/* Star Rating */}
                        <div className="flex justify-center gap-1 mb-5">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-[#F26522] text-[#F26522]"
                            />
                          ))}
                        </div>

                        {/* Quote Text */}
                        <blockquote className="text-lg md:text-xl text-[#20242B] leading-relaxed mb-6 italic min-h-[64px] flex items-center justify-center">
                          &ldquo;{stripHtml(item.quote)}&rdquo;
                        </blockquote>

                        {/* Author Info */}
                        <div className="mt-auto">
                          <div className="font-semibold text-[#2E4A9E] text-lg">
                            {item.name}
                          </div>
                          <div className="text-[#5C6069] text-sm">
                            {item.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {list.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1E3570] hover:text-white transition-all duration-200 border border-[#DEDDD6] active:scale-95 cursor-pointer"
                  aria-label="Previous testimonial"
                  type="button"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-12 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1E3570] hover:text-white transition-all duration-200 border border-[#DEDDD6] active:scale-95 cursor-pointer"
                  aria-label="Next testimonial"
                  type="button"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {list.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {list.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrent(index)}
                    type="button"
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-3 rounded-full transition-all duration-300 ease-out cursor-pointer ${
                      index === current
                        ? 'bg-[#2E4A9E] w-8'
                        : 'bg-[#DEDDD6] hover:bg-[#2E4A9E]/50 w-3'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
