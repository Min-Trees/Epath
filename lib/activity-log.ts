// Activity Log helpers - shared between API routes and CMS handlers.
import 'server-only'
import { getAdminDb } from './firebase-admin'
import { CollectionNames, type ActivityAction } from './cms-types'
import type { SessionUser } from './session'

export interface ActivityLogEntry {
  action: ActivityAction
  collection: string
  documentId?: string
  documentLabel?: string
  changes?: Record<string, unknown>
  actor: SessionUser | null
  request?: Request
}

function getClientMeta(req?: Request) {
  if (!req) return { ip: '', userAgent: '' }
  const forwarded = req.headers.get('x-forwarded-for') || ''
  const ip = forwarded.split(',')[0]?.trim() || req.headers.get('x-real-ip') || ''
  const userAgent = req.headers.get('user-agent') || ''
  return { ip, userAgent }
}

export async function logActivity(entry: ActivityLogEntry): Promise<void> {
  try {
    const { ip, userAgent } = getClientMeta(entry.request)
    const db = getAdminDb()
    await db.collection(CollectionNames.activityLogs).add({
      action: entry.action,
      collection: entry.collection,
      documentId: entry.documentId || '',
      documentLabel: entry.documentLabel || '',
      changes: entry.changes || null,
      actorUid: entry.actor?.uid || 'anonymous',
      actorEmail: entry.actor?.email || '',
      actorName: entry.actor?.name || '',
      ip,
      userAgent,
      createdAt: new Date(),
    })
  } catch (err) {
    // Activity logging must never break the main request flow.
    console.error('[activity-log] failed to write log:', err)
  }
}