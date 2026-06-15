import type { User } from "@supabase/supabase-js";

import {
  isDemoProfile,
  mergeProfiles,
  profileFromAuthUser,
} from "@/lib/profile-from-auth";
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

export async function syncProfile(
  client: AppSupabaseClient,
  userId: string,
  user: User,
  localProfile: UserProfile
): Promise<UserProfile> {
  const authProfile = profileFromAuthUser(user);
  const existing = await fetchProfile(client, userId);

  if (existing && !isDemoProfile(existing)) {
    return mergeProfiles(authProfile, existing);
  }

  const safeLocal = isDemoProfile(localProfile) ? authProfile : localProfile;
  const nextProfile = mergeProfiles(authProfile, safeLocal);

  await upsertProfile(client, userId, nextProfile);
  return nextProfile;
}
