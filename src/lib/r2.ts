import { AwsClient } from 'aws4fetch'
import { getCfEnv } from './cloudflare'
import { getEnv } from './env'

let _aws: AwsClient | null = null

function getAwsClient(): AwsClient {
  if (!_aws) {
    const env = getEnv()
    if (!env.R2_ACCESS_KEY_ID || !env.R2_SECRET_ACCESS_KEY) {
      throw new Error('R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required for local dev')
    }
    _aws = new AwsClient({
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    })
  }
  return _aws
}

function getR2Url(key: string): string {
  const env = getEnv()
  if (!env.R2_ENDPOINT || !env.R2_BUCKET_NAME) {
    throw new Error('R2_ENDPOINT and R2_BUCKET_NAME are required for local dev')
  }
  return `${env.R2_ENDPOINT}/${env.R2_BUCKET_NAME}/${key}`
}

export async function uploadToR2(key: string, body: Buffer | Uint8Array, contentType: string): Promise<void> {
  const cf = await getCfEnv()

  if (cf?.BUCKET) {
    await cf.BUCKET.put(key, body, { httpMetadata: { contentType } })
    return
  }

  // Local dev fallback: aws4fetch (S3-compatible API)
  await getAwsClient().fetch(getR2Url(key), {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: body as unknown as BodyInit,
  })
}

export async function getFromR2(key: string): Promise<{ body: Uint8Array; contentType: string } | null> {
  const cf = await getCfEnv()

  if (cf?.BUCKET) {
    const obj = await cf.BUCKET.get(key)
    if (!obj) return null
    const body = new Uint8Array(await obj.arrayBuffer())
    return { body, contentType: obj.httpMetadata?.contentType ?? 'application/octet-stream' }
  }

  // Local dev fallback
  const res = await getAwsClient().fetch(getR2Url(key), { method: 'GET' })
  if (!res.ok) return null
  const body = new Uint8Array(await res.arrayBuffer())
  return { body, contentType: res.headers.get('content-type') ?? 'application/octet-stream' }
}

export async function deleteFromR2(key: string): Promise<void> {
  const cf = await getCfEnv()

  if (cf?.BUCKET) {
    await cf.BUCKET.delete(key)
    return
  }

  await getAwsClient().fetch(getR2Url(key), { method: 'DELETE' })
}

export function buildFileKey(folder: string, fileName: string): string {
  const timestamp = Date.now()
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${folder}/${timestamp}_${sanitized}`
}
