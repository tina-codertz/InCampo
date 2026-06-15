import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CampusSearchBar } from "@/components/campus-search-bar";
import { FilterChips } from "@/components/filter-chips";
import { Icon } from "@/components/icon";
import { TagPill } from "@/components/student-avatar";
import { EVENT_FILTERS, MOCK_EVENTS } from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { EventItem } from "@/types";

function FeaturedEventCard({ event }: { event: EventItem }) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        borderRadius: radius.card,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Image
        source={{ uri: event.imageUrl }}
        style={{ width: "100%", height: 200 }}
        contentFit="cover"
      />
      <View
        style={{
          position: "absolute",
          top: 12,
          left: 12,
        }}
      >
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
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="mappin.and.ellipse" size={14} color="#FFFFFF" />
            <Text selectable style={{ color: "#FFFFFF", fontSize: 13 }}>
              {event.location}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: radius.button,
            }}
          >
            <Text selectable style={{ color: "#FFFFFF", fontWeight: "600" }}>
              RSVP
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function EventListCard({ event, index }: { event: EventItem; index: number }) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
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
            style={{ color: theme.textPrimary, fontSize: 15, fontWeight: "700", flex: 1 }}
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
          <Text selectable style={{ color: theme.textSecondary, fontSize: 12 }}>
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
              {event.attendees}
            </Text>
          </View>
          <Pressable
            style={{
              backgroundColor: event.isGoing ? theme.primaryMuted : theme.surfaceElevated,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: radius.button,
              borderWidth: 1,
              borderColor: event.isGoing ? theme.primary : theme.border,
            }}
          >
            <Text
              selectable
              style={{
                color: event.isGoing ? theme.primary : theme.textSecondary,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {event.isGoing ? "Going ✓" : "RSVP"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export default function EventsScreen() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<(typeof EVENT_FILTERS)[number]>("All");

  const filteredEvents =
    filter === "All"
      ? MOCK_EVENTS
      : MOCK_EVENTS.filter((event) => event.category === filter);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        padding: spacing.sm,
        paddingBottom: 120,
        gap: spacing.sm,
        backgroundColor: theme.background,
      }}
      style={{ flex: 1, backgroundColor: theme.background }}
    >
      <Text
        selectable
        style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
      >
        Events
      </Text>

      <CampusSearchBar
        placeholder="Search events..."
        showFilter
      />

      <FilterChips options={EVENT_FILTERS} selected={filter} onSelect={setFilter} />

      {filteredEvents.map((event, index) =>
        event.featured ? (
          <FeaturedEventCard key={event.id} event={event} />
        ) : (
          <EventListCard key={event.id} event={event} index={index} />
        )
      )}
    </ScrollView>
  );
}
