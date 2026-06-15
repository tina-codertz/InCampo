import * as Haptics from "expo-haptics";
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";

import { Icon } from "@/components/icon";
import { useTheme } from "@/hooks/use-theme";

export const TOUCH_TARGET = 44;
export const EXPANDED_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type IconButtonVariant = "ghost" | "surface" | "overlay";

type IconButtonProps = Omit<PressableProps, "children" | "style"> & {
  icon: string;
  iconSize?: number;
  color?: string;
  variant?: IconButtonVariant;
  style?: StyleProp<ViewStyle>;
  haptic?: boolean;
};

export function IconButton({
  icon,
  iconSize = 18,
  color,
  variant = "surface",
  style,
  haptic = true,
  onPress,
  ...props
}: IconButtonProps) {
  const { theme } = useTheme();
  const iconColor =
    color ?? (variant === "overlay" ? "#FFFFFF" : theme.textPrimary);

  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={EXPANDED_HIT_SLOP}
      onPress={(event) => {
        if (haptic && process.env.EXPO_OS === "ios") {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        onPress?.(event);
      }}
      style={({ pressed }) => [
        {
          width: TOUCH_TARGET,
          height: TOUCH_TARGET,
          borderRadius: TOUCH_TARGET / 2,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.75 : 1,
          backgroundColor:
            variant === "ghost"
              ? "transparent"
              : variant === "overlay"
                ? theme.overlay
                : theme.surface,
          borderWidth: variant === "surface" ? 1 : 0,
          borderColor: variant === "surface" ? theme.border : "transparent",
        },
        style,
      ]}
      {...props}
    >
      <Icon name={icon} size={iconSize} color={iconColor} />
    </Pressable>
  );
}

type BackButtonProps = {
  onPress: () => void;
  variant?: IconButtonVariant;
};

export function BackButton({ onPress, variant = "overlay" }: BackButtonProps) {
  return (
    <IconButton
      accessibilityLabel="Go back"
      icon="arrow.left"
      iconSize={16}
      variant={variant}
      onPress={onPress}
    />
  );
}

type CloseButtonProps = {
  onPress: () => void;
};

export function CloseButton({ onPress }: CloseButtonProps) {
  return (
    <IconButton
      accessibilityLabel="Close"
      icon="xmark"
      iconSize={14}
      variant="surface"
      onPress={onPress}
    />
  );
}
