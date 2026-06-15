import { Redirect, type Href } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/providers/auth-provider";

export default function Index() {
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

  if (isSignedIn) {
    return <Redirect href={"/(tabs)/home" as Href} />;
  }

  return <Redirect href={"/(auth)/login" as Href} />;
}
