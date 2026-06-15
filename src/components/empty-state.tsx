import { Text, View } from "react-native";

import { Icon } from "@/components/icon";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: string;
};

export function EmptyState({
  title,
  description,
  icon = "magnifyingglass",
}: EmptyStateProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: spacing.md,
        gap: spacing.xs,
        backgroundColor: theme.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.primaryMuted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon name={icon} size={24} color={theme.primary} />
      </View>
      <Text
        selectable
        style={{
          color: theme.textPrimary,
          fontSize: 17,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        selectable
        style={{
          color: theme.textSecondary,
          fontSize: 14,
          textAlign: "center",
          lineHeight: 20,
        }}
      >
        {description}
      </Text>
    </View>
  );
}
