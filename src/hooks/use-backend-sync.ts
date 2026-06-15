import { useAuth } from "@clerk/clerk-expo";
import { useEffect } from "react";

import { setEngagementContext } from "@/lib/engagement-context";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import { fetchEngagement } from "@/services/engagement";
import { ensureProfile } from "@/services/profiles";
import { useClubsStore } from "@/store/use-clubs-store";
import { useEventsStore } from "@/store/use-events-store";
import { useFeedStore } from "@/store/use-feed-store";
import { useProfileStore } from "@/store/use-profile-store";

export function useBackendSync() {
  const { isSignedIn, userId } = useAuth();
  const client = useSupabase();
  const hydrateFeed = useFeedStore((state) => state.hydrate);
  const hydrateEvents = useEventsStore((state) => state.hydrate);
  const hydrateClubs = useClubsStore((state) => state.hydrate);
  const setProfile = useProfileStore((state) => state.setProfile);

  useEffect(() => {
    if (!isSignedIn || !userId || !isSupabaseConfigured()) {
      setEngagementContext(null);
      return;
    }

    setEngagementContext({ clerkId: userId, client });

    let cancelled = false;

    async function sync() {
      if (!userId) {
        return;
      }

      const localProfile = useProfileStore.getState().profile;

      try {
        const remoteProfile = await ensureProfile(client, userId, localProfile);
        if (!cancelled && remoteProfile) {
          setProfile(remoteProfile);
        }
      } catch {
        // Profile sync is best-effort during auth bootstrap.
      }

      try {
        const engagement = await fetchEngagement(client, userId);
        if (cancelled) {
          return;
        }

        hydrateFeed({
          likedIds: engagement.likedIds,
          bookmarkedIds: engagement.bookmarkedIds,
        });
        hydrateEvents({ goingIds: engagement.goingIds });
        hydrateClubs({ joinedIds: engagement.joinedIds });
      } catch {
        // Engagement sync falls back to persisted local state.
      }
    }

    void sync();

    return () => {
      cancelled = true;
      setEngagementContext(null);
    };
  }, [
    client,
    hydrateClubs,
    hydrateEvents,
    hydrateFeed,
    isSignedIn,
    setProfile,
    userId,
  ]);
}
