import 'server-only'
import { getAdminDb } from './firebase-admin'
import { CollectionNames, PageSlugSchema, SectionTypeSchema } from './cms-types'
import { z } from 'zod'

export { PageSlugSchema, SectionTypeSchema }
export type PageSlug = z.infer<typeof PageSlugSchema>
export type SectionType = z.infer<typeof SectionTypeSchema>

export const PAGES_COLLECTION = CollectionNames.pages

export interface PageSection {
  id: string
  pageId: PageSlug
  type: SectionType
  order: number
  isActive: boolean
  data: Record<string, unknown>
}

export async function getPageSections(pageId: PageSlug): Promise<PageSection[]> {
  const snap = await getAdminDb()
    .collection(PAGES_COLLECTION)
    .doc(pageId)
    .collection('sections')
    .orderBy('order', 'asc')
    .get()
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PageSection, 'id'>) }))
}

export async function upsertPageSection(section: PageSection): Promise<void> {
  const { id, pageId, ...rest } = section
  await getAdminDb()
    .collection(PAGES_COLLECTION)
    .doc(pageId)
    .collection('sections')
    .doc(id)
    .set({ ...rest, updatedAt: new Date() }, { merge: true })
}

export async function deletePageSection(pageId: PageSlug, id: string): Promise<void> {
  await getAdminDb()
    .collection(PAGES_COLLECTION)
    .doc(pageId)
    .collection('sections')
    .doc(id)
    .delete()
}

export async function reorderPageSections(
  pageId: PageSlug,
  ids: string[]
): Promise<void> {
  const batch = getAdminDb().batch()
  ids.forEach((id, index) => {
    batch.update(
      getAdminDb().collection(PAGES_COLLECTION).doc(pageId).collection('sections').doc(id),
      { order: index, updatedAt: new Date() }
    )
  })
  await batch.commit()
}