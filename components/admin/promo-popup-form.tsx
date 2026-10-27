'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import { DEFAULT_PROMO_POPUP_DATA } from '@/lib/promo-popup-data'
import type { PromoPopupInput, PromoPopup } from '@/lib/cms-types'
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Check,
  Plus,
  Trash2,
  X,
  Bot,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
  Settings2,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react'

interface Props {
  load?: () => Promise<PromoPopup[]>
  update?: (id: string, data: Partial<PromoPopupInput>) => Promise<unknown>
  create?: (data: PromoPopupInput) => Promise<{ id: string }>
}

export function PromoPopupForm({ load, update, create }: Props) {
  const [form, setForm] = useState<PromoPopupInput>(DEFAULT_PROMO_POPUP_DATA)
  const [docId, setDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewLocale, setPreviewLocale] = useState<'vi' | 'en'>('vi')

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/cms/promo-popup')
        const data = await res.json()
        const items: PromoPopup[] = data.items || []
        if (items.length > 0) {
          const item = items[0]
          setDocId(item.id)
          setForm({
            isActive: item.isActive !== false,
            delaySeconds: item.delaySeconds ?? 15,
            cooldownHours: item.cooldownHours ?? 12,
            imageUrl: item.imageUrl || DEFAULT_PROMO_POPUP_DATA.imageUrl,
            tag: item.tag || DEFAULT_PROMO_POPUP_DATA.tag,
            tagDescription: item.tagDescription || DEFAULT_PROMO_POPUP_DATA.tagDescription,
            badge: item.badge || DEFAULT_PROMO_POPUP_DATA.badge,
            title: item.title || DEFAULT_PROMO_POPUP_DATA.title,
            description: item.description || DEFAULT_PROMO_POPUP_DATA.description,
            benefits: item.benefits || DEFAULT_PROMO_POPUP_DATA.benefits,
            showChatbotButton: item.showChatbotButton !== false,
            chatbotButtonText: item.chatbotButtonText || DEFAULT_PROMO_POPUP_DATA.chatbotButtonText,
            ctaText: item.ctaText || DEFAULT_PROMO_POPUP_DATA.ctaText,
            ctaLink: item.ctaLink || DEFAULT_PROMO_POPUP_DATA.ctaLink,
            dismissText: item.dismissText || DEFAULT_PROMO_POPUP_DATA.dismissText,
          })
        }
      } catch (err) {
        console.error('Failed to load promo popup config:', err)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const updateLocalized = (
    field: keyof PromoPopupInput,
    lang: 'vi' | 'en',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: {
        ...((prev[field] as any) || {}),
        [lang]: value,
      },
    }))
  }

  const addBenefit = () => {
    setForm((prev) => ({
      ...prev,
      benefits: {
        vi: [...(prev.benefits?.vi || []), 'Quyền lợi mới...'],
        en: [...(prev.benefits?.en || []), 'New academic benefit...'],
      },
    }))
  }

  const updateBenefit = (index: number, lang: 'vi' | 'en', value: string) => {
    setForm((prev) => {
      const list = [...(prev.benefits?.[lang] || [])]
      list[index] = value
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          [lang]: list,
        },
      }
    })
  }

  const removeBenefit = (index: number) => {
    setForm((prev) => ({
      ...prev,
      benefits: {
        vi: (prev.benefits?.vi || []).filter((_, i) => i !== index),
        en: (prev.benefits?.en || []).filter((_, i) => i !== index),
      },
    }))
  }

  const handleResetDefaults = () => {
    if (!confirm('Khôi phục về toàn bộ nội dung popup mặc định của EPath?')) return
    setForm(DEFAULT_PROMO_POPUP_DATA)
  }

  const handleSave = async () => {
    setIsSaving(true)
    setError(null)
    setSavedSuccess(false)
    try {
      if (docId) {
        const res = await fetch(`/api/cms/promo-popup/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Cập nhật cấu hình popup thất bại')
      } else {
        const res = await fetch('/api/cms/promo-popup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Lưu cấu hình popup thất bại')
        const data = await res.json()
        if (data.id) setDocId(data.id)
      }
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3500)
    } catch (err: any) {
      setError(err?.message || 'Có lỗi xảy ra khi lưu')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-slate-500">
        Đang tải cấu hình Popup...
      </div>
    )
  }

  const benefitsVi = form.benefits?.vi || []
  const benefitsEn = form.benefits?.en || []
  const maxBenefits = Math.max(benefitsVi.length, benefitsEn.length)

  return (
    <div className="space-y-6">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded border border-[#e2e8f0] shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#1E3570] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8DC63F]" />
            Cấu hình Popup Quảng Cáo & Tư Vấn (Advisory Popup)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý nội dung, hình ảnh, thời gian chờ và các nút hành động cho modal tư vấn xuất hiện tự động trên website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="h-8 text-xs gap-1.5 border-slate-300 text-[#1E3570] hover:bg-slate-50"
          >
            <Eye className="w-3.5 h-3.5" />
            Xem trước Popup
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="h-8 text-xs gap-1.5 text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Khôi phục mặc định
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isSaving}
            className="h-8 text-xs gap-1.5 bg-[#1E3570] hover:bg-[#2E4A9E] text-white"
          >
            {isSaving ? (
              'Đang lưu…'
            ) : savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-300" />
                Đã lưu thành công!
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Lưu cấu hình
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 text-xs rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* 1. Trạng thái & Kích hoạt */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570] flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-[#2E4A9E]" />
            1. Trạng thái & Cơ chế kích hoạt hiển thị
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50/70">
            <div>
              <div className="text-xs font-bold text-slate-800">
                Hiển thị Popup trên website
              </div>
              <div className="text-[11px] text-slate-500">
                Bật để popup tự động mở khi khách hàng truy cập website đủ thời gian quy định.
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1E3570]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Thời gian chờ trước khi popup hiện (giây)
              </Label>
              <Input
                type="number"
                min={1}
                max={300}
                value={form.delaySeconds ?? 15}
                onChange={(e) =>
                  setForm((p) => ({ ...p, delaySeconds: Number(e.target.value) || 15 }))
                }
                className="h-8 text-xs mt-1"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Mặc định 15 giây. Tránh làm phiền người dùng vừa vào trang ngay lập tức.
              </p>
            </div>

            <div>
              <Label className="text-xs font-semibold text-slate-700">
                Chu kỳ hiển thị lại sau khi khách bấm tắt (giờ)
              </Label>
              <Input
                type="number"
                min={1}
                max={720}
                value={form.cooldownHours ?? 12}
                onChange={(e) =>
                  setForm((p) => ({ ...p, cooldownHours: Number(e.target.value) || 12 }))
                }
                className="h-8 text-xs mt-1"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Mặc định 12 giờ. Sau khi khách đóng popup, hệ thống sẽ nhớ và không hiện lại trong khoảng thời gian này.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Cột hình ảnh bên trái */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570] flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#5C9024]" />
            2. Khối hình ảnh & Huy hiệu bên trái popup
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            <div className="md:col-span-5 space-y-2">
              <Label className="text-xs font-semibold text-slate-700">
                Ảnh minh họa popup (Tải lên hoặc chọn từ Thư viện S3)
              </Label>
              <div className="rounded border border-slate-200 p-3 bg-slate-50">
                <ImagePicker
                  value={form.imageUrl || ''}
                  onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                  folder="promo-popup"
                  helperText="Ảnh góc nhìn dọc/chữ nhật hiển thị ở nửa bên trái popup. Nên dùng ảnh học sinh, cố vấn học tập chất lượng cao."
                />
              </div>
            </div>

            <div className="md:col-span-7 space-y-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Huy hiệu góc dưới ảnh (Tag nổi)
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="Tiếng Việt (VD: Tư Vấn Miễn Phí)"
                    value={form.tag?.vi ?? ''}
                    onChange={(e) => updateLocalized('tag', 'vi', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="English (e.g. Free Assessment)"
                    value={form.tag?.en ?? ''}
                    onChange={(e) => updateLocalized('tag', 'en', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Dòng chữ ngắn gọn dưới huy hiệu ảnh
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                  <Input
                    placeholder="VD: Đánh giá năng lực chuẩn Cambridge & Lộ trình Tú tài Mỹ"
                    value={form.tagDescription?.vi ?? ''}
                    onChange={(e) => updateLocalized('tagDescription', 'vi', e.target.value)}
                    className="h-8 text-xs"
                  />
                  <Input
                    placeholder="e.g. Cambridge assessment & US High School Diploma pathways"
                    value={form.tagDescription?.en ?? ''}
                    onChange={(e) => updateLocalized('tagDescription', 'en', e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Nội dung văn bản & Quyền lợi bên phải */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570] flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-[#F26522]" />
            3. Nội dung thông điệp & Danh sách quyền lợi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div>
            <Label className="text-xs font-semibold text-slate-700">
              Nhãn chủ đề trên cùng (Pill Badge)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt (VD: Định Hướng Lộ Trình 2026)"
                value={form.badge?.vi ?? ''}
                onChange={(e) => updateLocalized('badge', 'vi', e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                placeholder="English (e.g. Academic Roadmap 2026)"
                value={form.badge?.en ?? ''}
                onChange={(e) => updateLocalized('badge', 'en', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Tiêu đề chính của Popup</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Tiếng Việt (VD: Bạn đang tìm lộ trình học chuẩn Quốc tế tối ưu cho con?)"
                value={form.title?.vi ?? ''}
                onChange={(e) => updateLocalized('title', 'vi', e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                placeholder="English title..."
                value={form.title?.en ?? ''}
                onChange={(e) => updateLocalized('title', 'en', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-slate-700">Đoạn mô tả / Giới thiệu</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <textarea
                className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[64px]"
                placeholder="Đoạn văn tiếng Việt..."
                value={form.description?.vi ?? ''}
                onChange={(e) => updateLocalized('description', 'vi', e.target.value)}
              />
              <textarea
                className="flex w-full rounded border border-input bg-background px-3 py-2 text-xs min-h-[64px]"
                placeholder="English description..."
                value={form.description?.en ?? ''}
                onChange={(e) => updateLocalized('description', 'en', e.target.value)}
              />
            </div>
          </div>

          {/* Benefits checklist */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-slate-700">
                Các gạch đầu dòng quyền lợi (Checklist điểm nổi bật)
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBenefit}
                className="h-6 text-[11px] gap-1 border-slate-300 text-[#1E3570]"
              >
                <Plus className="w-3 h-3" />
                Thêm quyền lợi
              </Button>
            </div>

            {Array.from({ length: maxBenefits }).map((_, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-500 w-4 shrink-0">#{idx + 1}</span>
                <Input
                  placeholder={`Quyền lợi ${idx + 1} (VI)`}
                  value={benefitsVi[idx] ?? ''}
                  onChange={(e) => updateBenefit(idx, 'vi', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
                <Input
                  placeholder={`Benefit ${idx + 1} (EN)`}
                  value={benefitsEn[idx] ?? ''}
                  onChange={(e) => updateBenefit(idx, 'en', e.target.value)}
                  className="h-8 text-xs flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBenefit(idx)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Xóa quyền lợi này"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 4. Các nút hành động */}
      <Card className="border border-[#e2e8f0] shadow-none bg-white">
        <CardHeader className="py-3 px-4 border-b border-[#e2e8f0] bg-slate-50/60">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-[#1E3570] flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-[#3A54A4]" />
            4. Các nút kêu gọi hành động (Call To Action)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Channel 1: Chatbot Button */}
          <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-slate-800">
                  Nút &quot;Hỏi nhanh qua Trợ lý AI (24/7)&quot;
                </div>
                <div className="text-[11px] text-slate-500">
                  Khi người dùng nhấn nút này, popup sẽ đóng lại và tự động mở khung Chatbot Preny AI để trò chuyện.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showChatbotButton}
                  onChange={(e) => setForm((p) => ({ ...p, showChatbotButton: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2E4A9E]"></div>
              </label>
            </div>

            {form.showChatbotButton && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">Nhãn nút (Tiếng Việt)</Label>
                  <Input
                    placeholder="Hỏi nhanh qua Trợ lý AI (24/7)"
                    value={form.chatbotButtonText?.vi ?? ''}
                    onChange={(e) => updateLocalized('chatbotButtonText', 'vi', e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] font-semibold text-slate-600">Nhãn nút (English)</Label>
                  <Input
                    placeholder="Chat with AI Academic Advisor"
                    value={form.chatbotButtonText?.en ?? ''}
                    onChange={(e) => updateLocalized('chatbotButtonText', 'en', e.target.value)}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Channel 2: Consultation Registration Button */}
          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Nút Đăng ký tư vấn (Tiếng Việt)
                </Label>
                <Input
                  placeholder="Đăng ký tư vấn 1 kèm 1 với Cố vấn"
                  value={form.ctaText?.vi ?? ''}
                  onChange={(e) => updateLocalized('ctaText', 'vi', e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Nút Đăng ký tư vấn (English)
                </Label>
                <Input
                  placeholder="Book a 1:1 Consultation"
                  value={form.ctaText?.en ?? ''}
                  onChange={(e) => updateLocalized('ctaText', 'en', e.target.value)}
                  className="h-8 text-xs mt-1"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-slate-700">
                  Đường dẫn (URL liên kết)
                </Label>
                <Input
                  placeholder="/admissions#contact"
                  value={form.ctaLink ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, ctaLink: e.target.value }))}
                  className="h-8 text-xs mt-1"
                />
              </div>
            </div>
          </div>

          {/* Channel 3: Dismiss Button Text */}
          <div className="pt-2 border-t border-slate-100">
            <Label className="text-xs font-semibold text-slate-700">
              Chữ nút bỏ qua / để sau (Dismiss link)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              <Input
                placeholder="Để sau, tôi muốn tiếp tục xem"
                value={form.dismissText?.vi ?? ''}
                onChange={(e) => updateLocalized('dismissText', 'vi', e.target.value)}
                className="h-8 text-xs"
              />
              <Input
                placeholder="Maybe later, continue browsing"
                value={form.dismissText?.en ?? ''}
                onChange={(e) => updateLocalized('dismissText', 'en', e.target.value)}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-2 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="h-9 px-6 bg-[#1E3570] hover:bg-[#2E4A9E] text-white text-xs font-semibold gap-1.5 shadow-sm"
        >
          {isSaving ? 'Đang lưu…' : <><Save className="w-4 h-4" /> Lưu cấu hình Popup</>}
        </Button>
      </div>

      {/* ── Interactive Live Preview Modal ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-[#1E3570]/70 backdrop-blur-sm cursor-pointer"
            onClick={() => setPreviewOpen(false)}
          />

          {/* Preview Container */}
          <div className="relative z-10 w-full max-w-xl sm:max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#DEDDD6] flex flex-col md:flex-row">
            {/* Top Preview Badge */}
            <div className="absolute top-3 left-4 z-20 flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1E3570] text-white">
                CHẾ ĐỘ XEM TRƯỚC
              </span>
              <div className="flex bg-white/90 rounded border border-slate-200 p-0.5 text-[10px]">
                <button
                  type="button"
                  onClick={() => setPreviewLocale('vi')}
                  className={`px-2 py-0.5 rounded ${previewLocale === 'vi' ? 'bg-[#1E3570] text-white font-bold' : 'text-slate-600'}`}
                >
                  VI
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLocale('en')}
                  className={`px-2 py-0.5 rounded ${previewLocale === 'en' ? 'bg-[#1E3570] text-white font-bold' : 'text-slate-600'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPreviewOpen(false)}
              className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 md:bg-[#F6F5F1] md:hover:bg-[#EAEFFB] text-white md:text-[#5C6069] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Visual Column */}
            <div className="md:w-5/12 relative h-48 md:h-auto min-h-[190px] overflow-hidden bg-[#1E3570] flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.imageUrl || '/images/admissions/admissions-consultation.jpg'}
                alt="Advisory Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 text-white">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#8DC63F] text-[#20242B] mb-1.5 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  {previewLocale === 'vi' ? form.tag?.vi : form.tag?.en}
                </span>
                <p className="text-xs font-semibold leading-tight text-white/95">
                  {previewLocale === 'vi' ? form.tagDescription?.vi : form.tagDescription?.en}
                </p>
              </div>
            </div>

            {/* Right Content Column */}
            <div className="md:w-7/12 p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#2E4A9E]/10 text-[#2E4A9E] text-[11px] font-bold uppercase tracking-wider mb-2">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>{previewLocale === 'vi' ? form.badge?.vi : form.badge?.en}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black text-[#20242B] mb-2 leading-snug">
                  {previewLocale === 'vi' ? form.title?.vi : form.title?.en}
                </h3>

                <p className="text-xs sm:text-sm text-[#5C6069] leading-relaxed mb-4">
                  {previewLocale === 'vi' ? form.description?.vi : form.description?.en}
                </p>

                {/* Benefits */}
                {(previewLocale === 'vi' ? benefitsVi : benefitsEn).length > 0 && (
                  <div className="space-y-1.5 mb-5 bg-[#F6F5F1] p-3 rounded-xl border border-[#DEDDD6]/80 text-xs text-[#20242B]">
                    {(previewLocale === 'vi' ? benefitsVi : benefitsEn).map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#5C9024] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1 border-t border-[#DEDDD6]/60">
                {form.showChatbotButton && (
                  <button
                    type="button"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#EAEFFB] text-[#2E4A9E]"
                  >
                    <Bot className="w-4 h-4 text-[#2E4A9E]" />
                    <span>{previewLocale === 'vi' ? form.chatbotButtonText?.vi : form.chatbotButtonText?.en}</span>
                  </button>
                )}

                <div className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs bg-[#F26522] text-white text-center shadow-md">
                  <span>{previewLocale === 'vi' ? form.ctaText?.vi : form.ctaText?.en}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>

                <div className="text-center pt-1">
                  <span className="text-[11px] text-[#5C6069] underline cursor-pointer">
                    {previewLocale === 'vi' ? form.dismissText?.vi : form.dismissText?.en}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
