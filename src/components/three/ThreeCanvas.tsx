"use client";

import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";

/**
 * Shared R3F canvas: dpr capped at 1.75, transparent (the section paints the background),
 * render loop stopped while the canvas is out of the viewport, WebGL context loss reported to the parent.
 */
export function ThreeCanvas({
  frameloop = "demand",
  onContextLost,
  className = "",
  children,
  ...props
}: Omit<CanvasProps, "frameloop" | "dpr"> & {
  frameloop?: "always" | "demand";
  onContextLost?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      <Canvas
        {...props}
        frameloop={inView ? frameloop : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (e) => {
            e.preventDefault();
            onContextLost?.();
          });
        }}
      >
        {children}
      </Canvas>
    </div>
  );
}
