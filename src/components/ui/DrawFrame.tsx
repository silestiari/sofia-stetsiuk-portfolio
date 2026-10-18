/**
 * 1px frame drawn as an SVG rect so it can be "drawn" with stroke-dashoffset (DESIGN_SYSTEM.md 8.2/8.3).
 * Fully visible by default (no JS, reduced motion); globals.css animates it. Color = currentColor.
 * Place inside a `relative` box with a transparent 1px border: the stroke lands exactly on that border.
 */
export function DrawFrame({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`draw-frame pointer-events-none absolute -top-px -left-px h-[calc(100%+2px)] w-[calc(100%+2px)] ${className}`}
    >
      {/* stroke 2 centered on the svg edge, half clipped → 1px inside, like a CSS border */}
      <rect width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth={2} pathLength={1} strokeDasharray="1" />
    </svg>
  );
}
