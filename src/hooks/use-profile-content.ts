import { useMemo } from "react";

import {
  MOCK_ANNOUNCEMENTS,
  MOCK_CLUBS,
  MOCK_EVENTS,
} from "@/constants/mock-data";
import { useClubsStore } from "@/store/use-clubs-store";
import { useEventsStore } from "@/store/use-events-store";
import { useFeedStore } from "@/store/use-feed-store";
import { useProfileStore } from "@/store/use-profile-store";
import type {
  ProfileActivityItem,
  ProfileSavedItem,
} from "@/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80";

export function useProfileStats() {
  const postCount = useProfileStore((state) => state.profile.postCount);
  const likedIds = useFeedStore((state) => state.likedIds);
  const bookmarkedIds = useFeedStore((state) => state.bookmarkedIds);
  const joinedClubCount = useClubsStore((state) => state.getJoinedCount());
  const goingCount = useEventsStore((state) => state.goingIds.length);

  return useMemo(
    () => ({
      posts: postCount,
      clubs: joinedClubCount,
      saved: bookmarkedIds.length,
      liked: likedIds.length,
      comments: Math.max(likedIds.length * 2, 0),
      events: goingCount,
    }),
    [
      postCount,
      joinedClubCount,
      bookmarkedIds.length,
      likedIds.length,
      goingCount,
    ]
  );
}

export function useProfileSavedItems() {
  const bookmarkedIds = useFeedStore((state) => state.bookmarkedIds);

  return useMemo(() => {
    const items: ProfileSavedItem[] = [];

    for (const id of bookmarkedIds) {
      const announcement = MOCK_ANNOUNCEMENTS.find((item) => item.id === id);
      if (announcement) {
        items.push({
          id: announcement.id,
          title: announcement.title,
          subtitle: announcement.authorName,
          imageUrl: announcement.imageUrl ?? FALLBACK_IMAGE,
          href: "/(tabs)/home",
        });
        continue;
      }

      const event = MOCK_EVENTS.find((item) => item.id === id);
      if (event) {
        items.push({
          id: event.id,
          title: event.title,
          subtitle: event.date,
          imageUrl: event.imageUrl,
          href: `/event/${event.id}`,
        });
        continue;
      }

      const club = MOCK_CLUBS.find((item) => item.id === id);
      if (club) {
        items.push({
          id: club.id,
          title: club.name,
          subtitle: club.category,
          imageUrl: club.imageUrl,
          href: `/club/${club.id}`,
        });
      }
    }

    return items;
  }, [bookmarkedIds]);
}

export function useProfileActivityItems() {
  const likedIds = useFeedStore((state) => state.likedIds);
  const bookmarkedIds = useFeedStore((state) => state.bookmarkedIds);
  const goingIds = useEventsStore((state) => state.goingIds);
  const joinedIds = useClubsStore((state) => state.joinedIds);

  return useMemo(() => {
    const items: ProfileActivityItem[] = [];

    for (const id of likedIds) {
      const announcement = MOCK_ANNOUNCEMENTS.find((item) => item.id === id);
      if (announcement) {
        items.push({
          id: `like-${id}`,
          type: "like",
          title: announcement.title,
          subtitle: "You liked this announcement",
          timestamp: announcement.timestamp,
          imageUrl: announcement.imageUrl,
        });
      }
    }

    for (const id of bookmarkedIds) {
      const announcement = MOCK_ANNOUNCEMENTS.find((item) => item.id === id);
      if (announcement) {
        items.push({
          id: `save-${id}`,
          type: "bookmark",
          title: announcement.title,
          subtitle: "You saved this announcement",
          timestamp: announcement.timestamp,
          imageUrl: announcement.imageUrl,
        });
      }
    }

    for (const id of goingIds) {
      const event = MOCK_EVENTS.find((item) => item.id === id);
      if (event) {
        items.push({
          id: `rsvp-${id}`,
          type: "rsvp",
          title: event.title,
          subtitle: `RSVP'd · ${event.date}`,
          timestamp: "Recently",
          imageUrl: event.imageUrl,
          href: `/event/${event.id}`,
        });
      }
    }

    for (const id of joinedIds) {
      const club = MOCK_CLUBS.find((item) => item.id === id);
      if (club) {
        items.push({
          id: `join-${id}`,
          type: "join",
          title: club.name,
          subtitle: "You joined this club",
          timestamp: "Recently",
          imageUrl: club.imageUrl,
          href: `/club/${club.id}`,
        });
      }
    }

    return items;
  }, [bookmarkedIds, joinedIds, likedIds, goingIds]);
}
