'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import { DEFAULT_ADMISSIONS_DATA } from '@/lib/admissions-data'
import type {
  AdmissionsContentInput,
  AdmissionsContent,
  TrustBadge,
  TuitionTrack,
  FinancialGuarantee,
} from '@/lib/cms-types'
import {
  Sparkles,
  Save,
  RotateCcw,
  Eye,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  Layers,
  Coins,
  MapPin,
  Building2,
  FileCheck2,
  UserCheck,
  HelpCircle,
  ArrowRight,
  ListOrdered,
  Percent,
} from 'lucide-react'

type TabKey = 'hero' | 'tuition' | 'policy' | 'steps' | 'campus'

export function AdmissionsForm() {
  const [form, setForm] = useState<AdmissionsContentInput>(DEFAULT_ADMISSIONS_DATA)
  const [docId, setDocId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('hero')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/cms/admissions-content')
        const data = await res.json()
        const items: AdmissionsContent[] = data.items || []
        if (items.length > 0) {
          const item = items[0]
          setDocId(item.id)
          setForm({
            hero: item.hero || DEFAULT_ADMISSIONS_DATA.hero,
            trustBadges: item.trustBadges?.length ? item.trustBadges : DEFAULT_ADMISSIONS_DATA.trustBadges,
            stepsSection: item.stepsSection || DEFAULT_ADMISSIONS_DATA.stepsSection,
            tuition: item.tuition || DEFAULT_ADMISSIONS_DATA.tuition,
            financialPolicy: item.financialPolicy || DEFAULT_ADMISSIONS_DATA.financialPolicy,
            campusSection: item.campusSection || DEFAULT_ADMISSIONS_DATA.campusSection,
            formSection: item.formSection || DEFAULT_ADMISSIONS_DATA.formSection,
          })
        }
      } catch (err) {
        console.error('Failed to load admissions page content:', err)
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
        const res = await fetch(`/api/cms/admissions-content/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể cập nhật cấu hình tuyển sinh')
      } else {
        const res = await fetch('/api/cms/admissions-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể tạo cấu hình tuyển sinh')
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
    if (confirm('Khôi phục toàn bộ nội dung Trang Tuyển Sinh về mặc định? Các chỉnh sửa chưa lưu sẽ bị hủy.')) {
      setForm(DEFAULT_ADMISSIONS_DATA)
    }
  }

  // ---------------- Helper Handlers for Nested Arrays ----------------
  // 1. Trust Badges
  const updateTrustBadge = (index: number, patch: Partial<TrustBadge>) => {
    const next = [...form.trustBadges]
    next[index] = { ...next[index], ...patch }
    setForm({ ...form, trustBadges: next })
  }

  const addTrustBadge = () => {
    const newBadge: TrustBadge = {
      icon: 'ShieldCheck',
      color: '#2E4A9E',
      title: { vi: 'Tiêu chuẩn quốc tế', en: 'Global Standard' },
      desc: { vi: 'Mô tả ngắn gọn', en: 'Brief description' },
    }
    setForm({ ...form, trustBadges: [...form.trustBadges, newBadge] })
  }

  const removeTrustBadge = (index: number) => {
    setForm({
      ...form,
      trustBadges: form.trustBadges.filter((_, i) => i !== index),
    })
  }

  // 2. Tuition Tracks
  const updateTuitionTrack = (index: number, patch: Partial<TuitionTrack>) => {
    const next = [...form.tuition.tracks]
    next[index] = { ...next[index], ...patch }
    setForm({ ...form, tuition: { ...form.tuition, tracks: next } })
  }

  const addHighlightToTrack = (trackIndex: number) => {
    const track = form.tuition.tracks[trackIndex]
    const nextVi = [...(track.highlights?.vi || []), 'Điểm nổi bật mới']
    const nextEn = [...(track.highlights?.en || []), 'New highlight feature']
    updateTuitionTrack(trackIndex, {
      highlights: { vi: nextVi, en: nextEn },
    })
  }

  const removeHighlightFromTrack = (trackIndex: number, hIdx: number) => {
    const track = form.tuition.tracks[trackIndex]
    const nextVi = (track.highlights?.vi || []).filter((_, i) => i !== hIdx)
    const nextEn = (track.highlights?.en || []).filter((_, i) => i !== hIdx)
    updateTuitionTrack(trackIndex, {
      highlights: { vi: nextVi, en: nextEn },
    })
  }

  const updateHighlightText = (
    trackIndex: number,
    hIdx: number,
    lang: 'vi' | 'en',
    value: string
  ) => {
    const track = form.tuition.tracks[trackIndex]
    const nextList = [...(track.highlights?.[lang] || [])]
    nextList[hIdx] = value
    updateTuitionTrack(trackIndex, {
      highlights: {
        ...track.highlights,
        [lang]: nextList,
      },
    })
  }

  // 3. Financial Guarantees
  const updateGuarantee = (index: number, patch: Partial<FinancialGuarantee>) => {
    const next = [...form.financialPolicy.guarantees]
    next[index] = { ...next[index], ...patch }
    setForm({
      ...form,
      financialPolicy: { ...form.financialPolicy, guarantees: next },
    })
  }

  const addGuarantee = () => {
    const newG: FinancialGuarantee = {
      title: { vi: 'Cam kết minh bạch', en: 'Transparent Guarantee' },
      desc: { vi: 'Nội dung chi tiết cam kết...', en: 'Guarantee details...' },
    }
    setForm({
      ...form,
      financialPolicy: {
        ...form.financialPolicy,
        guarantees: [...form.financialPolicy.guarantees, newG],
      },
    })
  }

  const removeGuarantee = (index: number) => {
    setForm({
      ...form,
      financialPolicy: {
        ...form.financialPolicy,
        guarantees: form.financialPolicy.guarantees.filter((_, i) => i !== index),
      },
    })
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-[#5C6069] flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-[#2E4A9E]" />
        <span>Đang tải cấu hình trang tuyển sinh...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Admissions Page Setup</span>
          </div>
          <h1 className="text-xl font-black text-[#1E3570]">Quản lý Nội Dung Trang Tuyển Sinh K-12</h1>
          <p className="text-xs text-[#5C6069]">
            Cập nhật Banner Hero, Huy hiệu uy tín, Gói học phí 4 lộ trình, Cam kết tài chính và thông tin Campus.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/vi/admissions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#F6F5F1] text-[#1E3570] hover:bg-[#EAEFFB] border border-[#DEDDD6] transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-[#2E4A9E]" />
            <span>Xem trang thực tế</span>
            <ExternalLink className="w-3 h-3 text-[#5C6069]" />
          </a>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="rounded-xl text-xs font-bold text-[#5C6069] border-[#DEDDD6] hover:bg-[#F6F5F1]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Mặc định</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl text-xs font-bold bg-[#2E4A9E] hover:bg-[#1E3570] text-white shadow-xs"
          >
            {isSaving ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : savedSuccess ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-[#8DC63F]" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>{isSaving ? 'Đang lưu...' : savedSuccess ? 'Đã lưu thành công!' : 'Lưu thay đổi'}</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DEDDD6] pb-2">
        {[
          { key: 'hero', label: '1. Hero & Điểm tin cậy', icon: ShieldCheck },
          { key: 'tuition', label: '2. Gói học phí (4 Tracks)', icon: Coins },
          { key: 'policy', label: '3. Chính sách & Cam kết', icon: Percent },
          { key: 'steps', label: '4. Quy trình tuyển sinh', icon: ListOrdered },
          { key: 'campus', label: '5. Campus & Form liên hệ', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#1E3570] text-white shadow-sm'
                  : 'bg-white text-[#5C6069] hover:text-[#1E3570] border border-[#DEDDD6]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#8DC63F]' : 'text-[#5C6069]'}`} />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          TAB 1: HERO & TRUST BADGES
      ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8DC63F]" />
                <span>Nội dung Hero Banner (Đầu trang)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-5">
              {/* Image Picker */}
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#20242B]">
                  Hình ảnh Hero Tuyển Sinh (Khuyến nghị 16:11 hoặc 4:3, chất lượng cao)
                </Label>
                <ImagePicker
                  value={form.hero.imageUrl}
                  onChange={(url) =>
                    setForm({
                      ...form,
                      hero: { ...form.hero, imageUrl: url },
                    })
                  }
                  folder="admissions"
                />
              </div>

              {/* Welcome Badge */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge chào đón (Tiếng Việt)</Label>
                  <Input
                    value={form.hero.badge.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          badge: { ...form.hero.badge, vi: e.target.value },
                        },
                      })
                    }
                    placeholder="Tư vấn & Tuyển sinh K-12 Chuẩn Hoa Kỳ"
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge chào đón (English)</Label>
                  <Input
                    value={form.hero.badge.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          badge: { ...form.hero.badge, en: e.target.value },
                        },
                      })
                    }
                    placeholder="US-Standard K-12 Admissions & Advising"
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              {/* Main Title */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (Tiếng Việt)</Label>
                  <Input
                    value={form.hero.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          title: { ...form.hero.title, vi: e.target.value },
                        },
                      })
                    }
                    placeholder="Khởi Đầu Hành Trình Học Thuật Quốc Tế Bền Vững"
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (English)</Label>
                  <Input
                    value={form.hero.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          title: { ...form.hero.title, en: e.target.value },
                        },
                      })
                    }
                    placeholder="Begin Your Global Academic Journey"
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả ngắn (Tiếng Việt)</Label>
                  <Textarea
                    rows={3}
                    value={form.hero.subtitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          subtitle: { ...form.hero.subtitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả ngắn (English)</Label>
                  <Textarea
                    rows={3}
                    value={form.hero.subtitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          subtitle: { ...form.hero.subtitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
              </div>

              {/* Floating Badge on Image */}
              <div className="p-4 rounded-xl bg-[#F6F5F1] border border-[#DEDDD6] space-y-3">
                <Label className="text-xs font-bold text-[#1E3570] block">
                  Huy hiệu nổi đè lên ảnh Hero (Floating Credential Badge)
                </Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Tiêu đề huy hiệu (VI)</Label>
                    <Input
                      value={form.hero.floatingBadgeTitle.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            floatingBadgeTitle: {
                              ...form.hero.floatingBadgeTitle,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Tiêu đề huy hiệu (EN)</Label>
                    <Input
                      value={form.hero.floatingBadgeTitle.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            floatingBadgeTitle: {
                              ...form.hero.floatingBadgeTitle,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Mô tả huy hiệu (VI)</Label>
                    <Input
                      value={form.hero.floatingBadgeSubtitle.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            floatingBadgeSubtitle: {
                              ...form.hero.floatingBadgeSubtitle,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Mô tả huy hiệu (EN)</Label>
                    <Input
                      value={form.hero.floatingBadgeSubtitle.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            floatingBadgeSubtitle: {
                              ...form.hero.floatingBadgeSubtitle,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Nút bấm chính (VI / EN)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={form.hero.primaryCtaText.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            primaryCtaText: {
                              ...form.hero.primaryCtaText,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="VI: Đăng ký tư vấn ngay"
                      className="rounded-xl border-[#DEDDD6] text-xs"
                    />
                    <Input
                      value={form.hero.primaryCtaText.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            primaryCtaText: {
                              ...form.hero.primaryCtaText,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="EN: Register Consultation"
                      className="rounded-xl border-[#DEDDD6] text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Nút bấm phụ (VI / EN)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={form.hero.secondaryCtaText.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            secondaryCtaText: {
                              ...form.hero.secondaryCtaText,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="VI: Xem gói học phí"
                      className="rounded-xl border-[#DEDDD6] text-xs"
                    />
                    <Input
                      value={form.hero.secondaryCtaText.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          hero: {
                            ...form.hero,
                            secondaryCtaText: {
                              ...form.hero.secondaryCtaText,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      placeholder="EN: View Tuition"
                      className="rounded-xl border-[#DEDDD6] text-xs"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4 Trust Badges */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2E4A9E]" />
                <span>4 Huy hiệu Uy tín & Điểm tin cậy (Above-the-fold Trust Bar)</span>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTrustBadge}
                className="rounded-xl text-xs font-bold border-[#DEDDD6] hover:bg-[#F6F5F1]"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[#2E4A9E]" />
                <span>Thêm huy hiệu</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                {form.trustBadges.map((badge, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6] space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E3570] flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full inline-block"
                          style={{ backgroundColor: badge.color }}
                        />
                        <span>Huy hiệu #{idx + 1}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => removeTrustBadge(idx)}
                        className="text-[#5C6069] hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa huy hiệu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-[11px] text-[#5C6069]">Mã icon Lucide</Label>
                        <Input
                          value={badge.icon}
                          onChange={(e) => updateTrustBadge(idx, { icon: e.target.value })}
                          className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                          placeholder="ShieldCheck"
                        />
                      </div>
                      <div>
                        <Label className="text-[11px] text-[#5C6069]">Màu đại diện (Hex)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={badge.color}
                            onChange={(e) => updateTrustBadge(idx, { color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-0 p-0"
                          />
                          <Input
                            value={badge.color}
                            onChange={(e) => updateTrustBadge(idx, { color: e.target.value })}
                            className="rounded-lg border-[#DEDDD6] bg-white text-xs flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={badge.title.vi}
                          onChange={(e) =>
                            updateTrustBadge(idx, {
                              title: { ...badge.title, vi: e.target.value },
                            })
                          }
                          placeholder="Tiêu đề (VI)"
                          className="rounded-lg border-[#DEDDD6] bg-white text-xs"
                        />
                        <Input
                          value={badge.title.en}
                          onChange={(e) =>
                            updateTrustBadge(idx, {
                              title: { ...badge.title, en: e.target.value },
                            })
                          }
                          placeholder="Tiêu đề (EN)"
                          className="rounded-lg border-[#DEDDD6] bg-white text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={badge.desc.vi}
                          onChange={(e) =>
                            updateTrustBadge(idx, {
                              desc: { ...badge.desc, vi: e.target.value },
                            })
                          }
                          placeholder="Mô tả phụ (VI)"
                          className="rounded-lg border-[#DEDDD6] bg-white text-xs"
                        />
                        <Input
                          value={badge.desc.en}
                          onChange={(e) =>
                            updateTrustBadge(idx, {
                              desc: { ...badge.desc, en: e.target.value },
                            })
                          }
                          placeholder="Mô tả phụ (EN)"
                          className="rounded-lg border-[#DEDDD6] bg-white text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 2: TUITION TRACKS (4 GÓI HỌC PHÍ)
      ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'tuition' && (
        <div className="space-y-6">
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#5C9024]" />
                <span>Tiêu đề & Giới thiệu Phần Học Phí (#tuition)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (VI)</Label>
                  <Input
                    value={form.tuition.badge.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          badge: { ...form.tuition.badge, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (EN)</Label>
                  <Input
                    value={form.tuition.badge.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          badge: { ...form.tuition.badge, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (VI)</Label>
                  <Input
                    value={form.tuition.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          title: { ...form.tuition.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (EN)</Label>
                  <Input
                    value={form.tuition.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          title: { ...form.tuition.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Mô tả phụ (VI)</Label>
                  <Textarea
                    rows={2}
                    value={form.tuition.subtitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          subtitle: { ...form.tuition.subtitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Mô tả phụ (EN)</Label>
                  <Textarea
                    rows={2}
                    value={form.tuition.subtitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        tuition: {
                          ...form.tuition,
                          subtitle: { ...form.tuition.subtitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4 Tracks Editor */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1E3570] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2E4A9E]" />
                <span>Danh sách 4 Gói Học Phí (Foundation, Standard, Dual Diploma, Fulltime)</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {form.tuition.tracks.map((track, tIdx) => (
                <div
                  key={track.id || tIdx}
                  className={`bg-white rounded-2xl p-5 border shadow-xs space-y-4 relative ${
                    track.popular ? 'border-[#F26522] ring-1 ring-[#F26522]/30' : 'border-[#DEDDD6]'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-[#DEDDD6]/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider"
                        style={{ backgroundColor: track.badgeBg, color: track.badgeColor }}
                      >
                        {track.badge.vi}
                      </span>
                      <span className="text-xs font-mono text-[#5C6069]">{track.id}</span>
                    </div>

                    <label className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F26522] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={track.popular}
                        onChange={(e) => updateTuitionTrack(tIdx, { popular: e.target.checked })}
                        className="rounded border-[#DEDDD6] text-[#F26522] focus:ring-[#F26522]"
                      />
                      <span>Gói nổi bật nhất</span>
                    </label>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Tên gói (VI)</Label>
                      <Input
                        value={track.title.vi}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            title: { ...track.title, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Tên gói (EN)</Label>
                      <Input
                        value={track.title.en}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            title: { ...track.title, en: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Badge Text */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Huy hiệu nhãn (VI)</Label>
                      <Input
                        value={track.badge.vi}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            badge: { ...track.badge, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Huy hiệu nhãn (EN)</Label>
                      <Input
                        value={track.badge.en}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            badge: { ...track.badge, en: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Target & Hours */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Đối tượng lớp học (VI)</Label>
                      <Input
                        value={track.target.vi}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            target: { ...track.target, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                        placeholder="Mầm non & Lớp 1 – 2"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Thời lượng / Tín chỉ (VI)</Label>
                      <Input
                        value={track.hours.vi}
                        onChange={(e) =>
                          updateTuitionTrack(tIdx, {
                            hours: { ...track.hours, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                        placeholder="3 – 5 giờ / tuần"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-[#5C6069]">Mô tả chương trình (VI)</Label>
                    <Textarea
                      rows={2}
                      value={track.desc.vi}
                      onChange={(e) =>
                        updateTuitionTrack(tIdx, {
                          desc: { ...track.desc, vi: e.target.value },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] text-xs resize-none"
                    />
                  </div>

                  {/* Colors */}
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#F6F5F1]">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Màu nền huy hiệu</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={track.badgeBg}
                          onChange={(e) => updateTuitionTrack(tIdx, { badgeBg: e.target.value })}
                          className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                        />
                        <Input
                          value={track.badgeBg}
                          onChange={(e) => updateTuitionTrack(tIdx, { badgeBg: e.target.value })}
                          className="rounded border-[#DEDDD6] bg-white text-xs h-7 flex-1 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Màu chữ huy hiệu</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          value={track.badgeColor}
                          onChange={(e) => updateTuitionTrack(tIdx, { badgeColor: e.target.value })}
                          className="w-7 h-7 rounded border-0 cursor-pointer p-0"
                        />
                        <Input
                          value={track.badgeColor}
                          onChange={(e) => updateTuitionTrack(tIdx, { badgeColor: e.target.value })}
                          className="rounded border-[#DEDDD6] bg-white text-xs h-7 flex-1 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Highlights List */}
                  <div className="space-y-2 pt-2 border-t border-[#DEDDD6]/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1E3570]">
                        Các gạch đầu dòng nổi bật (Highlights)
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addHighlightToTrack(tIdx)}
                        className="text-[11px] h-7 px-2 text-[#2E4A9E] hover:bg-[#EAEFFB]"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        <span>Thêm gạch đầu dòng</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(track.highlights?.vi || []).map((hVi, hIdx) => {
                        const hEn = track.highlights?.en?.[hIdx] || ''
                        return (
                          <div key={hIdx} className="flex items-center gap-2">
                            <Input
                              value={hVi}
                              onChange={(e) => updateHighlightText(tIdx, hIdx, 'vi', e.target.value)}
                              placeholder="Tiếng Việt"
                              className="rounded-lg border-[#DEDDD6] text-xs h-8 flex-1"
                            />
                            <Input
                              value={hEn}
                              onChange={(e) => updateHighlightText(tIdx, hIdx, 'en', e.target.value)}
                              placeholder="English"
                              className="rounded-lg border-[#DEDDD6] text-xs h-8 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeHighlightFromTrack(tIdx, hIdx)}
                              className="text-[#5C6069] hover:text-red-600 p-1 cursor-pointer"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: POLICY & COMMITMENTS (CHÍNH SÁCH & CAM KẾT)
      ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'policy' && (
        <div className="space-y-6">
          {/* Left Column: Blended Model Advantage */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Percent className="w-4 h-4 text-[#8DC63F]" />
                <span>Khối giới thiệu Mô hình Blended Learning Tối ưu (Cột trái)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#20242B]">
                  Hình ảnh tư vấn học vụ (Consultation photo)
                </Label>
                <ImagePicker
                  value={form.financialPolicy.leftBoxImage}
                  onChange={(url) =>
                    setForm({
                      ...form,
                      financialPolicy: { ...form.financialPolicy, leftBoxImage: url },
                    })
                  }
                  folder="admissions"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Nhãn góc trên ảnh (VI)</Label>
                  <Input
                    value={form.financialPolicy.leftBoxBadge.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxBadge: { ...form.financialPolicy.leftBoxBadge, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Nhãn góc trên ảnh (EN)</Label>
                  <Input
                    value={form.financialPolicy.leftBoxBadge.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxBadge: { ...form.financialPolicy.leftBoxBadge, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề hộp giải thích (VI)</Label>
                  <Input
                    value={form.financialPolicy.leftBoxTitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxTitle: { ...form.financialPolicy.leftBoxTitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề hộp giải thích (EN)</Label>
                  <Input
                    value={form.financialPolicy.leftBoxTitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxTitle: { ...form.financialPolicy.leftBoxTitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn phân tích mô hình (VI)</Label>
                  <Textarea
                    rows={4}
                    value={form.financialPolicy.leftBoxDesc.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxDesc: { ...form.financialPolicy.leftBoxDesc, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs leading-relaxed"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn phân tích mô hình (EN)</Label>
                  <Textarea
                    rows={4}
                    value={form.financialPolicy.leftBoxDesc.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          leftBoxDesc: { ...form.financialPolicy.leftBoxDesc, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs leading-relaxed"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Chữ trên nút yêu cầu báo giá (VI)</Label>
                  <Input
                    value={form.financialPolicy.buttonText.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          buttonText: { ...form.financialPolicy.buttonText, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Chữ trên nút yêu cầu báo giá (EN)</Label>
                  <Input
                    value={form.financialPolicy.buttonText.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          buttonText: { ...form.financialPolicy.buttonText, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: 5 Financial Commitments */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60 flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#5C9024]" />
                <span>5 Cam Kết Quyền Lợi Tài Chính Minh Bạch (Cột phải)</span>
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addGuarantee}
                className="rounded-xl text-xs font-bold border-[#DEDDD6] hover:bg-[#F6F5F1]"
              >
                <Plus className="w-3.5 h-3.5 mr-1 text-[#2E4A9E]" />
                <span>Thêm cam kết</span>
              </Button>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4 pb-2">
                <div>
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề khối cam kết (VI)</Label>
                  <Input
                    value={form.financialPolicy.rightBoxTitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          rightBoxTitle: { ...form.financialPolicy.rightBoxTitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề khối cam kết (EN)</Label>
                  <Input
                    value={form.financialPolicy.rightBoxTitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        financialPolicy: {
                          ...form.financialPolicy,
                          rightBoxTitle: { ...form.financialPolicy.rightBoxTitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {form.financialPolicy.guarantees.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#F6F5F1] border border-[#DEDDD6] space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E3570]">
                        Cam kết #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeGuarantee(idx)}
                        className="text-[#5C6069] hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa cam kết"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <Input
                        value={item.title.vi}
                        onChange={(e) =>
                          updateGuarantee(idx, {
                            title: { ...item.title, vi: e.target.value },
                          })
                        }
                        placeholder="Tiêu đề cam kết (VI)"
                        className="rounded-lg border-[#DEDDD6] bg-white text-xs font-bold"
                      />
                      <Input
                        value={item.title.en}
                        onChange={(e) =>
                          updateGuarantee(idx, {
                            title: { ...item.title, en: e.target.value },
                          })
                        }
                        placeholder="Tiêu đề cam kết (EN)"
                        className="rounded-lg border-[#DEDDD6] bg-white text-xs font-bold"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-2">
                      <Textarea
                        rows={2}
                        value={item.desc.vi}
                        onChange={(e) =>
                          updateGuarantee(idx, {
                            desc: { ...item.desc, vi: e.target.value },
                          })
                        }
                        placeholder="Nội dung giải thích chi tiết cam kết (VI)"
                        className="rounded-lg border-[#DEDDD6] bg-white text-xs resize-none"
                      />
                      <Textarea
                        rows={2}
                        value={item.desc.en}
                        onChange={(e) =>
                          updateGuarantee(idx, {
                            desc: { ...item.desc, en: e.target.value },
                          })
                        }
                        placeholder="Nội dung giải thích chi tiết cam kết (EN)"
                        className="rounded-lg border-[#DEDDD6] bg-white text-xs resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 4: ADMISSIONS STEPS SECTION
      ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'steps' && (
        <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
          <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
            <CardTitle className="text-base font-bold text-[#1E3570] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#2E4A9E]" />
                <span>Quy trình 5 Bước Nhập học Trên Trang Tuyển Sinh</span>
              </div>
              <a
                href="/admin/admission-steps"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#EAEFFB] text-[#2E4A9E] hover:bg-[#2E4A9E] hover:text-white transition-colors"
              >
                <span>Quản lý 5 bước chi tiết</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            <div className="p-4 rounded-xl bg-[#EAEFFB]/50 border border-[#2E4A9E]/20 text-xs text-[#1E3570] flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-[#2E4A9E] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Đồng bộ tự động cùng danh sách bước tuyển sinh:</p>
                <p className="text-[#5C6069] leading-relaxed">
                  Các bước nhập học chi tiết (như Bước 1: Tiếp nhận & Tư vấn, Bước 2: Đánh giá năng lực,...) được lấy trực tiếp từ mục <strong>&ldquo;Các bước tuyển sinh&rdquo;</strong> trong cơ sở dữ liệu CMS. Bạn có thể bật/tắt hiển thị phần này và tùy chỉnh tiêu đề bên dưới.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="showStepsToggle"
                checked={form.stepsSection.showSteps}
                onChange={(e) =>
                  setForm({
                    ...form,
                    stepsSection: {
                      ...form.stepsSection,
                      showSteps: e.target.checked,
                    },
                  })
                }
                className="rounded border-[#DEDDD6] text-[#2E4A9E] focus:ring-[#2E4A9E]"
              />
              <Label htmlFor="showStepsToggle" className="text-xs font-bold text-[#20242B] cursor-pointer">
                Hiển thị khối Quy trình 5 bước tuyển sinh trên trang /admissions
              </Label>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (VI)</Label>
                <Input
                  value={form.stepsSection.badge.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        badge: { ...form.stepsSection.badge, vi: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (EN)</Label>
                <Input
                  value={form.stepsSection.badge.en}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        badge: { ...form.stepsSection.badge, en: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (VI)</Label>
                <Input
                  value={form.stepsSection.title.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        title: { ...form.stepsSection.title, vi: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (EN)</Label>
                <Input
                  value={form.stepsSection.title.en}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        title: { ...form.stepsSection.title, en: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Mô tả quy trình (VI)</Label>
                <Textarea
                  rows={2}
                  value={form.stepsSection.subtitle.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        subtitle: { ...form.stepsSection.subtitle, vi: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Mô tả quy trình (EN)</Label>
                <Textarea
                  rows={2}
                  value={form.stepsSection.subtitle.en}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stepsSection: {
                        ...form.stepsSection,
                        subtitle: { ...form.stepsSection.subtitle, en: e.target.value },
                      },
                    })
                  }
                  className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 5: CAMPUS & CONTACT FORM
      ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'campus' && (
        <div className="space-y-6">
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2E4A9E]" />
                <span>Thông tin Campus & Điểm Liên Hệ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-[#20242B]">
                  Hình ảnh Campus EPath
                </Label>
                <ImagePicker
                  value={form.campusSection.campusImage}
                  onChange={(url) =>
                    setForm({
                      ...form,
                      campusSection: { ...form.campusSection, campusImage: url },
                    })
                  }
                  folder="admissions"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Địa chỉ Campus (VI)</Label>
                  <Input
                    value={form.campusSection.addressValue.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campusSection: {
                          ...form.campusSection,
                          addressValue: {
                            ...form.campusSection.addressValue,
                            vi: e.target.value,
                          },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Địa chỉ Campus (EN)</Label>
                  <Input
                    value={form.campusSection.addressValue.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campusSection: {
                          ...form.campusSection,
                          addressValue: {
                            ...form.campusSection.addressValue,
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Hotline tuyển sinh</Label>
                  <Input
                    value={form.campusSection.hotline}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campusSection: {
                          ...form.campusSection,
                          hotline: e.target.value,
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Email liên hệ</Label>
                  <Input
                    value={form.campusSection.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campusSection: {
                          ...form.campusSection,
                          email: e.target.value,
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Giờ làm việc</Label>
                  <Input
                    value={form.campusSection.workingHours.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        campusSection: {
                          ...form.campusSection,
                          workingHours: {
                            ...form.campusSection.workingHours,
                            vi: e.target.value,
                          },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              {/* Campus Tour Box */}
              <div className="p-4 rounded-xl bg-[#EAEFFB]/50 border border-[#2E4A9E]/20 space-y-3">
                <Label className="text-xs font-bold text-[#1E3570] block">
                  Khối Lời mời Thăm quan Campus (Tour Card)
                </Label>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Tiêu đề lời mời (VI)</Label>
                    <Input
                      value={form.campusSection.tourTitle.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          campusSection: {
                            ...form.campusSection,
                            tourTitle: {
                              ...form.campusSection.tourTitle,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Tiêu đề lời mời (EN)</Label>
                    <Input
                      value={form.campusSection.tourTitle.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          campusSection: {
                            ...form.campusSection,
                            tourTitle: {
                              ...form.campusSection.tourTitle,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Nội dung lời mời (VI)</Label>
                    <Input
                      value={form.campusSection.tourDesc.vi}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          campusSection: {
                            ...form.campusSection,
                            tourDesc: {
                              ...form.campusSection.tourDesc,
                              vi: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Nội dung lời mời (EN)</Label>
                    <Input
                      value={form.campusSection.tourDesc.en}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          campusSection: {
                            ...form.campusSection,
                            tourDesc: {
                              ...form.campusSection.tourDesc,
                              en: e.target.value,
                            },
                          },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Header & Confidentiality */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#8DC63F]" />
                <span>Tiêu đề & Cam kết Bảo mật Form Đăng Ký Tư Vấn</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề Form (VI)</Label>
                  <Input
                    value={form.formSection.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          title: { ...form.formSection.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề Form (EN)</Label>
                  <Input
                    value={form.formSection.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          title: { ...form.formSection.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Mô tả Form (VI)</Label>
                  <Textarea
                    rows={3}
                    value={form.formSection.description.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          description: { ...form.formSection.description, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Mô tả Form (EN)</Label>
                  <Textarea
                    rows={3}
                    value={form.formSection.description.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          description: { ...form.formSection.description, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Cam kết bảo mật dưới nút bấm (VI)</Label>
                  <Input
                    value={form.formSection.confidentialityNote.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          confidentialityNote: {
                            ...form.formSection.confidentialityNote,
                            vi: e.target.value,
                          },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Cam kết bảo mật dưới nút bấm (EN)</Label>
                  <Input
                    value={form.formSection.confidentialityNote.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        formSection: {
                          ...form.formSection,
                          confidentialityNote: {
                            ...form.formSection.confidentialityNote,
                            en: e.target.value,
                          },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#DEDDD6] shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#5C6069] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8DC63F]" />
          <span>Mọi thay đổi sẽ hiển thị ngay lập tức trên trang Tuyển sinh</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="rounded-xl text-xs font-bold text-[#5C6069] border-[#DEDDD6] hover:bg-[#F6F5F1]"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            <span>Khôi phục mặc định</span>
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-xl text-xs font-bold bg-[#2E4A9E] hover:bg-[#1E3570] text-white shadow-xs"
          >
            {isSaving ? (
              <Sparkles className="w-3.5 h-3.5 animate-spin mr-1.5" />
            ) : savedSuccess ? (
              <Check className="w-3.5 h-3.5 mr-1.5 text-[#8DC63F]" />
            ) : (
              <Save className="w-3.5 h-3.5 mr-1.5" />
            )}
            <span>{isSaving ? 'Đang lưu...' : savedSuccess ? 'Đã lưu thành công!' : 'Lưu thay đổi'}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
