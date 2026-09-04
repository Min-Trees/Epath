// Client-side helpers for review workflow API.
'use client'

import type { ReviewEvent, ReviewStatus } from './cms-types'

export interface ReviewQueueItem {
  collection: string
  id: string
  title: string
  createdByUid: string
  createdByName: string
  createdByEmail: string
  submittedAt: string
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const review = {
  queue: async (): Promise<ReviewQueueItem[]> => {
    const r = await request<{ items: ReviewQueueItem[] }>('/api/cms/review/queue')
    return r.items
  },
  transition: async (
    collection: string,
    id: string,
    to: ReviewStatus,
    comment = '',
    scheduledAt = ''
  ): Promise<{ ok: true; event: ReviewEvent }> => {
    return request(`/api/cms/review/transition/${collection}/${id}`, {
      method: 'POST',
      body: JSON.stringify({ to, comment, scheduledAt }),
    })
  },
  history: async (collection: string, id: string): Promise<ReviewEvent[]> => {
    const r = await request<{ items: ReviewEvent[] }>(
      `/api/cms/review/history/${collection}/${id}`
    )
    return r.items
  },
}
