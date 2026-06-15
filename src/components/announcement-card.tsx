import * as Haptics from "expo-haptics";
import { useCallback } from "react";
import { Pressable, Share, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  FadeInDown,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { Icon } from "@/components/icon";
import { StudentAvatar, TagPill } from "@/components/student-avatar";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useFeedStore } from "@/store/use-feed-store";
import type { Announcement } from "@/types";

const SWIPE_THRESHOLD = 72;

type AnnouncementCardProps = {
  announcement: Announcement;
  index: number;
};

export function AnnouncementCard({ announcement, index }: AnnouncementCardProps) {
  const { theme } = useTheme();
  const translateX = useSharedValue(0);
  const heartScale = useSharedValue(0);
  const heartOpacity = useSharedValue(0);

  const isLiked = useFeedStore((state) => state.isLiked(announcement.id));
  const isBookmarked = useFeedStore((state) => state.isBookmarked(announcement.id));
  const likeCount = useFeedStore((state) =>
    state.getLikeCount(announcement.id, announcement.likes)
  );
  const toggleLike = useFeedStore((state) => state.toggleLike);
  const toggleBookmark = useFeedStore((state) => state.toggleBookmark);

  const triggerHaptic = useCallback((type: "light" | "success" | "medium") => {
    if (process.env.EXPO_OS !== "ios") return;

    if (type === "success") {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    void Haptics.impactAsync(
      type === "medium"
        ? Haptics.ImpactFeedbackStyle.Medium
        : Haptics.ImpactFeedbackStyle.Light
    );
  }, []);

  const handleLike = useCallback(() => {
    toggleLike(announcement.id, announcement.likes);
    triggerHaptic("light");
  }, [announcement.id, announcement.likes, toggleLike, triggerHaptic]);

  const handleDoubleTapLike = useCallback(() => {
    if (!isLiked) {
      toggleLike(announcement.id, announcement.likes);
    }
    triggerHaptic("medium");
    heartScale.value = withSequence(
      withSpring(1.2, { damping: 8 }),
      withTiming(0, { duration: 220 })
    );
    heartOpacity.value = withSequence(
      withTiming(1, { duration: 120 }),
      withTiming(0, { duration: 280 })
    );
  }, [
    announcement.id,
    announcement.likes,
    heartOpacity,
    heartScale,
    isLiked,
    toggleLike,
    triggerHaptic,
  ]);

  const handleBookmark = useCallback(() => {
    toggleBookmark(announcement.id);
    triggerHaptic("success");
  }, [announcement.id, toggleBookmark, triggerHaptic]);

  const handleShare = useCallback(async () => {
    triggerHaptic("light");
    await Share.share({
      title: announcement.title,
      message: `${announcement.title}\n\n${announcement.body}`,
    });
  }, [announcement.body, announcement.title, triggerHaptic]);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX <= -SWIPE_THRESHOLD) {
        runOnJS(handleBookmark)();
      } else if (event.translationX >= SWIPE_THRESHOLD) {
        runOnJS(handleShare)();
      }

      translateX.value = withSpring(0, { damping: 18, stiffness: 220 });
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDelay(250)
    .onEnd(() => {
      runOnJS(handleDoubleTapLike)();
    });

  const composedGesture = Gesture.Simultaneous(
    panGesture,
    Gesture.Exclusive(doubleTapGesture, Gesture.Tap())
  );

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    opacity: heartOpacity.value,
    transform: [{ scale: heartScale.value }],
  }));

  const saveHintStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < -20 ? Math.min(Math.abs(translateX.value) / 60, 1) : 0,
  }));

  const shareHintStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 20 ? Math.min(translateX.value / 60, 1) : 0,
  }));

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).springify()}>
      <View style={{ position: "relative" }}>
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 16,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            },
            saveHintStyle,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Icon
              name={isBookmarked ? "bookmark.fill" : "bookmark"}
              size={22}
              color={theme.primary}
            />
            <Text style={{ color: theme.primary, fontWeight: "600" }}>Save</Text>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            {
              position: "absolute",
              right: 16,
              top: 0,
              bottom: 0,
              justifyContent: "center",
            },
            shareHintStyle,
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={{ color: theme.secondary, fontWeight: "600" }}>Share</Text>
            <Icon name="square.and.arrow.up" size={22} color={theme.secondary} />
          </View>
        </Animated.View>

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            style={[
              {
                backgroundColor: theme.surface,
                borderRadius: radius.card,
                borderWidth: 1,
                borderColor: theme.border,
                padding: spacing.sm,
                gap: spacing.xs,
                overflow: "hidden",
              },
              cardAnimatedStyle,
            ]}
          >
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: "absolute",
                  top: "40%",
                  left: "42%",
                  zIndex: 2,
                },
                heartAnimatedStyle,
              ]}
            >
              <Icon name="heart.fill" size={72} color={theme.error} />
            </Animated.View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <StudentAvatar
                  initials={announcement.authorInitials}
                  color={announcement.authorColor}
                  size={40}
                />
                <View style={{ gap: 4 }}>
                  <Text
                    selectable
                    style={{
                      color: theme.textPrimary,
                      fontWeight: "600",
                      fontSize: 15,
                    }}
                  >
                    {announcement.authorName}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 6 }}>
                    {announcement.isUrgent ? (
                      <TagPill label="URGENT" variant="urgent" />
                    ) : null}
                    <TagPill label={announcement.category} variant="category" />
                  </View>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <Text selectable style={{ color: theme.textMuted, fontSize: 12 }}>
                  {announcement.timestamp}
                </Text>
                <Icon name="chevron.right" size={14} color={theme.textMuted} />
              </View>
            </View>

            <Text
              selectable
              style={{
                color: theme.textPrimary,
                fontSize: 17,
                fontWeight: "700",
                marginTop: 4,
              }}
            >
              {announcement.title}
            </Text>
            <Text
              selectable
              style={{ color: theme.textSecondary, fontSize: 14, lineHeight: 20 }}
            >
              {announcement.body}
            </Text>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {announcement.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: 4,
              }}
            >
              <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                <Pressable
                  onPress={handleLike}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                  hitSlop={8}
                >
                  <Icon
                    name={isLiked ? "heart.fill" : "heart"}
                    size={18}
                    color={isLiked ? theme.error : theme.textMuted}
                  />
                  <Text
                    selectable
                    style={{
                      color: isLiked ? theme.error : theme.textSecondary,
                      fontSize: 13,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {likeCount}
                  </Text>
                </Pressable>

                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Icon name="bubble.left" size={18} color={theme.textMuted} />
                  <Text
                    selectable
                    style={{
                      color: theme.textSecondary,
                      fontSize: 13,
                      fontVariant: ["tabular-nums"],
                    }}
                  >
                    {announcement.comments}
                  </Text>
                </View>

                <Pressable onPress={() => void handleShare()} hitSlop={8}>
                  <Icon name="square.and.arrow.up" size={18} color={theme.textMuted} />
                </Pressable>
              </View>

              <Pressable onPress={handleBookmark} hitSlop={8}>
                <Icon
                  name={isBookmarked ? "bookmark.fill" : "bookmark"}
                  size={18}
                  color={isBookmarked ? theme.primary : theme.textMuted}
                />
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Animated.View>
  );
}
