// Backup repository - CRUD cho backup records trong Firestore.
import 'server-only'
import { getAdminDb } from '../firebase-admin'
import {
  CollectionNames,
  type Backup,
  type BackupInput,
} from '../cms-types'

function coll() {
  return getAdminDb().collection(CollectionNames.backups)
}

export const BackupsRepo = {
  async list(): Promise<Backup[]> {
    const snap = await coll().orderBy('createdAt', 'desc').limit(100).get()
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Backup, 'id'>) }))
  },

  async get(id: string): Promise<Backup | null> {
    const snap = await coll().doc(id).get()
    if (!snap.exists) return null
    return { id: snap.id, ...(snap.data() as Omit<Backup, 'id'>) }
  },

  async create(data: Omit<Backup, 'id'>): Promise<string> {
    const ref = await coll().add({ ...data, createdAt: new Date() })
    return ref.id
  },

  async update(id: string, data: Partial<Backup>): Promise<void> {
    await coll().doc(id).update({ ...data, updatedAt: new Date() })
  },

  async remove(id: string): Promise<void> {
    await coll().doc(id).delete()
  },
}
