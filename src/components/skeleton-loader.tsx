import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

function SkeletonBlock({
  width,
  height,
  opacity,
}: {
  width: number | `${number}%`;
  height: number;
  opacity: SharedValue<number>;
}) {
  const { theme } = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: 12,
          backgroundColor: theme.surfaceElevated,
        },
        animatedStyle,
      ]}
    />
  );
}

export function AnnouncementCardSkeleton() {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.45, { duration: 700 })
      ),
      -1,
      false
    );
  }, [opacity]);

  return (
    <View
      style={{
        backgroundColor: theme.surface,
        borderRadius: radius.card,
        borderWidth: 1,
        borderColor: theme.border,
        padding: spacing.sm,
        gap: spacing.xs,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <SkeletonBlock width={40} height={40} opacity={opacity} />
        <View style={{ flex: 1, gap: 8 }}>
          <SkeletonBlock width="45%" height={14} opacity={opacity} />
          <SkeletonBlock width="30%" height={12} opacity={opacity} />
        </View>
      </View>
      <SkeletonBlock width="80%" height={18} opacity={opacity} />
      <SkeletonBlock width="100%" height={14} opacity={opacity} />
      <SkeletonBlock width="92%" height={14} opacity={opacity} />
      <View style={{ flexDirection: "row", gap: 8 }}>
        <SkeletonBlock width={72} height={24} opacity={opacity} />
        <SkeletonBlock width={72} height={24} opacity={opacity} />
      </View>
    </View>
  );
}

export function FeedSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <AnnouncementCardSkeleton key={`skeleton-${index}`} />
      ))}
    </>
  );
}

export function EventCardSkeleton() {
  const { theme } = useTheme();
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 700 }),
        withTiming(0.45, { duration: 700 })
      ),
      -1,
      false
    );
  }, [opacity]);

  return (
    <View
      style={{
        borderRadius: radius.card,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.surface,
      }}
    >
      <SkeletonBlock width="100%" height={200} opacity={opacity} />
      <View style={{ padding: spacing.sm, gap: 8 }}>
        <SkeletonBlock width="70%" height={18} opacity={opacity} />
        <SkeletonBlock width="50%" height={14} opacity={opacity} />
        <SkeletonBlock width="90%" height={14} opacity={opacity} />
      </View>
    </View>
  );
}

export function EventsSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <EventCardSkeleton key={`event-skeleton-${index}`} />
      ))}
    </>
  );
}
