import { env } from "@/lib/env";

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export async function withMockFallback<T>(
  fetcher: () => Promise<T | null | undefined>,
  fallback: T
): Promise<T> {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const result = await fetcher();
    if (result === null || result === undefined) {
      return fallback;
    }

    if (Array.isArray(result) && result.length === 0) {
      return fallback;
    }

    return result;
  } catch {
    return fallback;
  }
}
