// Firestore managed export via REST API (v1/projects/{projectId}/databases/{db}:exportDocuments).
// Exports all CMS collections to GCS bucket.
import 'server-only'

function getGcpCredentials() {
  const projectId = process.env.GCP_SA_PROJECT_ID
  const clientEmail = process.env.GCP_SA_CLIENT_EMAIL
  const privateKey = process.env.GCP_SA_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Thiếu biến môi trường GCP: GCP_SA_PROJECT_ID, GCP_SA_CLIENT_EMAIL, GCP_SA_PRIVATE_KEY')
  }

  return {
    projectId,
    credentials: {
      type: 'service_account',
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  }
}

async function getAccessToken(): Promise<string> {
  const { credentials } = getGcpCredentials()
  const jwt = require('jsonwebtoken')
  const token = jwt.sign(
    {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/cloud-platform',
      aud: 'https://oauth2.googleapis.com/token',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    },
    credentials.private_key,
    { algorithm: 'RS256' }
  )

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token,
    }),
  })
  const data = await res.json()
  return data.access_token
}

export interface ExportResult {
  gcsPrefix: string
  operationName: string
}

/**
 * Gọi Firestore Managed Export API để export tất cả collections.
 */
export async function exportFirestore(collections: string[] = []): Promise<ExportResult> {
  const { projectId } = getGcpCredentials()
  const bucket = process.env.BACKUP_GCS_BUCKET || `${projectId}-backups`
  const accessToken = await getAccessToken()

  const prefix = `backups/${projectId}/${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}`
  const outputUriPrefix = `gs://${bucket}/${prefix}`

  const body: Record<string, unknown> = { outputUriPrefix }
  if (collections.length > 0) {
    body.collectionIds = collections
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default):exportDocuments`
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Firestore export failed: ${err}`)
  }

  const data = await res.json()
  return {
    gcsPrefix: outputUriPrefix,
    operationName: data.name || '',
  }
}
