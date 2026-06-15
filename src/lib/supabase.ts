import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";
import type { Database } from "@/types/database";

export type AppSupabaseClient = SupabaseClient<Database>;

export function isSupabaseConfigured() {
  return Boolean(env.supabaseUrl && env.supabaseAnonKey);
}

export const supabase = createClient<Database>(
  env.supabaseUrl,
  env.supabaseAnonKey
);

export function createSupabaseClient(
  getAccessToken?: () => Promise<string | null>
): AppSupabaseClient {
  if (!getAccessToken) {
    return supabase;
  }

  return createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
    accessToken: getAccessToken,
  });
}
