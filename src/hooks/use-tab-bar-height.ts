import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  TAB_BAR_FLOATING_OFFSET,
  TAB_BAR_PILL_HEIGHT,
  TAB_BAR_SCROLL_EXTRA,
} from "@/constants/layout";

/** Total bottom inset tab screens should reserve for the floating tab bar. */
export function useTabBarHeight() {
  const insets = useSafeAreaInsets();

  return (
    TAB_BAR_PILL_HEIGHT +
    TAB_BAR_FLOATING_OFFSET +
    insets.bottom +
    TAB_BAR_SCROLL_EXTRA
  );
}
