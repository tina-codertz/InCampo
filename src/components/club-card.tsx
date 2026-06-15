import { Image } from "expo-image";
import { type Href, Link } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Icon } from "@/components/icon";
import { TagPill } from "@/components/student-avatar";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useClubsStore } from "@/store/use-clubs-store";
import type { Club } from "@/types";

type JoinButtonProps = {
  club: Club;
  variant?: "featured" | "compact";
};

function JoinButton({ club, variant = "compact" }: JoinButtonProps) {
  const { theme } = useTheme();
  const isJoined = useClubsStore((state) => state.isJoined(club.id));
  const toggleJoin = useClubsStore((state) => state.toggleJoin);

  const handlePress = useCallback(() => {
    toggleJoin(club.id, club.members);
    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(
        isJoined
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
  }, [club.id, club.members, isJoined, toggleJoin]);

  if (variant === "featured") {
    return (
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: isJoined ? "rgba(255,255,255,0.2)" : "#FFFFFF",
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: radius.button,
          borderWidth: isJoined ? 1 : 0,
          borderColor: "rgba(255,255,255,0.35)",
        }}
      >
        <Text
          selectable
          style={{
            color: isJoined ? "#FFFFFF" : "#111827",
            fontWeight: "600",
            fontSize: 13,
          }}
        >
          {isJoined ? "Joined ✓" : "Join"}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: isJoined ? theme.primaryMuted : theme.surfaceElevated,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: isJoined ? theme.primary : theme.border,
      }}
    >
      <Text
        selectable
        style={{
          color: isJoined ? theme.primary : theme.textSecondary,
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {isJoined ? "Joined ✓" : "Join"}
      </Text>
    </Pressable>
  );
}

type FeaturedClubCardProps = {
  club: Club;
  index: number;
};

export function FeaturedClubCard({ club, index }: FeaturedClubCardProps) {
  const { theme } = useTheme();
  const memberCount = useClubsStore((state) =>
    state.getMemberCount(club.id, club.members)
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Link href={`/club/${club.id}` as Href} asChild>
        <Pressable
          style={{
            borderRadius: radius.card,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.border,
            height: 180,
          }}
        >
          <Image
            source={{ uri: club.imageUrl }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              right: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TagPill label={club.category} />
            <View onStartShouldSetResponder={() => true}>
              <JoinButton club={club} variant="featured" />
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 16,
              left: 16,
              gap: 4,
              right: 16,
            }}
          >
            <Text
              selectable
              style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}
            >
              {club.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="person.2" size={12} color="#FFFFFF" />
              <Text
                selectable
                style={{
                  color: "#FFFFFF",
                  fontSize: 13,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {memberCount} members
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

type ClubListCardProps = {
  club: Club;
  index: number;
};

export function ClubListCard({ club, index }: ClubListCardProps) {
  const { theme } = useTheme();
  const memberCount = useClubsStore((state) =>
    state.getMemberCount(club.id, club.members)
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 60).springify()}>
      <Link href={`/club/${club.id}` as Href} asChild>
        <Pressable
          style={{
            flexDirection: "row",
            backgroundColor: theme.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 12,
            gap: 12,
            alignItems: "center",
          }}
        >
          <Image
            source={{ uri: club.imageUrl }}
            style={{ width: 64, height: 64, borderRadius: 12 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                selectable
                style={{
                  color: theme.textPrimary,
                  fontSize: 15,
                  fontWeight: "700",
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {club.name}
              </Text>
              <TagPill label={club.category} />
            </View>
            <Text
              selectable
              numberOfLines={2}
              style={{ color: theme.textSecondary, fontSize: 12, lineHeight: 16 }}
            >
              {club.description}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 2,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Icon name="person.2" size={12} color={theme.textMuted} />
                <Text
                  selectable
                  style={{
                    color: theme.textSecondary,
                    fontSize: 12,
                    fontVariant: ["tabular-nums"],
                  }}
                >
                  {memberCount}
                </Text>
              </View>
              <View onStartShouldSetResponder={() => true}>
                <JoinButton club={club} />
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}
