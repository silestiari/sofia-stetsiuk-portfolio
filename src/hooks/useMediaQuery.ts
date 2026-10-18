"use client";

import { useCallback, useSyncExternalStore } from "react";

/** matchMedia as state. SSR / first paint: `serverValue`. */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => serverValue);
}

/** Phones and touch-first devices get posters instead of WebGL (DESIGN_SYSTEM.md 1.4). */
export const MOBILE_QUERY = "(max-width: 767px), (pointer: coarse)";
