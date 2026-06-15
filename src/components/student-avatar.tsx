import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type StudentAvatarProps = {
  initials: string;
  color: string;
  size?: number;
  name?: string;
  showName?: boolean;
  onPress?: () => void;
};

export function StudentAvatar({
  initials,
  color,
  size = 56,
  name,
  showName = false,
  onPress,
}: StudentAvatarProps) {
  const { theme } = useTheme();

  const content = (
    <View style={{ alignItems: "center", gap: 8 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: theme.border,
        }}
      >
        <Text
          selectable
          style={{
            color: "#FFFFFF",
            fontSize: size * 0.3,
            fontWeight: "600",
          }}
        >
          {initials}
        </Text>
      </View>
      {showName && name ? (
        <Text
          selectable
          style={{ color: theme.textSecondary, fontSize: 12 }}
          numberOfLines={1}
        >
          {name}
        </Text>
      ) : null}
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}

type StudentAvatarImageProps = {
  uri?: string;
  initials: string;
  color: string;
  size?: number;
};

export function StudentAvatarImage({
  uri,
  initials,
  color,
  size = 56,
}: StudentAvatarImageProps) {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        contentFit="cover"
      />
    );
  }

  return <StudentAvatar initials={initials} color={color} size={size} />;
}

type TagPillProps = {
  label: string;
  variant?: "default" | "urgent" | "category" | "primary";
  onPress?: () => void;
};

export function TagPill({
  label,
  variant = "default",
  onPress,
}: TagPillProps) {
  const { theme } = useTheme();

  const styles = {
    default: {
      backgroundColor: theme.surfaceElevated,
      color: theme.textSecondary,
      borderColor: theme.border,
    },
    urgent: {
      backgroundColor: "rgba(239, 68, 68, 0.15)",
      color: theme.urgent,
      borderColor: "rgba(239, 68, 68, 0.3)",
    },
    category: {
      backgroundColor: "rgba(251, 191, 36, 0.15)",
      color: theme.warning,
      borderColor: "rgba(251, 191, 36, 0.3)",
    },
    primary: {
      backgroundColor: theme.primaryMuted,
      color: theme.primary,
      borderColor: "transparent",
    },
  }[variant];

  const content = (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: radius.pill,
        backgroundColor: styles.backgroundColor,
        borderWidth: 1,
        borderColor: styles.borderColor,
      }}
    >
      <Text
        selectable
        style={{
          color: styles.color,
          fontSize: 11,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{content}</Pressable>;
  }

  return content;
}
