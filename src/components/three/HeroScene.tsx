"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, BoxGeometry, EdgesGeometry, MathUtils, Vector3, type Group } from "three";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useWebGLSupport } from "@/hooks/useWebGLSupport";
import { envIntensity, useModel, usePass, type Pass } from "./passes";
import { StudioLights } from "./StudioLights";
import { ThreeCanvas } from "./ThreeCanvas";

/** Static fallback for SSR, no-WebGL, reduced motion and the next/dynamic loading state. */
export const HERO_POSTER = "/posters/hero-scene.webp";

// Small real models only (~0.5 MB together): Build Your Pet + Cabin Chaos. Each one is centred on its bounding box.
const ITEMS = [
  { url: "/models/pet-cotton-cloud.glb", at: [-1.55, 0.15, 0], scale: 1.25, spin: 0.5, phase: 0 },
  { url: "/models/robot-passenger.glb", at: [1.6, 0.55, -0.6], scale: 1, spin: -0.6, phase: 1.7 },
  { url: "/models/sleepy-monster.glb", at: [0.85, -1.05, 0.5], scale: 0.85, spin: 0.4, phase: 3.1 },
  { url: "/models/pet-parts/acc-head-legendary.glb", at: [-0.45, 1.25, -0.9], scale: 5, spin: 1.2, phase: 4.4 },
] as const;

const PASSES: Pass[] = ["wire", "debug", "clay", "shaded", "beauty"];
export const passForProgress = (p: number) => PASSES[Math.min(PASSES.length - 1, Math.floor(MathUtils.clamp(p, 0, 1) * PASSES.length))];

function Item({ item, pass, spread }: { item: (typeof ITEMS)[number]; pass: Pass; spread: number }) {
  const model = useModel(item.url);
  usePass(model, pass);
  const ref = useRef<Group>(null);
  const box = useMemo(() => {
    const b = new Box3().setFromObject(model.root);
    const size = b.getSize(new Vector3());
    return { edges: new EdgesGeometry(new BoxGeometry(size.x, size.y, size.z)), center: b.getCenter(new Vector3()) };
  }, [model.root]);
  useEffect(() => () => box.edges.dispose(), [box]);

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    const t = clock.elapsedTime;
    const [x, y, z] = item.at;
    // Objects drift apart as the hero scrolls away (spread 1 → 2.2).
    g.position.x = MathUtils.damp(g.position.x, x * spread, 4, dt);
    g.position.z = MathUtils.damp(g.position.z, z * spread, 4, dt);
    const bob = Math.sin((t / 8) * Math.PI * 2 + item.phase) * 0.08;
    g.position.y = MathUtils.damp(g.position.y, y * spread + bob, 4, dt);
    g.rotation.y += dt * item.spin * 0.25;
  });

  return (
    <group ref={ref} position={[item.at[0], item.at[1], item.at[2]]} scale={item.scale}>
      <group position={[-box.center.x, -box.center.y, -box.center.z]}>
        <primitive object={model.root} />
        {pass === "debug" && (
          <lineSegments geometry={box.edges} position={box.center}>
            <lineBasicMaterial color="#A4AAB5" transparent opacity={0.6} />
          </lineSegments>
        )}
      </group>
    </group>
  );
}

function Rig({ scrollProgress }: { scrollProgress: number }) {
  const ref = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 };
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.current.x * 0.25, 3, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, pointer.current.y * 0.12, 3, dt);
  });

  // The slot can be portrait or landscape: scale the ~4.6 × 3.6 composition to fit the view at z = 0.
  const viewport = useThree((st) => st.viewport);
  const fit = Math.min(viewport.width / 4.6, viewport.height / 3.6, 1.3);
  const pass = passForProgress(scrollProgress);
  const spread = 1 + MathUtils.clamp(scrollProgress, 0, 1) * 1.2;
  return (
    <>
      <StudioLights envIntensity={envIntensity[pass]} />
      <group ref={ref} scale={fit}>
        {ITEMS.map((item) => (
          <Suspense key={item.url} fallback={null}>
            <Item item={item} pass={pass} spread={spread} />
          </Suspense>
        ))}
      </group>
    </>
  );
}

/**
 * Hero composition: Sofia's own models float around the name and go through the render passes
 * wire → debug → clay → shaded → beauty as `scrollProgress` (0..1, hero scroll) grows; they also spread out.
 * Light cursor parallax. Decorative: aria-hidden, the name and text carry the meaning.
 */
export default function HeroScene({ scrollProgress = 0, className = "" }: { scrollProgress?: number; className?: string }) {
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const [lost, setLost] = useState(false);

  if (!webgl || reduced || lost) {
    // eslint-disable-next-line @next/next/no-img-element -- static poster, sized by the slot
    return <img src={HERO_POSTER} alt="" aria-hidden="true" className={`object-contain ${className}`} />;
  }
  return (
    <ThreeCanvas
      aria-hidden="true"
      className={className}
      frameloop="always"
      camera={{ position: [0, 0, 7], fov: 35 }}
      onContextLost={() => setLost(true)}
    >
      <Rig scrollProgress={scrollProgress} />
    </ThreeCanvas>
  );
}
