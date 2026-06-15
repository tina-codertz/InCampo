import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ColorScheme } from "@/constants/theme";

type AppState = {
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleColorScheme: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      colorScheme: "dark",
      setColorScheme: (scheme) => set({ colorScheme: scheme }),
      toggleColorScheme: () =>
        set({
          colorScheme: get().colorScheme === "dark" ? "light" : "dark",
        }),
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
