import { makeRedirectUri } from "expo-auth-session";
import { type Href, useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { Icon } from "@/components/icon";
import { Screen } from "@/components/screen";
import { radius, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { createSessionFromUrl } from "@/lib/auth-session";
import { supabase } from "@/lib/supabase";

WebBrowser.maybeCompleteAuthSession();

type AuthMode = "sign-in" | "sign-up";

const redirectTo = makeRedirectUri();

export default function LoginScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);

  async function handleEmailAuth() {
    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      if (mode === "sign-in") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          throw signInError;
        }

        router.replace("/(tabs)/home" as Href);
      } else {
        const username = email.trim().split("@")[0] ?? "student";
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: "",
              username,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        if (data.session) {
          router.replace("/(tabs)/home" as Href);
        } else {
          setInfo("Check your email to verify your account, then sign in.");
        }
      }

      if (process.env.EXPO_OS === "ios") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(message);
      if (process.env.EXPO_OS === "ios") {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Enter your university email first.");
      return;
    }

    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        { redirectTo }
      );

      if (resetError) {
        throw resetError;
      }

      setInfo("Password reset link sent. Check your email.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not send reset email.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleGoogleAuth() {
    setError(null);
    setInfo(null);
    setIsSubmitting(true);

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        throw oauthError;
      }

      if (!data?.url) {
        throw new Error("Google sign in could not be started.");
      }

      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (result.type === "success") {
        await createSessionFromUrl(result.url);
        router.replace("/(tabs)/home" as Href);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Google sign in failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen edges={["top", "left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={process.env.EXPO_OS === "ios" ? "padding" : undefined}
      >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flexGrow: 1,
          padding: spacing.md,
          justifyContent: "center",
          gap: spacing.sm,
        }}
      >
        <View style={{ alignItems: "center", gap: spacing.xs, marginBottom: spacing.sm }}>
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              backgroundColor: theme.primary,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="graduationcap.fill" size={34} color="#FFFFFF" />
          </View>
          <Text
            selectable
            style={{ color: theme.textPrimary, fontSize: 28, fontWeight: "700" }}
          >
            Incampo
          </Text>
          <Text
            selectable
            style={{ color: theme.textSecondary, fontSize: 15, textAlign: "center" }}
          >
            Your university life, all in one place
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            backgroundColor: theme.surface,
            borderRadius: radius.button,
            padding: 4,
            borderWidth: 1,
            borderColor: theme.border,
          }}
        >
          {(["sign-in", "sign-up"] as const).map((item) => {
            const isActive = mode === item;
            return (
              <Pressable
                key={item}
                onPress={() => {
                  setMode(item);
                  setError(null);
                  setInfo(null);
                }}
                style={{
                  flex: 1,
                  paddingVertical: 12,
                  borderRadius: 12,
                  backgroundColor: isActive ? theme.surfaceElevated : "transparent",
                  alignItems: "center",
                }}
              >
                <Text
                  selectable
                  style={{
                    color: isActive ? theme.textPrimary : theme.textMuted,
                    fontWeight: "600",
                  }}
                >
                  {item === "sign-in" ? "Sign In" : "Sign Up"}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={{ gap: spacing.xs }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: theme.surface,
              borderRadius: radius.button,
              borderWidth: 1,
              borderColor: theme.border,
              paddingHorizontal: 16,
            }}
          >
            <Icon name="envelope" size={18} color={theme.textSecondary} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              placeholder="University email"
              placeholderTextColor={theme.textMuted}
              style={{
                flex: 1,
                color: theme.textPrimary,
                fontSize: 16,
                paddingVertical: 14,
              }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: theme.surface,
              borderRadius: radius.button,
              borderWidth: 1,
              borderColor: theme.border,
              paddingHorizontal: 16,
            }}
          >
            <Icon name="lock" size={18} color={theme.textSecondary} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="Password"
              placeholderTextColor={theme.textMuted}
              style={{
                flex: 1,
                color: theme.textPrimary,
                fontSize: 16,
                paddingVertical: 14,
              }}
            />
            <Pressable onPress={() => setShowPassword((value) => !value)} hitSlop={12}>
              <Icon
                name={showPassword ? "eye.slash" : "eye"}
                size={18}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>

          {mode === "sign-in" ? (
            <Pressable
              style={{ alignSelf: "flex-end", paddingVertical: 4 }}
              onPress={() => void handleForgotPassword()}
            >
              <Text selectable style={{ color: theme.primary, fontSize: 14 }}>
                Forgot password?
              </Text>
            </Pressable>
          ) : null}
        </View>

        {error ? (
          <Text selectable style={{ color: theme.error, fontSize: 14 }}>
            {error}
          </Text>
        ) : null}

        {info ? (
          <Text selectable style={{ color: theme.success, fontSize: 14 }}>
            {info}
          </Text>
        ) : null}

        <Pressable
          disabled={isSubmitting || !email || !password}
          onPress={() => void handleEmailAuth()}
          style={{
            backgroundColor: theme.primary,
            borderRadius: radius.button,
            paddingVertical: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            opacity: isSubmitting || !email || !password ? 0.6 : 1,
            boxShadow: `0 8px 24px ${theme.primaryMuted}`,
          }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Icon name="arrow.right" size={18} color="#FFFFFF" />
              <Text selectable style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
                {mode === "sign-in" ? "Sign In" : "Sign Up"}
              </Text>
            </>
          )}
        </Pressable>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <Text selectable style={{ color: theme.textMuted, fontSize: 13 }}>
            or continue with
          </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </View>

        <Pressable
          disabled={isSubmitting}
          onPress={() => void handleGoogleAuth()}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            backgroundColor: theme.surface,
            borderRadius: radius.button,
            borderWidth: 1,
            borderColor: theme.border,
            paddingVertical: 14,
          }}
        >
          <Text selectable style={{ fontSize: 18 }}>
            G
          </Text>
          <Text selectable style={{ color: theme.textPrimary, fontWeight: "600" }}>
            Continue with Google
          </Text>
        </Pressable>

        <Text
          selectable
          style={{
            color: theme.textMuted,
            fontSize: 12,
            textAlign: "center",
            lineHeight: 18,
            marginTop: spacing.xs,
          }}
        >
          By continuing, you agree to our{" "}
          <Text style={{ color: theme.primary }}>Terms of Service</Text> and{" "}
          <Text style={{ color: theme.primary }}>Privacy Policy</Text>.
        </Text>
      </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
