"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { LazyMount } from "@/components/LazyMount";

const DESKTOP = "(min-width: 64rem)";
const subscribe = (cb: () => void) => {
  const mql = matchMedia(DESKTOP);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
};
const useDesktop = () => useSyncExternalStore(subscribe, () => matchMedia(DESKTOP).matches, () => false);

/** Hero scroll progress 0..1 (top of the page → hero scrolled out), rAF-throttled. */
function useHeroProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("hero");
      if (hero) setProgress(Math.min(1, Math.max(0, scrollY / hero.offsetHeight)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return progress;
}

const SCENE = "absolute inset-0 size-full";

/**
 * Hero 3D slot. Desktop: three.js loads only when the slot nears the viewport (LazyMount + next/dynamic, ssr:false).
 * Mobile: static poster only (DESIGN_SYSTEM.md 5.1). Until then — the poster if it exists, else the decorative grid.
 */
export function HeroSceneSlot({ poster }: { poster: string | null }) {
  const desktop = useDesktop();
  const fallback = poster ? (
    // eslint-disable-next-line @next/next/no-img-element -- decorative poster sized by the slot
    <img src={poster} alt="" className={`${SCENE} object-contain`} />
  ) : null;

  return (
    <div data-hero-scene aria-hidden="true" className="relative size-full">
      <div className={`hero-slot-grid ${SCENE} opacity-(--grid-opacity)`} />
      {desktop ? (
        <LazyMount fallback={fallback} className={SCENE}>
          <LiveScene />
        </LazyMount>
      ) : (
        fallback
      )}
    </div>
  );
}

// While the chunk loads, the grid underneath stays visible.
const Scene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

function LiveScene() {
  return <Scene scrollProgress={useHeroProgress()} className={SCENE} />;
}
