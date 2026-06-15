import { Image } from "expo-image";
import { type Href, Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ProfileActivityItem, ProfileActivityType } from "@/types";

const ACTIVITY_ICONS: Record<
  ProfileActivityType,
  { icon: string; color: string; background: string }
> = {
  like: {
    icon: "heart.fill",
    color: "#EF4444",
    background: "rgba(239, 68, 68, 0.15)",
  },
  bookmark: {
    icon: "bookmark.fill",
    color: "#8B5CF6",
    background: "rgba(139, 92, 246, 0.15)",
  },
  rsvp: {
    icon: "calendar",
    color: "#FBBF24",
    background: "rgba(251, 191, 36, 0.15)",
  },
  join: {
    icon: "person.2.fill",
    color: "#34D399",
    background: "rgba(52, 211, 153, 0.15)",
  },
};

type ProfileActivityListProps = {
  items: ProfileActivityItem[];
};

function ActivityRow({
  item,
  index,
}: {
  item: ProfileActivityItem;
  index: number;
}) {
  const { theme } = useTheme();
  const icon = ACTIVITY_ICONS[item.type];

  const content = (
    <Pressable
      style={{
        flexDirection: "row",
        gap: 12,
        backgroundColor: theme.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: theme.border,
        padding: spacing.sm,
        alignItems: "center",
      }}
    >
      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 48, height: 48, borderRadius: 12 }}
          contentFit="cover"
        />
      ) : (
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: icon.background,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name={icon.icon} size={20} color={icon.color} />
        </View>
      )}

      <View style={{ flex: 1, gap: 4 }}>
        <Text
          selectable
          numberOfLines={1}
          style={{ color: theme.textPrimary, fontSize: 14, fontWeight: "600" }}
        >
          {item.title}
        </Text>
        <Text
          selectable
          numberOfLines={1}
          style={{ color: theme.textSecondary, fontSize: 12 }}
        >
          {item.subtitle}
        </Text>
        <Text selectable style={{ color: theme.textMuted, fontSize: 11 }}>
          {item.timestamp}
        </Text>
      </View>

      <Icon name="chevron.right" size={14} color={theme.textMuted} />
    </Pressable>
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      {item.href ? (
        <Link href={item.href as Href} asChild>
          {content}
        </Link>
      ) : (
        content
      )}
    </Animated.View>
  );
}

export function ProfileActivityList({ items }: ProfileActivityListProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Like announcements, RSVP to events, or join clubs to see your activity here."
        icon="chart.line.uptrend.xyaxis"
      />
    );
  }

  return (
    <View style={{ gap: spacing.xs }}>
      {items.map((item, index) => (
        <ActivityRow key={item.id} item={item} index={index} />
      ))}
    </View>
  );
}
