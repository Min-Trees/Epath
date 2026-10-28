'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImagePicker } from './image-picker'
import { DEFAULT_PROGRAMS_CONTENT } from '@/lib/programs-content-data'
import type {
  ProgramsContentInput,
  ProgramsContent,
  RoadmapStage,
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
  Milestone,
  GraduationCap,
  Users,
  Compass,
  Award,
  Layers,
} from 'lucide-react'

type SubTabKey = 'roadmap' | 'edoptions' | 'personalized'

export function ProgramsPageForm() {
  const [form, setForm] = useState<ProgramsContentInput>(DEFAULT_PROGRAMS_CONTENT)
  const [docId, setDocId] = useState<string | null>(null)
  const [subTab, setSubTab] = useState<SubTabKey>('roadmap')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function init() {
      setIsLoading(true)
      try {
        const res = await fetch('/api/cms/programs-content')
        const data = await res.json()
        const items: ProgramsContent[] = data.items || []
        if (items.length > 0) {
          const item = items[0]
          setDocId(item.id)
          const isRoadmapActive = item.showRoadmap !== false && item.roadmap?.isActive !== false
          setForm({
            hero: item.hero || DEFAULT_PROGRAMS_CONTENT.hero,
            showRoadmap: isRoadmapActive,
            roadmap: {
              ...(item.roadmap || DEFAULT_PROGRAMS_CONTENT.roadmap),
              isActive: isRoadmapActive,
            },
            edoptions: item.edoptions || DEFAULT_PROGRAMS_CONTENT.edoptions,
            personalized: item.personalized || DEFAULT_PROGRAMS_CONTENT.personalized,
            cta: item.cta || DEFAULT_PROGRAMS_CONTENT.cta,
            showAchievements: item.showAchievements !== false,
          })
        }
      } catch (err) {
        console.error('Failed to load programs page content:', err)
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
        const res = await fetch(`/api/cms/programs-content/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể cập nhật cấu hình Trang Chương trình')
      } else {
        const res = await fetch('/api/cms/programs-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })
        if (!res.ok) throw new Error('Không thể tạo mới cấu hình Trang Chương trình')
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
    if (confirm('Khôi phục toàn bộ nội dung Trang Chương trình đào tạo về mặc định?')) {
      setForm(DEFAULT_PROGRAMS_CONTENT)
    }
  }

  // Helpers for Roadmap Stages
  const updateStage = (index: number, patch: Partial<RoadmapStage>) => {
    const next = [...form.roadmap.stages]
    next[index] = { ...next[index], ...patch }
    setForm({ ...form, roadmap: { ...form.roadmap, stages: next } })
  }

  const addOutcomeToStage = (stageIndex: number) => {
    const stage = form.roadmap.stages[stageIndex]
    const nextVi = [...(stage.outcomes.vi || []), 'Chuẩn đầu ra mới']
    const nextEn = [...(stage.outcomes.en || []), 'New learning outcome']
    updateStage(stageIndex, {
      outcomes: { vi: nextVi, en: nextEn },
    })
  }

  const removeOutcomeFromStage = (stageIndex: number, oIdx: number) => {
    const stage = form.roadmap.stages[stageIndex]
    const nextVi = (stage.outcomes.vi || []).filter((_, i) => i !== oIdx)
    const nextEn = (stage.outcomes.en || []).filter((_, i) => i !== oIdx)
    updateStage(stageIndex, {
      outcomes: { vi: nextVi, en: nextEn },
    })
  }

  const updateOutcomeText = (
    stageIndex: number,
    oIdx: number,
    lang: 'vi' | 'en',
    value: string
  ) => {
    const stage = form.roadmap.stages[stageIndex]
    const nextList = [...(stage.outcomes[lang] || [])]
    nextList[oIdx] = value
    updateStage(stageIndex, {
      outcomes: {
        ...stage.outcomes,
        [lang]: nextList,
      },
    })
  }

  if (isLoading) {
    return (
      <div className="py-16 text-center text-sm text-[#5C6069] flex items-center justify-center gap-2">
        <Sparkles className="w-5 h-5 animate-spin text-[#2E4A9E]" />
        <span>Đang tải nội dung Trang Chương trình...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Banner & Control Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAEFFB] text-[#2E4A9E] text-xs font-bold uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Programs Page Setup</span>
          </div>
          <h1 className="text-xl font-black text-[#1E3570]">
            Cấu hình Lộ trình K-12, Tú tài Mỹ EdOptions & Cố vấn 1:1
          </h1>
          <p className="text-xs text-[#5C6069]">
            Cập nhật hình ảnh và nội dung các khối giới thiệu trên trang Chương trình đào tạo (https://www.epath.edu.vn/vi/programs).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/vi/programs"
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

      {/* Sub Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#DEDDD6] pb-2">
        {[
          { key: 'roadmap', label: '1. Lộ trình K-12 liên thông (4 Giai đoạn)', icon: Milestone },
          { key: 'edoptions', label: '2. Tú tài Mỹ EdOptions (Dual & Fulltime)', icon: GraduationCap },
          { key: 'personalized', label: '3. Cố vấn 1:1, Thành tích & CTA', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = subTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSubTab(tab.key as SubTabKey)}
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
          TAB 1: ROADMAP (4 GIAI ĐOẠN)
      ─────────────────────────────────────────────────────────────── */}
      {subTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Hero Banner Editor Card */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#8DC63F]" />
                <span>Tiêu Đề & Lời Chào Đầu Trang (Hero Banner)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Huy hiệu chào mừng (VI)</Label>
                  <Input
                    value={form.hero?.welcomeBadge?.vi || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          welcomeBadge: { vi: e.target.value, en: form.hero?.welcomeBadge?.en || '' },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                    placeholder="LỘ TRÌNH ĐÀO TẠO CHUẨN QUỐC TẾ"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Huy hiệu chào mừng (EN)</Label>
                  <Input
                    value={form.hero?.welcomeBadge?.en || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          welcomeBadge: { vi: form.hero?.welcomeBadge?.vi || '', en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                    placeholder="ACCREDITED US & CAMBRIDGE CURRICULUM"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề trang lớn (VI)</Label>
                  <Input
                    value={form.hero?.title?.vi || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          title: { vi: e.target.value, en: form.hero?.title?.en || '' },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs font-bold"
                    placeholder="Hệ Thống Chương Trình Đào Tạo EPath Education"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề trang lớn (EN)</Label>
                  <Input
                    value={form.hero?.title?.en || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          title: { vi: form.hero?.title?.vi || '', en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs font-bold"
                    placeholder="EPath Education Academic Curriculum & Programs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả phụ (VI)</Label>
                  <Textarea
                    rows={2}
                    value={form.hero?.subtitle?.vi || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          subtitle: { vi: e.target.value, en: form.hero?.subtitle?.en || '' },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                    placeholder="Hành trình đào tạo liền mạch từ Mầm non đến THPT..."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả phụ (EN)</Label>
                  <Textarea
                    rows={2}
                    value={form.hero?.subtitle?.en || ''}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        hero: {
                          ...form.hero,
                          subtitle: { vi: form.hero?.subtitle?.vi || '', en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                    placeholder="A continuous academic journey from Kindergarten to Grade 12..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Roadmap Visibility Toggle Card */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#8DC63F]" />
                  <span>Trạng thái Hiển thị Khối &ldquo;Hành Trình Học Thuật Xuyên Suốt Từ Mầm Non Đến Tú Tài Hoa Kỳ&rdquo;</span>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    form.showRoadmap !== false && form.roadmap.isActive !== false
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {form.showRoadmap !== false && form.roadmap.isActive !== false ? 'Đang Hiển Thị' : 'Đang Tắt (Ẩn)'}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showRoadmap !== false && form.roadmap.isActive !== false}
                  onChange={(e) => {
                    const checked = e.target.checked
                    setForm({
                      ...form,
                      showRoadmap: checked,
                      roadmap: {
                        ...form.roadmap,
                        isActive: checked,
                      },
                    })
                  }}
                  className="rounded border-[#DEDDD6] text-[#2E4A9E] focus:ring-[#2E4A9E] w-4 h-4"
                />
                <span className="text-xs font-bold text-[#20242B]">
                  Bật hiển thị khối Lộ trình đào tạo K-12 liên thông trên trang https://www.epath.edu.vn/vi/programs
                </span>
              </label>
              <p className="text-[11px] text-[#5C6069] mt-2 ml-7 leading-relaxed">
                Khi tắt tùy chọn này, toàn bộ khối &ldquo;Hành Trình Học Thuật Xuyên Suốt Từ Mầm Non Đến Tú Tài Hoa Kỳ&rdquo; (gồm tiêu đề và 4 giai đoạn Mầm non, Tiểu học, THCS, THPT) sẽ được ẩn khỏi trang Chương trình đào tạo phía người dùng.
              </p>
            </CardContent>
          </Card>
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Milestone className="w-4 h-4 text-[#8DC63F]" />
                <span>Tiêu Đề Khối Lộ Trình K-12 Liên Thông</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Huy hiệu đề mục (VI)</Label>
                  <Input
                    value={form.roadmap.badge.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          badge: { ...form.roadmap.badge, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                    placeholder="LỘ TRÌNH ĐÀO TẠO K-12 LIÊN THÔNG"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Huy hiệu đề mục (EN)</Label>
                  <Input
                    value={form.roadmap.badge.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          badge: { ...form.roadmap.badge, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                    placeholder="CONTINUOUS K-12 PATHWAY"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (VI)</Label>
                  <Input
                    value={form.roadmap.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          title: { ...form.roadmap.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (EN)</Label>
                  <Input
                    value={form.roadmap.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          title: { ...form.roadmap.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả ngắn (VI)</Label>
                  <Textarea
                    rows={2}
                    value={form.roadmap.subtitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          subtitle: { ...form.roadmap.subtitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn mô tả ngắn (EN)</Label>
                  <Textarea
                    rows={2}
                    value={form.roadmap.subtitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        roadmap: {
                          ...form.roadmap,
                          subtitle: { ...form.roadmap.subtitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 4 Stages Detailed Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#1E3570] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#2E4A9E]" />
              <span>4 Giai Đoạn Đào Tạo (Mầm non, Tiểu học, THCS, THPT)</span>
            </h3>

            <div className="grid md:grid-cols-2 gap-5">
              {form.roadmap.stages.map((stage, idx) => (
                <div
                  key={stage.step || idx}
                  className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-[#DEDDD6]/60 pb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black text-white bg-[#1E3570]">
                      Bước {stage.step}: {stage.level.toUpperCase()}
                    </span>
                    <span className="text-xs font-mono text-[#5C6069]">{stage.color}</span>
                  </div>

                  {/* Image Picker */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-[#20242B]">
                      Hình ảnh giai đoạn {stage.step}
                    </Label>
                    <ImagePicker
                      value={stage.image}
                      onChange={(url) => updateStage(idx, { image: url })}
                      folder="programs"
                    />
                  </div>

                  {/* Titles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Tiêu đề giai đoạn (VI)</Label>
                      <Input
                        value={stage.title.vi}
                        onChange={(e) =>
                          updateStage(idx, {
                            title: { ...stage.title, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1 font-bold"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Tiêu đề giai đoạn (EN)</Label>
                      <Input
                        value={stage.title.en}
                        onChange={(e) =>
                          updateStage(idx, {
                            title: { ...stage.title, en: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1 font-bold"
                      />
                    </div>
                  </div>

                  {/* Subtitles */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Phụ đề định hướng (VI)</Label>
                      <Input
                        value={stage.subtitle.vi}
                        onChange={(e) =>
                          updateStage(idx, {
                            subtitle: { ...stage.subtitle, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Phụ đề định hướng (EN)</Label>
                      <Input
                        value={stage.subtitle.en}
                        onChange={(e) =>
                          updateStage(idx, {
                            subtitle: { ...stage.subtitle, en: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Model Tag */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Nhãn mô hình (VI)</Label>
                      <Input
                        value={stage.modelTag.vi}
                        onChange={(e) =>
                          updateStage(idx, {
                            modelTag: { ...stage.modelTag, vi: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-[11px] text-[#5C6069]">Nhãn mô hình (EN)</Label>
                      <Input
                        value={stage.modelTag.en}
                        onChange={(e) =>
                          updateStage(idx, {
                            modelTag: { ...stage.modelTag, en: e.target.value },
                          })
                        }
                        className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Outcomes List */}
                  <div className="space-y-2 pt-2 border-t border-[#DEDDD6]/60">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-bold text-[#1E3570]">
                        Chuẩn đầu ra (Outcomes)
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => addOutcomeToStage(idx)}
                        className="text-[11px] h-7 px-2 text-[#2E4A9E] hover:bg-[#EAEFFB]"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        <span>Thêm chuẩn đầu ra</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {(stage.outcomes.vi || []).map((oVi, oIdx) => {
                        const oEn = stage.outcomes.en?.[oIdx] || ''
                        return (
                          <div key={oIdx} className="flex items-center gap-2">
                            <Input
                              value={oVi}
                              onChange={(e) => updateOutcomeText(idx, oIdx, 'vi', e.target.value)}
                              placeholder="Tiếng Việt"
                              className="rounded-lg border-[#DEDDD6] text-xs h-8 flex-1"
                            />
                            <Input
                              value={oEn}
                              onChange={(e) => updateOutcomeText(idx, oIdx, 'en', e.target.value)}
                              placeholder="English"
                              className="rounded-lg border-[#DEDDD6] text-xs h-8 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeOutcomeFromStage(idx, oIdx)}
                              className="text-[#5C6069] hover:text-red-600 p-1 cursor-pointer"
                              title="Xóa mục này"
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
          TAB 2: EDOPTIONS ACADEMY (DUAL & FULLTIME)
      ─────────────────────────────────────────────────────────────── */}
      {subTab === 'edoptions' && (
        <div className="space-y-6">
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[#F26522]" />
                <span>Tiêu Đề Khối Tú Tài Mỹ EdOptions Academy</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (VI)</Label>
                  <Input
                    value={form.edoptions.badge.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          badge: { ...form.edoptions.badge, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Badge đề mục (EN)</Label>
                  <Input
                    value={form.edoptions.badge.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          badge: { ...form.edoptions.badge, en: e.target.value },
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
                    value={form.edoptions.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          title: { ...form.edoptions.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề chính (EN)</Label>
                  <Input
                    value={form.edoptions.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          title: { ...form.edoptions.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Phụ đề (VI)</Label>
                  <Input
                    value={form.edoptions.subtitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          subtitle: { ...form.edoptions.subtitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Phụ đề (EN)</Label>
                  <Input
                    value={form.edoptions.subtitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          subtitle: { ...form.edoptions.subtitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dual Diploma & Fulltime Details */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Dual Diploma Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EAEFFB] text-[#2E4A9E]">
                Lộ trình 1: Song Bằng Mỹ (Dual Diploma)
              </span>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Hình ảnh minh họa Dual Diploma</Label>
                <ImagePicker
                  value={form.edoptions.dual.imageUrl}
                  onChange={(url) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        dual: { ...form.edoptions.dual, imageUrl: url },
                      },
                    })
                  }
                  folder="programs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] text-[#5C6069]">Tiêu đề (VI)</Label>
                  <Input
                    value={form.edoptions.dual.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          dual: {
                            ...form.edoptions.dual,
                            title: { ...form.edoptions.dual.title, vi: e.target.value },
                          },
                        },
                      })
                    }
                    className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-[#5C6069]">Tiêu đề (EN)</Label>
                  <Input
                    value={form.edoptions.dual.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          dual: {
                            ...form.edoptions.dual,
                            title: { ...form.edoptions.dual.title, en: e.target.value },
                          },
                        },
                      })
                    }
                    className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-[#5C6069]">Mô tả chi tiết (VI)</Label>
                <Textarea
                  rows={3}
                  value={form.edoptions.dual.desc.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        dual: {
                          ...form.edoptions.dual,
                          desc: { ...form.edoptions.dual.desc, vi: e.target.value },
                        },
                      },
                    })
                  }
                  className="rounded-lg border-[#DEDDD6] text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-[#5C6069]">Đoạn giải thích phương pháp p2 (VI)</Label>
                <Textarea
                  rows={3}
                  value={form.edoptions.dual.p2.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        dual: {
                          ...form.edoptions.dual,
                          p2: { ...form.edoptions.dual.p2, vi: e.target.value },
                        },
                      },
                    })
                  }
                  className="rounded-lg border-[#DEDDD6] text-xs resize-none"
                />
              </div>
            </div>

            {/* Fulltime Homeschool Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#DEDDD6] shadow-xs space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F4F9EC] text-[#5C9024]">
                Lộ trình 2: Tú tài Toàn phần (Fulltime Homeschool)
              </span>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-[#20242B]">Hình ảnh minh họa Fulltime</Label>
                <ImagePicker
                  value={form.edoptions.fulltime.imageUrl}
                  onChange={(url) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        fulltime: { ...form.edoptions.fulltime, imageUrl: url },
                      },
                    })
                  }
                  folder="programs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] text-[#5C6069]">Tiêu đề (VI)</Label>
                  <Input
                    value={form.edoptions.fulltime.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          fulltime: {
                            ...form.edoptions.fulltime,
                            title: { ...form.edoptions.fulltime.title, vi: e.target.value },
                          },
                        },
                      })
                    }
                    className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-[#5C6069]">Tiêu đề (EN)</Label>
                  <Input
                    value={form.edoptions.fulltime.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        edoptions: {
                          ...form.edoptions,
                          fulltime: {
                            ...form.edoptions.fulltime,
                            title: { ...form.edoptions.fulltime.title, en: e.target.value },
                          },
                        },
                      })
                    }
                    className="rounded-lg border-[#DEDDD6] text-xs mt-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-[#5C6069]">Mô tả chi tiết (VI)</Label>
                <Textarea
                  rows={3}
                  value={form.edoptions.fulltime.desc.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        fulltime: {
                          ...form.edoptions.fulltime,
                          desc: { ...form.edoptions.fulltime.desc, vi: e.target.value },
                        },
                      },
                    })
                  }
                  className="rounded-lg border-[#DEDDD6] text-xs resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[11px] text-[#5C6069]">Đoạn giải thích phương pháp p2 (VI)</Label>
                <Textarea
                  rows={3}
                  value={form.edoptions.fulltime.p2.vi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      edoptions: {
                        ...form.edoptions,
                        fulltime: {
                          ...form.edoptions.fulltime,
                          p2: { ...form.edoptions.fulltime.p2, vi: e.target.value },
                        },
                      },
                    })
                  }
                  className="rounded-lg border-[#DEDDD6] text-xs resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          TAB 3: PERSONALIZED, ACHIEVEMENTS & CTA
      ─────────────────────────────────────────────────────────────── */}
      {subTab === 'personalized' && (
        <div className="space-y-6">
          {/* Personalized Mentorship */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#2E4A9E]" />
                <span>Cá Nhân Hóa Lộ Trình & Hệ Sinh Thái Cố Vấn 1:1</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề khối (VI)</Label>
                  <Input
                    value={form.personalized.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        personalized: {
                          ...form.personalized,
                          title: { ...form.personalized.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề khối (EN)</Label>
                  <Input
                    value={form.personalized.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        personalized: {
                          ...form.personalized,
                          title: { ...form.personalized.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn giới thiệu p1 (VI)</Label>
                  <Textarea
                    rows={3}
                    value={form.personalized.desc.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        personalized: {
                          ...form.personalized,
                          desc: { ...form.personalized.desc, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đoạn kết luận p2 (VI)</Label>
                  <Textarea
                    rows={3}
                    value={form.personalized.p2.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        personalized: {
                          ...form.personalized,
                          p2: { ...form.personalized.p2, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Toggle Display Achievements on Programs Page */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#8DC63F]" />
                <span>Hiển thị Khối &ldquo;Thành tích Vượt trội & Kết quả Đào tạo&rdquo; trên Trang Programs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.showAchievements}
                  onChange={(e) => setForm({ ...form, showAchievements: e.target.checked })}
                  className="rounded border-[#DEDDD6] text-[#2E4A9E] focus:ring-[#2E4A9E] w-4 h-4"
                />
                <span className="text-xs font-bold text-[#20242B]">
                  Bật hiển thị khối 4 chỉ số kết quả đào tạo & banner Olympic trên trang https://www.epath.edu.vn/vi/programs
                </span>
              </label>
              <p className="text-[11px] text-[#5C6069] mt-2 ml-7 leading-relaxed">
                Khi bật, học sinh & phụ huynh khi xem trang Chương trình đào tạo sẽ thấy ngay minh chứng chất lượng đào tạo (92% đỗ đại học Mỹ, 100% đạt chuẩn ngôn ngữ, 21.5 tín chỉ, 400+ khóa học) ngay trên trang.
              </p>
            </CardContent>
          </Card>

          {/* CTA Banner */}
          <Card className="border-[#DEDDD6] rounded-2xl shadow-xs">
            <CardHeader className="pb-3 border-b border-[#DEDDD6]/60">
              <CardTitle className="text-base font-bold text-[#1E3570] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F26522]" />
                <span>Banner Kêu Gọi Hành Động Cuối Trang (CTA Banner)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề CTA (VI)</Label>
                  <Input
                    value={form.cta.title.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: {
                          ...form.cta,
                          title: { ...form.cta.title, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Tiêu đề CTA (EN)</Label>
                  <Input
                    value={form.cta.title.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: {
                          ...form.cta,
                          title: { ...form.cta.title, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Phụ đề CTA (VI)</Label>
                  <Input
                    value={form.cta.subtitle.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: {
                          ...form.cta,
                          subtitle: { ...form.cta.subtitle, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Phụ đề CTA (EN)</Label>
                  <Input
                    value={form.cta.subtitle.en}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: {
                          ...form.cta,
                          subtitle: { ...form.cta.subtitle, en: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Nút bấm CTA (VI)</Label>
                  <Input
                    value={form.cta.buttonText.vi}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: {
                          ...form.cta,
                          buttonText: { ...form.cta.buttonText, vi: e.target.value },
                        },
                      })
                    }
                    className="rounded-xl border-[#DEDDD6] text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-[#20242B]">Đường dẫn nút bấm (Link)</Label>
                  <Input
                    value={form.cta.buttonLink}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        cta: { ...form.cta, buttonLink: e.target.value },
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

      {/* Bottom Sticky Save Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-[#DEDDD6] shadow-lg flex items-center justify-between">
        <div className="text-xs text-[#5C6069] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8DC63F]" />
          <span>Mọi cập nhật sẽ tự động đồng bộ lên trang https://www.epath.edu.vn/vi/programs</span>
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
