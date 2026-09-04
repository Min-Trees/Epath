'use client'

import type { Backup } from './cms-types'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    credentials: 'include',
  })
  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error || `Request failed: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export const backupClient = {
  list: () => request<{ items: Backup[] }>('/api/cms/backup').then((r) => r.items),
  get: (id: string) => request<{ item: Backup }>(`/api/cms/backup/${id}`).then((r) => r.item),
  create: (notes?: string) => request<{ ok: boolean; id: string; gcsPrefix: string }>('/api/cms/backup', {
    method: 'POST',
    body: JSON.stringify({ notes }),
  }),
  remove: (id: string) => request<{ ok: boolean }>(`/api/cms/backup/${id}`, { method: 'DELETE' }),
  restore: (id: string, mode: 'full' | 'collection', collection?: string) =>
    request<{ ok: boolean; preRestoreId: string }>(`/api/cms/backup/${id}/restore`, {
      method: 'POST',
      body: JSON.stringify({ mode, collection }),
    }),
}
