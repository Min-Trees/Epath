'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { CrudList, type CrudFieldDef } from '@/components/admin/crud-list'
import { PartnersPageForm } from '@/components/admin/partners-page-form'
import { cms } from '@/lib/cms-client'
import { DEFAULT_PARTNERS } from '@/lib/default-partners'
import type { Partner } from '@/lib/cms-types'
import { semanticColors } from '@/lib/design-tokens'
import { Globe2, Sparkles, Image as ImageIcon } from 'lucide-react'

const fields: CrudFieldDef[] = [
  { key: 'name', label: 'Tên đối tác', kind: 'text' },
  {
    key: 'category',
    label: 'Loại đối tác',
    kind: 'select',
    options: [
      { value: 'curriculum', label: 'Chương trình học (Curriculum)' },
      { value: 'certification', label: 'Kiểm định & Khảo thí (Certification)' },
      { value: 'lab', label: 'Lab & Trải nghiệm (Makerspace)' },
      { value: 'other', label: 'Mạng lưới đối tác khác (Network)' },
    ],
  },
  {
    key: 'badgeLabel',
    label: 'Huy hiệu nổi bật (Song ngữ)',
    kind: 'text',
    multilang: true,
    placeholder: 'VD: Chương Trình Chuẩn Hoa Kỳ',
  },
  {
    key: 'logoUrl',
    label: 'Logo đối tác',
    kind: 'image',
    placeholder: 'SVG / PNG / JPG',
    folder: 'partners',
  },
  {
    key: 'imageUrl',
    label: 'Ảnh Banner / Showcase đối tác',
    kind: 'image',
    placeholder: 'JPG / PNG / WEBP đại diện cho đối tác',
    folder: 'partners',
  },
  {
    key: 'website',
    label: 'Đường dẫn Website chính thức',
    kind: 'text',
    placeholder: 'https://...',
  },
  {
    key: 'description',
    label: 'Mô tả chi tiết (Song ngữ)',
    kind: 'richtext',
    multilang: true,
  },
  {
    key: 'isFeatured',
    label: 'Nổi bật (hiển thị trên Trang chủ)',
    kind: 'checkbox',
  },
]

export default function AdminPartnersPage() {
  const user = useRequireAdmin()
  const [mainTab, setMainTab] = useState<'page-content' | 'catalog'>('page-content')

  if (user === undefined) return null

  const handleSeed = async () => {
    if (!confirm(`Đồng bộ ${DEFAULT_PARTNERS.length} đối tác quốc tế chuẩn từ tài liệu vào Firestore?`)) return
    for (const p of DEFAULT_PARTNERS) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = p
        await cms.partners.create(data as never)
      } catch (e) {
        console.error(e)
      }
    }
    alert('Đã hoàn tất đồng bộ danh sách đối tác!')
    window.location.reload()
  }

  return (
    <AdminLayout
      title="Đối tác Quốc tế"
      subtitle="Quản lý danh sách đối tác chiến lược và cấu hình trang Đối tác Quốc tế."
    >
      <div className="space-y-6">
        {/* Main Tab Switcher */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#F6F5F1] border border-[#DEDDD6] max-w-fit">
          <button
            type="button"
            onClick={() => setMainTab('page-content')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'page-content'
                ? 'bg-white text-[#1E3570] shadow-xs'
                : 'text-[#5C6069] hover:text-[#1E3570]'
            }`}
          >
            <Globe2 className="w-4 h-4 text-[#F26522]" />
            <span>Cấu hình Trang Đối tác</span>
          </button>

          <button
            type="button"
            onClick={() => setMainTab('catalog')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'catalog'
                ? 'bg-white text-[#1E3570] shadow-xs'
                : 'text-[#5C6069] hover:text-[#1E3570]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#2E4A9E]" />
            <span>Danh sách Đối tác ({DEFAULT_PARTNERS.length})</span>
          </button>
        </div>

        {/* Tab 1: Page Content Form */}
        {mainTab === 'page-content' && <PartnersPageForm />}

        {/* Tab 2: Partners CRUD List */}
        {mainTab === 'catalog' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#DEDDD6] shadow-xs">
              <div className="text-xs text-[#5C6069]">
                Danh sách đối tác hiển thị trên trang <code className="text-[#1E3570]">/partners</code> và trang chủ.
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSeed}
                className="text-xs border-[#DEDDD6] text-[#1E3570] hover:bg-[#F6F5F1]"
              >
                Đồng bộ 4 đối tác chuẩn
              </Button>
            </div>

            <CrudList<Partner>
              title="Đối tác Quốc tế"
              fields={fields}
              load={cms.partners.list}
              create={(d) => cms.partners.create(d as never) as unknown as Promise<{ id: string }>}
              update={(id, d) => cms.partners.update(id, d as never) as unknown as Promise<unknown>}
              remove={cms.partners.remove}
              reorder={cms.partners.reorder}
              reviewCollection="partners"
              renderSummary={(item) => (
                <div className="flex items-start gap-4">
                  {/* Partner Showcase Image or Logo */}
                  {item.imageUrl || item.logoUrl ? (
                    <div className="w-20 h-16 rounded-xl border border-[#DEDDD6] overflow-hidden bg-white shrink-0 flex items-center justify-center p-0.5 relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageUrl || item.logoUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-16 rounded-xl border border-[#DEDDD6] bg-[#F6F5F1] shrink-0 flex items-center justify-center text-xs text-[#5C6069] font-bold">
                      <ImageIcon className="w-5 h-5 text-[#8E939E]" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider"
                        style={{
                          color: semanticColors.primary,
                          backgroundColor: semanticColors.primaryBg,
                        }}
                      >
                        {item.category}
                      </span>

                      {item.badgeLabel && (
                        <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-[#F6F5F1] text-[#20242B] border border-[#DEDDD6]">
                          {typeof item.badgeLabel === 'object'
                            ? item.badgeLabel.vi || item.badgeLabel.en
                            : String(item.badgeLabel)}
                        </span>
                      )}

                      {item.isFeatured && (
                        <span
                          className="text-[11px] px-2 py-0.5 rounded-full font-bold"
                          style={{
                            color: '#fff',
                            backgroundColor: semanticColors.cta,
                          }}
                        >
                          Nổi bật Home
                        </span>
                      )}
                    </div>

                    <div className="font-bold text-sm text-[#1E3570] truncate">
                      {item.name}
                    </div>

                    {item.website && (
                      <div className="text-xs text-[#2E4A9E] hover:underline truncate mt-0.5">
                        {item.website}
                      </div>
                    )}

                    <div className="text-xs line-clamp-2 mt-1 text-[#5C6069]">
                      {item.description?.vi || item.description?.en || ''}
                    </div>
                  </div>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
