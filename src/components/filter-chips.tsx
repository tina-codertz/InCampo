import * as Haptics from "expo-haptics";
import { Pressable, ScrollView, Text } from "react-native";

import { radius } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type FilterChipsProps<T extends string> = {
  options: readonly T[];
  selected: T;
  onSelect: (option: T) => void;
};

export function FilterChips<T extends string>({
  options,
  selected,
  onSelect,
}: FilterChipsProps<T>) {
  const { theme } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
    >
      {options.map((option) => {
        const isActive = option === selected;

        return (
          <Pressable
            key={option}
            onPress={() => {
              if (process.env.EXPO_OS === "ios") {
                void Haptics.selectionAsync();
              }
              onSelect(option);
            }}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: radius.pill,
              backgroundColor: isActive ? theme.primary : theme.surface,
              borderWidth: 1,
              borderColor: isActive ? theme.primary : theme.border,
            }}
          >
            <Text
              selectable
              style={{
                color: isActive ? "#FFFFFF" : theme.textSecondary,
                fontSize: 14,
                fontWeight: isActive ? "600" : "500",
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
