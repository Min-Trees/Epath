import dotenv from 'dotenv'
import path from 'path'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { DEFAULT_PARTNERS, DEFAULT_PARTNERS_CONTENT } from '../lib/default-partners'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
const privateKey = (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n')

if (!projectId || !clientEmail || !privateKey) {
  console.error('Missing Firebase Admin environment variables!')
  process.exit(1)
}

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })

const db = getFirestore(app)
db.settings({ ignoreUndefinedProperties: true })

function cleanUndefined<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      result[k] = v
    }
  }
  return result as T
}

async function run() {
  console.log('Syncing partners to Firestore...')
  const partnersCol = db.collection('partners')
  const batch = db.batch()

  for (const p of DEFAULT_PARTNERS) {
    const docRef = partnersCol.doc(p.id)
    const cleaned = cleanUndefined(p as unknown as Record<string, unknown>)
    batch.set(docRef, cleaned, { merge: true })
    console.log(`- Upserting partner: ${p.id} (${p.name})`)
  }

  // Also sync partners-content if not existing
  const pcCol = db.collection('partners-content')
  const pcSnap = await pcCol.limit(1).get()
  if (pcSnap.empty) {
    const pcDoc = pcCol.doc('default')
    const cleanedContent = cleanUndefined(DEFAULT_PARTNERS_CONTENT as unknown as Record<string, unknown>)
    batch.set(pcDoc, cleanedContent, { merge: true })
    console.log('- Initialized partners-content document: default')
  } else {
    console.log(`- partners-content document already exists (${pcSnap.docs[0].id})`)
  }

  await batch.commit()
  console.log('Partners and partners-content successfully synced to Firestore!')
}

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
