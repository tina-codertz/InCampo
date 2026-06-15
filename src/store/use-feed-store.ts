import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getEngagementContext } from "@/lib/engagement-context";
import { syncBookmark, syncLike } from "@/services/engagement";

type FeedState = {
  likedIds: string[];
  bookmarkedIds: string[];
  likeCounts: Record<string, number>;
  toggleLike: (id: string, baseCount: number) => void;
  toggleBookmark: (id: string) => void;
  isLiked: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getLikeCount: (id: string, baseCount: number) => number;
  hydrate: (data: { likedIds?: string[]; bookmarkedIds?: string[] }) => void;
};

export const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      likedIds: [],
      bookmarkedIds: [],
      likeCounts: {},
      toggleLike: (id, baseCount) => {
        const { likedIds, likeCounts } = get();
        const isLiked = likedIds.includes(id);
        const currentCount = likeCounts[id] ?? baseCount;
        const nextLiked = !isLiked;

        set({
          likedIds: nextLiked
            ? [...likedIds, id]
            : likedIds.filter((likedId) => likedId !== id),
          likeCounts: {
            ...likeCounts,
            [id]: nextLiked ? currentCount + 1 : currentCount - 1,
          },
        });

        const context = getEngagementContext();
        if (context) {
          void syncLike(context.client, context.clerkId, id, nextLiked);
        }
      },
      toggleBookmark: (id) => {
        const { bookmarkedIds } = get();
        const isBookmarked = bookmarkedIds.includes(id);
        const nextBookmarked = !isBookmarked;

        set({
          bookmarkedIds: nextBookmarked
            ? [...bookmarkedIds, id]
            : bookmarkedIds.filter((bookmarkedId) => bookmarkedId !== id),
        });

        const context = getEngagementContext();
        if (context) {
          void syncBookmark(context.client, context.clerkId, id, nextBookmarked);
        }
      },
      isLiked: (id) => get().likedIds.includes(id),
      isBookmarked: (id) => get().bookmarkedIds.includes(id),
      getLikeCount: (id, baseCount) => get().likeCounts[id] ?? baseCount,
      hydrate: ({ likedIds, bookmarkedIds }) =>
        set((state) => ({
          likedIds: likedIds ?? state.likedIds,
          bookmarkedIds: bookmarkedIds ?? state.bookmarkedIds,
        })),
    }),
    {
      name: "incampo-feed-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
