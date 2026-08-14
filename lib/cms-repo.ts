// Server-side Firestore helpers for CMS modules.
import 'server-only'
import { getAdminDb } from './firebase-admin'
import {
  FAQ,
  CoreValue,
  LearningPathway,
  Program,
  Partner,
  CmsEvent,
  AdmissionStep,
  Achievement,
  TeamMember,
  CollectionNames,
} from './cms-types'

function coll(name: string) {
  return getAdminDb().collection(name)
}

function toObject<T extends { id?: string }>(doc: FirebaseFirestore.QueryDocumentSnapshot | FirebaseFirestore.DocumentSnapshot): T {
  const data = doc.data() as Omit<T, 'id'> | undefined
  return { id: doc.id, ...(data as Omit<T, 'id'>) } as T
}

export async function listCollection<T extends { id: string }>(name: string): Promise<T[]> {
  const snap = await coll(name).orderBy('order', 'asc').get()
  return snap.docs.map((d) => toObject<T>(d))
}

export async function listActiveCollection<T extends { id: string }>(name: string): Promise<T[]> {
  const snap = await coll(name)
    .where('isActive', '==', true)
    .orderBy('order', 'asc')
    .get()
  return snap.docs.map((d) => toObject<T>(d))
}

export async function createDocument<T extends Record<string, unknown>>(
  name: string,
  data: T
): Promise<string> {
  const ref = await coll(name).add({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
  return ref.id
}

export async function updateDocument(
  name: string,
  id: string,
  data: Record<string, unknown>
): Promise<void> {
  await coll(name).doc(id).update({ ...data, updatedAt: new Date() })
}

export async function deleteDocument(name: string, id: string): Promise<void> {
  await coll(name).doc(id).delete()
}

export async function reorderCollection(
  name: string,
  ids: string[]
): Promise<void> {
  const batch = getAdminDb().batch()
  ids.forEach((id, index) => {
    batch.update(coll(name).doc(id), { order: index, updatedAt: new Date() })
  })
  await batch.commit()
}

// Typed wrappers
export const FaqsRepo = {
  list: () => listCollection<FAQ>(CollectionNames.faqs),
  listActive: () => listActiveCollection<FAQ>(CollectionNames.faqs),
  create: (data: Omit<FAQ, 'id'>) => createDocument(CollectionNames.faqs, data),
  update: (id: string, data: Partial<FAQ>) => updateDocument(CollectionNames.faqs, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.faqs, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.faqs, ids),
}

export const CoreValuesRepo = {
  list: () => listCollection<CoreValue>(CollectionNames.coreValues),
  listActive: () => listActiveCollection<CoreValue>(CollectionNames.coreValues),
  create: (data: Omit<CoreValue, 'id'>) => createDocument(CollectionNames.coreValues, data),
  update: (id: string, data: Partial<CoreValue>) => updateDocument(CollectionNames.coreValues, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.coreValues, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.coreValues, ids),
}

export const PathwaysRepo = {
  list: () => listCollection<LearningPathway>(CollectionNames.learningPathways),
  listActive: () => listActiveCollection<LearningPathway>(CollectionNames.learningPathways),
  create: (data: Omit<LearningPathway, 'id'>) => createDocument(CollectionNames.learningPathways, data),
  update: (id: string, data: Partial<LearningPathway>) => updateDocument(CollectionNames.learningPathways, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.learningPathways, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.learningPathways, ids),
}

export const ProgramsRepo = {
  list: () => listCollection<Program>(CollectionNames.programs),
  listActive: () => listActiveCollection<Program>(CollectionNames.programs),
  create: (data: Omit<Program, 'id'>) => createDocument(CollectionNames.programs, data),
  update: (id: string, data: Partial<Program>) => updateDocument(CollectionNames.programs, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.programs, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.programs, ids),
}

export const PartnersRepo = {
  list: () => listCollection<Partner>(CollectionNames.partners),
  listActive: () => listActiveCollection<Partner>(CollectionNames.partners),
  create: (data: Omit<Partner, 'id'>) => createDocument(CollectionNames.partners, data),
  update: (id: string, data: Partial<Partner>) => updateDocument(CollectionNames.partners, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.partners, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.partners, ids),
}

export const EventsRepo = {
  list: () => listCollection<CmsEvent>(CollectionNames.events),
  listActive: () => listActiveCollection<CmsEvent>(CollectionNames.events),
  create: (data: Omit<CmsEvent, 'id'>) => createDocument(CollectionNames.events, data),
  update: (id: string, data: Partial<CmsEvent>) => updateDocument(CollectionNames.events, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.events, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.events, ids),
}

export const AdmissionStepsRepo = {
  list: () => listCollection<AdmissionStep>(CollectionNames.admissionSteps),
  listActive: () => listActiveCollection<AdmissionStep>(CollectionNames.admissionSteps),
  create: (data: Omit<AdmissionStep, 'id'>) => createDocument(CollectionNames.admissionSteps, data),
  update: (id: string, data: Partial<AdmissionStep>) => updateDocument(CollectionNames.admissionSteps, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.admissionSteps, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.admissionSteps, ids),
}

export const AchievementsRepo = {
  list: () => listCollection<Achievement>(CollectionNames.achievements),
  listActive: () => listActiveCollection<Achievement>(CollectionNames.achievements),
  create: (data: Omit<Achievement, 'id'>) => createDocument(CollectionNames.achievements, data),
  update: (id: string, data: Partial<Achievement>) => updateDocument(CollectionNames.achievements, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.achievements, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.achievements, ids),
}

export const TeamMembersRepo = {
  list: () => listCollection<TeamMember>(CollectionNames.teamMembers),
  listActive: () => listActiveCollection<TeamMember>(CollectionNames.teamMembers),
  create: (data: Omit<TeamMember, 'id'>) => createDocument(CollectionNames.teamMembers, data),
  update: (id: string, data: Partial<TeamMember>) => updateDocument(CollectionNames.teamMembers, id, data),
  remove: (id: string) => deleteDocument(CollectionNames.teamMembers, id),
  reorder: (ids: string[]) => reorderCollection(CollectionNames.teamMembers, ids),
}