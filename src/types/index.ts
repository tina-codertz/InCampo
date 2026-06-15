export type Student = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
};

export type Announcement = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  isUrgent: boolean;
  category: string;
  timestamp: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  imageUrl?: string;
};

export type EventItem = {
  id: string;
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl: string;
  description: string;
  host: string;
  featured?: boolean;
};

export type Club = {
  id: string;
  name: string;
  category: string;
  members: number;
  imageUrl: string;
  description: string;
  meetingTime?: string;
  location?: string;
  featured?: boolean;
};

export type NotificationType = "like" | "reply" | "event" | "club";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  section: string;
};

export type TabRoute = "home" | "events" | "clubs" | "profile";

export type ProfileActivityType = "like" | "bookmark" | "rsvp" | "join";

export type ProfileActivityItem = {
  id: string;
  type: ProfileActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
  imageUrl?: string;
  href?: string;
};

export type ProfileSavedItem = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
};
