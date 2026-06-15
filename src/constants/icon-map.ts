import type { AndroidSymbol } from "expo-symbols";
import type { SFSymbol } from "sf-symbols-typescript";

export type IconName = keyof typeof ICON_MAP;

export const ICON_MAP = {
  bell: { ios: "bell", android: "notifications" },
  "bell.fill": { ios: "bell.fill", android: "notifications" },
  house: { ios: "house", android: "home" },
  "house.fill": { ios: "house.fill", android: "home" },
  calendar: { ios: "calendar", android: "calendar_month" },
  "person.2": { ios: "person.2", android: "group" },
  "person.2.fill": { ios: "person.2.fill", android: "group" },
  person: { ios: "person", android: "person" },
  "person.fill": { ios: "person.fill", android: "person" },
  magnifyingglass: { ios: "magnifyingglass", android: "search" },
  "slider.horizontal.3": { ios: "slider.horizontal.3", android: "tune" },
  "chevron.right": { ios: "chevron.right", android: "chevron_right" },
  heart: { ios: "heart", android: "favorite" },
  "heart.fill": { ios: "heart.fill", android: "favorite" },
  "bubble.left": { ios: "bubble.left", android: "chat_bubble" },
  "bubble.left.fill": { ios: "bubble.left.fill", android: "chat_bubble" },
  "square.and.arrow.up": { ios: "square.and.arrow.up", android: "share" },
  bookmark: { ios: "bookmark", android: "bookmark" },
  "bookmark.fill": { ios: "bookmark.fill", android: "bookmark" },
  "chart.line.uptrend.xyaxis": {
    ios: "chart.line.uptrend.xyaxis",
    android: "trending_up",
  },
  "mappin.and.ellipse": { ios: "mappin.and.ellipse", android: "location_on" },
  clock: { ios: "clock", android: "schedule" },
  trash: { ios: "trash", android: "delete" },
  xmark: { ios: "xmark", android: "close" },
  checkmark: { ios: "checkmark", android: "check" },
  "sun.max": { ios: "sun.max", android: "light_mode" },
  moon: { ios: "moon", android: "dark_mode" },
  gearshape: { ios: "gearshape", android: "settings" },
  pencil: { ios: "pencil", android: "edit" },
  graduationcap: { ios: "graduationcap", android: "school" },
  "square.grid.2x2": { ios: "square.grid.2x2", android: "grid_view" },
  "star.fill": { ios: "star.fill", android: "star" },
  envelope: { ios: "envelope", android: "mail" },
  lock: { ios: "lock", android: "lock" },
  eye: { ios: "eye", android: "visibility" },
  "eye.slash": { ios: "eye.slash", android: "visibility_off" },
  "arrow.right": { ios: "arrow.right", android: "arrow_forward" },
  "arrow.left": { ios: "arrow.left", android: "arrow_back" },
  "graduationcap.fill": { ios: "graduationcap.fill", android: "school" },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol }>;

export function resolveIconName(name: string): {
  ios: SFSymbol;
  android: AndroidSymbol;
} {
  const normalized = name.startsWith("sf:") ? name.slice(3) : name;
  const mapped = ICON_MAP[normalized as IconName];

  if (mapped) {
    return mapped;
  }

  return {
    ios: normalized as SFSymbol,
    android: "help" as AndroidSymbol,
  };
}
