import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type FeedState = {
  likedIds: string[];
  bookmarkedIds: string[];
  likeCounts: Record<string, number>;
  toggleLike: (id: string, baseCount: number) => void;
  toggleBookmark: (id: string) => void;
  isLiked: (id: string) => boolean;
  isBookmarked: (id: string) => boolean;
  getLikeCount: (id: string, baseCount: number) => number;
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

        set({
          likedIds: isLiked
            ? likedIds.filter((likedId) => likedId !== id)
            : [...likedIds, id],
          likeCounts: {
            ...likeCounts,
            [id]: isLiked ? currentCount - 1 : currentCount + 1,
          },
        });
      },
      toggleBookmark: (id) => {
        const { bookmarkedIds } = get();
        const isBookmarked = bookmarkedIds.includes(id);

        set({
          bookmarkedIds: isBookmarked
            ? bookmarkedIds.filter((bookmarkedId) => bookmarkedId !== id)
            : [...bookmarkedIds, id],
        });
      },
      isLiked: (id) => get().likedIds.includes(id),
      isBookmarked: (id) => get().bookmarkedIds.includes(id),
      getLikeCount: (id, baseCount) => get().likeCounts[id] ?? baseCount,
    }),
    {
      name: "incampo-feed-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
