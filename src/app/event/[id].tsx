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
import { useEvent } from "@/hooks/use-events";
import { useTheme } from "@/hooks/use-theme";
import { useEventsStore } from "@/store/use-events-store";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { data: event, isLoading, isError } = useEvent(id ?? "");

  const isGoing = useEventsStore((state) => state.isGoing(id ?? ""));
  const attendeeCount = useEventsStore((state) =>
    event ? state.getAttendeeCount(event.id, event.attendees) : 0
  );
  const toggleRsvp = useEventsStore((state) => state.toggleRsvp);

  const handleRsvp = useCallback(() => {
    if (!event) return;
    toggleRsvp(event.id, event.attendees);
    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(
        isGoing
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
  }, [event, isGoing, toggleRsvp]);

  const handleShare = useCallback(async () => {
    if (!event) return;
    await Share.share({
      title: event.title,
      message: `${event.title}\n${event.date} · ${event.time}\n${event.location}\n\n${event.description}`,
    });
  }, [event]);

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

  if (isError || !event) {
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
          Event not found
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
          source={{ uri: event.imageUrl }}
          style={{ width: "100%", height: 280 }}
          contentFit="cover"
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
        {event.featured ? (
          <View style={{ position: "absolute", top: spacing.sm, right: spacing.sm }}>
            <TagPill label="Featured" variant="category" />
          </View>
        ) : null}
      </View>

      <Animated.View
        entering={FadeInDown.springify()}
        style={{ padding: spacing.sm, gap: spacing.sm }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TagPill label={event.category} variant="primary" />
          <Text selectable style={{ color: theme.textMuted, fontSize: 13 }}>
            Hosted by {event.host}
          </Text>
        </View>

        <Text
          selectable
          style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
        >
          {event.title}
        </Text>

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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name="calendar" size={18} color={theme.primary} />
            <Text selectable style={{ color: theme.textPrimary, fontSize: 15 }}>
              {event.date} · {event.time}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name="mappin.and.ellipse" size={18} color={theme.primary} />
            <Text selectable style={{ color: theme.textPrimary, fontSize: 15 }}>
              {event.location}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Icon name="person.2" size={18} color={theme.primary} />
            <Text
              selectable
              style={{
                color: theme.textPrimary,
                fontSize: 15,
                fontVariant: ["tabular-nums"],
              }}
            >
              {attendeeCount} students going
            </Text>
          </View>
        </View>

        <Text
          selectable
          style={{ color: theme.textSecondary, fontSize: 15, lineHeight: 22 }}
        >
          {event.description}
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={handleRsvp}
            style={{
              flex: 1,
              backgroundColor: isGoing ? theme.primaryMuted : theme.primary,
              paddingVertical: 16,
              borderRadius: radius.button,
              alignItems: "center",
              borderWidth: isGoing ? 1 : 0,
              borderColor: theme.primary,
            }}
          >
            <Text
              selectable
              style={{
                color: isGoing ? theme.primary : "#FFFFFF",
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              {isGoing ? "Going ✓" : "RSVP"}
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
