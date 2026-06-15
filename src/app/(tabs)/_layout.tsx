import { useAuth } from "@clerk/clerk-expo";
import { Redirect, Tabs, type Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { TabBar } from "@/components/tab-bar";
import { useTheme } from "@/hooks/use-theme";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();

  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.background,
        }}
      >
        <ActivityIndicator color={theme.primary} />
      </View>
    );
  }

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/login" as Href} />;
  }

  return (
    <Tabs
      tabBar={() => <TabBar />}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="clubs" options={{ title: "Clubs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
