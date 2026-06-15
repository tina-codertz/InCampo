import { MOCK_EVENTS } from "@/constants/mock-data";
import { mapEvent } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import { withMockFallback } from "@/services/utils";
import type { EventItem } from "@/types";

export async function fetchEvents(client: AppSupabaseClient): Promise<EventItem[]> {
  return withMockFallback(async () => {
    const { data, error } = await client
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return data.map(mapEvent);
  }, MOCK_EVENTS);
}

export async function fetchEventById(
  client: AppSupabaseClient,
  id: string
): Promise<EventItem | null> {
  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return MOCK_EVENTS.find((item) => item.id === id) ?? null;
  }

  return mapEvent(data);
}
