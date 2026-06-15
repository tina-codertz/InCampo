import { useQuery } from "@tanstack/react-query";

import { MOCK_ANNOUNCEMENTS } from "@/constants/mock-data";
import type { Announcement } from "@/types";

async function fetchAnnouncements(): Promise<Announcement[]> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return MOCK_ANNOUNCEMENTS;
}

export function useAnnouncements() {
  return useQuery({
    queryKey: ["announcements"],
    queryFn: fetchAnnouncements,
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
