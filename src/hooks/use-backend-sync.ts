import { useEffect } from "react";

import { setEngagementContext } from "@/lib/engagement-context";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useSupabase } from "@/hooks/use-supabase";
import { useAuth } from "@/providers/auth-provider";
import { fetchEngagement } from "@/services/engagement";
import { syncProfile } from "@/services/profiles";
import { useClubsStore } from "@/store/use-clubs-store";
import { useEventsStore } from "@/store/use-events-store";
import { useFeedStore } from "@/store/use-feed-store";
import { useProfileStore } from "@/store/use-profile-store";

export function useBackendSync() {
  const { isSignedIn, userId, user } = useAuth();
  const client = useSupabase();
  const hydrateFeed = useFeedStore((state) => state.hydrate);
  const hydrateEvents = useEventsStore((state) => state.hydrate);
  const hydrateClubs = useClubsStore((state) => state.hydrate);
  const replaceProfile = useProfileStore((state) => state.replaceProfile);

  useEffect(() => {
    if (!isSignedIn || !userId || !user || !isSupabaseConfigured()) {
      setEngagementContext(null);
      return;
    }

    const activeUserId = userId;
    const activeUser = user;
    setEngagementContext({ userId: activeUserId, client });

    let cancelled = false;

    async function sync() {
      const localProfile = useProfileStore.getState().profile;

      try {
        const remoteProfile = await syncProfile(
          client,
          activeUserId,
          activeUser,
          localProfile
        );
        if (!cancelled) {
          replaceProfile(remoteProfile);
        }
      } catch {
        // Profile sync is best-effort during auth bootstrap.
      }

      try {
        const engagement = await fetchEngagement(client, activeUserId);
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
    replaceProfile,
    user,
    userId,
  ]);
}
