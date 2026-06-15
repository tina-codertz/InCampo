import { MOCK_ANNOUNCEMENTS } from "@/constants/mock-data";
import { mapAnnouncement } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import { withMockFallback } from "@/services/utils";
import type { Announcement } from "@/types";

export async function fetchAnnouncements(
  client: AppSupabaseClient
): Promise<Announcement[]> {
  return withMockFallback(async () => {
    const { data, error } = await client
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapAnnouncement);
  }, MOCK_ANNOUNCEMENTS);
}

export async function fetchAnnouncementById(
  client: AppSupabaseClient,
  id: string
): Promise<Announcement | null> {
  const { data, error } = await client
    .from("announcements")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return MOCK_ANNOUNCEMENTS.find((item) => item.id === id) ?? null;
  }

  return mapAnnouncement(data);
}
