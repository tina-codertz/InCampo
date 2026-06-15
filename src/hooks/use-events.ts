import { useQuery } from "@tanstack/react-query";

import { fetchEventById, fetchEvents } from "@/services/events";
import { useSupabase } from "@/hooks/use-supabase";
import type { EventItem } from "@/types";

export function useEvents() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["events"],
    queryFn: () => fetchEvents(client),
    staleTime: 1000 * 60 * 5,
  });
}

export function useEvent(id: string) {
  const client = useSupabase();

  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      const event = await fetchEventById(client, id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function filterEvents(
  events: EventItem[],
  query: string,
  category: string,
  featuredOnly = false
) {
  const normalizedQuery = query.trim().toLowerCase();

  return events.filter((event) => {
    const matchesQuery =
      !normalizedQuery ||
      event.title.toLowerCase().includes(normalizedQuery) ||
      event.location.toLowerCase().includes(normalizedQuery) ||
      event.host.toLowerCase().includes(normalizedQuery) ||
      event.description.toLowerCase().includes(normalizedQuery);

    const matchesCategory =
      category === "All" || event.category === category;

    const matchesFeatured = !featuredOnly || event.featured;

    return matchesQuery && matchesCategory && matchesFeatured;
  });
}
