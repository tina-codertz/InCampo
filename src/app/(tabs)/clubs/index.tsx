import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CampusSearchBar } from "@/components/campus-search-bar";
import { FilterChips } from "@/components/filter-chips";
import { Icon } from "@/components/icon";
import { TagPill } from "@/components/student-avatar";
import { CLUB_FILTERS, MOCK_CLUBS } from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import type { Club } from "@/types";

function FeaturedClubCard({ club, index }: { club: Club; index: number }) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
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
          ...{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
          },
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
        <Pressable
          style={{
            backgroundColor: club.isJoined ? "rgba(255,255,255,0.2)" : "#FFFFFF",
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: radius.button,
          }}
        >
          <Text
            selectable
            style={{
              color: club.isJoined ? "#FFFFFF" : "#111827",
              fontWeight: "600",
              fontSize: 13,
            }}
          >
            {club.isJoined ? "Joined ✓" : "Join"}
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          gap: 4,
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
            {club.members} members
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

export default function ClubsScreen() {
  const { theme } = useTheme();
  const [filter, setFilter] = useState<(typeof CLUB_FILTERS)[number]>("All");

  const joinedCount = MOCK_CLUBS.filter((club) => club.isJoined).length;
  const filteredClubs =
    filter === "All"
      ? MOCK_CLUBS
      : MOCK_CLUBS.filter((club) => club.category === filter);

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
            borderRadius: radius.pill,
          }}
        >
          <Text
            selectable
            style={{ color: theme.primary, fontSize: 12, fontWeight: "600" }}
          >
            {joinedCount} joined
          </Text>
        </View>
      </View>

      <CampusSearchBar placeholder="Search clubs..." />

      <FilterChips options={CLUB_FILTERS} selected={filter} onSelect={setFilter} />

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

      {filteredClubs
        .filter((club) => club.featured)
        .map((club, index) => (
          <FeaturedClubCard key={club.id} club={club} index={index} />
        ))}

      <Text
        selectable
        style={{
          color: theme.textMuted,
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 1,
          marginTop: 8,
        }}
      >
        ALL CLUBS
      </Text>

      {filteredClubs.map((club, index) => (
        <FeaturedClubCard key={`all-${club.id}`} club={club} index={index} />
      ))}
    </ScrollView>
  );
}
