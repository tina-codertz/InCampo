import { useQuery } from "@tanstack/react-query";

import { fetchClubById, fetchClubs } from "@/services/clubs";
import { useSupabase } from "@/hooks/use-supabase";
import type { Club } from "@/types";

export function useClubs() {
  const client = useSupabase();

  return useQuery({
    queryKey: ["clubs"],
    queryFn: () => fetchClubs(client),
    staleTime: 1000 * 60 * 5,
  });
}

export function useClub(id: string) {
  const client = useSupabase();

  return useQuery({
    queryKey: ["clubs", id],
    queryFn: async () => {
      const club = await fetchClubById(client, id);
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
