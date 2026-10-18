"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

/**
 * Fallback for browsers without CSS scroll-driven animations (DESIGN_SYSTEM.md 8.3, step 2):
 * marks [data-pass] sections as entered once they cross 40% of the viewport; CSS transitions the values.
 */
export function RenderPassFallback() {
  const pathname = usePathname();

  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const entered = e.isIntersecting || e.boundingClientRect.top < 0;
          e.target.toggleAttribute("data-entered", entered);
        }
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    document.querySelectorAll("main [data-pass]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
