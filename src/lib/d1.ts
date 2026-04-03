import { getCfEnv } from './cloudflare'
import { getEnv } from './env'

export async function queryD1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const cf = await getCfEnv()

  // Production: use D1 binding directly
  if (cf?.DB) {
    const stmt = cf.DB.prepare(sql).bind(...params)
    const result = await stmt.all<T>()
    return result.results ?? []
  }

  // Local dev fallback: REST API
  const env = getEnv()
  if (!env.CLOUDFLARE_ACCOUNT_ID || !env.D1_DATABASE_ID || !env.CLOUDFLARE_API_TOKEN) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID, D1_DATABASE_ID, and CLOUDFLARE_API_TOKEN are required for local dev')
  }
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.D1_DATABASE_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  )
  const data = (await res.json()) as { result?: { results?: T[] }[] }
  return data.result?.[0]?.results ?? []
}
