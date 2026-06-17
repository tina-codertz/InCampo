import { type Href, useRouter } from "expo-router";
import { Text, View } from "react-native";

import { IconButton } from "@/components/icon-button";
import { useUnreadNotificationCount } from "@/hooks/use-notifications";
import { useTheme } from "@/hooks/use-theme";

type NotificationBellProps = {
  size?: number;
};

export function NotificationBell({ size = 20 }: NotificationBellProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const unreadCount = useUnreadNotificationCount();

  return (
    <View style={{ position: "relative" }}>
      <IconButton
        accessibilityLabel="Notifications"
        icon="bell"
        iconSize={size}
        variant="surface"
        onPress={() => router.push("/notifications" as Href)}
      />
      {unreadCount > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.error,
          }}
        />
      ) : null}
    </View>
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
