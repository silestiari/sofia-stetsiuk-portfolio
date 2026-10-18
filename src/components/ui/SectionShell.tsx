import type { CSSProperties, ReactNode } from "react";
import { sections, type SectionId } from "@/content/sections";
import { HudLabel } from "./HudLabel";

const nn = (n: number) => String(n).padStart(2, "0");

/** Render-pass variables of a section (from src/content/sections.ts), for any wrapper with .pass-section. */
export function passStyle(id: SectionId) {
  const index = sections.findIndex((s) => s.id === id);
  const self = sections[index];
  const prev = sections[index - 1] ?? self;
  // A section can end on different values than it starts (Projects: roblox scrub)
  const prevGrid = "exitGrid" in prev ? prev.exitGrid : prev.grid;
  const prevHud = "exitHud" in prev ? prev.exitHud : prev.hud;
  return {
    index,
    pass: self.pass,
    style: { "--grid-from": prevGrid, "--grid-to": self.grid, "--hud-from": prevHud, "--hud-to": self.hud } as CSSProperties,
  };
}

/**
 * Home section wrapper: anchor id, aria-labelledby heading (focusable via tabindex=-1 for menu jumps),
 * the "01 / PROJECTS ──── 01—07" label row and a giant caps heading (docs/REDESIGN_UX_SPEC.md 3.5).
 */
export function SectionShell({
  id,
  title,
  hudTitle,
  headingClassName = "font-display text-display font-bold uppercase",
  tail = true,
  className = "",
  children,
}: {
  id: Exclude<SectionId, "hero">;
  title: ReactNode;
  /** Plain-text title for the label row (defaults to `title` when it is a string) */
  hudTitle?: string;
  headingClassName?: string;
  /** Editorial " —" after the heading on lg+ (decorative) */
  tail?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  const { index, pass, style } = passStyle(id);
  const label = hudTitle ?? (typeof title === "string" ? title : "");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-pass={pass}
      style={style}
      className={`pass-section py-(--section-y) ${className}`}
    >
      <div className="page-container">
        <div data-reveal="stagger">
          <div className="flex items-center gap-4">
            <HudLabel>
              <span className="text-qa-accent">{nn(index)}</span> / {label}
            </HudLabel>
            <span aria-hidden="true" className="hud-line h-px flex-1 origin-left bg-grid-strong opacity-(--hud-opacity)" />
            <span aria-hidden="true">
              <HudLabel>
                {nn(index)}—{nn(sections.length - 1)}
              </HudLabel>
            </span>
          </div>
          <h2 id={`${id}-title`} tabIndex={-1} className={`mt-6 ${headingClassName}`}>
            {title}
            {tail && (
              <span aria-hidden="true" className="hidden font-normal lg:inline">
                {" —"}
              </span>
            )}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
