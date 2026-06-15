import { Image } from "expo-image";
import { type Href, Link } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Icon } from "@/components/icon";
import { TagPill } from "@/components/student-avatar";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEventsStore } from "@/store/use-events-store";
import type { EventItem } from "@/types";

type RsvpButtonProps = {
  event: EventItem;
  variant?: "featured" | "compact";
};

function RsvpButton({ event, variant = "compact" }: RsvpButtonProps) {
  const { theme } = useTheme();
  const isGoing = useEventsStore((state) => state.isGoing(event.id));
  const toggleRsvp = useEventsStore((state) => state.toggleRsvp);

  const handlePress = useCallback(() => {
    toggleRsvp(event.id, event.attendees);
    if (process.env.EXPO_OS === "ios") {
      void Haptics.notificationAsync(
        isGoing
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );
    }
  }, [event.attendees, event.id, isGoing, toggleRsvp]);

  if (variant === "featured") {
    return (
      <Pressable
        onPress={handlePress}
        style={{
          backgroundColor: isGoing ? "rgba(255,255,255,0.2)" : theme.primary,
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: radius.button,
          borderWidth: isGoing ? 1 : 0,
          borderColor: "rgba(255,255,255,0.4)",
        }}
      >
        <Text selectable style={{ color: "#FFFFFF", fontWeight: "600" }}>
          {isGoing ? "Going ✓" : "RSVP"}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      style={{
        backgroundColor: isGoing ? theme.primaryMuted : theme.surfaceElevated,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: isGoing ? theme.primary : theme.border,
      }}
    >
      <Text
        selectable
        style={{
          color: isGoing ? theme.primary : theme.textSecondary,
          fontSize: 12,
          fontWeight: "600",
        }}
      >
        {isGoing ? "Going ✓" : "RSVP"}
      </Text>
    </Pressable>
  );
}

type FeaturedEventCardProps = {
  event: EventItem;
  index: number;
};

export function FeaturedEventCard({ event, index }: FeaturedEventCardProps) {
  const { theme } = useTheme();
  const attendeeCount = useEventsStore((state) =>
    state.getAttendeeCount(event.id, event.attendees)
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Link href={`/event/${event.id}` as Href} asChild>
        <Pressable
          style={{
            borderRadius: radius.card,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Image
            source={{ uri: event.imageUrl }}
            style={{ width: "100%", height: 220 }}
            contentFit="cover"
          />
          <View style={{ position: "absolute", top: 12, left: 12 }}>
            <TagPill label="Featured" variant="category" />
          </View>
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: spacing.sm,
              backgroundColor: theme.overlay,
              gap: 8,
            }}
          >
            <Text
              selectable
              style={{ color: "#FFFFFF", fontSize: 20, fontWeight: "700" }}
            >
              {event.title}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="calendar" size={14} color="#FFFFFF" />
              <Text selectable style={{ color: "#FFFFFF", fontSize: 13 }}>
                {event.date} · {event.time}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Icon name="mappin.and.ellipse" size={14} color="#FFFFFF" />
                <Text
                  selectable
                  numberOfLines={1}
                  style={{ color: "#FFFFFF", fontSize: 13, flex: 1 }}
                >
                  {event.location}
                </Text>
              </View>
              <View onStartShouldSetResponder={() => true}>
                <RsvpButton event={event} variant="featured" />
              </View>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="person.2" size={12} color="#FFFFFF" />
              <Text
                selectable
                style={{
                  color: "#FFFFFF",
                  fontSize: 12,
                  fontVariant: ["tabular-nums"],
                }}
              >
                {attendeeCount} going
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}

type EventListCardProps = {
  event: EventItem;
  index: number;
};

export function EventListCard({ event, index }: EventListCardProps) {
  const { theme } = useTheme();
  const attendeeCount = useEventsStore((state) =>
    state.getAttendeeCount(event.id, event.attendees)
  );

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <Link href={`/event/${event.id}` as Href} asChild>
        <Pressable
          style={{
            flexDirection: "row",
            backgroundColor: theme.surface,
            borderRadius: radius.card,
            borderWidth: 1,
            borderColor: theme.border,
            padding: 12,
            gap: 12,
          }}
        >
          <Image
            source={{ uri: event.imageUrl }}
            style={{ width: 80, height: 80, borderRadius: 12 }}
            contentFit="cover"
          />
          <View style={{ flex: 1, gap: 6 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Text
                selectable
                style={{
                  color: theme.textPrimary,
                  fontSize: 15,
                  fontWeight: "700",
                  flex: 1,
                }}
              >
                {event.title}
              </Text>
              <TagPill label={event.category} />
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="clock" size={12} color={theme.textMuted} />
              <Text selectable style={{ color: theme.textSecondary, fontSize: 12 }}>
                {event.date} · {event.time}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Icon name="mappin.and.ellipse" size={12} color={theme.textMuted} />
              <Text
                selectable
                numberOfLines={1}
                style={{ color: theme.textSecondary, fontSize: 12, flex: 1 }}
              >
                {event.location}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
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
                  {attendeeCount}
                </Text>
              </View>
              <View onStartShouldSetResponder={() => true}>
                <RsvpButton event={event} />
              </View>
            </View>
          </View>
        </Pressable>
      </Link>
    </Animated.View>
  );
}
