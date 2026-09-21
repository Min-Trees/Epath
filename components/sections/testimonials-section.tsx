'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
import { useCmsContext } from '@/lib/cms-context'
import type { Testimonial } from '@/lib/cms-types'

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
  const [direction, setDirection] = useState(0)
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
  const i18nList = t.raw('list') as TestimonialData[]
  const list = testimonials.length > 0 ? testimonials : i18nList

  const next = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % list.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((p) => (p === 0 ? list.length - 1 : p - 1))
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 48 : -48,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 48 : -48,
      opacity: 0,
    }),
  }

  return (
    <section className="py-20 bg-[#F6F5F1] overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
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
          <>
            <div className="relative max-w-4xl mx-auto">
              <div className="min-h-[400px]">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={current}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: duration.normal, ease: easeOut }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="bg-white rounded-3xl p-8 md:p-12 relative shadow-lg border border-[#DEDDD6] w-full"
                      style={{ boxShadow: '0 12px 40px -12px rgba(30, 53, 112, 0.12)' }}
                    >
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-[#1E3570] rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>

                      <div className="text-center">
                        {list[current].avatarUrl ? (
                          <img
                            src={list[current].avatarUrl}
                            alt={list[current].name}
                            className="w-20 h-20 mx-auto mb-6 rounded-2xl object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
                            style={{ background: 'linear-gradient(135deg, #1E3570 0%, #F26522 100%)' }}
                          >
                            {list[current].name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(-2)
                              .join('')}
                          </div>
                        )}

                        <div className="flex justify-center gap-1 mb-6">
                          {[...Array(list[current].rating || 5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-[#F26522] text-[#F26522]"
                            />
                          ))}
                        </div>

                        <blockquote className="text-lg md:text-xl text-[#20242B] leading-relaxed mb-6 italic">
                          &ldquo;{list[current].quote}&rdquo;
                        </blockquote>

                        <div>
                          <div className="font-semibold text-[#2E4A9E] text-lg">
                            {list[current].name}
                          </div>
                          <div className="text-[#5C6069] text-sm">
                            {list[current].role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {list.length > 1 && (
                <>
                  <motion.button
                    onClick={prev}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: duration.fast, ease: easeOut }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1E3570] hover:text-white transition-colors duration-300 ease-out border border-[#DEDDD6]"
                    aria-label="Previous testimonial"
                    type="button"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    onClick={next}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ duration: duration.fast, ease: easeOut }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1E3570] hover:text-white transition-colors duration-300 ease-out border border-[#DEDDD6]"
                    aria-label="Next testimonial"
                    type="button"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </>
              )}
            </div>

            {list.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {list.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > current ? 1 : -1)
                      setCurrent(index)
                    }}
                    type="button"
                    aria-label={`Go to testimonial ${index + 1}`}
                    className={`h-3 rounded-full transition-all duration-400 ease-out ${
                      index === current
                        ? 'bg-[#2E4A9E] w-8'
                        : 'bg-[#DEDDD6] hover:bg-[#2E4A9E]/50 w-3'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
