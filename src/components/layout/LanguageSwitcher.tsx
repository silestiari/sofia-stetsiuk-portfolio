"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { motion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const useLocationHash = () => useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");

const EASE_PRECISE = [0.2, 0, 0, 1] as const;

/**
 * EN/RU links with a "selection gizmo" (DESIGN_SYSTEM.md 4.2). Keeps the current path and the anchor:
 * the section in view on the home page (activeId), otherwise location.hash.
 * next-intl Link writes the NEXT_LOCALE cookie and sets hreflang.
 */
export function LanguageSwitcher({ activeId, className = "" }: { activeId?: string | null; className?: string }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const locationHash = useLocationHash();
  const reduced = usePrefersReducedMotion();
  const gizmoId = useId();
  // Optimistic: the gizmo moves on click, before the new locale arrives.
  const [pending, setPending] = useState<{ from: Locale; to: Locale } | null>(null);
  const selected = pending?.from === locale ? pending.to : locale;

  const hash = activeId ? (activeId === "hero" ? "" : `#${activeId}`) : locationHash;
  const frame = { duration: reduced ? 0 : 0.18, ease: EASE_PRECISE };

  return (
    <nav aria-label={t("label")} className={`flex h-8 items-stretch rounded-qa border border-line ${className}`}>
      {routing.locales.map((l) => {
        const current = l === locale;
        return (
          <Link
            key={l}
            href={`${pathname}${hash}`}
            locale={l}
            lang={l}
            hrefLang={l}
            aria-label={t(l)}
            aria-current={current ? "true" : undefined}
            onClick={(e) => {
              if (current) e.preventDefault();
              else setPending({ from: locale, to: l });
            }}
            className={`hud relative grid place-items-center px-2.5 text-mono font-medium before:absolute before:-inset-y-1.5 before:inset-x-0 ${
              selected === l
                ? "cursor-default text-text"
                : "text-text-3 after:absolute after:inset-0.5 after:border after:border-dashed after:border-transparent hover:text-text-2 hover:after:border-text-3"
            }`}
          >
            {selected === l && (
              <>
                <motion.span
                  layoutId={`${gizmoId}-frame`}
                  transition={frame}
                  aria-hidden="true"
                  className="absolute -inset-px border border-qa-accent"
                />
                {/* corner handles trail the frame by 60ms, like dragging a selection */}
                <motion.span
                  layoutId={`${gizmoId}-handles`}
                  transition={{ ...frame, delay: reduced ? 0 : 0.06 }}
                  aria-hidden="true"
                  className="absolute -inset-px [&>i]:absolute [&>i]:size-[3px] [&>i]:bg-qa-accent"
                >
                  <i className="-top-px -left-px" />
                  <i className="-top-px -right-px" />
                  <i className="-bottom-px -left-px" />
                  <i className="-right-px -bottom-px" />
                </motion.span>
              </>
            )}
            <span className="relative">{l}</span>
          </Link>
        );
      })}
    </nav>
  );
}
