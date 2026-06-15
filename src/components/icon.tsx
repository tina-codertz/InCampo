import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleProp, ViewStyle } from "react-native";

import { resolveIconName } from "@/constants/icon-map";

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  weight?: SymbolViewProps["weight"];
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 20, color, weight = "regular", style }: IconProps) {
  const symbol = resolveIconName(name);

  return (
    <SymbolView
      name={symbol}
      size={size}
      tintColor={color}
      weight={weight}
      resizeMode="scaleAspectFit"
      style={[{ width: size, height: size }, style]}
    />
  );
}
