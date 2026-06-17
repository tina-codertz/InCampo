import { spacing } from "@/constants/theme";

export const TAB_BAR_ICON_SIZE = 44;
export const TAB_BAR_LABEL_HEIGHT = 15;
export const TAB_BAR_ITEM_GAP = 4;
export const TAB_BAR_VERTICAL_PADDING = 12;
export const TAB_BAR_FLOATING_OFFSET = spacing.xs;

/** Height of the blurred pill only (excluding safe area). */
export const TAB_BAR_PILL_HEIGHT =
  TAB_BAR_VERTICAL_PADDING * 2 +
  TAB_BAR_ICON_SIZE +
  TAB_BAR_ITEM_GAP +
  TAB_BAR_LABEL_HEIGHT;

/** Extra breathing room so the last list item clears the floating tab bar. */
export const TAB_BAR_SCROLL_EXTRA = spacing.sm;
