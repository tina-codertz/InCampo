export type ProfileRow = {
  clerk_id: string;
  full_name: string;
  username: string;
  class_year: string;
  major: string;
  university: string;
  bio: string;
  avatar_color: string;
  post_count: number;
  created_at: string;
  updated_at: string;
};

export type AnnouncementRow = {
  id: string;
  author_name: string;
  author_initials: string;
  author_color: string;
  is_urgent: boolean;
  category: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  image_url: string | null;
  created_at: string;
};

export type EventRow = {
  id: string;
  title: string;
  category: string;
  event_date: string;
  event_time: string;
  location: string;
  attendees: number;
  host: string;
  description: string;
  image_url: string;
  featured: boolean;
  created_at: string;
};

export type ClubRow = {
  id: string;
  name: string;
  category: string;
  members: number;
  description: string;
  meeting_time: string | null;
  location: string | null;
  image_url: string;
  featured: boolean;
  created_at: string;
};

export type NotificationRow = {
  id: string;
  clerk_id: string | null;
  type: "like" | "reply" | "event" | "club";
  title: string;
  body: string;
  section: string;
  is_read: boolean;
  created_at: string;
};

export type AnnouncementLikeRow = {
  clerk_id: string;
  announcement_id: string;
  created_at: string;
};

export type BookmarkRow = {
  clerk_id: string;
  content_type: "announcement";
  content_id: string;
  created_at: string;
};

export type EventRsvpRow = {
  clerk_id: string;
  event_id: string;
  created_at: string;
};

export type ClubMemberRow = {
  clerk_id: string;
  club_id: string;
  created_at: string;
};

export type EngagementState = {
  likedIds: string[];
  bookmarkedIds: string[];
  goingIds: string[];
  joinedIds: string[];
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProfileRow, "clerk_id">>;
        Relationships: [];
      };
      announcements: {
        Row: AnnouncementRow;
        Insert: Omit<AnnouncementRow, "created_at"> & { created_at?: string };
        Update: Partial<AnnouncementRow>;
        Relationships: [];
      };
      events: {
        Row: EventRow;
        Insert: Omit<EventRow, "created_at"> & { created_at?: string };
        Update: Partial<EventRow>;
        Relationships: [];
      };
      clubs: {
        Row: ClubRow;
        Insert: Omit<ClubRow, "created_at"> & { created_at?: string };
        Update: Partial<ClubRow>;
        Relationships: [];
      };
      notifications: {
        Row: NotificationRow;
        Insert: Omit<NotificationRow, "created_at" | "is_read"> & {
          created_at?: string;
          is_read?: boolean;
        };
        Update: Partial<Omit<NotificationRow, "id">>;
        Relationships: [];
      };
      announcement_likes: {
        Row: AnnouncementLikeRow;
        Insert: Omit<AnnouncementLikeRow, "created_at"> & { created_at?: string };
        Update: Partial<AnnouncementLikeRow>;
        Relationships: [];
      };
      bookmarks: {
        Row: BookmarkRow;
        Insert: Omit<BookmarkRow, "created_at"> & { created_at?: string };
        Update: Partial<BookmarkRow>;
        Relationships: [];
      };
      event_rsvps: {
        Row: EventRsvpRow;
        Insert: Omit<EventRsvpRow, "created_at"> & { created_at?: string };
        Update: Partial<EventRsvpRow>;
        Relationships: [];
      };
      club_members: {
        Row: ClubMemberRow;
        Insert: Omit<ClubMemberRow, "created_at"> & { created_at?: string };
        Update: Partial<ClubMemberRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
