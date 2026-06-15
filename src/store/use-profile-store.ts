import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { EMPTY_PROFILE } from "@/lib/profile-from-auth";

export type UserProfile = {
  fullName: string;
  username: string;
  classYear: string;
  major: string;
  university: string;
  bio: string;
  avatarColor: string;
  postCount: number;
};

type ProfileState = {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: Partial<UserProfile>) => void;
  replaceProfile: (profile: UserProfile) => void;
  resetProfile: () => void;
  setIsEditing: (isEditing: boolean) => void;
  getInitials: () => string;
};

function getInitialsFromName(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: EMPTY_PROFILE,
      isEditing: false,
      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      replaceProfile: (profile) => set({ profile }),
      resetProfile: () => set({ profile: EMPTY_PROFILE }),
      setIsEditing: (isEditing) => set({ isEditing }),
      getInitials: () => getInitialsFromName(get().profile.fullName),
    }),
    {
      name: "incampo-profile-store",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { getInitialsFromName };
