"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

/** Set by LanguageSwitcher right before a locale switch; consumed once after it. */
export const RERENDER_KEY = "locale-rerender";

const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * DESIGN_SYSTEM.md 8.2, one-shot motion that needs JS:
 * 1. [data-reveal] elements reveal once when they enter the viewport. html[data-motion] arms the hidden
 *    state only after hydration, and what is already on screen is marked in view first — so content is
 *    never hidden without JS, under reduced motion, or on first paint.
 * 2. After a locale switch, headings in the viewport get a one-time clip-path "re-render" (240ms, stagger 40ms, ≤ 6).
 */
export function MotionObserver() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion()) {
      root.removeAttribute("data-motion");
      return;
    }
    // First load: what is on screen stays as is ("instant"). Later client navigations: it fades in ("anim").
    const armed = root.hasAttribute("data-motion");
    const pending = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-inview])")].filter((el) => {
      const onScreen = el.getBoundingClientRect().top < innerHeight;
      if (onScreen) el.setAttribute("data-inview", armed ? "anim" : "instant");
      return !onScreen;
    });
    root.setAttribute("data-motion", "");
    // ponytail: only server-rendered [data-reveal] are observed; add a MutationObserver if client-only ones appear
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-inview", "anim");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    pending.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname, locale]);

  // 3. Magnetic buttons: a .btn leans towards the cursor (≤ 6px), springs back on leave. Mouse only.
  useEffect(() => {
    if (reducedMotion() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let current: HTMLElement | null = null;
    const release = () => {
      current?.style.removeProperty("--mx");
      current?.style.removeProperty("--my");
      current = null;
    };
    const onMove = (e: PointerEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>(".btn:not(:disabled, [aria-disabled='true'])");
      if (btn !== current) release();
      if (!btn) return;
      current = btn;
      const r = btn.getBoundingClientRect();
      const pull = (v: number, size: number) => `${Math.max(-6, Math.min(6, (v / size) * 12)).toFixed(1)}px`;
      btn.style.setProperty("--mx", pull(e.clientX - r.left - r.width / 2, r.width));
      btn.style.setProperty("--my", pull(e.clientY - r.top - r.height / 2, r.height));
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
    };
  }, []);

  useEffect(() => {
    let requested = false;
    try {
      requested = sessionStorage.getItem(RERENDER_KEY) === locale;
      sessionStorage.removeItem(RERENDER_KEY);
    } catch {}
    if (!requested || reducedMotion()) return;
    // two frames: let the new locale paint and the anchor scroll settle
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const top = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
        [...document.querySelectorAll<HTMLElement>("main :is(h1, h2, h3)")]
          .filter((h) => {
            const r = h.getBoundingClientRect();
            return r.width > 1 && r.bottom > top && r.top < innerHeight;
          })
          .slice(0, 6)
          .forEach((h, i) =>
            h.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], {
              duration: 240,
              delay: i * 40,
              easing: "cubic-bezier(0.2, 0, 0, 1)",
              fill: "backwards",
            }),
          );
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [locale]);

  return null;
}
