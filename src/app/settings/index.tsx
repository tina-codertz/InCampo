import { type Href, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { type ReactNode } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";

import { CloseButton } from "@/components/icon-button";
import { Icon } from "@/components/icon";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/providers/auth-provider";
import { useAppStore } from "@/store/use-app-store";
import { useProfileStore } from "@/store/use-profile-store";
import { useSettingsStore } from "@/store/use-settings-store";

type SettingsRowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  destructive?: boolean;
};

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showChevron = true,
  destructive = false,
}: SettingsRowProps) {
  const { theme } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 14,
        paddingHorizontal: spacing.sm,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: destructive ? "rgba(239,68,68,0.12)" : theme.primaryMuted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon
          name={icon}
          size={18}
          color={destructive ? theme.error : theme.primary}
        />
      </View>
      <Text
        selectable
        style={{
          flex: 1,
          color: destructive ? theme.error : theme.textPrimary,
          fontSize: 15,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
      {value ? (
        <Text selectable style={{ color: theme.textMuted, fontSize: 14 }}>
          {value}
        </Text>
      ) : null}
      {showChevron && onPress ? (
        <Icon name="chevron.right" size={14} color={theme.textMuted} />
      ) : null}
    </Pressable>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const { theme } = useTheme();

  return (
    <View style={{ gap: spacing.xs }}>
      <Text
        selectable
        style={{
          color: theme.textMuted,
          fontSize: 12,
          fontWeight: "600",
          letterSpacing: 1,
          paddingHorizontal: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: theme.surface,
          borderRadius: radius.card,
          borderWidth: 1,
          borderColor: theme.border,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </View>
  );
}

function NotificationToggle({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        paddingHorizontal: spacing.sm,
      }}
    >
      <Text selectable style={{ color: theme.textPrimary, fontSize: 15 }}>
        {label}
      </Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary }}
      />
    </View>
  );
}

export default function SettingsScreen() {
  const { theme, colorScheme } = useTheme();
  const router = useRouter();
  const { signOut } = useAuth();
  const resetProfile = useProfileStore((state) => state.resetProfile);
  const toggleColorScheme = useAppStore((state) => state.toggleColorScheme);
  const notificationPreferences = useSettingsStore(
    (state) => state.notificationPreferences
  );
  const setNotificationPreference = useSettingsStore(
    (state) => state.setNotificationPreference
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1, backgroundColor: theme.background }}
      contentContainerStyle={{ padding: spacing.sm, gap: spacing.sm }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <CloseButton onPress={() => router.back()} />
        <Text
          selectable
          style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700" }}
        >
          Settings
        </Text>
        <View style={{ width: 44 }} />
      </View>

      <SettingsSection title="ACCOUNT">
        <SettingsRow
          icon="person"
          label="Edit Profile"
          onPress={() => router.push("/edit-profile" as Href)}
        />
        <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 60 }} />
        <SettingsRow
          icon="bell"
          label="Notifications"
          onPress={() => router.push("/notifications" as Href)}
        />
      </SettingsSection>

      <SettingsSection title="APPEARANCE">
        <SettingsRow
          icon="sun.max"
          label="Theme"
          value={colorScheme === "dark" ? "Dark" : "Light"}
          onPress={() => {
            if (process.env.EXPO_OS === "ios") {
              void Haptics.selectionAsync();
            }
            toggleColorScheme();
          }}
          showChevron={false}
        />
      </SettingsSection>

      <SettingsSection title="NOTIFICATION PREFERENCES">
        <NotificationToggle
          label="Announcements"
          value={notificationPreferences.announcements}
          onValueChange={(value) =>
            setNotificationPreference("announcements", value)
          }
        />
        <View style={{ height: 1, backgroundColor: theme.border }} />
        <NotificationToggle
          label="Events"
          value={notificationPreferences.events}
          onValueChange={(value) => setNotificationPreference("events", value)}
        />
        <View style={{ height: 1, backgroundColor: theme.border }} />
        <NotificationToggle
          label="Clubs"
          value={notificationPreferences.clubs}
          onValueChange={(value) => setNotificationPreference("clubs", value)}
        />
        <View style={{ height: 1, backgroundColor: theme.border }} />
        <NotificationToggle
          label="Social"
          value={notificationPreferences.social}
          onValueChange={(value) => setNotificationPreference("social", value)}
        />
      </SettingsSection>

      <SettingsSection title="SUPPORT">
        <SettingsRow
          icon="envelope"
          label="Help & Support"
          onPress={() => {}}
          showChevron={false}
        />
        <View style={{ height: 1, backgroundColor: theme.border, marginLeft: 60 }} />
        <SettingsRow
          icon="lock"
          label="Privacy Policy"
          onPress={() => {}}
          showChevron={false}
        />
      </SettingsSection>

      <SettingsSection title="SESSION">
        <SettingsRow
          icon="arrow.right"
          label="Sign Out"
          destructive
          showChevron={false}
          onPress={async () => {
            await signOut();
            resetProfile();
            router.replace("/(auth)/login" as Href);
          }}
        />
      </SettingsSection>

      <Text
        selectable
        style={{
          color: theme.textMuted,
          fontSize: 12,
          textAlign: "center",
          marginTop: spacing.xs,
        }}
      >
        Incampo · Version 1.0.0
      </Text>
    </ScrollView>
  );
}
