import { useAuth } from "@/providers/auth-provider";
import { Redirect, Tabs, type Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { TabBar } from "@/components/tab-bar";
import { useBackendSync } from "@/hooks/use-backend-sync";
import { useTheme } from "@/hooks/use-theme";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { theme } = useTheme();
  useBackendSync();

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
        sceneStyle: { backgroundColor: theme.background },
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="clubs" options={{ title: "Clubs" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
