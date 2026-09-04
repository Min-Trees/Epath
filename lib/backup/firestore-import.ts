// Firestore managed import (restore) via REST API.
import 'server-only'

function getGcpCredentials() {
  const projectId = process.env.GCP_SA_PROJECT_ID
  const clientEmail = process.env.GCP_SA_CLIENT_EMAIL
  const privateKey = process.env.GCP_SA_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Thiếu GCP credentials')
  }
  return { projectId, credentials: { client_email: clientEmail, private_key: privateKey.replace(/\\n/g, '\n') } }
}

async function getAccessToken(): Promise<string> {
  const { credentials } = getGcpCredentials()
  const jwt = require('jsonwebtoken')
  const token = jwt.sign(
    { iss: credentials.client_email, scope: 'https://www.googleapis.com/auth/cloud-platform', aud: 'https://oauth2.googleapis.com/token', exp: Math.floor(Date.now() / 1000) + 3600, iat: Math.floor(Date.now() / 1000) },
    credentials.private_key,
    { algorithm: 'RS256' }
  )
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: token }),
  })
  return (await res.json()).access_token
}

export interface ImportResult { operationName: string }

/**
 * Gọi Firestore Managed Import API để restore từ GCS.
 */
export async function importFirestore(gcsUri: string, collections?: string[]): Promise<ImportResult> {
  const { projectId } = getGcpCredentials()
  const accessToken = await getAccessToken()
  const body: Record<string, unknown> = { inputUriPrefix: gcsUri }
  if (collections && collections.length > 0) body.collectionIds = collections

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default):importDocuments`
  const res = await fetch(url, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firestore import failed: ${err}`)
  }

  const data = await res.json()
  return { operationName: data.name || '' }
}
