import { mapProfile, profileToRow } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import type { UserProfile } from "@/store/use-profile-store";

export async function fetchProfile(
  client: AppSupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfile(data);
}

export async function upsertProfile(
  client: AppSupabaseClient,
  userId: string,
  profile: UserProfile
) {
  const row = profileToRow(userId, profile);

  const { error } = await client.from("profiles").upsert(row, {
    onConflict: "user_id",
  });

  if (error) {
    throw error;
  }
}

export async function ensureProfile(
  client: AppSupabaseClient,
  userId: string,
  defaults: UserProfile
) {
  const existing = await fetchProfile(client, userId);
  if (existing) {
    return existing;
  }

  await upsertProfile(client, userId, defaults);
  return defaults;
}
