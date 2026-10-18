"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Box3, BoxGeometry, EdgesGeometry, MathUtils, Vector3, type Group } from "three";
import { envIntensity, useModel, usePass, useWarmPasses, type Pass } from "./passes";
import { StudioLights } from "./StudioLights";
import type { Progress } from "./HeroScene";
import { ThreeCanvas } from "./ThreeCanvas";

// One hero object (DESIGN_SYSTEM.md 1.4: the same pet goes Hero → Showroom → Contact), placed right of the name.
const PET = "/models/pet-cotton-cloud.glb";

const PASSES: Pass[] = ["wire", "debug", "clay", "shaded", "beauty"];
export const passForProgress = (p: number) => PASSES[Math.min(PASSES.length - 1, Math.floor(MathUtils.clamp(p, 0, 1) * PASSES.length))];

const read = (p: Progress) => MathUtils.clamp(typeof p === "number" ? p : p.get(), 0, 1);

function Pet({ pass, progress }: { pass: Pass; progress: { current: number } }) {
  const model = useModel(PET);
  usePass(model, pass);
  const ref = useRef<Group>(null);
  const box = useMemo(() => {
    const b = new Box3().setFromObject(model.root);
    const size = b.getSize(new Vector3());
    return { size, edges: new EdgesGeometry(new BoxGeometry(size.x, size.y, size.z)), center: b.getCenter(new Vector3()) };
  }, [model.root]);
  useEffect(() => () => box.edges.dispose(), [box]);

  // Portrait desktop slot (right half of the hero): ~46% of the slot height, a bit right of centre,
  // which keeps it in columns 8–12 and off the name. Landscape slots: centred.
  const vp = useThree((st) => st.viewport);
  const scale = Math.min((vp.height * 0.46) / box.size.y, (vp.width * 0.62) / Math.max(box.size.x, box.size.z));
  const x0 = vp.width < vp.height ? vp.width * 0.08 : 0;

  useFrame(({ clock }, dt) => {
    const g = ref.current;
    if (!g) return;
    // Scrolling away: the pet drifts right and towards the camera, handing the viewer over to Projects.
    const p = progress.current;
    g.position.x = MathUtils.damp(g.position.x, x0 + p * vp.width * 0.25, 4, dt);
    g.position.z = MathUtils.damp(g.position.z, p * 2.5, 4, dt);
    const bob = Math.sin((clock.elapsedTime / 8) * Math.PI * 2) * 0.06;
    g.position.y = MathUtils.damp(g.position.y, bob, 4, dt);
    g.rotation.y += dt * 0.12;
  });

  return (
    <group ref={ref} position={[x0, 0, 0]} rotation-y={-0.5} scale={scale}>
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

  return (
    <>
      <StudioLights envIntensity={envIntensity[pass]} />
      <group ref={ref}>
        <Suspense fallback={null}>
          <Pet pass={pass} progress={progress} />
        </Suspense>
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
    </ThreeCanvas>
  );
}
