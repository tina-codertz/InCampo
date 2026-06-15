import type {
  Announcement,
  Club,
  EventItem,
  NotificationItem,
  Student,
} from "@/types";

export const MOCK_STUDENTS: Student[] = [
  { id: "1", name: "Sarah", initials: "SC", avatarColor: "#8B5CF6" },
  { id: "2", name: "Marcus", initials: "ML", avatarColor: "#A78BFA" },
  { id: "3", name: "Priya", initials: "PN", avatarColor: "#34D399" },
  { id: "4", name: "James", initials: "JO", avatarColor: "#4ADE80" },
  { id: "5", name: "Luis", initials: "L", avatarColor: "#60A5FA" },
];

export const TRENDING_TAGS = [
  "#FinalsWeek",
  "#SpringRegistration",
  "#HackathonUni26",
  "#GreenCampus",
  "#ResearchGrant",
];

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    authorName: "Admin Office",
    authorInitials: "AO",
    authorColor: "#8B5CF6",
    isUrgent: true,
    category: "Announcement",
    timestamp: "2m ago",
    title: "Campus Library Extended Hours",
    body: "The main library will be open 24/7 during finals week starting December 10th. Additional study rooms are available.",
    tags: ["Academic", "Library"],
    likes: 142,
    comments: 18,
  },
  {
    id: "2",
    authorName: "CS Department",
    authorInitials: "CS",
    authorColor: "#6366F1",
    isUrgent: false,
    category: "Announcement",
    timestamp: "1h ago",
    title: "Spring Registration Opens Monday",
    body: "Course registration for Spring 2026 opens at 8:00 AM. Check your advising hold status before enrolling.",
    tags: ["Academic", "Registration"],
    likes: 89,
    comments: 12,
  },
  {
    id: "3",
    authorName: "Student Life",
    authorInitials: "SL",
    authorColor: "#34D399",
    isUrgent: false,
    category: "Event",
    timestamp: "3h ago",
    title: "Green Campus Week Starts Tomorrow",
    body: "Join sustainability workshops, campus clean-ups, and the zero-waste challenge. Prizes for top participating clubs.",
    tags: ["GreenCampus", "Social"],
    likes: 56,
    comments: 9,
  },
  {
    id: "4",
    authorName: "Research Office",
    authorInitials: "RO",
    authorColor: "#F59E0B",
    isUrgent: false,
    category: "Opportunity",
    timestamp: "5h ago",
    title: "Undergraduate Research Grant Applications Open",
    body: "Apply for up to $2,500 in funding for faculty-mentored research projects. Deadline: January 15.",
    tags: ["ResearchGrant", "Academic"],
    likes: 73,
    comments: 14,
  },
  {
    id: "5",
    authorName: "Hackathon Committee",
    authorInitials: "HC",
    authorColor: "#60A5FA",
    isUrgent: false,
    category: "Event",
    timestamp: "Yesterday",
    title: "HackathonUni26 Team Registration Now Live",
    body: "Form teams of 2–4 students. Workshops on AI tooling and product design run all week before the main event.",
    tags: ["HackathonUni26", "Tech"],
    likes: 201,
    comments: 42,
  },
];

export const MOCK_EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Annual Hackathon 2026",
    category: "Academic",
    date: "Dec 14–16",
    time: "6:00 PM",
    location: "Engineering Hub, Room 301",
    attendees: 234,
    imageUrl:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    title: "Winter Art Exhibition Opening",
    category: "Arts",
    date: "Dec 12",
    time: "7:00 PM",
    location: "Arts Center Gallery",
    attendees: 67,
    imageUrl:
      "https://images.unsplash.com/photo-1460661419345-08bfab32645f?w=400&q=80",
    isGoing: true,
  },
  {
    id: "3",
    title: "Intramural Basketball Finals",
    category: "Sports",
    date: "Dec 18",
    time: "5:30 PM",
    location: "Campus Recreation Center",
    attendees: 156,
    imageUrl:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
    featured: true,
  },
];

export const MOCK_CLUBS: Club[] = [
  {
    id: "1",
    name: "AI & Machine Learning Society",
    category: "Tech",
    members: 312,
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
    featured: true,
  },
  {
    id: "2",
    name: "Entrepreneurship Hub",
    category: "Academic",
    members: 228,
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    featured: true,
    isJoined: true,
  },
  {
    id: "3",
    name: "Esports & Gaming Society",
    category: "Social",
    members: 445,
    imageUrl:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
    featured: true,
  },
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    type: "like",
    title: "Sarah Chen",
    body: "liked your comment on Campus Library Extended Hours",
    timestamp: "2m ago",
    isRead: false,
    section: "TODAY",
  },
  {
    id: "2",
    type: "reply",
    title: "Marcus Lee",
    body: 'replied to your comment: "Thanks for sharing this!"',
    timestamp: "15m ago",
    isRead: false,
    section: "TODAY",
  },
  {
    id: "3",
    type: "event",
    title: "CS Department",
    body: "Hackathon 2026 registration closes in 2 days",
    timestamp: "1h ago",
    isRead: false,
    section: "TODAY",
  },
  {
    id: "4",
    type: "club",
    title: "Entrepreneurship Hub",
    body: "posted a new update about the startup pitch night",
    timestamp: "3h ago",
    isRead: false,
    section: "TODAY",
  },
  {
    id: "5",
    type: "event",
    title: "Campus Events",
    body: "Winter Art Exhibition Opening starts tomorrow at 7 PM",
    timestamp: "Yesterday",
    isRead: true,
    section: "YESTERDAY",
  },
];

export const NOTIFICATION_FILTERS = ["All", "Unread", "Events", "Clubs"] as const;
export const EVENT_FILTERS = ["All", "Academic", "Social", "Sports", "Arts"] as const;
export const CLUB_FILTERS = ["All", "Tech", "Arts", "Sports", "Academic"] as const;
