import type {
  AnnouncementRow,
  ClubRow,
  EventRow,
  NotificationRow,
  ProfileRow,
} from "@/types/database";
import type { Announcement, Club, EventItem, NotificationItem } from "@/types";
import type { UserProfile } from "@/store/use-profile-store";

export function formatRelativeTime(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) {
    return new Date(isoDate).toLocaleDateString("en-US", { weekday: "short" });
  }

  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    authorName: row.author_name,
    authorInitials: row.author_initials,
    authorColor: row.author_color,
    isUrgent: row.is_urgent,
    category: row.category,
    timestamp: formatRelativeTime(row.created_at),
    title: row.title,
    body: row.body,
    tags: row.tags ?? [],
    likes: row.likes,
    comments: row.comments,
    imageUrl: row.image_url ?? undefined,
  };
}

export function mapEvent(row: EventRow): EventItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    date: row.event_date,
    time: row.event_time,
    location: row.location,
    attendees: row.attendees,
    host: row.host,
    description: row.description,
    imageUrl: row.image_url,
    featured: row.featured,
  };
}

export function mapClub(row: ClubRow): Club {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    members: row.members,
    description: row.description,
    meetingTime: row.meeting_time ?? undefined,
    location: row.location ?? undefined,
    imageUrl: row.image_url,
    featured: row.featured,
  };
}

export function mapNotification(row: NotificationRow): NotificationItem {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    timestamp: formatRelativeTime(row.created_at),
    isRead: row.is_read,
    section: row.section,
  };
}

export function mapProfile(row: ProfileRow): UserProfile {
  return {
    fullName: row.full_name,
    username: row.username,
    classYear: row.class_year,
    major: row.major,
    university: row.university,
    bio: row.bio,
    avatarColor: row.avatar_color,
    postCount: row.post_count,
  };
}

export function profileToRow(
  clerkId: string,
  profile: UserProfile
): Omit<ProfileRow, "created_at" | "updated_at"> {
  return {
    clerk_id: clerkId,
    full_name: profile.fullName,
    username: profile.username,
    class_year: profile.classYear,
    major: profile.major,
    university: profile.university,
    bio: profile.bio,
    avatar_color: profile.avatarColor,
    post_count: profile.postCount,
  };
}
