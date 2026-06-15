import { type Href, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { Pressable, ScrollView, Share, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { Icon } from "@/components/icon";
import { ProfileActivityList } from "@/components/profile-activity-list";
import { ProfileSavedGrid } from "@/components/profile-saved-grid";
import { StudentAvatar } from "@/components/student-avatar";
import { radius, spacing } from "@/constants/theme";
import {
  useProfileActivityItems,
  useProfileSavedItems,
  useProfileStats,
} from "@/hooks/use-profile-content";
import { useTheme } from "@/hooks/use-theme";
import { useAppStore } from "@/store/use-app-store";
import { useProfileStore } from "@/store/use-profile-store";

export default function ProfileScreen() {
  const { theme, colorScheme } = useTheme();
  const router = useRouter();
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);
  const profile = useProfileStore((state) => state.profile);
  const getInitials = useProfileStore((state) => state.getInitials);
  const stats = useProfileStats();
  const savedItems = useProfileSavedItems();
  const activityItems = useProfileActivityItems();
  const [activeTab, setActiveTab] = useState<"saved" | "activity">("saved");

  const headerStats = [
    { label: "Posts", value: stats.posts },
    { label: "Clubs", value: stats.clubs },
    { label: "Saved", value: stats.saved },
  ] as const;

  const engagement = [
    { label: "Liked", value: stats.liked, icon: "heart.fill", color: "#EF4444" },
    {
      label: "Comments",
      value: stats.comments,
      icon: "bubble.left.fill",
      color: "#3B82F6",
    },
    {
      label: "Saved",
      value: stats.saved,
      icon: "bookmark.fill",
      color: "#8B5CF6",
    },
    { label: "Events", value: stats.events, icon: "star.fill", color: "#FBBF24" },
  ] as const;

  function openEditProfile() {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/edit-profile" as Href);
  }

  function openSettings() {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    router.push("/settings" as Href);
  }

  async function handleShareProfile() {
    if (process.env.EXPO_OS === "ios") {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    await Share.share({
      message: `${profile.fullName} (@${profile.username}) on Incampo\n${profile.bio}`,
    });
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
            <Icon
              name={colorScheme === "dark" ? "sun.max" : "moon"}
              size={18}
              color={theme.textPrimary}
            />
          </Pressable>
          <Pressable
            onPress={openSettings}
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

      <Animated.View
        entering={FadeInDown.springify()}
        style={{ alignItems: "center", gap: 12 }}
      >
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

        <View
          style={{
            flexDirection: "row",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
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
          {headerStats.map((stat) => (
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
      </Animated.View>

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
          onPress={() => void handleShareProfile()}
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

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {engagement.map((item, index) => (
          <Animated.View
            key={item.label}
            entering={FadeInDown.delay(index * 60).springify()}
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
          </Animated.View>
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
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                void Haptics.selectionAsync();
              }
              setActiveTab(tab);
            }}
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

      {activeTab === "saved" ? (
        <ProfileSavedGrid items={savedItems} />
      ) : (
        <ProfileActivityList items={activityItems} />
      )}
    </ScrollView>
  );
}
