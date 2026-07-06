'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { duration, easeOut, inViewViewport } from '@/lib/motion-presets'

export default function AdmissionsPage() {
  const t = useTranslations('admissions')
  const tFooter = useTranslations('footer')
  const params = useParams()
  const locale = (params.locale as string) || 'vi'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentName: '',
    studentGrade: '',
    program: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setSubmitted(true)
    setIsSubmitting(false)
  }

  return (
    <>
      <section
        id="contact"
        className="pt-32 pb-20"
        style={{ background: 'linear-gradient(135deg, #3A53A3 0%, #2E4389 100%)' }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.normal, ease: easeOut }}
            className="max-w-3xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('hero.title')}</h1>
            <p className="text-xl text-white/90">{t('hero.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 surface-alt">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, ease: easeOut }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-[#231F20] mb-6">{t('form.title')}</h2>
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: duration.normal, ease: easeOut }}
                  className="text-center py-12"
                >
                  <div className="w-20 h-20 bg-[#8BC53F]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-[#8BC53F]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#231F20] mb-4">
                    {t('form.success')}
                  </h3>
                  <p className="text-[#6B6B6B] mb-6">{t('form.successText')}</p>
                  <Button onClick={() => setSubmitted(false)} variant="outline">
                    {t('form.registerMore')}
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>{t('form.parentName')}</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label>{t('form.phone')}</Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label>{t('form.email')}</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#F05A28] hover:bg-[#E04D1A]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('form.submitting') : t('form.submit')}
                  </Button>
                </form>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inViewViewport}
              transition={{ duration: duration.normal, delay: 0.1, ease: easeOut }}
            >
              <h2 className="text-2xl font-bold text-[#231F20] mb-6">{t('contact.title')}</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#3A53A3]/10 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-[#3A53A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20]">{t('contact.address')}</h3>
                    <p className="text-[#6B6B6B]">{tFooter('contact.address')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#8BC53F]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-[#8BC53F]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20]">{t('contact.hotline')}</h3>
                    <p className="text-[#6B6B6B]">{tFooter('contact.phone')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#F05A28]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-[#F05A28]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20]">{t('contact.emailLabel')}</h3>
                    <p className="text-[#6B6B6B]">{tFooter('contact.email')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#3A53A3]/10 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-[#3A53A3]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#231F20]">{t('contact.hours')}</h3>
                    <p className="text-[#6B6B6B]">{t('contact.hoursValue')}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#231F20] mb-4">{t('faq.title')}</h2>
          </div>
          <div className="max-w-3xl mx-auto surface-alt rounded-xl p-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="q1">
                <AccordionTrigger>{t('faq.q1')}</AccordionTrigger>
                <AccordionContent>{t('faq.a1')}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2">
                <AccordionTrigger>{t('faq.q2')}</AccordionTrigger>
                <AccordionContent>{t('faq.a2')}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>
    </>
  )
}
