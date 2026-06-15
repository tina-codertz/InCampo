import { colors, type ThemeColors } from "@/constants/theme";
import { useAppStore } from "@/store/use-app-store";

export function useTheme() {
  const colorScheme = useAppStore((state) => state.colorScheme);
  const theme: ThemeColors = colors[colorScheme];

  return {
    colorScheme,
    theme,
    isDark: colorScheme === "dark",
  };
}
