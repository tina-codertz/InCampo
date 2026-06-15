import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getEngagementContext } from "@/lib/engagement-context";
import { syncClubJoin } from "@/services/engagement";

type ClubsState = {
  joinedIds: string[];
  memberCounts: Record<string, number>;
  toggleJoin: (id: string, baseMembers: number) => void;
  isJoined: (id: string) => boolean;
  getMemberCount: (id: string, baseMembers: number) => number;
  getJoinedCount: () => number;
  hydrate: (data: { joinedIds?: string[] }) => void;
};

export const useClubsStore = create<ClubsState>()(
  persist(
    (set, get) => ({
      joinedIds: ["2"],
      memberCounts: {},
      toggleJoin: (id, baseMembers) => {
        const { joinedIds, memberCounts } = get();
        const isJoined = joinedIds.includes(id);
        const currentCount = memberCounts[id] ?? baseMembers;
        const nextJoined = !isJoined;

        set({
          joinedIds: nextJoined
            ? [...joinedIds, id]
            : joinedIds.filter((joinedId) => joinedId !== id),
          memberCounts: {
            ...memberCounts,
            [id]: nextJoined ? currentCount + 1 : currentCount - 1,
          },
        });

        const context = getEngagementContext();
        if (context) {
          void syncClubJoin(context.client, context.userId, id, nextJoined);
        }
      },
      isJoined: (id) => get().joinedIds.includes(id),
      getMemberCount: (id, baseMembers) => get().memberCounts[id] ?? baseMembers,
      getJoinedCount: () => get().joinedIds.length,
      hydrate: ({ joinedIds }) =>
        set((state) => ({
          joinedIds: joinedIds ?? state.joinedIds,
        })),
    }),
    {
      name: "incampo-clubs-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
