import { useQueryClient } from "@tanstack/react-query";
import * as Haptics from "expo-haptics";
import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";

import { AnnouncementCard } from "@/components/announcement-card";
import { CampusSearchBar } from "@/components/campus-search-bar";
import { EmptyState } from "@/components/empty-state";
import { Icon } from "@/components/icon";
import { NotificationBell } from "@/components/notification-bell";
import { FeedSkeletonList } from "@/components/skeleton-loader";
import { StudentAvatar, TagPill } from "@/components/student-avatar";
import { MOCK_STUDENTS, TRENDING_TAGS } from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import {
  filterAnnouncements,
  useAnnouncements,
} from "@/hooks/use-announcements";
import { useTheme } from "@/hooks/use-theme";
import { useProfileStore } from "@/store/use-profile-store";

export default function HomeScreen() {
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  const profile = useProfileStore((state) => state.profile);
  const { data: announcements = [], isLoading, isRefetching, refetch } =
    useAnnouncements();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | undefined>();

  const filteredAnnouncements = useMemo(
    () => filterAnnouncements(announcements, searchQuery, selectedTag),
    [announcements, searchQuery, selectedTag]
  );

  const firstName = profile.fullName.split(" ")[0] ?? "there";

  const handleRefresh = useCallback(async () => {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await queryClient.invalidateQueries({ queryKey: ["announcements"] });
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            selectable
            style={{
              color: theme.textMuted,
              fontSize: 12,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            WELCOME BACK
          </Text>
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
          >
            Incampo
          </Text>
          <Text selectable style={{ color: theme.textSecondary, fontSize: 14 }}>
            Hey {firstName}, here&apos;s what&apos;s happening on campus
          </Text>
        </View>
        <NotificationBell />
      </View>

      <CampusSearchBar
        placeholder="Search announcements, events..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          if (text) setSelectedTag(undefined);
        }}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingVertical: 4 }}
      >
        {MOCK_STUDENTS.map((student) => (
          <StudentAvatar
            key={student.id}
            initials={student.initials}
            color={student.avatarColor}
            name={student.name}
            showName
          />
        ))}
      </ScrollView>

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
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Icon name="chart.line.uptrend.xyaxis" size={18} color={theme.primary} />
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 16, fontWeight: "700" }}
          >
            Trending
          </Text>
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TRENDING_TAGS.map((tag) => {
            const isActive = selectedTag === tag;

            return (
              <TagPill
                key={tag}
                label={tag}
                variant={isActive ? "primary" : "default"}
                onPress={() => {
                  if (process.env.EXPO_OS === "ios") {
                    void Haptics.selectionAsync();
                  }
                  setSelectedTag(isActive ? undefined : tag);
                  setSearchQuery("");
                }}
              />
            );
          })}
        </View>
      </View>

      {isLoading ? (
        <FeedSkeletonList count={3} />
      ) : filteredAnnouncements.length === 0 ? (
        <EmptyState
          title="No announcements found"
          description="Try a different search term or clear your trending filter."
          icon="magnifyingglass"
        />
      ) : (
        filteredAnnouncements.map((announcement, index) => (
          <AnnouncementCard
            key={announcement.id}
            announcement={announcement}
            index={index}
          />
        ))
      )}
    </ScrollView>
  );
}
