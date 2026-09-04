'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { AdminLayout, useRequireAdmin } from '@/components/admin/admin-layout'
import { PageSectionsEditor } from '@/components/admin/page-sections-editor'
import { semanticColors } from '@/lib/design-tokens'
import type { PageSlug } from '@/lib/pages-repo'

const PAGES: { id: PageSlug; title: string; subtitle: string }[] = [
  { id: 'about', title: 'Trang About', subtitle: 'Sắp xếp section trang Giới thiệu.' },
  { id: 'programs', title: 'Trang Chương trình học', subtitle: 'Sắp xếp section trang Programs.' },
  { id: 'admissions', title: 'Trang Tuyển sinh', subtitle: 'Sắp xếp section trang Tuyển sinh.' },
  { id: 'events', title: 'Trang Sự kiện', subtitle: 'Sắp xếp section trang Sự kiện.' },
  { id: 'partners', title: 'Trang Đối tác', subtitle: 'Sắp xếp section trang Đối tác.' },
]

export default function AdminPageBuilderIndexPage() {
  const user = useRequireAdmin()
  const [selected, setSelected] = useState<PageSlug>('about')

  if (user === undefined) return null

  return (
    <AdminLayout
      title="Page Builder"
      subtitle="Chọn trang và sắp xếp thứ tự section tương ứng."
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        {PAGES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p.id)}
            className="px-4 py-3 rounded-lg border text-sm font-medium transition-all text-center break-words min-w-0"
            style={{
              backgroundColor:
                selected === p.id ? semanticColors.primaryBg : semanticColors.surface,
              borderColor:
                selected === p.id ? semanticColors.primary : 'rgba(35,31,32,0.1)',
              color: selected === p.id ? semanticColors.primary : semanticColors.text,
            }}
          >
            {p.title}
          </button>
        ))}
      </div>

      {PAGES.filter((p) => p.id === selected).map((p) => (
        <PageSectionsEditor
          key={p.id}
          pageId={p.id}
          title={p.title}
          subtitle={p.subtitle}
        />
      ))}
    </AdminLayout>
  )
}