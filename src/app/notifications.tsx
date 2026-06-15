import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { FilterChips } from "@/components/filter-chips";
import { Icon } from "@/components/icon";
import { NotificationBadge } from "@/components/notification-bell";
import {
  MOCK_NOTIFICATIONS,
  NOTIFICATION_FILTERS,
} from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import type { NotificationItem, NotificationType } from "@/types";

const ICON_MAP: Record<
  NotificationType,
  { icon: string; color: string; background: string }
> = {
  like: {
    icon: "heart.fill",
    color: "#EF4444",
    background: "rgba(239, 68, 68, 0.15)",
  },
  reply: {
    icon: "bubble.left.fill",
    color: "#3B82F6",
    background: "rgba(59, 130, 246, 0.15)",
  },
  event: {
    icon: "calendar",
    color: "#FBBF24",
    background: "rgba(251, 191, 36, 0.15)",
  },
  club: {
    icon: "person.2.fill",
    color: "#34D399",
    background: "rgba(52, 211, 153, 0.15)",
  },
};

function NotificationCard({
  item,
  index,
}: {
  item: NotificationItem;
  index: number;
}) {
  const { theme } = useTheme();
  const icon = ICON_MAP[item.type];

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 60).springify()}
      style={{
        flexDirection: "row",
        gap: 12,
        backgroundColor: theme.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: theme.border,
        padding: spacing.sm,
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: icon.background,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon.icon} size={20} color={icon.color} />
      </View>

      <View style={{ flex: 1, gap: 6 }}>
        <Text selectable style={{ color: theme.textPrimary, fontSize: 14, lineHeight: 20 }}>
          <Text style={{ fontWeight: "700" }}>{item.title}</Text> {item.body}
        </Text>
        <Text selectable style={{ color: theme.textMuted, fontSize: 12 }}>
          {item.timestamp}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end", gap: 12 }}>
        {!item.isRead ? (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.primary,
            }}
          />
        ) : null}
        <Pressable hitSlop={8}>
          <Icon name="trash" size={16} color={theme.textMuted} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const unreadCount = useAppStore((state) => state.unreadNotificationCount);
  const markAllRead = useAppStore((state) => state.markAllNotificationsRead);
  const [filter, setFilter] =
    useState<(typeof NOTIFICATION_FILTERS)[number]>("All");

  const filteredNotifications = useMemo(() => {
    if (filter === "All") return MOCK_NOTIFICATIONS;
    if (filter === "Unread") return MOCK_NOTIFICATIONS.filter((n) => !n.isRead);
    if (filter === "Events")
      return MOCK_NOTIFICATIONS.filter((n) => n.type === "event");
    return MOCK_NOTIFICATIONS.filter((n) => n.type === "club");
  }, [filter]);

  const sections = useMemo(() => {
    const grouped = new Map<string, NotificationItem[]>();
    for (const item of filteredNotifications) {
      const list = grouped.get(item.section) ?? [];
      list.push(item);
      grouped.set(item.section, list);
    }
    return Array.from(grouped.entries());
  }, [filteredNotifications]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.sm,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: theme.surface,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Icon name="xmark" size={14} color={theme.textPrimary} />
          </Pressable>
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 24, fontWeight: "700" }}
          >
            Notifications
          </Text>
          <NotificationBadge count={unreadCount} />
        </View>

        <Pressable
          onPress={() => {
            if (process.env.EXPO_OS === "ios") {
              void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            markAllRead();
          }}
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
          }}
        >
          <Icon name="checkmark" size={14} color={theme.textSecondary} />
          <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
            Read all
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          padding: spacing.sm,
          gap: spacing.sm,
        }}
      >
        <FilterChips
          options={NOTIFICATION_FILTERS}
          selected={filter}
          onSelect={setFilter}
        />

        {sections.map(([section, items]) => (
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
              <NotificationCard key={item.id} item={item} index={index} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
