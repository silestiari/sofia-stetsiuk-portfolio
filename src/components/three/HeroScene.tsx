"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";

/** Static fallback for SSR, no-WebGL, reduced motion and the time before three.js arrives. */
export const HERO_POSTER = "/posters/hero-scene.webp";

/** A number (static) or anything with get(), e.g. a motion MotionValue: read every frame, no React re-render. */
export type Progress = number | { get(): number };

// three.js (~285 KB gzip) + the GLB live in this separate chunk, requested only after load + idle.
const HeroCanvas = lazy(() => import("./HeroCanvas"));

/** Resolves after window load and the next idle period (timeout so it never waits forever). */
function useIdleAfterLoad() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let id = 0;
    const idle = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      id = ric(() => setReady(true), { timeout: 2000 });
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => {
      window.removeEventListener("load", idle);
      (window.cancelIdleCallback ?? window.clearTimeout)(id);
    };
  }, []);
  return ready;
}

/**
 * Hero objects: Petforge Arena world pieces go through the render passes wire → debug → clay → shaded → beauty
 * as `scrollProgress` (0..1, hero scroll) grows. Cursor parallax. Decorative: aria-hidden.
 * The poster shows until the page is idle and the 3D chunk has loaded.
 */
export default function HeroScene({ scrollProgress = 0, className = "" }: { scrollProgress?: Progress; className?: string }) {
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const idle = useIdleAfterLoad();
  const [lost, setLost] = useState(false);

  // eslint-disable-next-line @next/next/no-img-element -- static poster, sized by the slot
  const poster = <img src={HERO_POSTER} alt="" aria-hidden="true" decoding="async" className={`object-contain ${className}`} />;
  if (!webgl || reduced || lost || !idle) return poster;
  return (
    <Suspense fallback={poster}>
      <HeroCanvas scrollProgress={scrollProgress} className={className} onContextLost={() => setLost(true)} />
    </Suspense>
  );
}
