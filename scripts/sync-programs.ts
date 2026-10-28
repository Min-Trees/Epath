import dotenv from 'dotenv'
import path from 'path'
import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { DEFAULT_PROGRAMS } from '../lib/default-programs'

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
const programsCol = db.collection('programs')

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
  console.log('Fetching current Firestore programs...')
  const snapshot = await programsCol.get()
  console.log(`Found ${snapshot.size} current documents in programs collection.`)

  const currentDocs = snapshot.docs.map((d) => ({ id: d.id, slug: d.data().slug }))
  console.log('Current docs:', currentDocs)

  // Desired programs:
  console.log(`Writing ${DEFAULT_PROGRAMS.length} programs from DEFAULT_PROGRAMS...`)
  const batch = db.batch()

  const validSlugs = new Set(DEFAULT_PROGRAMS.map((p) => p.slug))
  const validIds = new Set(DEFAULT_PROGRAMS.map((p) => p.slug))

  for (const prog of DEFAULT_PROGRAMS) {
    const docId = prog.slug // Use slug as docId for clean deterministic keys
    const docRef = programsCol.doc(docId)
    // Strip id from data to let doc.id serve as id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...data } = prog
    const cleaned = cleanUndefined({
      ...data,
      id: docId,
      updatedAt: new Date().toISOString(),
    })
    batch.set(docRef, cleaned, { merge: true })
    console.log(`- Queued program: ${docId} (level: ${prog.level})`)
  }

  // Delete legacy docs whose IDs or slugs are not in the 13 programs
  for (const doc of snapshot.docs) {
    const data = doc.data()
    const docId = doc.id
    const slug = data.slug
    if (!validSlugs.has(slug) && !validIds.has(docId)) {
      console.log(`- Deleting legacy doc: ${docId} (slug: ${slug})`)
      batch.delete(doc.ref)
    }
  }

  await batch.commit()
  console.log('Firestore programs collection synced successfully!')
}

run().catch((err) => {
  console.error('Error syncing programs:', err)
  process.exit(1)
})
