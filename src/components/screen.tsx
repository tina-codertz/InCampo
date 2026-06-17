import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import {
  SafeAreaView,
  type Edge,
} from "react-native-safe-area-context";

import { useTheme } from "@/hooks/use-theme";

type ScreenProps = {
  children: ReactNode;
  edges?: Edge[];
  style?: StyleProp<ViewStyle>;
};

export function Screen({
  children,
  edges = ["top", "left", "right"],
  style,
}: ScreenProps) {
  const { theme } = useTheme();

  return (
    <SafeAreaView
      edges={edges}
      style={[{ flex: 1, backgroundColor: theme.background }, style]}
    >
      {children}
    </SafeAreaView>
  );
}
