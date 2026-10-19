"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Sakhli palette (sakhli/app/globals.css), scoped to the pond: pond-sim reads these from the element.
const palette = {
  "--color-lamp": "#f4d96c",
  "--color-lamp-soft": "#c9bc74",
  "--color-plaster": "#eceae1",
  "--color-saperavi": "#5b1e2d",
  "--color-garden-2": "#1a4429",
  background: "#1e4a55",
} as CSSProperties;

/**
 * The live koi pond from Sakhli: koi swim away from the cursor or finger, a click drops ripples.
 * The poster frame shows until the canvas starts.
 */
export function KoiPond({ poster, label, className = "" }: { poster: string; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    // Not gated on reduced motion: the pond is the project demo itself (Windows "animation effects off" froze it).
    if (!el) return;
    let stop: VoidFunction | undefined;
    let dead = false;
    import("./pond-sim").then((m) => {
      if (!dead) stop = m.startPond(el);
    });
    return () => {
      dead = true;
      stop?.();
    };
  }, []);

  return (
    <div ref={ref} role="img" aria-label={label} style={palette} className={`relative aspect-[3/1] w-full overflow-hidden rounded-full ${className}`}>
      {/* the canvas is transparent (koi, pads, ripples only): the still frame hides once it is live */}
      <canvas className="peer absolute inset-0 size-full opacity-0 transition-opacity duration-500 data-[live]:opacity-100" />
      {/* eslint-disable-next-line @next/next/no-img-element -- still frame of the same pond */}
      <img src={poster} alt="" className="absolute inset-0 size-full scale-[1.06] object-cover peer-data-[live]:hidden" />
    </div>
  );
}
