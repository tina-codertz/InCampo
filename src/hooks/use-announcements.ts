import { useQuery } from "@tanstack/react-query";

import { fetchAnnouncements } from "@/services/announcements";
import { useSupabase } from "@/hooks/use-supabase";
import type { Announcement } from "@/types";

export function useAnnouncements() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["announcements"],
    queryFn: () => fetchAnnouncements(client),
    staleTime: 1000 * 60 * 5,
  });
}

export function filterAnnouncements(
  announcements: Announcement[],
  query: string,
  tag?: string
) {
  const normalizedQuery = query.trim().toLowerCase();
  const normalizedTag = tag?.replace("#", "").toLowerCase();

  return announcements.filter((announcement) => {
    const matchesQuery =
      !normalizedQuery ||
      announcement.title.toLowerCase().includes(normalizedQuery) ||
      announcement.body.toLowerCase().includes(normalizedQuery) ||
      announcement.authorName.toLowerCase().includes(normalizedQuery) ||
      announcement.tags.some((item) => item.toLowerCase().includes(normalizedQuery));

    const matchesTag =
      !normalizedTag ||
      announcement.tags.some((item) =>
        item.toLowerCase().includes(normalizedTag)
      ) ||
      announcement.title.toLowerCase().includes(normalizedTag) ||
      announcement.body.toLowerCase().includes(normalizedTag);

    return matchesQuery && matchesTag;
  });
}
