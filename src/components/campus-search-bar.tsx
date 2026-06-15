import { Link, type Href } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, TextInput, View } from "react-native";

import { Icon } from "@/components/icon";
import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type CampusSearchBarProps = {
  placeholder: string;
  value?: string;
  onChangeText?: (text: string) => void;
  showFilter?: boolean;
  onFilterPress?: () => void;
};

export function CampusSearchBar({
  placeholder,
  value,
  onChangeText,
  showFilter = false,
  onFilterPress,
}: CampusSearchBarProps) {
  const { theme } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.surface,
        borderRadius: radius.button,
        borderWidth: 1,
        borderColor: theme.border,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
      }}
    >
      <Icon name="magnifyingglass" size={18} color={theme.textSecondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textMuted}
        style={{
          flex: 1,
          color: theme.textPrimary,
          fontSize: 15,
        }}
      />
      {showFilter ? (
        <Pressable onPress={onFilterPress} hitSlop={8}>
          <Icon name="slider.horizontal.3" size={18} color={theme.textSecondary} />
        </Pressable>
      ) : null}
    </View>
  );
}
