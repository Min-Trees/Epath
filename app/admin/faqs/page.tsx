'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  AdminLayout,
  useRequireAdmin,
} from '@/components/admin/admin-layout'
import { semanticColors } from '@/lib/design-tokens'

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
  order: number
}

const sampleFAQs: FAQ[] = [
  {
    id: 1,
    question: 'Chương trình EPath phù hợp với học sinh ở độ tuổi nào?',
    answer: 'EPath cung cấp chương trình học từ Mầm non (3-5 tuổi) đến THPT (15-18 tuổi).',
    category: 'Tuyển sinh',
    order: 1,
  },
  {
    id: 2,
    question: 'Con tôi đang học trường công/tư — có học EPath song song được không?',
    answer: 'Hoàn toàn có thể! EPath được thiết kế theo mô hình Blended Learning.',
    category: 'Tuyển sinh',
    order: 2,
  },
  {
    id: 3,
    question: 'Học phí và chính sách tài chính như thế nào?',
    answer: 'Học phí tại EPath được chia theo từng gói chương trình và cấp học.',
    category: 'Học phí',
    order: 3,
  },
]

export default function AdminFAQsPage() {
  const isLoggedIn = useRequireAdmin()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>(sampleFAQs)
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '', category: '' })

  if (!isLoggedIn) return null

  const handleAddFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setFaqs([
        ...faqs,
        { ...newFAQ, id: Date.now(), order: faqs.length + 1 },
      ])
      setNewFAQ({ question: '', answer: '', category: '' })
      setIsAddDialogOpen(false)
    }
  }

  const handleDeleteFAQ = (id: number) => {
    setFaqs(faqs.filter((faq) => faq.id !== id))
  }

  return (
    <AdminLayout
      title="Quản lý FAQ"
      subtitle="Thêm, sửa, xóa câu hỏi thường gặp"
      actions={
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Thêm FAQ
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Thêm câu hỏi mới</DialogTitle>
              <DialogDescription>
                Điền thông tin câu hỏi và câu trả lời
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label>Câu hỏi</Label>
                <Input
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  placeholder="Nhập câu hỏi..."
                />
              </div>
              <div>
                <Label>Câu trả lời</Label>
                <textarea
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  placeholder="Nhập câu trả lời..."
                />
              </div>
              <div>
                <Label>Danh mục</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ({ ...newFAQ, category: e.target.value })}
                >
                  <option value="">Chọn danh mục</option>
                  <option value="Tuyển sinh">Tuyển sinh</option>
                  <option value="Học phí">Học phí</option>
                  <option value="Chương trình">Chương trình</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddFAQ}>Thêm mới</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-2 text-sm mb-4 transition-colors duration-200"
        style={{ color: semanticColors.textMuted }}
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại Dashboard
      </Link>

      {/* FAQ List */}
      <div className="space-y-4">
        {faqs.map((faq) => (
          <Card key={faq.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="text-xs px-2 py-1 rounded font-medium"
                      style={{
                        color: semanticColors.primary,
                        backgroundColor: semanticColors.primaryBg,
                      }}
                    >
                      {faq.category}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: semanticColors.textMuted }}
                    >
                      Thứ tự: {faq.order}
                    </span>
                  </div>
                  <h3
                    className="font-medium mb-2"
                    style={{ color: semanticColors.text }}
                  >
                    {faq.question}
                  </h3>
                  <p className="text-sm" style={{ color: semanticColors.textMuted }}>
                    {faq.answer}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" aria-label="Edit">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    aria-label="Delete"
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="transition-colors duration-200"
                    style={{ color: semanticColors.cta }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}
