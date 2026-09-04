// Restore utilities - backup management (deletion, GCS cleanup).
// Uses REST API for GCS operations instead of SDK.
import 'server-only'

function getGcpCredentials() {
  const projectId = process.env.GCP_SA_PROJECT_ID
  const clientEmail = process.env.GCP_SA_CLIENT_EMAIL
  const privateKey = process.env.GCP_SA_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Thiếu GCP credentials')
  }
  return {
    projectId,
    credentials: {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    },
  }
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

/**
 * Xóa tất cả objects trong GCS prefix của một backup.
 */
export async function deleteGcsPrefix(gcsPrefix: string): Promise<void> {
  const accessToken = await getAccessToken()
  const bucket = gcsPrefix.replace(/^gs:\/\//, '').split('/')[0]
  const prefix = gcsPrefix.replace(/^gs:\/\/[^\/]+\//, '')

  try {
    const url = `https://storage.googleapis.com/storage/v1/b/${bucket}/o?prefix=${encodeURIComponent(prefix)}`
    const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } })
    if (!res.ok) return
    const data = await res.json()
    const items: Array<{ name: string }> = data.items || []
    await Promise.all(
      items.map((item) =>
        fetch(`https://storage.googleapis.com/storage/v1/b/${bucket}/o/${encodeURIComponent(item.name)}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      )
    )
  } catch {
    // Ignore errors - object có thể không tồn tại
  }
}
