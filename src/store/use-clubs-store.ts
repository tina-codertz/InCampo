import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ClubsState = {
  joinedIds: string[];
  memberCounts: Record<string, number>;
  toggleJoin: (id: string, baseMembers: number) => void;
  isJoined: (id: string) => boolean;
  getMemberCount: (id: string, baseMembers: number) => number;
  getJoinedCount: () => number;
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

        set({
          joinedIds: isJoined
            ? joinedIds.filter((joinedId) => joinedId !== id)
            : [...joinedIds, id],
          memberCounts: {
            ...memberCounts,
            [id]: isJoined ? currentCount - 1 : currentCount + 1,
          },
        });
      },
      isJoined: (id) => get().joinedIds.includes(id),
      getMemberCount: (id, baseMembers) => get().memberCounts[id] ?? baseMembers,
      getJoinedCount: () => get().joinedIds.length,
    }),
    {
      name: "incampo-clubs-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
