import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { fetchNotifications } from "@/services/notifications";
import { useClerkUserId, useSupabase } from "@/hooks/use-supabase";
import { useNotificationsStore } from "@/store/use-notifications-store";
import type { NotificationItem } from "@/types";

export function useNotifications() {
  const client = useSupabase();
  const clerkId = useClerkUserId();

  return useQuery({
    queryKey: ["notifications", clerkId],
    queryFn: () => fetchNotifications(client, clerkId),
    staleTime: 1000 * 60 * 3,
  });
}

export function useUnreadNotificationCount() {
  const { data: notifications = [] } = useNotifications();
  const readIds = useNotificationsStore((state) => state.readIds);
  const deletedIds = useNotificationsStore((state) => state.deletedIds);
  const isRead = useNotificationsStore((state) => state.isRead);
  const isDeleted = useNotificationsStore((state) => state.isDeleted);

  return useMemo(
    () =>
      notifications.filter(
        (item) => !isDeleted(item.id) && !isRead(item.id, item.isRead)
      ).length,
    [notifications, readIds, deletedIds, isRead, isDeleted]
  );
}

export function filterNotifications(
  notifications: NotificationItem[],
  filter: "All" | "Unread" | "Events" | "Clubs",
  isRead: (id: string, defaultRead: boolean) => boolean,
  isDeleted: (id: string) => boolean
) {
  return notifications
    .filter((item) => !isDeleted(item.id))
    .filter((item) => {
      if (filter === "All") return true;
      if (filter === "Unread") return !isRead(item.id, item.isRead);
      if (filter === "Events") return item.type === "event";
      return item.type === "club";
    });
}

export function groupNotificationsBySection(notifications: NotificationItem[]) {
  const grouped = new Map<string, NotificationItem[]>();

  for (const item of notifications) {
    const list = grouped.get(item.section) ?? [];
    list.push(item);
    grouped.set(item.section, list);
  }

  return Array.from(grouped.entries());
}
