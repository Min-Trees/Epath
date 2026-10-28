'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList, type CrudFieldDef } from '@/components/admin/crud-list'
import { ProgramsPageForm } from '@/components/admin/programs-page-form'
import { cms } from '@/lib/cms-client'
import { DEFAULT_PROGRAMS } from '@/lib/default-programs'
import type { Program } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { Compass, BookOpen } from 'lucide-react'

const fields: CrudFieldDef[] = [
  { key: 'title', label: 'Tên chương trình (Song ngữ)', kind: 'text', multilang: true },
  { key: 'slug', label: 'Slug (Định danh URL)', kind: 'text' },
  {
    key: 'level',
    label: 'Cấp học',
    kind: 'select',
    options: [
      { value: 'kindergarten', label: 'Mầm non (3 – 6 tuổi)' },
      { value: 'elementary', label: 'Tiểu học (Lớp 1 – 5)' },
      { value: 'middle', label: 'Trung học cơ sở (Lớp 6 – 8)' },
      { value: 'high', label: 'Trung học phổ thông (Lớp 9 – 12) – Dual Diploma & Fulltime Homeschool' },
    ],
  },
  { key: 'shortDescription', label: 'Mô tả ngắn / Phân mục (Song ngữ)', kind: 'richtext', multilang: true },
  { key: 'content', label: 'Nội dung chi tiết (Song ngữ)', kind: 'richtext', multilang: true },
  { key: 'ageRange', label: 'Độ tuổi / Lớp học', kind: 'text' },
  { key: 'imageUrl', label: 'Hình ảnh đại diện', kind: 'image', placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng', folder: 'programs' },
]

const levelBadges: Record<string, { label: string; color: string; bg: string }> = {
  kindergarten: { label: 'Mầm non (3–6 tuổi)', color: '#5C9024', bg: '#8DC63F25' },
  elementary: { label: 'Tiểu học (Lớp 1–5)', color: '#2E4A9E', bg: '#2E4A9E15' },
  middle: { label: 'THCS (Lớp 6–8)', color: '#1E3570', bg: '#1E357015' },
  high: { label: 'THPT (Lớp 9–12)', color: '#F26522', bg: '#F2652215' },
}

export default function AdminProgramsPage() {
  const user = useRequireAdmin()
  const [mainTab, setMainTab] = useState<'page-content' | 'catalog'>('page-content')
  const [levelFilter, setLevelFilter] = useState<'all' | 'kindergarten' | 'elementary' | 'middle' | 'high'>('all')

  if (user === undefined) return null

  const handleSeed = async () => {
    if (!confirm(`Tạo ${DEFAULT_PROGRAMS.length} chương trình mẫu vào Firestore? (Bỏ qua nếu đã có)`)) return
    for (const p of DEFAULT_PROGRAMS) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = p
        await cms.programs.create(data as never)
      } catch (err) {
        console.error('Seed program failed:', err)
      }
    }
    alert('Đã tạo xong. Tải lại trang để thấy danh sách.')
    location.reload()
  }

  const loadFiltered = async () => {
    const list = await cms.programs.list()
    if (levelFilter === 'all') return list
    return list.filter((p) => p.level === levelFilter)
  }

  return (
    <AdminLayout
      title="Quản lý Chương trình Đào tạo"
      subtitle="Quản lý Lộ trình K-12 liên thông, Tú tài Mỹ EdOptions, Cố vấn 1:1 và danh mục 5 khóa học."
    >
      {/* Primary Tab Bar */}
      <div className="flex gap-2 border-b border-[#DEDDD6] pb-3 mb-6">
        <button
          type="button"
          onClick={() => setMainTab('page-content')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mainTab === 'page-content'
              ? 'bg-[#1E3570] text-white shadow-sm'
              : 'bg-white text-[#5C6069] hover:text-[#1E3570] border border-[#DEDDD6]'
          }`}
        >
          <Compass className={`w-4 h-4 ${mainTab === 'page-content' ? 'text-[#8DC63F]' : 'text-[#5C6069]'}`} />
          <span>1. Thiết lập Trang & Lộ trình (Programs Page Setup)</span>
        </button>

        <button
          type="button"
          onClick={() => setMainTab('catalog')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mainTab === 'catalog'
              ? 'bg-[#1E3570] text-white shadow-sm'
              : 'bg-white text-[#5C6069] hover:text-[#1E3570] border border-[#DEDDD6]'
          }`}
        >
          <BookOpen className={`w-4 h-4 ${mainTab === 'catalog' ? 'text-[#8DC63F]' : 'text-[#5C6069]'}`} />
          <span>2. Danh mục Khóa học (Programs Catalog)</span>
        </button>
      </div>

      {mainTab === 'page-content' ? (
        <ProgramsPageForm />
      ) : (
        <>
          {/* Filter Tabs */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1 border border-[#DEDDD6] bg-white p-1 rounded-xl">
              <div className="px-2 text-xs font-semibold text-[#5C6069]">
                Cấp học:
              </div>
              <button
                type="button"
                onClick={() => setLevelFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'text-[#5C6069] hover:text-[#20242B]'
                }`}
              >
                Tất cả
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('kindergarten')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === 'kindergarten'
                    ? 'bg-[#5C9024] text-white'
                    : 'text-[#5C6069] hover:text-[#5C9024]'
                }`}
              >
                Mầm non
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('elementary')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === 'elementary'
                    ? 'bg-[#2E4A9E] text-white'
                    : 'text-[#5C6069] hover:text-[#2E4A9E]'
                }`}
              >
                Tiểu học
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('middle')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === 'middle'
                    ? 'bg-[#1E3570] text-white'
                    : 'text-[#5C6069] hover:text-[#1E3570]'
                }`}
              >
                THCS
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('high')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  levelFilter === 'high'
                    ? 'bg-[#F26522] text-white'
                    : 'text-[#5C6069] hover:text-[#F26522]'
                }`}
              >
                THPT
              </button>
            </div>

            <Button
              onClick={handleSeed}
              variant="outline"
              size="sm"
              className="text-xs rounded-xl border-[#DEDDD6] hover:bg-[#F6F5F1]"
            >
              Nạp dữ liệu mẫu ban đầu
            </Button>
          </div>

          <CrudList<Program>
            key={levelFilter}
            title="Chương trình"
            fields={fields}
            load={loadFiltered}
            create={(d) => cms.programs.create(d as never) as unknown as Promise<{ id: string }>}
            update={(id, d) => cms.programs.update(id, d as never) as unknown as Promise<unknown>}
            remove={cms.programs.remove}
            reorder={cms.programs.reorder}
            reviewCollection="programs"
            renderSummary={(item) => {
              const badge = levelBadges[item.level] || { label: item.level, color: '#666', bg: '#f0f0f0' }
              return (
                <div className="flex items-start gap-3">
                  {item.imageUrl ? (
                    <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] overflow-hidden bg-white shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl}
                        alt={item.title.vi || item.title.en}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-12 rounded-lg border border-[#DEDDD6] bg-[#F6F5F1] shrink-0 flex items-center justify-center text-xs text-[#5C6069] font-bold">
                      {item.level?.toUpperCase().slice(0, 3)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm truncate" style={{ color: semanticColors.text }}>
                        {item.title.vi || item.title.en}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider shrink-0"
                        style={{ color: badge.color, backgroundColor: badge.bg }}
                      >
                        {badge.label}
                      </span>
                      {item.ageRange && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium shrink-0">
                          {item.ageRange}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C6069] truncate mt-0.5 font-mono">
                      /{item.slug}
                    </div>
                  </div>
                </div>
              )
            }}
          />
        </>
      )}
    </AdminLayout>
  )
}
