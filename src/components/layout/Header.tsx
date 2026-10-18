"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
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
        className="fixed top-2 left-2 z-(--z-skip) -translate-y-[200%] rounded-qa-panel bg-qa-accent-fill px-4 py-3 text-small font-bold text-white focus-visible:translate-y-0"
      >
        {tA11y("skipToContent")}
      </a>

      <div className="page-container flex h-full items-center gap-6">
        <a
          href={href("hero")}
          aria-label={tA11y("logo")}
          className="font-mono text-mono font-medium tracking-[0.08em] text-text"
        >
          SS_
        </a>

        <nav aria-label={t("label")} className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-6">
            {desktopNavIds.map((id) => (
              <li key={id}>
                <a
                  href={href(id)}
                  aria-current={activeId === id ? "true" : undefined}
                  className="nav-link group relative flex items-baseline gap-1.5 py-2 text-small font-semibold text-text-2 transition-colors duration-150 hover:text-text aria-[current=true]:text-text"
                >
                  <span className="hud text-mono-xs text-text-3 group-aria-[current=true]:text-qa-accent">
                    {String(sections.findIndex((s) => s.id === id)).padStart(2, "0")}
                  </span>
                  {t(id === "ai-lab" ? "labs" : id)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button href={isHome ? "#contact" : "/#contact"} size="sm" className="hidden lg:inline-flex">
          {t("contact")}
        </Button>
        <LanguageSwitcher activeId={activeId} className="ml-auto lg:ml-0" />
        <MobileMenu activeId={activeId} className="-mr-2.5 lg:hidden" />
      </div>
    </header>
  );
}
