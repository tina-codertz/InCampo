import type { AppSupabaseClient } from "@/lib/supabase";
import type { EngagementState } from "@/types/database";

export async function fetchEngagement(
  client: AppSupabaseClient,
  userId: string
): Promise<EngagementState> {
  const [likes, bookmarks, rsvps, members] = await Promise.all([
    client.from("announcement_likes").select("announcement_id").eq("user_id", userId),
    client
      .from("bookmarks")
      .select("content_id")
      .eq("user_id", userId)
      .eq("content_type", "announcement"),
    client.from("event_rsvps").select("event_id").eq("user_id", userId),
    client.from("club_members").select("club_id").eq("user_id", userId),
  ]);

  return {
    likedIds: likes.data?.map((row) => row.announcement_id) ?? [],
    bookmarkedIds: bookmarks.data?.map((row) => row.content_id) ?? [],
    goingIds: rsvps.data?.map((row) => row.event_id) ?? [],
    joinedIds: members.data?.map((row) => row.club_id) ?? [],
  };
}

export async function syncLike(
  client: AppSupabaseClient,
  userId: string,
  announcementId: string,
  liked: boolean
) {
  if (liked) {
    await client.from("announcement_likes").upsert({
      user_id: userId,
      announcement_id: announcementId,
    });
    return;
  }

  await client
    .from("announcement_likes")
    .delete()
    .eq("user_id", userId)
    .eq("announcement_id", announcementId);
}

export async function syncBookmark(
  client: AppSupabaseClient,
  userId: string,
  announcementId: string,
  bookmarked: boolean
) {
  if (bookmarked) {
    await client.from("bookmarks").upsert({
      user_id: userId,
      content_type: "announcement",
      content_id: announcementId,
    });
    return;
  }

  await client
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("content_type", "announcement")
    .eq("content_id", announcementId);
}

export async function syncRsvp(
  client: AppSupabaseClient,
  userId: string,
  eventId: string,
  going: boolean
) {
  if (going) {
    await client.from("event_rsvps").upsert({
      user_id: userId,
      event_id: eventId,
    });
    return;
  }

  await client
    .from("event_rsvps")
    .delete()
    .eq("user_id", userId)
    .eq("event_id", eventId);
}

export async function syncClubJoin(
  client: AppSupabaseClient,
  userId: string,
  clubId: string,
  joined: boolean
) {
  if (joined) {
    await client.from("club_members").upsert({
      user_id: userId,
      club_id: clubId,
    });
    return;
  }

  await client
    .from("club_members")
    .delete()
    .eq("user_id", userId)
    .eq("club_id", clubId);
}
