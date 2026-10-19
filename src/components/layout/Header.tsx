"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { desktopNavIds, sectionIds, sections, type SectionId } from "@/content/sections";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

/** Section crossing the line at 40% of the viewport height (DESIGN_SYSTEM.md 2.3). null off the home page. */
function useActiveSection(pathname: string) {
  const [state, setState] = useState<{ path: string; id: SectionId } | null>(null);

  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter((el) => el !== null);
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setState({ path: pathname, id: hit.target.id as SectionId });
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return state?.path === pathname ? state.id : null;
}

export function Header() {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const locale = useLocale();
  const pathname = usePathname();
  const activeId = useActiveSection(pathname);
  const isHome = pathname === "/";
  const href = (id: SectionId) => (isHome ? `#${id}` : `/${locale}#${id}`);

  return (
    <header className="site-header sticky top-0 z-(--z-header) h-(--header-h)">
      <a
        href="#content"
        className="fixed top-2 left-2 z-(--z-skip) -translate-y-[200%] rounded-full bg-qa-accent-fill px-4 py-3 text-small font-bold text-on-accent focus-visible:translate-y-0"
      >
        {tA11y("skipToContent")}
      </a>

      <div className="page-container flex h-full items-center gap-2 lg:gap-6">
        <a
          href={href("hero")}
          className="inline-flex min-h-11 min-w-11 items-center font-mono text-mono font-medium tracking-[0.08em] text-text"
        >
          SS_<span className="sr-only">, {tA11y("logo")}</span>
        </a>

        {/* pill nav: links, not a radiogroup; the active section gets a filled pill (docs/REDESIGN_UX_SPEC.md 3.4) */}
        <nav aria-label={t("label")} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1 rounded-full border border-line p-1">
            {desktopNavIds.map((id) => (
              <li key={id}>
                <a
                  href={href(id)}
                  aria-current={activeId === id ? "true" : undefined}
                  className="group hud relative flex h-9 items-center gap-1.5 rounded-full px-4 text-mono-xs text-text-2 transition-colors duration-150 before:absolute before:-inset-y-1 before:inset-x-0 hover:bg-surface-1 hover:text-text aria-[current=true]:bg-surface-2 aria-[current=true]:text-text"
                >
                  <span className="hidden text-text-3 group-aria-[current=true]:text-qa-accent xl:inline">
                    {String(sections.findIndex((s) => s.id === id)).padStart(2, "0")}
                  </span>
                  {t(id === "ai-lab" ? "labs" : id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <LanguageSwitcher activeId={activeId} className="ml-auto lg:ml-0" />
        {/* "Contact" pill + the adjoining arrow circle: one link, the circle is decoration */}
        <a href={isHome ? "#contact" : `/${locale}#contact`} className="group hidden items-center gap-1 lg:flex">
          <span className="btn btn-secondary min-h-11 px-5 group-hover:border-text">{t("contact")}</span>
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full border border-ui-border transition-colors duration-150 group-hover:border-text"
          >
            ↘
          </span>
        </a>
        <MobileMenu activeId={activeId} className="lg:hidden" />
      </div>
    </header>
  );
}
