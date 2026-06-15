import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type NotificationsState = {
  readIds: string[];
  deletedIds: string[];
  markAsRead: (id: string) => void;
  markAllAsRead: (ids: string[]) => void;
  deleteNotification: (id: string) => void;
  isRead: (id: string, defaultRead: boolean) => boolean;
  isDeleted: (id: string) => boolean;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      readIds: [],
      deletedIds: [],
      markAsRead: (id) => {
        const { readIds } = get();
        if (readIds.includes(id)) return;
        set({ readIds: [...readIds, id] });
      },
      markAllAsRead: (ids) => {
        const { readIds } = get();
        const merged = new Set([...readIds, ...ids]);
        set({ readIds: Array.from(merged) });
      },
      deleteNotification: (id) => {
        const { deletedIds, readIds } = get();
        if (deletedIds.includes(id)) return;
        set({
          deletedIds: [...deletedIds, id],
          readIds: readIds.includes(id) ? readIds : [...readIds, id],
        });
      },
      isRead: (id, defaultRead) => get().readIds.includes(id) || defaultRead,
      isDeleted: (id) => get().deletedIds.includes(id),
    }),
    {
      name: "incampo-notifications-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
