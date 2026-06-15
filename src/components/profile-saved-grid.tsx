import { Image } from "expo-image";
import { type Href, Link } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Pressable, Text, View } from "react-native";

import { EmptyState } from "@/components/empty-state";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { ProfileSavedItem } from "@/types";

type ProfileSavedGridProps = {
  items: ProfileSavedItem[];
};

export function ProfileSavedGrid({ items }: ProfileSavedGridProps) {
  const { theme } = useTheme();

  if (items.length === 0) {
    return (
      <EmptyState
        title="No saved items yet"
        description="Swipe left on feed cards or tap the bookmark icon to save announcements, events, and clubs."
        icon="bookmark"
      />
    );
  }

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {items.map((item, index) => (
        <Animated.View
          key={item.id}
          entering={FadeInDown.delay(index * 50).springify()}
          style={{ width: "48.5%" }}
        >
          <Link href={item.href as Href} asChild>
            <Pressable
              style={{
                borderRadius: radius.card,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: theme.border,
                backgroundColor: theme.surface,
              }}
            >
              <Image
                source={{ uri: item.imageUrl }}
                style={{ width: "100%", height: 120 }}
                contentFit="cover"
              />
              <View style={{ padding: 10, gap: 4 }}>
                <Text
                  selectable
                  numberOfLines={2}
                  style={{
                    color: theme.textPrimary,
                    fontSize: 13,
                    fontWeight: "600",
                    lineHeight: 17,
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  selectable
                  numberOfLines={1}
                  style={{ color: theme.textMuted, fontSize: 11 }}
                >
                  {item.subtitle}
                </Text>
              </View>
            </Pressable>
          </Link>
        </Animated.View>
      ))}
    </View>
  );
}
