// Firestore is not currently used in this project
// This file is kept for future reference if Firestore is needed

export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  console.warn(`getDocument called but Firestore is disabled: ${collectionName}/${id}`)
  return null
}

export async function getDocuments<T>(
  collectionName: string,
  constraints?: any[]
): Promise<T[]> {
  console.warn(`getDocuments called but Firestore is disabled: ${collectionName}`)
  return []
}

export async function getPrograms() { return [] }
export async function getProgramsByLevel(level: string) { return [] }
export async function getProgram(id: string) { return null }
export async function getFAQs() { return [] }
export async function getTestimonials() { return [] }
export async function getPartners() { return [] }
export async function submitContact(data: any) { return null }
export async function getStatistics() { return [] }
export async function createDocument(collectionName: string, data: any) { return null }
export async function updateDocument(collectionName: string, id: string, data: any) { return null }
export async function deleteDocument(collectionName: string, id: string) { return null }
