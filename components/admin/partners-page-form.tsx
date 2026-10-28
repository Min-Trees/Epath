'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import { DEFAULT_PARTNERS_CONTENT } from '@/lib/default-partners'
import type {
  PartnersContentInput,
  PartnersContent,
} from '@/lib/cms-types'
import {
  Globe2,
  Save,
  RotateCcw,
  Eye,
  Check,
  ExternalLink,
  Sparkles,
  MessageSquare,
} from 'lucide-react'

export function PartnersPageForm() {
  const [form, setForm] = useState<PartnersContentInput>(DEFAULT_PARTNERS_CONTENT)
  const [docId, setDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/cms/partners-content')
        const data = await res.json()
        const items: PartnersContent[] = data.items || []
        if (items.length > 0) {
          const item = items[0]
          setDocId(item.id)
          setForm({
            ...DEFAULT_PARTNERS_CONTENT,
            ...item,
            hero: item.hero || DEFAULT_PARTNERS_CONTENT.hero,
            cta: item.cta || DEFAULT_PARTNERS_CONTENT.cta,
            isActive: item.isActive !== false,
          })
        }
      } catch (err) {
        console.error('Failed to load partners content:', err)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSavedSuccess(false)
    try {
      if (docId) {
        const res = await fetch(`/api/cms/partners-content/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          const detailMsg = errData.details?.fieldErrors
            ? Object.entries(errData.details.fieldErrors)
                .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
                .join('; ')
            : errData.error || `Không thể cập nhật cấu hình Trang Đối tác Quốc tế (${res.status})`
          throw new Error(detailMsg)
        }
      } else {
        const res = await fetch('/api/cms/partners-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          const detailMsg = errData.details?.fieldErrors
            ? Object.entries(errData.details.fieldErrors)
                .map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`)
                .join('; ')
            : errData.error || `Không thể tạo mới cấu hình Trang Đối tác Quốc tế (${res.status})`
          throw new Error(detailMsg)
        }
        const json = await res.json()
        setDocId(json.id)
      }
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)
    } catch (err: unknown) {
      console.error(err)
      setError((err as Error).message || 'Có lỗi xảy ra khi lưu')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (confirm('Khôi phục toàn bộ nội dung cấu hình Trang Đối tác Quốc tế về mặc định?')) {
      setForm(DEFAULT_PARTNERS_CONTENT)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3570]" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#DEDDD6] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#1E3570]/10 flex items-center justify-center text-[#1E3570]">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1E3570]">
              Cấu hình Trang Đối tác Quốc tế
            </h2>
            <p className="text-xs text-[#5C6069]">
              Quản lý tiêu đề, thông điệp giới thiệu, hình ảnh đại diện và khối kêu gọi hành động (CTA).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/vi/partners"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-[#DEDDD6] text-[#1E3570] hover:bg-[#F6F5F1] transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Xem trang thực tế</span>
            <ExternalLink className="w-3 h-3 text-[#5C6069]" />
          </a>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
            disabled={isSaving}
            className="text-xs border-[#DEDDD6] text-[#5C6069] hover:text-[#1E3570]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Khôi phục mặc định
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="text-xs bg-[#1E3570] hover:bg-[#2E4A9E] text-white shadow-xs"
          >
            {isSaving ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent" />
                Đang lưu...
              </span>
            ) : savedSuccess ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-200">
                <Check className="w-3.5 h-3.5" />
                Đã lưu thành công!
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <Save className="w-3.5 h-3.5" />
                Lưu cấu hình
              </span>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
          {error}
        </div>
      )}

      {/* SECTION 1: HERO & INTRO HEADER */}
      <Card className="border-[#DEDDD6] shadow-xs">
        <CardHeader className="bg-[#F6F5F1]/60 border-b border-[#DEDDD6] py-3.5">
          <CardTitle className="text-sm font-bold text-[#1E3570] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F26522]" />
            1. Phần Mở Đầu & Banner Giới Thiệu (Hero Section)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Tiêu đề trang (Tiếng Việt)</Label>
              <Input
                value={form.hero?.title?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: {
                      ...form.hero,
                      title: { ...form.hero.title, vi: e.target.value },
                    },
                  })
                }
                placeholder="Đối tác Quốc tế"
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Tiêu đề trang (English)</Label>
              <Input
                value={form.hero?.title?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: {
                      ...form.hero,
                      title: { ...form.hero.title, en: e.target.value },
                    },
                  })
                }
                placeholder="International Partners"
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Thông điệp giới thiệu (Tiếng Việt)</Label>
              <Textarea
                rows={3}
                value={form.hero?.subtitle?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: {
                      ...form.hero,
                      subtitle: { ...form.hero.subtitle, vi: e.target.value },
                    },
                  })
                }
                placeholder="Mô tả tầm nhìn hợp tác quốc tế..."
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Thông điệp giới thiệu (English)</Label>
              <Textarea
                rows={3}
                value={form.hero?.subtitle?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    hero: {
                      ...form.hero,
                      subtitle: { ...form.hero.subtitle, en: e.target.value },
                    },
                  })
                }
                placeholder="International partnership vision..."
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-[#1E3570] block mb-1">
              Hình ảnh Banner đại diện trang Đối tác
            </Label>
            <ImagePicker
              value={form.hero?.bannerUrl || ''}
              onChange={(url) =>
                setForm({
                  ...form,
                  hero: { ...form.hero, bannerUrl: url },
                })
              }
              folder="partners"
            />
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: BOTTOM CTA BANNER */}
      <Card className="border-[#DEDDD6] shadow-xs">
        <CardHeader className="bg-[#F6F5F1]/60 border-b border-[#DEDDD6] py-3.5">
          <CardTitle className="text-sm font-bold text-[#1E3570] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#2E4A9E]" />
            2. Khối Kêu Gọi Hành Động Cuối Trang (Bottom CTA)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Tiêu đề CTA (Tiếng Việt)</Label>
              <Input
                value={form.cta?.title?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: { ...form.cta, title: { ...form.cta.title, vi: e.target.value } },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Tiêu đề CTA (English)</Label>
              <Input
                value={form.cta?.title?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: { ...form.cta, title: { ...form.cta.title, en: e.target.value } },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Phụ đề CTA (Tiếng Việt)</Label>
              <Textarea
                rows={2}
                value={form.cta?.subtitle?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: { ...form.cta, subtitle: { ...form.cta.subtitle, vi: e.target.value } },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Phụ đề CTA (English)</Label>
              <Textarea
                rows={2}
                value={form.cta?.subtitle?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: { ...form.cta, subtitle: { ...form.cta.subtitle, en: e.target.value } },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Chữ trên nút (Tiếng Việt)</Label>
              <Input
                value={form.cta?.buttonText?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: {
                      ...form.cta,
                      buttonText: { ...form.cta.buttonText, vi: e.target.value },
                    },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-[#1E3570]">Chữ trên nút (English)</Label>
              <Input
                value={form.cta?.buttonText?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    cta: {
                      ...form.cta,
                      buttonText: { ...form.cta.buttonText, en: e.target.value },
                    },
                  })
                }
                className="mt-1 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
