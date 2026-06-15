import { useQuery } from "@tanstack/react-query";

import { MOCK_CLUBS } from "@/constants/mock-data";
import type { Club } from "@/types";

async function fetchClubs(): Promise<Club[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return MOCK_CLUBS;
}

export function useClubs() {
  return useQuery({
    queryKey: ["clubs"],
    queryFn: fetchClubs,
    staleTime: 1000 * 60 * 5,
  });
}

export function useClub(id: string) {
  return useQuery({
    queryKey: ["clubs", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const club = MOCK_CLUBS.find((item) => item.id === id);
      if (!club) {
        throw new Error("Club not found");
      }
      return club;
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function filterClubs(
  clubs: Club[],
  query: string,
  category: string,
  featuredOnly = false
) {
  const normalizedQuery = query.trim().toLowerCase();

  return clubs.filter((club) => {
    const matchesQuery =
      !normalizedQuery ||
      club.name.toLowerCase().includes(normalizedQuery) ||
      club.description.toLowerCase().includes(normalizedQuery) ||
      club.category.toLowerCase().includes(normalizedQuery);

    const matchesCategory = category === "All" || club.category === category;
    const matchesFeatured = !featuredOnly || club.featured;

    return matchesQuery && matchesCategory && matchesFeatured;
  });
}
