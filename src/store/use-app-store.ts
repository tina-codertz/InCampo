import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ColorScheme } from "@/constants/theme";

type AppState = {
  colorScheme: ColorScheme;
  unreadNotificationCount: number;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
  setUnreadNotificationCount: (count: number) => void;
  markAllNotificationsRead: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      colorScheme: "dark",
      unreadNotificationCount: 4,
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set({
          colorScheme: get().colorScheme === "dark" ? "light" : "dark",
        }),
      setUnreadNotificationCount: (count) =>
        set({ unreadNotificationCount: count }),
      markAllNotificationsRead: () => set({ unreadNotificationCount: 0 }),
    }),
    {
      name: "incampo-app-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        colorScheme: state.colorScheme,
      }),
    }
  )
);
