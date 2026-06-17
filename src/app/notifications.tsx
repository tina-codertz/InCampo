import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";

import { CloseButton } from "@/components/icon-button";
import { EmptyState } from "@/components/empty-state";
import { FilterChips } from "@/components/filter-chips";
import { Screen } from "@/components/screen";
import { Icon } from "@/components/icon";
import { NotificationItemCard } from "@/components/notification-item";
import { NotificationBadge } from "@/components/notification-bell";
import { NotificationsSkeletonList } from "@/components/skeleton-loader";
import { NOTIFICATION_FILTERS } from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import { useSupabase, useUserId } from "@/hooks/use-supabase";
import { useTheme } from "@/hooks/use-theme";
import { markAllNotificationsRead } from "@/services/notifications";
import {
  filterNotifications,
  groupNotificationsBySection,
  useNotifications,
  useUnreadNotificationCount,
} from "@/hooks/use-notifications";
import { useNotificationsStore } from "@/store/use-notifications-store";

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const client = useSupabase();
  const userId = useUserId();
  const { data: notifications = [], isLoading, isRefetching, refetch } =
    useNotifications();
  const unreadCount = useUnreadNotificationCount();
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const isRead = useNotificationsStore((state) => state.isRead);
  const isDeleted = useNotificationsStore((state) => state.isDeleted);

  const [filter, setFilter] =
    useState<(typeof NOTIFICATION_FILTERS)[number]>("All");

  const filteredNotifications = useMemo(
    () => filterNotifications(notifications, filter, isRead, isDeleted),
    [notifications, filter, isRead, isDeleted]
  );

  const sections = useMemo(
    () => groupNotificationsBySection(filteredNotifications),
    [filteredNotifications]
  );

  const handleReadAll = useCallback(() => {
    const unreadIds = notifications
      .filter((item) => !isDeleted(item.id) && !isRead(item.id, item.isRead))
      .map((item) => item.id);

    markAllAsRead(unreadIds);
    if (userId) {
      void markAllNotificationsRead(client, userId);
    }

    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [userId, client, isDeleted, isRead, markAllAsRead, notifications]);

  const handleRefresh = useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    await refetch();
  }, [queryClient, refetch]);

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.sm,
          paddingBottom: spacing.xs,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <CloseButton onPress={() => router.back()} />
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "700" }}
          >
            Notifications
          </Text>
          <NotificationBadge count={unreadCount} />
        </View>

        <Pressable
          onPress={handleReadAll}
          disabled={unreadCount === 0}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: radius.pill,
            borderWidth: 1,
            borderColor: theme.border,
            backgroundColor: theme.surface,
            opacity: unreadCount === 0 ? 0.5 : 1,
          }}
        >
          <Icon name="checkmark" size={14} color={theme.textSecondary} />
          <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
            Read all
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.sm,
          gap: spacing.sm,
          flexGrow: 1,
        }}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={() => void handleRefresh()}
            tintColor={theme.primary}
          />
        }
      >
        <FilterChips
          options={NOTIFICATION_FILTERS}
          selected={filter}
          onSelect={setFilter}
        />

        {isLoading ? (
          <NotificationsSkeletonList count={4} />
        ) : sections.length === 0 ? (
          <EmptyState
            title={
              filter === "Unread"
                ? "You're all caught up"
                : "No notifications found"
            }
            description={
              filter === "Unread"
                ? "No unread notifications right now. Check back later for campus updates."
                : "Try a different filter to see more notifications."
            }
            icon="bell"
          />
        ) : (
          sections.map(([section, items]) => (
            <View key={section} style={{ gap: spacing.xs }}>
              <Text
                selectable
                style={{
                  color: theme.textMuted,
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 1,
                }}
              >
                {section}
              </Text>
              {items.map((item, index) => (
                <NotificationItemCard key={item.id} item={item} index={index} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
