import { NextResponse } from 'next/server'
import { getAdminDb } from '@/lib/firebase-admin'
import { isFirebaseAdminConfigured } from '@/lib/firebase-admin'
import { CollectionNames } from '@/lib/cms-types'

export async function GET() {
  if (!isFirebaseAdminConfigured) {
    return NextResponse.json(
      { error: 'Firebase Admin is not configured' },
      { status: 500 }
    )
  }

  try {
    const db = getAdminDb()
    
    // Check pages/home/sections for duplicates
    const homeSectionsSnap = await db
      .collection(CollectionNames.pages)
      .doc('home')
      .collection('sections')
      .orderBy('order', 'asc')
      .get()

    const sections: Array<{
      id: string
      type: string
      order: number
      isActive: boolean
    }> = []

    const typeCount: Record<string, number> = {}
    const duplicateTypes: string[] = []

    homeSectionsSnap.docs.forEach((doc) => {
      const data = doc.data()
      const section = {
        id: doc.id,
        type: data.type,
        order: data.order,
        isActive: data.isActive,
      }
      sections.push(section)
      
      typeCount[data.type] = (typeCount[data.type] || 0) + 1
      if (typeCount[data.type]! > 1 && !duplicateTypes.includes(data.type)) {
        duplicateTypes.push(data.type)
      }
    })

    return NextResponse.json({
      totalSections: sections.length,
      sections,
      typeCount,
      duplicateTypes,
      hasDuplicates: duplicateTypes.length > 0,
    })
  } catch (error) {
    console.error('Error checking duplicates:', error)
    return NextResponse.json(
      { error: 'Failed to check duplicates', details: (error as Error).message },
      { status: 500 }
    )
  }
}
