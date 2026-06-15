import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";

import { CampusSearchBar } from "@/components/campus-search-bar";
import {
  ClubListCard,
  FeaturedClubCard,
} from "@/components/club-card";
import { EmptyState } from "@/components/empty-state";
import { FilterChips } from "@/components/filter-chips";
import { ClubsSkeletonList } from "@/components/skeleton-loader";
import { CLUB_FILTERS } from "@/constants/mock-data";
import { spacing } from "@/constants/theme";
import { filterClubs, useClubs } from "@/hooks/use-clubs";
import { useTheme } from "@/hooks/use-theme";
import { useClubsStore } from "@/store/use-clubs-store";

export default function ClubsScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const { data: clubs = [], isLoading, isRefetching, refetch } = useClubs();
  const joinedCount = useClubsStore((state) => state.getJoinedCount());

  const [filter, setFilter] = useState<(typeof CLUB_FILTERS)[number]>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);

  const filteredClubs = useMemo(
    () => filterClubs(clubs, searchQuery, filter, featuredOnly),
    [clubs, searchQuery, filter, featuredOnly]
  );

  const featuredClubs = filteredClubs.filter((club) => club.featured);

  const handleRefresh = useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await queryClient.invalidateQueries({ queryKey: ["clubs"] });
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
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <Text
          selectable
          style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
        >
          Clubs
        </Text>
        <View
          style={{
            backgroundColor: theme.primaryMuted,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 999,
          }}
        >
          <Text
            selectable
            style={{
              color: theme.primary,
              fontSize: 12,
              fontWeight: "600",
              fontVariant: ["tabular-nums"],
            }}
          >
            {joinedCount} joined
          </Text>
        </View>
      </View>

      <CampusSearchBar
        placeholder="Search clubs..."
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
          Showing featured clubs only
        </Text>
      ) : null}

      <FilterChips options={CLUB_FILTERS} selected={filter} onSelect={setFilter} />

      {isLoading ? (
        <ClubsSkeletonList count={3} />
      ) : filteredClubs.length === 0 ? (
        <EmptyState
          title="No clubs found"
          description="Try another category or clear your search and filters."
          icon="person.2"
        />
      ) : (
        <>
          {featuredClubs.length > 0 ? (
            <>
              <Text
                selectable
                style={{
                  color: theme.textMuted,
                  fontSize: 12,
                  fontWeight: "600",
                  letterSpacing: 1,
                }}
              >
                FEATURED
              </Text>
              {featuredClubs.map((club, index) => (
                <FeaturedClubCard key={club.id} club={club} index={index} />
              ))}
            </>
          ) : null}

          <Text
            selectable
            style={{
              color: theme.textMuted,
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 1,
              marginTop: featuredClubs.length > 0 ? 8 : 0,
            }}
          >
            ALL CLUBS
          </Text>

          {filteredClubs.map((club, index) => (
            <ClubListCard key={club.id} club={club} index={index} />
          ))}
        </>
      )}
    </ScrollView>
  );
}
