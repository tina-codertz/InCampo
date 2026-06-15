import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type UserProfile = {
  fullName: string;
  username: string;
  classYear: string;
  major: string;
  university: string;
  bio: string;
  avatarColor: string;
};

export const DEFAULT_PROFILE: UserProfile = {
  fullName: "Alex Rivera",
  username: "alex.rivera",
  classYear: "CS '27",
  major: "Computer Science",
  university: "State University",
  bio: "Building cool things with code. ML enthusiast · Entrepreneurship Hub member · Photography lover",
  avatarColor: "#8B5CF6",
};

type ProfileState = {
  profile: UserProfile;
  isEditing: boolean;
  setProfile: (profile: Partial<UserProfile>) => void;
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
      profile: DEFAULT_PROFILE,
      isEditing: false,
      setProfile: (updates) =>
        set((state) => ({
          profile: { ...state.profile, ...updates },
        })),
      resetProfile: () => set({ profile: DEFAULT_PROFILE }),
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
