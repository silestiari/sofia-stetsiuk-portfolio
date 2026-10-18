"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts `children` once the wrapper comes within `rootMargin` of the viewport (and keeps them mounted).
 * Until then renders `fallback` (e.g. a poster). Use with next/dynamic for 3D so three.js loads only on approach.
 */
export function LazyMount({
  children,
  fallback = null,
  rootMargin = "400px 0px",
  className,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, visible]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
