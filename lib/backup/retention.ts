// Retention policy - prune backups older than 90 days.
import 'server-only'
import { BackupsRepo } from './repo'
import { deleteGcsPrefix } from './restore'
import { logActivity } from '../activity-log'
import type { SessionUser } from '../session'

const RETENTION_DAYS = 90

export async function pruneExpiredBackups(actor?: SessionUser): Promise<{ deleted: number }> {
  const all = await BackupsRepo.list()
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS)

  const expired = all.filter((b) => {
    const created = b.createdAt
      ? new Date(typeof b.createdAt === 'string' ? b.createdAt : b.createdAt)
      : null
    return created && created < cutoff
  })

  for (const backup of expired) {
    try {
      if (backup.gcsPrefix) {
        await deleteGcsPrefix(backup.gcsPrefix)
      }
      await BackupsRepo.remove(backup.id as string)
    } catch (err) {
      console.error(`[prune] failed to remove backup ${backup.id}:`, err)
    }
  }

  if (actor) {
    await logActivity({
      action: 'backup_prune',
      collection: 'backups',
      documentLabel: `Pruned ${expired.length} backups`,
      changes: { count: expired.length },
      actor,
    })
  }

  return { deleted: expired.length }
}
