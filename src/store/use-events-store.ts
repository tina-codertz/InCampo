import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type EventsState = {
  goingIds: string[];
  attendeeCounts: Record<string, number>;
  toggleRsvp: (id: string, baseAttendees: number) => void;
  isGoing: (id: string) => boolean;
  getAttendeeCount: (id: string, baseAttendees: number) => number;
};

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      goingIds: ["2"],
      attendeeCounts: {},
      toggleRsvp: (id, baseAttendees) => {
        const { goingIds, attendeeCounts } = get();
        const isGoing = goingIds.includes(id);
        const currentCount = attendeeCounts[id] ?? baseAttendees;

        set({
          goingIds: isGoing
            ? goingIds.filter((goingId) => goingId !== id)
            : [...goingIds, id],
          attendeeCounts: {
            ...attendeeCounts,
            [id]: isGoing ? currentCount - 1 : currentCount + 1,
          },
        });
      },
      isGoing: (id) => get().goingIds.includes(id),
      getAttendeeCount: (id, baseAttendees) =>
        get().attendeeCounts[id] ?? baseAttendees,
    }),
    {
      name: "incampo-events-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
