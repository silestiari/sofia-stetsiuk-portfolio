"use client";

import dynamic from "next/dynamic";
import { useRef, useSyncExternalStore } from "react";
import { useScroll, type MotionValue } from "motion/react";
import { LazyMount } from "@/components/LazyMount";

const DESKTOP = "(min-width: 64rem)";
const subscribe = (cb: () => void) => {
  const mql = matchMedia(DESKTOP);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const useDesktop = () => useSyncExternalStore(subscribe, () => matchMedia(DESKTOP).matches, () => false);

const SCENE = "absolute inset-0 size-full";

/**
 * Hero 3D slot. Desktop: three.js loads only when the slot nears the viewport (LazyMount + next/dynamic, ssr:false).
 * Mobile: static poster only (DESIGN_SYSTEM.md 5.1). Until then — the poster if it exists, else the decorative grid.
 */
export function HeroSceneSlot({ poster }: { poster: string | null }) {
  const desktop = useDesktop();
  const ref = useRef<HTMLDivElement>(null);
  // Desktop slot spans the hero's full height: 0 when its top meets the viewport top, 1 when the hero is gone.
  // A MotionValue: the 3D scene reads it in useFrame, React does not re-render on scroll.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const fallback = poster ? (
    // eslint-disable-next-line @next/next/no-img-element -- decorative poster sized by the slot
    <img src={poster} alt="" className={`${SCENE} object-contain`} />
  ) : null;

  return (
    <div ref={ref} data-hero-scene aria-hidden="true" className="relative size-full">
      <div className={`hero-slot-grid ${SCENE} opacity-(--grid-opacity)`} />
      {desktop ? (
        <LazyMount fallback={fallback} className={SCENE}>
          <LiveScene progress={scrollYProgress} />
        </LazyMount>
      ) : (
        fallback
      )}
    </div>
  );
}

// While the chunk loads, the grid underneath stays visible.
const Scene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

function LiveScene({ progress }: { progress: MotionValue<number> }) {
  return <Scene scrollProgress={progress} className={SCENE} />;
}
