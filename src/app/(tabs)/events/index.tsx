import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { CampusSearchBar } from "@/components/campus-search-bar";
import { EmptyState } from "@/components/empty-state";
import {
  EventListCard,
  FeaturedEventCard,
} from "@/components/event-card";
import { FilterChips } from "@/components/filter-chips";
import { EventsSkeletonList } from "@/components/skeleton-loader";
import { EVENT_FILTERS } from "@/constants/mock-data";
import { spacing } from "@/constants/theme";
import { filterEvents, useEvents } from "@/hooks/use-events";
import { useTheme } from "@/hooks/use-theme";

export default function EventsScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { data: events = [], isLoading, isRefetching, refetch } = useEvents();

  const [filter, setFilter] = useState<(typeof EVENT_FILTERS)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filteredEvents = useMemo(
    () => filterEvents(events, searchQuery, filter, featuredOnly),
    [events, searchQuery, filter, featuredOnly]
  );

  const handleRefresh = useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await queryClient.invalidateQueries({ queryKey: ["events"] });
    await refetch();
  }, [queryClient, refetch]);

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
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={() => void handleRefresh()}
          tintColor={theme.primary}
        />
      }
    >
      <Text
        selectable
        style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
      >
        Events
      </Text>

      <CampusSearchBar
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        showFilter
        onFilterPress={() => {
          if (process.env.EXPO_OS === "ios") {
            void Haptics.selectionAsync();
          }
          setFeaturedOnly((value) => !value);
        }}
      />

      {featuredOnly ? (
        <Text selectable style={{ color: theme.primary, fontSize: 13, fontWeight: "600" }}>
          Showing featured events only
        </Text>
      ) : null}

      <FilterChips options={EVENT_FILTERS} selected={filter} onSelect={setFilter} />

      {isLoading ? (
        <EventsSkeletonList count={3} />
      ) : filteredEvents.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Try another category or clear your search and filters."
          icon="calendar"
        />
      ) : (
        filteredEvents.map((event, index) =>
          event.featured ? (
            <FeaturedEventCard key={event.id} event={event} index={index} />
          ) : (
            <EventListCard key={event.id} event={event} index={index} />
          )
        )
      )}
    </ScrollView>
  );
}
