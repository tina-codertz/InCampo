import { useQuery } from "@tanstack/react-query";

import { MOCK_EVENTS } from "@/constants/mock-data";
import type { EventItem } from "@/types";

async function fetchEvents(): Promise<EventItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_EVENTS;
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
    staleTime: 1000 * 60 * 5,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const event = MOCK_EVENTS.find((item) => item.id === id);
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
