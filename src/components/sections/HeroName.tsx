"use client";

import { animate } from "motion";
import { useEffect, useRef } from "react";

/**
 * The hero h1. Hover (or tap) over the name: the letters fly apart and spring back together.
 * The h1 stays pointer-events-none so the bugs under it can still be caught: hover is read on the whole frame
 * and checked against the h1 box. Reduced motion: a smaller scatter, same idea.
 */
export function HeroName({ first, last, className = "" }: { first: string; last: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const h1 = ref.current!;
    const frame = h1.parentElement!;
    const letters = [...h1.querySelectorAll<HTMLElement>("[data-letter]")];
    const amp = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.4 : 1;
    let inside = false, busy = false;

    const play = async () => {
      if (busy) return;
      busy = true;
      h1.dataset.scatter = ""; // lets letters leave the .mask-line clip
      const em = parseFloat(getComputedStyle(h1).fontSize);
      const rnd = (n: number) => (Math.random() * 2 - 1) * n * amp;
      await Promise.all(
        letters.map((el) =>
          animate(el, { x: rnd(0.7 * em), y: rnd(0.5 * em), rotate: rnd(45), scale: 1 - Math.random() * 0.3 * amp }, { duration: 0.35, ease: [0.16, 1, 0.3, 1] }),
        ),
      );
      await Promise.all(
        letters.map((el, i) =>
          animate(el, { x: 0, y: 0, rotate: 0, scale: 1 }, { type: "spring", stiffness: 260, damping: 14, delay: 0.1 + i * 0.03 }),
        ),
      );
      delete h1.dataset.scatter;
      busy = false;
    };

    const onMove = (e: PointerEvent) => {
      const r = h1.getBoundingClientRect();
      const over = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
      if (over && !inside) play();
      inside = over;
    };
    const onLeave = () => (inside = false);
    frame.addEventListener("pointermove", onMove);
    frame.addEventListener("pointerdown", onMove);
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerdown", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const word = (w: string) =>
    [...w].map((c, i) => (
      <span key={i} data-letter="" className="inline-block will-change-transform">
        {c}
      </span>
    ));

  return (
    <h1 ref={ref} id="hero-title" tabIndex={-1} className={className}>
      <span className="sr-only">{`${first} ${last}`}</span>
      <span aria-hidden="true" className="mask-line">
        <span>{word(first)}</span>
      </span>{" "}
      <span aria-hidden="true" className="mask-line [--i:1]">
        <span>{word(last)}</span>
      </span>
    </h1>
  );
}
