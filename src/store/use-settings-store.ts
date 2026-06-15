import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NotificationPreferences = {
  announcements: boolean;
  events: boolean;
  clubs: boolean;
  social: boolean;
};

type SettingsState = {
  notificationPreferences: NotificationPreferences;
  setNotificationPreference: (
    key: keyof NotificationPreferences,
    value: boolean
  ) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      notificationPreferences: {
        announcements: true,
        events: true,
        clubs: true,
        social: true,
      },
      setNotificationPreference: (key, value) =>
        set({
          notificationPreferences: {
            ...get().notificationPreferences,
            [key]: value,
          },
        }),
    }),
    {
      name: "incampo-settings-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
