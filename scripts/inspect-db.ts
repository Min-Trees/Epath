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

async function inspect() {
  console.log('Inspecting Firestore collections...')
  for (const col of collections) {
    try {
      const snap = await db.collection(col).get()
      console.log(`- ${col}: ${snap.size} documents`)
    } catch (err) {
      console.error(`- ${col}: error`, (err as Error).message)
    }
  }
}

inspect().then(() => process.exit(0)).catch((err) => {
  console.error(err)
  process.exit(1)
})
