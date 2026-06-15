import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { BackButton } from "@/components/icon-button";
import { Icon } from "@/components/icon";
import { TagPill } from "@/components/student-avatar";
import { radius, spacing } from "@/constants/theme";
import { useClub } from "@/hooks/use-clubs";
import { useTheme } from "@/hooks/use-theme";
import { useClubsStore } from "@/store/use-clubs-store";

export default function ClubDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: club, isLoading, isError } = useClub(id ?? "");

  const isJoined = useClubsStore((state) => state.isJoined(id ?? ""));
  const memberCount = useClubsStore((state) =>
    club ? state.getMemberCount(club.id, club.members) : 0
  );
  const toggleJoin = useClubsStore((state) => state.toggleJoin);

  const handleJoin = useCallback(() => {
    if (!club) return;
    toggleJoin(club.id, club.members);
    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(
        isJoined
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
  }, [club, isJoined, toggleJoin]);

  const handleShare = useCallback(async () => {
    if (!club) return;
    await Share.share({
      title: club.name,
      message: `${club.name}\n${club.description}\n\n${club.meetingTime ?? ""}\n${club.location ?? ""}`,
    });
  }, [club]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (isError || !club) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
          padding: spacing.md,
          gap: spacing.sm,
        }}
      >
        <Text selectable style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700" }}>
          Club not found
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text selectable style={{ color: theme.primary, fontWeight: "600" }}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
    >
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: club.imageUrl }}
          style={{ width: "100%", height: 260 }}
          contentFit="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.35)",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: spacing.sm,
            left: spacing.sm,
            zIndex: 1,
          }}
        >
          <BackButton onPress={() => router.back()} />
        </View>
        {club.featured ? (
          <View style={{ position: "absolute", top: spacing.sm, right: spacing.sm }}>
            <TagPill label="Featured" variant="category" />
          </View>
        ) : null}
        <View style={{ position: "absolute", bottom: spacing.sm, left: spacing.sm, right: spacing.sm, gap: 8 }}>
          <TagPill label={club.category} variant="primary" />
          <Text selectable style={{ color: "#FFFFFF", fontSize: 28, fontWeight: "700" }}>
            {club.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="person.2" size={14} color="#FFFFFF" />
            <Text
              selectable
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontVariant: ["tabular-nums"],
              }}
            >
              {memberCount} members
            </Text>
          </View>
        </View>
      </View>

      <Animated.View
        entering={FadeInDown.springify()}
        style={{ padding: spacing.sm, gap: spacing.sm }}
      >
        <View
          style={{
            backgroundColor: theme.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: theme.border,
            padding: spacing.sm,
            gap: spacing.xs,
          }}
        >
          {club.meetingTime ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Icon name="clock" size={18} color={theme.primary} />
              <Text selectable style={{ color: theme.textPrimary, fontSize: 15 }}>
                {club.meetingTime}
              </Text>
            </View>
          ) : null}
          {club.location ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Icon name="mappin.and.ellipse" size={18} color={theme.primary} />
              <Text selectable style={{ color: theme.textPrimary, fontSize: 15 }}>
                {club.location}
              </Text>
            </View>
          ) : null}
        </View>

        <Text
          selectable
          style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 22 }}
        >
          {club.description}
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={handleJoin}
            style={{
              flex: 1,
              backgroundColor: isJoined ? theme.primaryMuted : theme.primary,
              paddingVertical: 16,
              borderRadius: radius.button,
              alignItems: "center",
              borderWidth: isJoined ? 1 : 0,
              borderColor: theme.primary,
            }}
          >
            <Text
              selectable
              style={{
                color: isJoined ? theme.primary : "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {isJoined ? "Joined ✓" : "Join Club"}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => void handleShare()}
            style={{
              width: 56,
              backgroundColor: theme.surface,
              borderRadius: radius.button,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: theme.border,
            }}
          >
            <Icon name="square.and.arrow.up" size={20} color={theme.textPrimary} />
          </Pressable>
        </View>
      </Animated.View>
    </ScrollView>
  );
}
