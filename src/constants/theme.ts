export const radius = {
  card: 20,
  button: 16,
  sheet: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 40,
} as const;

export const colors = {
  light: {
    background: "#F5F5F7",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    primary: "#7C3AED",
    primaryMuted: "rgba(124, 58, 237, 0.12)",
    secondary: "#6366F1",
    border: "rgba(0, 0, 0, 0.08)",
    textPrimary: "#111827",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    urgent: "#DC2626",
    tabBar: "rgba(255, 255, 255, 0.92)",
    overlay: "rgba(0, 0, 0, 0.45)",
  },
  dark: {
    background: "#0A0A0F",
    surface: "#16161E",
    surfaceElevated: "#1E1E28",
    primary: "#8B5CF6",
    primaryMuted: "rgba(139, 92, 246, 0.18)",
    secondary: "#818CF8",
    border: "rgba(255, 255, 255, 0.08)",
    textPrimary: "#FFFFFF",
    textSecondary: "#A1A1AA",
    textMuted: "#71717A",
    success: "#34D399",
    warning: "#FBBF24",
    error: "#F87171",
    urgent: "#EF4444",
    tabBar: "rgba(22, 22, 30, 0.92)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
} as const;

export type ThemeColors = (typeof colors)[ColorScheme];
export type ColorScheme = keyof typeof colors;
