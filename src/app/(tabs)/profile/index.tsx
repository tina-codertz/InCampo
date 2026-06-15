import { Image } from "expo-image";
import { type Href, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { StudentAvatar } from "@/components/student-avatar";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { useClubsStore } from "@/store/use-clubs-store";
import { useProfileStore } from "@/store/use-profile-store";

const STATS_BASE = [
  { label: "Posts", value: "27", icon: "square.grid.2x2", color: "#8B5CF6" },
  { label: "Clubs", icon: "person.2", color: "#34D399" },
  { label: "Saved", value: "12", icon: "bookmark", color: "#60A5FA" },
] as const;

const ENGAGEMENT = [
  { label: "Liked", value: "84", icon: "heart.fill", color: "#EF4444" },
  { label: "Comments", value: "31", icon: "bubble.left.fill", color: "#3B82F6" },
  { label: "Saved", value: "12", icon: "bookmark.fill", color: "#8B5CF6" },
  { label: "Events", value: "5", icon: "star.fill", color: "#FBBF24" },
] as const;

const SAVED_IMAGES = [
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80",
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&q=80",
];

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);
  const profile = useProfileStore((state) => state.profile);
  const getInitials = useProfileStore((state) => state.getInitials);
  const joinedClubCount = useClubsStore((state) => state.getJoinedCount());
  const [activeTab, setActiveTab] = useState<"saved" | "activity">("saved");

  const stats = STATS_BASE.map((stat) =>
    stat.label === "Clubs"
      ? { ...stat, value: String(joinedClubCount) }
      : stat
  );

  function openEditProfile() {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/edit-profile" as Href);
  }

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
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          selectable
          style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
        >
          Profile
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                void Haptics.selectionAsync();
              }
              toggleColorScheme();
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="sun.max" size={18} color={theme.textPrimary} />
          </Pressable>
          <Pressable
            onPress={openEditProfile}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.border,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="gearshape" size={18} color={theme.textPrimary} />
          </Pressable>
        </View>
      </View>

      <View style={{ alignItems: "center", gap: 12 }}>
        <Pressable onPress={openEditProfile} style={{ position: "relative" }}>
          <StudentAvatar
            initials={getInitials()}
            color={profile.avatarColor}
            size={96}
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: theme.secondary,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: theme.background,
            }}
          >
            <Icon name="pencil" size={12} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={{ alignItems: "center", gap: 4 }}>
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 22, fontWeight: "700" }}
          >
            {profile.fullName}
          </Text>
          <Text selectable style={{ color: theme.textSecondary, fontSize: 14 }}>
            @{profile.username} · {profile.classYear}
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="graduationcap" size={14} color={theme.textMuted} />
            <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
              {profile.major}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Icon name="mappin.and.ellipse" size={14} color={theme.textMuted} />
            <Text selectable style={{ color: theme.textSecondary, fontSize: 13 }}>
              {profile.university}
            </Text>
          </View>
        </View>

        <Text
          selectable
          style={{
            color: theme.textSecondary,
            fontSize: 14,
            textAlign: "center",
            lineHeight: 20,
            paddingHorizontal: 16,
          }}
        >
          {profile.bio}
        </Text>

        <View style={{ flexDirection: "row", gap: 24 }}>
          {stats.map((stat) => (
            <View key={stat.label} style={{ alignItems: "center", gap: 2 }}>
              <Text
                selectable
                style={{
                  color: theme.textPrimary,
                  fontSize: 18,
                  fontWeight: "700",
                  fontVariant: ["tabular-nums"],
                }}
              >
                {stat.value}
              </Text>
              <Text selectable style={{ color: theme.textMuted, fontSize: 12 }}>
                {stat.label}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12 }}>
        <Pressable
          onPress={openEditProfile}
          style={{
            flex: 1,
            backgroundColor: theme.primary,
            paddingVertical: 14,
            borderRadius: radius.button,
            alignItems: "center",
          }}
        >
          <Text selectable style={{ color: "#FFFFFF", fontWeight: "600" }}>
            Edit Profile
          </Text>
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            backgroundColor: theme.surface,
            paddingVertical: 14,
            borderRadius: radius.button,
            alignItems: "center",
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          <Text selectable style={{ color: theme.textPrimary, fontWeight: "600" }}>
            Share
          </Text>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {ENGAGEMENT.map((item) => (
          <View
            key={item.label}
            style={{
              width: "47%",
              backgroundColor: theme.surface,
              borderRadius: radius.card,
              borderWidth: 1,
              borderColor: theme.border,
              padding: spacing.sm,
              gap: 8,
            }}
          >
            <Icon name={item.icon} size={20} color={item.color} />
            <Text
              selectable
              style={{
                color: theme.textPrimary,
                fontSize: 22,
                fontWeight: "700",
                fontVariant: ["tabular-nums"],
              }}
            >
              {item.value}
            </Text>
            <Text selectable style={{ color: theme.textMuted, fontSize: 13 }}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: theme.surface,
          borderRadius: radius.button,
          padding: 4,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        {(["saved", "activity"] as const).map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor:
                activeTab === tab ? theme.surfaceElevated : "transparent",
              alignItems: "center",
            }}
          >
            <Text
              selectable
              style={{
                color: activeTab === tab ? theme.textPrimary : theme.textMuted,
                fontWeight: "600",
                textTransform: "capitalize",
              }}
            >
              {tab}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: "row", gap: 8 }}>
        {SAVED_IMAGES.map((uri) => (
          <Image
            key={uri}
            source={{ uri }}
            style={{
              flex: 1,
              height: 140,
              borderRadius: radius.card,
            }}
            contentFit="cover"
          />
        ))}
      </View>
    </ScrollView>
  );
}
