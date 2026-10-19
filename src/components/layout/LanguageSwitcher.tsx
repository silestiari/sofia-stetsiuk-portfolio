"use client";

import { useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { RERENDER_KEY } from "./MotionObserver";

const subscribeHash = (onChange: () => void) => {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
};
const useLocationHash = () => useSyncExternalStore(subscribeHash, () => window.location.hash, () => "");

/**
 * EN/RU pill segment (docs/REDESIGN_UX_SPEC.md 3.3): the current locale is the white pill. Keeps the current path
 * and the anchor: the section in view on the home page (activeId), otherwise location.hash.
 * next-intl Link writes the NEXT_LOCALE cookie and sets hreflang.
 */
export function LanguageSwitcher({ activeId, className = "" }: { activeId?: string | null; className?: string }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const pathname = usePathname();
  const locationHash = useLocationHash();
  // Optimistic: the pill moves on click, before the new locale arrives.
  const [pending, setPending] = useState<{ from: Locale; to: Locale } | null>(null);
  const selected = pending?.from === locale ? pending.to : locale;
  const hash = activeId ? (activeId === "hero" ? "" : `#${activeId}`) : locationHash;

  return (
    <nav aria-label={t("label")} className={`flex items-center gap-1 rounded-full border border-ui-border p-1 ${className}`}>
      {routing.locales.map((l) => {
        const current = l === locale;
        return (
          <Link
            key={l}
            href={`${pathname}${hash}`}
            locale={l}
            lang={l}
            hrefLang={l}
            aria-current={current ? "true" : undefined}
            onClick={(e) => {
              if (current) e.preventDefault();
              else {
                setPending({ from: locale, to: l });
                try {
                  sessionStorage.setItem(RERENDER_KEY, l);
                } catch {}
              }
            }}
            className={`hud relative grid h-9 min-w-11 place-items-center rounded-full px-3 text-mono-xs transition-colors duration-150 before:absolute before:-inset-y-1 before:inset-x-0 ${
              selected === l ? "cursor-default bg-text text-bg" : "text-text-2 hover:text-text"
            }`}
          >
            <span>
              {l}
              {/* visible code first, so voice control ("click EN") matches the accessible name */}
              <span className="sr-only normal-case">, {t(l)}</span>
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
