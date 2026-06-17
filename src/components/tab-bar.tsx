import { BlurView } from "expo-blur";
import { type Href, usePathname, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/icon";
import {
  TAB_BAR_ICON_SIZE,
  TAB_BAR_ITEM_GAP,
  TAB_BAR_LABEL_HEIGHT,
  TAB_BAR_VERTICAL_PADDING,
} from "@/constants/layout";
import { useTheme } from "@/hooks/use-theme";
import type { TabRoute } from "@/types";

type TabItem = {
  route: TabRoute;
  label: string;
  icon: string;
  iconFilled: string;
  href: Href;
};

const TABS: TabItem[] = [
  {
    route: "home",
    label: "Home",
    icon: "house",
    iconFilled: "house.fill",
    href: "/(tabs)/home" as Href,
  },
  {
    route: "events",
    label: "Events",
    icon: "calendar",
    iconFilled: "calendar",
    href: "/(tabs)/events" as Href,
  },
  {
    route: "clubs",
    label: "Clubs",
    icon: "person.2",
    iconFilled: "person.2.fill",
    href: "/(tabs)/clubs" as Href,
  },
  {
    route: "profile",
    label: "Profile",
    icon: "person",
    iconFilled: "person.fill",
    href: "/(tabs)/profile" as Href,
  },
];

export function TabBar() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, isDark } = useTheme();

  const activeRoute = TABS.find((tab) => pathname.includes(tab.route))?.route ?? "home";

  return (
    <BlurView
      intensity={isDark ? 72 : 88}
      tint={isDark ? "dark" : "light"}
      style={{
        width: "100%",
        borderTopWidth: 1,
        borderTopColor: theme.border,
        backgroundColor: theme.tabBar,
        paddingTop: TAB_BAR_VERTICAL_PADDING,
        paddingBottom: Math.max(insets.bottom, TAB_BAR_VERTICAL_PADDING),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-around",
          paddingHorizontal: TAB_BAR_VERTICAL_PADDING,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeRoute === tab.route;

          return (
            <Pressable
              key={tab.route}
              onPress={() => {
                if (process.env.EXPO_OS === "ios") {
                  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                router.push(tab.href);
              }}
              style={{
                alignItems: "center",
                gap: TAB_BAR_ITEM_GAP,
                minWidth: 64,
              }}
            >
              <View
                style={{
                  width: TAB_BAR_ICON_SIZE,
                  height: TAB_BAR_ICON_SIZE,
                  borderRadius: TAB_BAR_ICON_SIZE / 2,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isActive ? theme.primaryMuted : "transparent",
                }}
              >
                <Icon
                  name={isActive ? tab.iconFilled : tab.icon}
                  size={22}
                  color={isActive ? theme.primary : theme.textMuted}
                />
              </View>
              <Text
                style={{
                  fontSize: 11,
                  lineHeight: TAB_BAR_LABEL_HEIGHT,
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? theme.primary : theme.textMuted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}
