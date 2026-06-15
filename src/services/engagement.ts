import type { AppSupabaseClient } from "@/lib/supabase";
import type { EngagementState } from "@/types/database";

export async function fetchEngagement(
  client: AppSupabaseClient,
  clerkId: string
): Promise<EngagementState> {
  const [likes, bookmarks, rsvps, members] = await Promise.all([
    client
      .from("announcement_likes")
      .select("announcement_id")
      .eq("clerk_id", clerkId),
    client
      .from("bookmarks")
      .select("content_id")
      .eq("clerk_id", clerkId)
      .eq("content_type", "announcement"),
    client.from("event_rsvps").select("event_id").eq("clerk_id", clerkId),
    client.from("club_members").select("club_id").eq("clerk_id", clerkId),
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
  clerkId: string,
  announcementId: string,
  liked: boolean
) {
  if (liked) {
    await client.from("announcement_likes").upsert({
      clerk_id: clerkId,
      announcement_id: announcementId,
    });
    return;
  }

  await client
    .from("announcement_likes")
    .delete()
    .eq("clerk_id", clerkId)
    .eq("announcement_id", announcementId);
}

export async function syncBookmark(
  client: AppSupabaseClient,
  clerkId: string,
  announcementId: string,
  bookmarked: boolean
) {
  if (bookmarked) {
    await client.from("bookmarks").upsert({
      clerk_id: clerkId,
      content_type: "announcement",
      content_id: announcementId,
    });
    return;
  }

  await client
    .from("bookmarks")
    .delete()
    .eq("clerk_id", clerkId)
    .eq("content_type", "announcement")
    .eq("content_id", announcementId);
}

export async function syncRsvp(
  client: AppSupabaseClient,
  clerkId: string,
  eventId: string,
  going: boolean
) {
  if (going) {
    await client.from("event_rsvps").upsert({
      clerk_id: clerkId,
      event_id: eventId,
    });
    return;
  }

  await client
    .from("event_rsvps")
    .delete()
    .eq("clerk_id", clerkId)
    .eq("event_id", eventId);
}

export async function syncClubJoin(
  client: AppSupabaseClient,
  clerkId: string,
  clubId: string,
  joined: boolean
) {
  if (joined) {
    await client.from("club_members").upsert({
      clerk_id: clerkId,
      club_id: clubId,
    });
    return;
  }

  await client
    .from("club_members")
    .delete()
    .eq("clerk_id", clerkId)
    .eq("club_id", clubId);
}
