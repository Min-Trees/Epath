'use client'

import { useEffect, useState } from 'react'
import { History as HistoryIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { ReviewStatusBadge } from './review-status-badge'
import type { ReviewEvent } from '@/lib/cms-types'
import { formatDateVi } from '@/lib/date-utils'

export interface ReviewHistoryTimelineProps {
  collection: string
  documentId: string
}

export function ReviewHistoryTimeline({ collection, documentId }: ReviewHistoryTimelineProps) {
  const [items, setItems] = useState<ReviewEvent[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/cms/review/history/${collection}/${documentId}`)
      .then((r) => r.json())
      .then((data: { items?: ReviewEvent[] }) => {
        if (!cancelled) setItems(data.items || [])
      })
      .catch(() => {
        if (!cancelled) setItems([])
      })
    return () => {
      cancelled = true
    }
  }, [collection, documentId])

  if (items === null) {
    return <p className="text-sm text-gray-500">Đang tải lịch sử...</p>
  }
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Chưa có lịch sử review.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium">
        <HistoryIcon className="w-4 h-4" />
        Lịch sử ({items.length})
      </div>
      <div className="space-y-2">
        {items.map((event) => (
          <Card key={event.id}>
            <CardContent className="p-3">
              <div className="flex items-start gap-3 flex-wrap">
                <ReviewStatusBadge status={event.from} size="sm" />
                <span className="text-gray-400">→</span>
                <ReviewStatusBadge status={event.to} size="sm" />
                <div className="text-xs text-gray-500 ml-auto">
                  {event.actorName || event.actorEmail || event.actorUid || 'Hệ thống'}
                </div>
              </div>
              {event.comment && (
                <p className="text-sm mt-2 p-2 rounded bg-gray-50 italic" style={{ color: '#374151' }}>
                  “{event.comment}”
                </p>
              )}
              <div className="text-xs text-gray-500 mt-2">
                {formatDate(event.at)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

function formatDate(value: ReviewEvent['at']): string {
  return formatDateVi(value, '', { hour12: false })
}
