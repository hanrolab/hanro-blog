import { getEnv } from './env'

function getD1Api(): string {
  const env = getEnv()
  return `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/d1/database/${env.D1_DATABASE_ID}/query`
}

export async function queryD1<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const env = getEnv()
  const res = await fetch(getD1Api(), {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, params }),
  })
  const data = (await res.json()) as { result?: { results?: T[] }[] }
  return data.result?.[0]?.results ?? []
}
