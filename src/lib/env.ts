import { z } from 'zod'

const serverEnvSchema = z.object({
  // Always required
  JWT_SECRET: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),

  // Only needed for local dev REST API fallback (production uses D1/R2 bindings)
  CLOUDFLARE_ACCOUNT_ID: z.string().min(1).optional(),
  D1_DATABASE_ID: z.string().min(1).optional(),
  CLOUDFLARE_API_TOKEN: z.string().min(1).optional(),
  R2_ENDPOINT: z.string().min(1).optional(),
  R2_ACCESS_KEY_ID: z.string().min(1).optional(),
  R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
  R2_BUCKET_NAME: z.string().min(1).optional(),
  R2_PUBLIC_URL: z.string().optional(),
})

type ServerEnv = z.infer<typeof serverEnvSchema>

let _cache: ServerEnv | undefined

export function getEnv(): ServerEnv {
  if (!_cache) {
    const result = serverEnvSchema.safeParse(process.env)
    if (!result.success) {
      const missing = result.error.issues.map((i) => i.path.join('.')).join(', ')
      throw new Error(`Missing or invalid environment variables: ${missing}`)
    }
    _cache = result.data
  }
  return _cache
}
