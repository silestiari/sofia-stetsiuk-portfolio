import type { CSSProperties, ReactNode } from "react";
import { sections, type SectionId } from "@/content/sections";
import { HudLabel } from "./HudLabel";

/**
 * Home section wrapper: anchor id, aria-labelledby heading (focusable via tabindex=-1 for menu jumps),
 * "NN / TITLE" HUD label and the render-pass variables (DESIGN_SYSTEM.md 8.3) from src/content/sections.ts.
 */
export function SectionShell({
  id,
  title,
  hudTitle,
  as: Heading = "h2",
  headingClassName = "text-h1 font-semibold",
  className = "",
  children,
}: {
  id: SectionId;
  title: ReactNode;
  /** Plain-text title for the HUD label (defaults to `title` when it is a string) */
  hudTitle?: string;
  /** h1 only for the Hero name */
  as?: "h1" | "h2";
  headingClassName?: string;
  className?: string;
  children?: ReactNode;
}) {
  const index = sections.findIndex((s) => s.id === id);
  const self = sections[index];
  const prev = sections[index - 1] ?? self;
  // A section can end on different values than it starts (Projects: roblox scrub clay → shaded)
  const prevGrid = "exitGrid" in prev ? prev.exitGrid : prev.grid;
  const prevHud = "exitHud" in prev ? prev.exitHud : prev.hud;
  const style = {
    "--grid-from": prevGrid,
    "--grid-to": self.grid,
    "--hud-from": prevHud,
    "--hud-to": self.hud,
  } as CSSProperties;
  const hero = id === "hero";
  const label = hudTitle ?? (typeof title === "string" ? title : "");

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      data-pass={self.pass}
      style={style}
      className={`pass-section py-(--section-y) ${className}`}
    >
      <div className="page-container">
        {/* Hero has its own intro (globals.css); other sections reveal once on entry (MotionObserver) */}
        <div data-reveal={hero ? undefined : "stagger"}>
          <HudLabel>
            {String(index).padStart(2, "0")} / {label}
          </HudLabel>
          <Heading id={`${id}-title`} tabIndex={-1} className={`mt-4 ${headingClassName}`}>
            {title}
          </Heading>
        </div>
        {children}
      </div>
    </section>
  );
}
