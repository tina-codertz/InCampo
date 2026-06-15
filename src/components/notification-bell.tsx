import { Link, type Href } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";

type NotificationBellProps = {
  size?: number;
};

export function NotificationBell({ size = 22 }: NotificationBellProps) {
  const { theme } = useTheme();
  const unreadCount = useAppStore((state) => state.unreadNotificationCount);

  return (
    <Link href={"/notifications" as Href} asChild>
      <Pressable
        onPress={() => {
          if (process.env.EXPO_OS === "ios") {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
        }}
        hitSlop={8}
        style={{ position: "relative" }}
      >
        <Icon name="bell" size={size} color={theme.textPrimary} />
        {unreadCount > 0 ? (
          <View
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: theme.error,
            }}
          />
        ) : null}
      </Pressable>
    </Link>
  );
}

type NotificationBadgeProps = {
  count: number;
};

export function NotificationBadge({ count }: NotificationBadgeProps) {
  const { theme } = useTheme();

  if (count <= 0) {
    return null;
  }

  return (
    <View
      style={{
        minWidth: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: theme.primary,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6,
      }}
    >
      <Text
        selectable
        style={{
          color: "#FFFFFF",
          fontSize: 12,
          fontWeight: "700",
          fontVariant: ["tabular-nums"],
        }}
      >
        {count}
      </Text>
    </View>
  );
}
