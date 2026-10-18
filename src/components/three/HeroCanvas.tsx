"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, BoxGeometry, EdgesGeometry, MathUtils, Vector3, type Group } from "three";
import { envIntensity, useModel, usePass, useWarmPasses, type Pass } from "./passes";
import { Bloom } from "./Bloom";
import { StudioLights } from "./StudioLights";
import type { Progress } from "./HeroScene";
import { ThreeCanvas } from "./ThreeCanvas";

// Petforge Arena world pieces (Creator Store exports, ~0.6 MB together), around the dragon. Each one is centred on its bounding box.
const ITEMS = [
  { url: "/models/bubble-lagoon-dragon.glb", at: [0.25, 0.15, 0], scale: 1.15, spin: 0.3, phase: 0 },
  { url: "/models/cloud-gardens-castle.glb", at: [-1.4, -1.05, -0.6], scale: 0.75, spin: -0.4, phase: 1.7 },
  { url: "/models/tree-crystal-m.glb", at: [1.55, -1.05, -0.3], scale: 0.65, spin: 0.5, phase: 3.1 },
  { url: "/models/bubble-lagoon-lighthouse.glb", at: [-1.3, 1.1, -1], scale: 0.6, spin: 0.6, phase: 4.4 },
  { url: "/models/tree-blossom-m.glb", at: [1.4, 1.2, -0.6], scale: 0.45, spin: -0.7, phase: 2.2 },
] as const;

const PASSES: Pass[] = ["wire", "debug", "clay", "shaded", "beauty"];
export const passForProgress = (p: number) => PASSES[Math.min(PASSES.length - 1, Math.floor(MathUtils.clamp(p, 0, 1) * PASSES.length))];

const read = (p: Progress) => MathUtils.clamp(typeof p === "number" ? p : p.get(), 0, 1);

function Item({ item, pass, progress }: { item: (typeof ITEMS)[number]; pass: Pass; progress: { current: number } }) {
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
    // Scrolling away: the pieces open up a little (spread 1 → 1.4), drift right — off the page edge, never across
    // the canvas' left edge next to the name — and fly past the camera, handing the viewer over to Projects.
    const [x, y, z] = item.at;
    const p = progress.current;
    const spread = 1 + p * 0.4;
    const bob = Math.sin((clock.elapsedTime / 8) * Math.PI * 2 + item.phase) * 0.06;
    g.position.x = MathUtils.damp(g.position.x, x * spread + p * 0.9, 4, dt);
    g.position.y = MathUtils.damp(g.position.y, y * spread + bob, 4, dt);
    g.position.z = MathUtils.damp(g.position.z, z * spread + p * 2.5, 4, dt);
    g.rotation.y += dt * item.spin * 0.25;
  });

  return (
    <group ref={ref} position={[item.at[0], item.at[1], item.at[2]]} rotation-y={-0.5} scale={item.scale}>
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

function Rig({ scrollProgress }: { scrollProgress: Progress }) {
  const ref = useRef<Group>(null);
  const progress = useRef(0);
  // Pass is discrete (5 steps): React re-renders only when it actually changes.
  const [pass, setPass] = useState(() => passForProgress(read(scrollProgress)));
  const pointer = useRef({ x: 0, y: 0 });
  useWarmPasses();
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current = { x: (e.clientX / innerWidth) * 2 - 1, y: (e.clientY / innerHeight) * 2 - 1 };
    };
    addEventListener("pointermove", onMove, { passive: true });
    return () => removeEventListener("pointermove", onMove);
  }, []);
  useFrame((_, dt) => {
    progress.current = read(scrollProgress);
    const next = passForProgress(progress.current);
    if (next !== pass) setPass(next);
    const g = ref.current;
    if (!g) return;
    g.rotation.y = MathUtils.damp(g.rotation.y, pointer.current.x * 0.25, 3, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, pointer.current.y * 0.12, 3, dt);
  });

  // The slot can be portrait or landscape: scale the ~4.6 × 3.8 composition to fit the view at z = 0.
  const viewport = useThree((st) => st.viewport);
  const fit = Math.min(viewport.width / 4.6, viewport.height / 3.8, 1.3);
  return (
    <>
      <StudioLights envIntensity={envIntensity[pass]} />
      <group ref={ref} scale={fit}>
        {ITEMS.map((item) => (
          <Suspense key={item.url} fallback={null}>
            <Item item={item} pass={pass} progress={progress} />
          </Suspense>
        ))}
      </group>
    </>
  );
}

/** WebGL part of the hero, loaded by HeroScene only after the page is idle. */
export default function HeroCanvas({
  scrollProgress,
  className,
  onContextLost,
}: {
  scrollProgress: Progress;
  className: string;
  onContextLost: () => void;
}) {
  return (
    <ThreeCanvas
      aria-hidden="true"
      className={className}
      frameloop="always"
      camera={{ position: [0, 0, 7], fov: 35 }}
      onContextLost={onContextLost}
    >
      <Rig scrollProgress={scrollProgress} />
      <Bloom />
    </ThreeCanvas>
  );
}
