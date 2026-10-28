'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import { DEFAULT_ACHIEVEMENTS_CONTENT } from '@/lib/achievements-data'
import type {
  AchievementsContentInput,
  AchievementsContent,
  AchievementMetric,
} from '@/lib/cms-types'
import {
  Trophy,
  Save,
  RotateCcw,
  Eye,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  BarChart3,
  Award,
} from 'lucide-react'

export function AchievementsOverviewForm() {
  const [form, setForm] = useState<AchievementsContentInput>(DEFAULT_ACHIEVEMENTS_CONTENT)
  const [docId, setDocId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/cms/achievements-content')
        const data = await res.json()
        const items: AchievementsContent[] = data.items || []
        if (items.length > 0) {
          const item = items[0]
          setDocId(item.id)
          setForm({
            badge: item.badge || DEFAULT_ACHIEVEMENTS_CONTENT.badge,
            title: item.title || DEFAULT_ACHIEVEMENTS_CONTENT.title,
            subtitle: item.subtitle || DEFAULT_ACHIEVEMENTS_CONTENT.subtitle,
            desc: item.desc || DEFAULT_ACHIEVEMENTS_CONTENT.desc,
            metrics: item.metrics?.length ? item.metrics : DEFAULT_ACHIEVEMENTS_CONTENT.metrics,
            olympiad: item.olympiad || DEFAULT_ACHIEVEMENTS_CONTENT.olympiad,
          })
        }
      } catch (err) {
        console.error('Failed to load achievements content:', err)
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
        const res = await fetch(`/api/cms/achievements-content/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể cập nhật cấu hình Thành tích & Kết quả Đào tạo')
      } else {
        const res = await fetch('/api/cms/achievements-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể tạo mới cấu hình Thành tích & Kết quả Đào tạo')
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
    if (confirm('Khôi phục toàn bộ nội dung Thành tích Vượt trội & Kết quả Đào tạo về mặc định?')) {
      setForm(DEFAULT_ACHIEVEMENTS_CONTENT)
    }
  }

  const updateMetric = (index: number, patch: Partial<AchievementMetric>) => {
    const next = [...form.metrics]
    next[index] = { ...next[index], ...patch }
    setForm({ ...form, metrics: next })
  }

  const addMetric = () => {
    const newM: AchievementMetric = {
      number: '100%',
      label: { vi: 'Chỉ số mới', en: 'New Metric' },
      desc: { vi: 'Mô tả chi tiết kết quả học thuật...', en: 'Detailed outcome description...' },
    }
    setForm({ ...form, metrics: [...form.metrics, newM] })
  }

  const removeMetric = (index: number) => {
    setForm({ ...form, metrics: form.metrics.filter((_, i) => i !== index) })
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-[#5C6069] flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-[#2E4A9E]" />
        <span>Đang tải nội dung Thành tích & Kết quả Đào tạo...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-1">
            <Trophy className="w-3.5 h-3.5" />
            <span>Thành tích Vượt trội & Kết quả Đào tạo</span>
          </div>
          <h1 className="text-xl font-black text-[#1E3570]">
            Cấu hình Tiêu đề, 4 Chỉ số Học thuật & Banner Olympic
          </h1>
          <p className="text-xs text-[#5C6069]">
            Cập nhật nội dung hiển thị trong khối kết quả đào tạo xuất sắc trên website (Trang Giới thiệu & Chương trình đào tạo).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/vi/about#achievements"
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

      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & INTRODUCTION
      ─────────────────────────────────────────────────────────────── */}
      <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
        <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
          <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F26522]" />
            <span>Tiêu đề & Giới thiệu Phần Thành Tích</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Huy hiệu nhãn đề mục (VI)</Label>
              <Input
                value={form.badge?.vi || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    badge: { vi: e.target.value, en: form.badge?.en || '' },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Dấu ấn xuất sắc"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Huy hiệu nhãn đề mục (EN)</Label>
              <Input
                value={form.badge?.en || ''}
                onChange={(e) =>
                  setForm({
                    ...form,
                    badge: { vi: form.badge?.vi || '', en: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Verified Excellence"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (VI)</Label>
              <Input
                value={form.title.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: { ...form.title, vi: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Thành tích Vượt trội & Kết quả Đào tạo"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (EN)</Label>
              <Input
                value={form.title.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: { ...form.title, en: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Outstanding Achievements & Outcomes"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Phụ đề (VI)</Label>
              <Input
                value={form.subtitle.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle: { ...form.subtitle, vi: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Phụ đề (EN)</Label>
              <Input
                value={form.subtitle.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subtitle: { ...form.subtitle, en: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả chi tiết (VI)</Label>
              <Textarea
                rows={3}
                value={form.desc.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    desc: { ...form.desc, vi: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả chi tiết (EN)</Label>
              <Textarea
                rows={3}
                value={form.desc.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    desc: { ...form.desc, en: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs resize-none"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          2. 4 MAJOR ACADEMIC METRICS
      ─────────────────────────────────────────────────────────────── */}
      <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
        <CardHeader className="pb-3 border-b border-[#DEDDD6]/60 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#2E4A9E]" />
            <span>4 Chỉ Số Học Thuật Nổi Bật (Major Academic Metrics)</span>
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMetric}
            className="rounded-xl text-xs font-bold border-[#DEDDD6] hover:bg-[#F6F5F1]"
          >
            <Plus className="w-3.5 h-3.5 mr-1 text-[#2E4A9E]" />
            <span>Thêm chỉ số</span>
          </Button>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {form.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E3570]">Chỉ số #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeMetric(idx)}
                    className="text-[#5C6069] hover:text-red-600 transition-colors cursor-pointer"
                    title="Xóa chỉ số"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div>
                  <Label className="text-[11px] text-[#5C6069]">Số liệu nổi bật (e.g. 92%, 100%, 21.5, 400+)</Label>
                  <Input
                    value={metric.number}
                    onChange={(e) => updateMetric(idx, { number: e.target.value })}
                    className="rounded-lg border-[#DEDDD6] bg-white text-base font-black text-[#2E4A9E] mt-1"
                    placeholder="92%"
                  />
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Nhãn chỉ số (VI)</Label>
                    <Input
                      value={metric.label.vi}
                      onChange={(e) =>
                        updateMetric(idx, {
                          label: { ...metric.label, vi: e.target.value },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                      placeholder="Đỗ Đại học Mỹ Uy Tín"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Nhãn chỉ số (EN)</Label>
                    <Input
                      value={metric.label.en}
                      onChange={(e) =>
                        updateMetric(idx, {
                          label: { ...metric.label, en: e.target.value },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs mt-1"
                      placeholder="US University Acceptance"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Mô tả giải thích (VI)</Label>
                    <Textarea
                      rows={2}
                      value={metric.desc.vi}
                      onChange={(e) =>
                        updateMetric(idx, {
                          desc: { ...metric.desc, vi: e.target.value },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-[11px] text-[#5C6069]">Mô tả giải thích (EN)</Label>
                    <Textarea
                      rows={2}
                      value={metric.desc.en}
                      onChange={(e) =>
                        updateMetric(idx, {
                          desc: { ...metric.desc, en: e.target.value },
                        })
                      }
                      className="rounded-lg border-[#DEDDD6] bg-white text-xs resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ─────────────────────────────────────────────────────────────
          3. OLYMPIAD & STEAM MAKER HIGHLIGHT BANNER
      ─────────────────────────────────────────────────────────────── */}
      <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
        <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
          <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
            <Award className="w-4 h-4 text-[#8DC63F]" />
            <span>Banner Đấu Trường Học Thuật & Trải Nghiệm Công Nghệ (Olympiad Showcase)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-[#20242B]">
              Hình ảnh minh họa banner (Khuyến nghị 16:9 hoặc ảnh học sinh thi cử/robotics)
            </Label>
            <ImagePicker
              value={form.olympiad.imageUrl}
              onChange={(url) =>
                setForm({
                  ...form,
                  olympiad: { ...form.olympiad, imageUrl: url },
                })
              }
              folder="achievements"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Huy hiệu nổi trên ảnh</Label>
              <Input
                value={form.olympiad.badge}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: { ...form.olympiad, badge: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs font-bold"
                placeholder="SASMO • AMC • TIMO • Vanda"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Đường dẫn nút bấm (Link)</Label>
              <Input
                value={form.olympiad.ctaLink}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: { ...form.olympiad, ctaLink: e.target.value },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="/programs"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Nhãn tiêu điểm (VI)</Label>
              <Input
                value={form.olympiad.tag.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      tag: { ...form.olympiad.tag, vi: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Dấu Ấn Xuất Sắc"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Nhãn tiêu điểm (EN)</Label>
              <Input
                value={form.olympiad.tag.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      tag: { ...form.olympiad.tag, en: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Outstanding Milestone"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Tiêu đề banner (VI)</Label>
              <Input
                value={form.olympiad.title.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      title: { ...form.olympiad.title, vi: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs font-bold"
                placeholder="Đấu trường Học thuật & Trải nghiệm Công nghệ"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Tiêu đề banner (EN)</Label>
              <Input
                value={form.olympiad.title.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      title: { ...form.olympiad.title, en: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs font-bold"
                placeholder="Academic Olympiads & Applied Innovation"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Nội dung mô tả banner (VI)</Label>
              <Textarea
                rows={3}
                value={form.olympiad.desc.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      desc: { ...form.olympiad.desc, vi: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs resize-none leading-relaxed"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Nội dung mô tả banner (EN)</Label>
              <Textarea
                rows={3}
                value={form.olympiad.desc.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      desc: { ...form.olympiad.desc, en: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Chữ trên nút hành động (VI)</Label>
              <Input
                value={form.olympiad.ctaText.vi}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      ctaText: { ...form.olympiad.ctaText, vi: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Xem Lộ Trình Học Thuật"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-[#20242B]">Chữ trên nút hành động (EN)</Label>
              <Input
                value={form.olympiad.ctaText.en}
                onChange={(e) =>
                  setForm({
                    ...form,
                    olympiad: {
                      ...form.olympiad,
                      ctaText: { ...form.olympiad.ctaText, en: e.target.value },
                    },
                  })
                }
                className="rounded-xl border-[#DEDDD6] text-xs"
                placeholder="Explore Academic Pathways"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#DEDDD6] shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#5C6069] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8DC63F]" />
          <span>Mọi cập nhật sẽ tự động đồng bộ lên trang Giới thiệu & Chương trình đào tạo</span>
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
