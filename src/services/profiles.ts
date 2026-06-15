import { mapProfile, profileToRow } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import type { UserProfile } from "@/store/use-profile-store";

export async function fetchProfile(
  client: AppSupabaseClient,
  clerkId: string
): Promise<UserProfile | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("clerk_id", clerkId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return mapProfile(data);
}

export async function upsertProfile(
  client: AppSupabaseClient,
  clerkId: string,
  profile: UserProfile
) {
  const row = profileToRow(clerkId, profile);

  const { error } = await client.from("profiles").upsert(row, {
    onConflict: "clerk_id",
  });

  if (error) {
    throw error;
  }
}

export async function ensureProfile(
  client: AppSupabaseClient,
  clerkId: string,
  defaults: UserProfile
) {
  const existing = await fetchProfile(client, clerkId);
  if (existing) {
    return existing;
  }

  await upsertProfile(client, clerkId, defaults);
  return defaults;
}
