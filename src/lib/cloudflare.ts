// Minimal Cloudflare Workers types (avoids heavy @cloudflare/workers-types)
interface D1Result<T> {
  results: T[];
  success: boolean;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run(): Promise<D1Result<unknown>>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}

export interface D1DatabaseBinding {
  prepare(query: string): D1PreparedStatement;
}

export interface R2ObjectBody {
  arrayBuffer(): Promise<ArrayBuffer>;
  httpMetadata?: { contentType?: string };
}

export interface R2BucketBinding {
  put(key: string, value: ArrayBuffer | Uint8Array | ReadableStream | string, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
  get(key: string): Promise<R2ObjectBody | null>;
  delete(key: string): Promise<void>;
}

declare global {
  interface CloudflareEnv {
    DB: D1DatabaseBinding;
    BUCKET: R2BucketBinding;
  }
}

/**
 * Try to get Cloudflare bindings.
 * - Development: skips entirely, returns null (uses REST API fallback)
 * - Production: dynamically imports @opennextjs/cloudflare for bindings
 */
export async function getCfEnv(): Promise<CloudflareEnv | null> {
  if (process.env.NODE_ENV === 'development') {
    return null;
  }
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    return getCloudflareContext({ async: false }).env;
  } catch {
    return null;
  }
}
