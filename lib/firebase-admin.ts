// Firebase Admin SDK for server-side operations (API routes, middleware).
// Uses Application Default Credentials in production environments.
import 'server-only'
import {
  cert,
  getApp,
  getApps,
  initializeApp,
  type App,
} from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let adminApp: App | null = null
let adminAuth: Auth | null = null
let adminDb: Firestore | null = null

export const isFirebaseAdminConfigured = Boolean(
  process.env.FIREBASE_ADMIN_PROJECT_ID &&
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    process.env.FIREBASE_ADMIN_PRIVATE_KEY
)

function ensureAdminApp(): App {
  if (adminApp) return adminApp
  if (getApps().length) {
    adminApp = getApp()
    return adminApp
  }
  if (!isFirebaseAdminConfigured) {
    throw new Error('Firebase Admin SDK is not configured. Set FIREBASE_ADMIN_* env vars.')
  }
  adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // The private key is stored as a single-line PEM string with escaped \n
      privateKey: (process.env.FIREBASE_ADMIN_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
    }),
  })
  return adminApp
}

export function getAdminAuth(): Auth {
  if (!adminAuth) adminAuth = getAuth(ensureAdminApp())
  return adminAuth
}

export function getAdminDb(): Firestore {
  if (!adminDb) adminDb = getFirestore(ensureAdminApp())
  return adminDb
}