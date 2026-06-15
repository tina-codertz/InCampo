import { MOCK_CLUBS } from "@/constants/mock-data";
import { mapClub } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import { withMockFallback } from "@/services/utils";
import type { Club } from "@/types";

export async function fetchClubs(client: AppSupabaseClient): Promise<Club[]> {
  return withMockFallback(async () => {
    const { data, error } = await client
      .from("clubs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapClub);
  }, MOCK_CLUBS);
}

export async function fetchClubById(
  client: AppSupabaseClient,
  id: string
): Promise<Club | null> {
  const { data, error } = await client
    .from("clubs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return MOCK_CLUBS.find((item) => item.id === id) ?? null;
  }

  return mapClub(data);
}
