import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { CloseButton } from "@/components/icon-button";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useSupabase, useUserId } from "@/hooks/use-supabase";
import { upsertProfile } from "@/services/profiles";
import { useProfileStore } from "@/store/use-profile-store";

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const client = useSupabase();
  const userId = useUserId();
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const [fullName, setFullName] = useState(profile.fullName);
  const [username, setUsername] = useState(profile.username);
  const [classYear, setClassYear] = useState(profile.classYear);
  const [major, setMajor] = useState(profile.major);
  const [university, setUniversity] = useState(profile.university);
  const [bio, setBio] = useState(profile.bio);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);

    const nextProfile = {
      fullName: fullName.trim(),
      username: username.trim(),
      classYear: classYear.trim(),
      major: major.trim(),
      university: university.trim(),
      bio: bio.trim(),
      avatarColor: profile.avatarColor,
      postCount: profile.postCount,
    };

    setProfile(nextProfile);

    try {
      if (userId) {
        await upsertProfile(client, userId, nextProfile);
      }

      if (process.env.EXPO_OS === "ios") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      router.back();
    } catch {
      if (process.env.EXPO_OS === "ios") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsSaving(false);
    }
  }

  function Field({
    label,
    value,
    onChangeText,
    multiline = false,
  }: {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    multiline?: boolean;
  }) {
    return (
      <View style={{ gap: 8 }}>
        <Text selectable style={{ color: theme.textSecondary, fontSize: 13, fontWeight: "600" }}>
          {label}
        </Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          placeholder={label}
          placeholderTextColor={theme.textMuted}
          style={{
            backgroundColor: theme.surface,
            borderRadius: radius.button,
            borderWidth: 1,
            borderColor: theme.border,
            color: theme.textPrimary,
            fontSize: 15,
            paddingHorizontal: 16,
            paddingVertical: multiline ? 14 : 12,
            minHeight: multiline ? 100 : undefined,
            textAlignVertical: multiline ? "top" : "center",
          }}
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: spacing.sm,
          paddingTop: spacing.sm,
          paddingBottom: spacing.xs,
        }}
      >
        <CloseButton onPress={() => router.back()} />
        <Text
          selectable
          style={{ color: theme.textPrimary, fontSize: 18, fontWeight: "700" }}
        >
          Edit Profile
        </Text>
        <Pressable
          onPress={() => void handleSave()}
          disabled={isSaving}
          hitSlop={12}
          style={{ minHeight: 44, justifyContent: "center", paddingHorizontal: 4 }}
        >
          <Text
            selectable
            style={{
              color: theme.primary,
              fontSize: 16,
              fontWeight: "700",
              opacity: isSaving ? 0.5 : 1,
            }}
          >
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          padding: spacing.sm,
          gap: spacing.sm,
        }}
      >
        <Field label="Full name" value={fullName} onChangeText={setFullName} />
        <Field label="Username" value={username} onChangeText={setUsername} />
        <Field label="Class year" value={classYear} onChangeText={setClassYear} />
        <Field label="Major" value={major} onChangeText={setMajor} />
        <Field label="University" value={university} onChangeText={setUniversity} />
        <Field label="Bio" value={bio} onChangeText={setBio} multiline />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
