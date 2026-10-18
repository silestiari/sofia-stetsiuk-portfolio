"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { profile } from "@/content/profile";
import { sectionIds, type SectionId } from "@/content/sections";
import { LanguageSwitcher } from "./LanguageSwitcher";

const gridVars = { "--grid-from": 1, "--grid-to": 1, "--hud-from": 1, "--hud-to": 1 } as CSSProperties;

const setScrollLock = (on: boolean) => {
  document.documentElement.style.overflow = on ? "hidden" : "";
};

/**
 * Full-screen menu (DESIGN_SYSTEM.md 4.3) on native <dialog showModal>: the page behind is inert
 * (focus stays inside), Esc closes, focus returns to the burger. Lists all 8 anchors.
 */
export function MobileMenu({ activeId, className = "" }: { activeId: SectionId | null; className?: string }) {
  const t = useTranslations("nav");
  const tA11y = useTranslations("a11y");
  const tContact = useTranslations("sections.contact");
  const locale = useLocale();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  const show = () => {
    dialog.current?.showModal();
    setScrollLock(true);
    setOpen(true);
  };
  const onClosed = () => {
    setScrollLock(false);
    setOpen(false);
  };

  // Close on locale switch from inside the menu; never leave the page scroll-locked.
  useEffect(() => dialog.current?.close(), [locale]);
  useEffect(() => () => setScrollLock(false), []);

  // showModal() makes the page inert, but focus can still escape via browser chrome; keep Tab cycling inside.
  const trapTab = (e: KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = e.currentTarget.querySelectorAll<HTMLElement>("a[href], button");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const jump = (id: SectionId) => (e: MouseEvent<HTMLAnchorElement>) => {
    const section = document.getElementById(id);
    if (!section) return; // not on the home page: let the link navigate there
    e.preventDefault();
    dialog.current?.close();
    setScrollLock(false);
    history.pushState(null, "", `#${id}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    section.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    document.getElementById(`${id}-title`)?.focus({ preventScroll: true });
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={show}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={tA11y("menuOpen")}
        className="grid size-11 cursor-pointer place-items-center text-text"
      >
        <BurgerIcon cross={false} />
      </button>

      <dialog
        ref={dialog}
        id="mobile-menu"
        aria-labelledby="mobile-menu-title"
        onClose={onClosed}
        onKeyDown={trapTab}
        className="mobile-menu fixed inset-0 z-(--z-menu) m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-bg p-0 text-text"
      >
        <div className="pass-section flex min-h-full flex-col" style={gridVars}>
          <div className="page-container flex h-(--header-h) shrink-0 items-center justify-between">
            <span aria-hidden="true" className="font-mono text-mono font-medium">
              SS_
            </span>
            <button
              type="button"
              autoFocus
              onClick={() => dialog.current?.close()}
              aria-label={tA11y("menuClose")}
              className="grid size-11 cursor-pointer place-items-center text-text"
            >
              <BurgerIcon cross />
            </button>
          </div>

          <nav aria-labelledby="mobile-menu-title" className="page-container flex-1 py-6">
            <h2 id="mobile-menu-title" className="sr-only">
              {t("label")}
            </h2>
            <ol>
              {sectionIds.map((id, i) => (
                <li key={id} className="menu-item border-b border-line" style={{ "--i": i } as CSSProperties}>
                  <a
                    href={`/${locale}#${id}`}
                    onClick={jump(id)}
                    aria-current={activeId === id ? "true" : undefined}
                    className="group flex min-h-14 items-center gap-4 py-2"
                  >
                    <span className="hud text-mono text-text-3 group-aria-[current=true]:text-qa-accent">
                      {String(i).padStart(2, "0")}
                    </span>
                    <span className="text-h3 font-bold">{t(id)}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="page-container flex shrink-0 flex-wrap items-center gap-4 border-t border-line py-6">
            <LanguageSwitcher activeId={activeId} />
            <Button variant="ghost" href={`mailto:${profile.contacts.email}`}>
              {tContact("email")}
            </Button>
            <Button variant="ghost" href={profile.contacts.phone.href}>
              {tContact("call")}
            </Button>
            <Button variant="ghost" href={profile.contacts.github.href}>
              {tContact("github")}
            </Button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

/**
 * Two lines → cross (DESIGN_SYSTEM.md 8.2). The dialog's close button sits exactly over the burger,
 * so the cross morphs from the burger's lines each time the menu opens (globals.css .burger-cross).
 */
function BurgerIcon({ cross }: { cross: boolean }) {
  const line = "absolute left-0 h-px w-5 bg-current";
  return (
    <span aria-hidden="true" className={`relative block h-3 w-5 ${cross ? "burger-cross" : ""}`}>
      <span className={`${line} top-0.5`} />
      <span className={`${line} bottom-0.5`} />
    </span>
  );
}
