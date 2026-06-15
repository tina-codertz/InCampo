import { ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { CampusSearchBar } from "@/components/campus-search-bar";
import { Icon } from "@/components/icon";
import { NotificationBell } from "@/components/notification-bell";
import { StudentAvatar, TagPill } from "@/components/student-avatar";
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_STUDENTS,
  TRENDING_TAGS,
} from "@/constants/mock-data";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

function AnnouncementCard({
  announcement,
  index,
}: {
  announcement: (typeof MOCK_ANNOUNCEMENTS)[number];
  index: number;
}) {
  const { theme } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80).springify()}
      style={{
        backgroundColor: theme.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: theme.border,
        padding: spacing.sm,
        gap: spacing.xs,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <StudentAvatar
            initials={announcement.authorInitials}
            color={announcement.authorColor}
            size={40}
          />
          <View style={{ gap: 4 }}>
            <Text
              selectable
              style={{ color: theme.textPrimary, fontWeight: "600", fontSize: 15 }}
            >
              {announcement.authorName}
            </Text>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {announcement.isUrgent ? <TagPill label="URGENT" variant="urgent" /> : null}
              <TagPill label={announcement.category} variant="category" />
            </View>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <Text selectable style={{ color: theme.textMuted, fontSize: 12 }}>
            {announcement.timestamp}
          </Text>
          <Icon name="chevron.right" size={14} color={theme.textMuted} />
        </View>
      </View>

      <Text
        selectable
        style={{
          color: theme.textPrimary,
          fontSize: 17,
          fontWeight: "700",
          marginTop: 4,
        }}
      >
        {announcement.title}
      </Text>
      <Text selectable style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}>
        {announcement.body}
      </Text>

      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {announcement.tags.map((tag) => (
          <TagPill key={tag} label={tag} />
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="heart" size={18} color={theme.textMuted} />
            <Text
              selectable
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                fontVariant: ["tabular-nums"],
              }}
            >
              {announcement.likes}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="bubble.left" size={18} color={theme.textMuted} />
            <Text
              selectable
              style={{
                color: theme.textSecondary,
                fontSize: 13,
                fontVariant: ["tabular-nums"],
              }}
            >
              {announcement.comments}
            </Text>
          </View>
          <Icon name="square.and.arrow.up" size={18} color={theme.textMuted} />
        </View>
        <Icon name="bookmark" size={18} color={theme.textMuted} />
      </View>
    </Animated.View>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();

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
        </View>
        <NotificationBell />
      </View>

      <CampusSearchBar placeholder="Search announcements, events..." />

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
          {TRENDING_TAGS.map((tag) => (
            <TagPill key={tag} label={tag} variant="primary" />
          ))}
        </View>
      </View>

      {MOCK_ANNOUNCEMENTS.map((announcement, index) => (
        <AnnouncementCard
          key={announcement.id}
          announcement={announcement}
          index={index}
        />
      ))}
    </ScrollView>
  );
}
