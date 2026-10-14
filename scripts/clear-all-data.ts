import { config } from 'dotenv'
config({ path: '.env.local' })

import { cert, initializeApp, getApps } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')
const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey,
      }),
    })

const db = getFirestore(app)

const collections = [
  'faqs',
  'programs',
  'partners',
  'events',
  'core-values',
  'learning-pathways',
  'admission-steps',
  'achievements',
  'team-members',
  'statistics',
  'testimonials',
  'site-settings',
  'hero-content',
  'about-content',
  'blog-posts',
  'leads',
  'pages',
]

async function clearCollection(name: string) {
  const snap = await db.collection(name).get()
  if (snap.empty) {
    console.log(`[CLEARED] ${name}: 0 docs (already empty)`)
    return
  }

  // Delete subcollections if any (for pages)
  for (const doc of snap.docs) {
    if (name === 'pages') {
      const subSnap = await doc.ref.collection('sections').get()
      const subBatch = db.batch()
      subSnap.docs.forEach((sDoc) => subBatch.delete(sDoc.ref))
      await subBatch.commit()
    }
  }

  const batch = db.batch()
  snap.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
  console.log(`[CLEARED] ${name}: deleted ${snap.size} docs`)
}

async function main() {
  console.log('--- STARTING WIPE OF ALL FIRESTORE DATA ---')
  for (const col of collections) {
    try {
      await clearCollection(col)
    } catch (err) {
      console.error(`Error clearing ${col}:`, (err as Error).message)
    }
  }
  console.log('--- ALL FIRESTORE DATA CLEARED SUCCESSFULLY ---')
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
