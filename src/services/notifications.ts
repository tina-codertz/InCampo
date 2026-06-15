import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { mapNotification } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import { withMockFallback } from "@/services/utils";
import type { NotificationItem } from "@/types";

export async function fetchNotifications(
  client: AppSupabaseClient,
  userId?: string | null
): Promise<NotificationItem[]> {
  return withMockFallback(async () => {
    let query = client
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.or(`user_id.is.null,user_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data.map(mapNotification);
  }, MOCK_NOTIFICATIONS);
}

export async function markNotificationRead(
  client: AppSupabaseClient,
  userId: string,
  notificationId: string
) {
  await client
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .or(`user_id.is.null,user_id.eq.${userId}`);
}

export async function markAllNotificationsRead(
  client: AppSupabaseClient,
  userId: string
) {
  await client
    .from("notifications")
    .update({ is_read: true })
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .eq("is_read", false);
}
