import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  FadeOutRight,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { Icon } from "@/components/icon";
import { radius, spacing } from "@/constants/theme";
import { useSupabase, useUserId } from "@/hooks/use-supabase";
import { useTheme } from "@/hooks/use-theme";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "@/services/notifications";
import { useNotificationsStore } from "@/store/use-notifications-store";
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

const SWIPE_DELETE_THRESHOLD = 80;

type NotificationItemCardProps = {
  item: NotificationItem;
  index: number;
};

export function NotificationItemCard({ item, index }: NotificationItemCardProps) {
  const { theme } = useTheme();
  const client = useSupabase();
  const userId = useUserId();
  const icon = ICON_MAP[item.type];
  const translateX = useSharedValue(0);

  const isRead = useNotificationsStore((state) =>
    state.isRead(item.id, item.isRead)
  );
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const deleteNotification = useNotificationsStore(
    (state) => state.deleteNotification
  );

  const handlePress = useCallback(() => {
    if (!isRead) {
      markAsRead(item.id);
      if (userId) {
        void markNotificationRead(client, userId, item.id);
      }
      if (process.env.EXPO_OS === "ios") {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  }, [userId, client, isRead, item.id, markAsRead]);

  const handleDelete = useCallback(() => {
    deleteNotification(item.id);
    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [deleteNotification, item.id]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((event) => {
      translateX.value = Math.min(0, event.translationX);
    })
    .onEnd((event) => {
      if (event.translationX <= -SWIPE_DELETE_THRESHOLD) {
        runOnJS(handleDelete)();
      }
      translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const deleteHintStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? Math.min(Math.abs(translateX.value) / 60, 1) : 0,
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      exiting={FadeOutRight.duration(220)}
    >
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            {
              position: "absolute",
              right: 16,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            },
            deleteHintStyle,
          ]}
        >
          <Icon name="trash" size={20} color={theme.error} />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={cardAnimatedStyle}>
            <Pressable
              onPress={handlePress}
              style={{
                flexDirection: "row",
                gap: 12,
                backgroundColor: isRead ? theme.surface : theme.surfaceElevated,
                borderRadius: radius.card,
                borderWidth: 1,
                borderColor: isRead ? theme.border : theme.primaryMuted,
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
                <Text
                  selectable
                  style={{ color: theme.textPrimary, fontSize: 14, lineHeight: 20 }}
                >
                  <Text style={{ fontWeight: "700" }}>{item.title}</Text> {item.body}
                </Text>
                <Text selectable style={{ color: theme.textMuted, fontSize: 12 }}>
                  {item.timestamp}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end", gap: 12 }}>
                {!isRead ? (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.primary,
                    }}
                  />
                ) : null}
                <Pressable
                  onPress={handleDelete}
                  hitSlop={8}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: theme.surface,
                    borderWidth: 1,
                    borderColor: theme.border,
                  }}
                >
                  <Icon name="trash" size={14} color={theme.textMuted} />
                </Pressable>
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}
