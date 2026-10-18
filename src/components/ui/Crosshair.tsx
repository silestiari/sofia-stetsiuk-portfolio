import { HudLabel } from "./HudLabel";

const corner = "cross-mark absolute size-[9px]";

/**
 * Hairline frame overlay (docs/REDESIGN_UX_SPEC.md 3.6): "+" marks at the corners, optional inner divisions
 * and tiny corner labels. Decorative: aria-hidden, never catches the pointer. Colour = currentColor
 * (pass e.g. `group-hover:text-qa-accent` to light it up). Below md only the marks and the tl/br labels show.
 */
export function Crosshair({
  rows = 0,
  cols = 0,
  labels = {},
  active = false,
  className = "",
}: {
  rows?: number;
  cols?: number;
  labels?: { tl?: string; tr?: string; bl?: string; br?: string };
  /** accent colour (selected state) */
  active?: boolean;
  className?: string;
}) {
  const layers = [
    cols > 0 && "linear-gradient(90deg, transparent calc(100% - 1px), currentColor 0)",
    rows > 0 && "linear-gradient(transparent calc(100% - 1px), currentColor 0)",
  ].filter(Boolean);
  const sizes = [cols > 0 && `calc(100% / ${cols + 1}) 100%`, rows > 0 && `100% calc(100% / ${rows + 1})`].filter(Boolean);
  const label = "absolute";
  return (
    <span
      aria-hidden="true"
      className={`crosshair pointer-events-none absolute inset-0 ${active ? "text-qa-accent" : "text-grid-strong"} opacity-(--hud-opacity) transition-colors duration-300 ${className}`}
    >
      {layers.length > 0 && (
        // the last division of each axis lands on the frame edge: clip it off with the inset
        <span
          className="absolute inset-0 right-px bottom-px hidden md:block"
          style={{ backgroundImage: layers.join(","), backgroundSize: sizes.join(",") }}
        />
      )}
      <span className={`${corner} -top-1 -left-1`} />
      <span className={`${corner} -top-1 -right-1`} />
      <span className={`${corner} -bottom-1 -left-1`} />
      <span className={`${corner} -right-1 -bottom-1`} />
      {labels.tl && <HudLabel className={`${label} top-3 left-4`}>{labels.tl}</HudLabel>}
      {labels.tr && <HudLabel className={`${label} top-3 right-4 hidden md:inline-block`}>{labels.tr}</HudLabel>}
      {labels.bl && <HudLabel className={`${label} bottom-3 left-4 hidden md:inline-block`}>{labels.bl}</HudLabel>}
      {labels.br && <HudLabel className={`${label} right-4 bottom-3`}>{labels.br}</HudLabel>}
    </span>
  );
}
