import { Fragment } from "react";
import { useTranslations } from "next-intl";

const REPEAT = 4;

/**
 * The one giant-type band (docs/REDESIGN_UX_SPEC.md 3.12): two rows, filled and outline, that slide in opposite
 * directions only while the page is scrolled (animation-timeline: view() in globals.css) — no autoplay, so nothing to
 * pause. Static without scroll-driven animations or with reduced motion. Decorative: aria-hidden, not a section.
 */
export function MarqueeBand() {
  const words = useTranslations()("marquee").split("×").map((w) => w.trim());
  const row = (outline: boolean) => (
    <p className={`marquee-row font-display text-marquee font-extrabold whitespace-nowrap uppercase ${outline ? "marquee-outline" : "text-text"}`}>
      {Array.from({ length: REPEAT * words.length }, (_, i) => (
        <Fragment key={i}>
          <span className="px-[0.2em]">{words[i % words.length]}</span>
          <span className={outline ? "" : "text-qa-accent"}>×</span>
        </Fragment>
      ))}
    </p>
  );
  return (
    <div aria-hidden="true" className="marquee overflow-x-clip border-y border-line py-6">
      {row(false)}
      {row(true)}
    </div>
  );
}
