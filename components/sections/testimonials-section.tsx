'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'
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
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const [testimonials, setTestimonials] = useState<TestimonialData[]>([])

  useEffect(() => {
    fetch('/api/cms/testimonials')
      .then((r) => r.json())
      .then((data) => {
        if (data.items && data.items.length > 0) {
          const items = data.items.filter((t: Testimonial) => t.isActive)
            .sort((a: Testimonial, b: Testimonial) => {
              if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1
              return a.order - b.order
            })
            .map((item: Testimonial) => ({
              name: item.name,
              role: item.role || 'Phụ huynh học sinh',
              quote: item.content?.vi || item.content?.en || '',
              rating: item.rating || 5,
              avatarUrl: item.avatarUrl,
            }))
          setTestimonials(items)
        }
      })
      .catch(console.error)
  }, [])

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
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inViewViewport}
          transition={{ duration: duration.normal, ease: easeOut }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#231F20] mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto">
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
                    <div className="surface-alt rounded-2xl p-8 md:p-12 relative shadow-lg border border-[#3A53A3]/10 w-full">
                      <div className="absolute -top-6 left-8 w-12 h-12 bg-[#3A53A3] rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>

                      <div className="text-center">
                        {list[current].avatarUrl ? (
                          <img
                            src={list[current].avatarUrl}
                            alt={list[current].name}
                            className="w-20 h-20 mx-auto mb-6 rounded-xl object-cover"
                          />
                        ) : (
                          <div className="w-20 h-20 mx-auto mb-6 rounded-xl bg-gradient-to-br from-[#3A53A3] to-[#8BC53F] flex items-center justify-center text-white text-2xl font-bold">
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
                              className="w-5 h-5 fill-[#F05A28] text-[#F05A28]"
                            />
                          ))}
                        </div>

                        <blockquote className="text-lg md:text-xl text-[#231F20] leading-relaxed mb-6 italic">
                          &ldquo;{list[current].quote}&rdquo;
                        </blockquote>

                        <div>
                          <div className="font-semibold text-[#3A53A3] text-lg">
                            {list[current].name}
                          </div>
                          <div className="text-[#6B6B6B] text-sm">
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
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#3A53A3] hover:text-white transition-colors duration-200 border border-[#3A53A3]/20"
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#3A53A3] hover:text-white transition-colors duration-200 border border-[#3A53A3]/20"
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
                    className={`h-3 rounded-full transition-all duration-200 ${
                      index === current
                        ? 'bg-[#3A53A3] w-8'
                        : 'bg-[#3A53A3]/30 hover:bg-[#3A53A3]/50 w-3'
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
