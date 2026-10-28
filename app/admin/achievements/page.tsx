'use client'

import { useState } from 'react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList } from '@/components/admin/crud-list'
import { AchievementsOverviewForm } from '@/components/admin/achievements-overview-form'
import { cms } from '@/lib/cms-client'
import type { Achievement } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { Trophy, Award, BarChart3 } from 'lucide-react'

const fields = [
  { key: 'title', label: 'Tiêu đề', kind: 'text' as const, multilang: true },
  { key: 'description', label: 'Mô tả', kind: 'richtext' as const, multilang: true },
  {
    key: 'coverImage',
    label: 'Ảnh bìa',
    kind: 'image' as const,
    placeholder: 'JPG/PNG/WEBP, không giới hạn dung lượng',
    folder: 'achievements',
  },
  { key: 'images', label: 'URL hình ảnh bổ sung (mỗi dòng một URL)', kind: 'textarea' as const },
]

export default function AdminAchievementsPage() {
  const user = useRequireAdmin()
  const [activeTab, setActiveTab] = useState<'overview' | 'list'>('overview')

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Thành Tích & Kết Quả Đào Tạo"
      subtitle="Quản lý tiêu đề, 4 chỉ số học thuật, banner Olympic và danh sách thành tích học sinh trên website."
    >
      {/* Top Tab Bar */}
      <div className="flex gap-2 border-b border-[#DEDDD6] pb-3 mb-6">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#1E3570] text-white shadow-sm'
              : 'bg-white text-[#5C6069] hover:text-[#1E3570] border border-[#DEDDD6]'
          }`}
        >
          <BarChart3 className={`w-4 h-4 ${activeTab === 'overview' ? 'text-[#8DC63F]' : 'text-[#5C6069]'}`} />
          <span>1. Thành tích Vượt trội & Kết quả Đào tạo</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('list')}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'bg-[#1E3570] text-white shadow-sm'
              : 'bg-white text-[#5C6069] hover:text-[#1E3570] border border-[#DEDDD6]'
          }`}
        >
          <Award className={`w-4 h-4 ${activeTab === 'list' ? 'text-[#8DC63F]' : 'text-[#5C6069]'}`} />
          <span>2. Danh sách Thành tích học sinh (Cards)</span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <AchievementsOverviewForm />
      ) : (
        <CrudList<Achievement>
          title="Thành tích"
          fields={fields}
          load={cms.achievements.list}
          create={(d) => cms.achievements.create(d as never) as unknown as Promise<{ id: string }>}
          update={(id, d) => cms.achievements.update(id, d as never) as unknown as Promise<unknown>}
          remove={cms.achievements.remove}
          reorder={cms.achievements.reorder}
          reviewCollection="achievements"
          renderSummary={(item) => (
            <div className="flex items-start gap-3">
              {item.coverImage ? (
                <div className="w-16 h-12 rounded border border-[#DEDDD6] overflow-hidden bg-white shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.coverImage}
                    alt={item.title.vi || item.title.en}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-12 rounded border border-[#DEDDD6] bg-[#F6F5F1] shrink-0 flex items-center justify-center text-xs text-[#5C6069] font-bold">
                  AWARD
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate" style={{ color: semanticColors.text }}>
                  {item.title.vi || item.title.en}
                </div>
                <div className="text-xs line-clamp-2 mt-0.5" style={{ color: semanticColors.textMuted }}>
                  {item.description.vi || item.description.en}
                </div>
              </div>
            </div>
          )}
        />
      )}
    </AdminLayout>
  )
}
