import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getEngagementContext } from "@/lib/engagement-context";
import { syncRsvp } from "@/services/engagement";

type EventsState = {
  goingIds: string[];
  attendeeCounts: Record<string, number>;
  toggleRsvp: (id: string, baseAttendees: number) => void;
  isGoing: (id: string) => boolean;
  getAttendeeCount: (id: string, baseAttendees: number) => number;
  hydrate: (data: { goingIds?: string[] }) => void;
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
        const nextGoing = !isGoing;

        set({
          goingIds: nextGoing
            ? [...goingIds, id]
            : goingIds.filter((goingId) => goingId !== id),
          attendeeCounts: {
            ...attendeeCounts,
            [id]: nextGoing ? currentCount + 1 : currentCount - 1,
          },
        });

        const context = getEngagementContext();
        if (context) {
          void syncRsvp(context.client, context.clerkId, id, nextGoing);
        }
      },
      isGoing: (id) => get().goingIds.includes(id),
      getAttendeeCount: (id, baseAttendees) =>
        get().attendeeCounts[id] ?? baseAttendees,
      hydrate: ({ goingIds }) =>
        set((state) => ({
          goingIds: goingIds ?? state.goingIds,
        })),
    }),
    {
      name: "incampo-events-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
