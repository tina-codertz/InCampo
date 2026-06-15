import type { User } from "@supabase/supabase-js";

import type { UserProfile } from "@/store/use-profile-store";

export const EMPTY_PROFILE: UserProfile = {
  fullName: "",
  username: "",
  classYear: "",
  major: "",
  university: "",
  bio: "",
  avatarColor: "#8B5CF6",
  postCount: 0,
};

/** @deprecated Demo seed only — never use as a live user default */
export const DEMO_PROFILE: UserProfile = {
  fullName: "Alex Rivera",
  username: "alex.rivera",
  classYear: "CS '27",
  major: "Computer Science",
  university: "State University",
  bio: "Building cool things with code. ML enthusiast · Entrepreneurship Hub member · Photography lover",
  avatarColor: "#8B5CF6",
  postCount: 27,
};

function readMetadata(user: User, ...keys: string[]) {
  const metadata = user.user_metadata as Record<string, unknown>;

  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

export function profileFromAuthUser(user: User): UserProfile {
  const emailPrefix = user.email?.split("@")[0] ?? "student";

  return {
    fullName: readMetadata(user, "full_name", "fullName"),
    username: readMetadata(user, "username") || emailPrefix,
    classYear: readMetadata(user, "class_year", "classYear"),
    major: readMetadata(user, "major"),
    university: readMetadata(user, "university"),
    bio: readMetadata(user, "bio"),
    avatarColor: readMetadata(user, "avatar_color", "avatarColor") || "#8B5CF6",
    postCount: 0,
  };
}

function isFilled(value: string) {
  return value.trim().length > 0;
}

export function mergeProfiles(base: UserProfile, overrides: Partial<UserProfile>): UserProfile {
  return {
    fullName: isFilled(overrides.fullName ?? "") ? overrides.fullName! : base.fullName,
    username: isFilled(overrides.username ?? "") ? overrides.username! : base.username,
    classYear: isFilled(overrides.classYear ?? "") ? overrides.classYear! : base.classYear,
    major: isFilled(overrides.major ?? "") ? overrides.major! : base.major,
    university: isFilled(overrides.university ?? "")
      ? overrides.university!
      : base.university,
    bio: isFilled(overrides.bio ?? "") ? overrides.bio! : base.bio,
    avatarColor: overrides.avatarColor || base.avatarColor,
    postCount: overrides.postCount ?? base.postCount,
  };
}

export function isDemoProfile(profile: UserProfile) {
  return (
    profile.fullName === DEMO_PROFILE.fullName &&
    profile.username === DEMO_PROFILE.username
  );
}

export function getProfileFirstName(profile: UserProfile, email?: string | null) {
  const fromName = profile.fullName.trim().split(" ")[0];
  if (fromName) {
    return fromName;
  }

  const fromUsername = profile.username.trim();
  if (fromUsername) {
    return fromUsername;
  }

  const fromEmail = email?.split("@")[0];
  if (fromEmail) {
    return fromEmail;
  }

  return "there";
}
