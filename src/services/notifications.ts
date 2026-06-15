import { MOCK_NOTIFICATIONS } from "@/constants/mock-data";
import { mapNotification } from "@/lib/mappers";
import type { AppSupabaseClient } from "@/lib/supabase";
import { withMockFallback } from "@/services/utils";
import type { NotificationItem } from "@/types";

export async function fetchNotifications(
  client: AppSupabaseClient,
  clerkId?: string | null
): Promise<NotificationItem[]> {
  return withMockFallback(async () => {
    let query = client
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false });

    if (clerkId) {
      query = query.or(`clerk_id.is.null,clerk_id.eq.${clerkId}`);
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
  clerkId: string,
  notificationId: string
) {
  await client
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .or(`clerk_id.is.null,clerk_id.eq.${clerkId}`);
}

export async function markAllNotificationsRead(
  client: AppSupabaseClient,
  clerkId: string
) {
  await client
    .from("notifications")
    .update({ is_read: true })
    .or(`clerk_id.is.null,clerk_id.eq.${clerkId}`)
    .eq("is_read", false);
}
