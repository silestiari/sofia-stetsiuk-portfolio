"use client";

import { ContactShadows, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect, useRef } from "react";
import type { Group } from "three";
import { useModel } from "@/components/three/passes";
import { StudioLights } from "@/components/three/StudioLights";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";

type Vec3 = number[];
export interface Placed {
  key: string;
  file: string;
  at: Vec3;
}

// DESIGN_SYSTEM.md 8.1 spring pet «плюх»: { stiffness 320, damping 14, mass 0.8 }.
const K = 320;
const C = 14;
const M = 0.8;
const DROP = 0.12; // metres above the socket the part falls from

/** One part at its socket. On mount it drops in and squashes on landing (underdamped spring). */
function Part({ file, at, reduced }: { file: string; at: Vec3; reduced: boolean }) {
  const model = useModel(file);
  const ref = useRef<Group>(null);
  const s = useRef({ x: reduced ? 0 : 1, v: 0 });

  useFrame((_, dt) => {
    const g = ref.current;
    const st = s.current;
    if (!g || (st.x === 0 && st.v === 0)) return;
    const h = Math.min(dt, 1 / 30);
    st.v += ((-K * st.x - C * st.v) / M) * h;
    st.x += st.v * h;
    if (Math.abs(st.x) < 1e-3 && Math.abs(st.v) < 1e-2) st.x = st.v = 0;
    g.position.y = at[1] + DROP * st.x;
    // falling: slight stretch; overshoot below the socket: squash (scaleY ≈ 0.85, scaleX ≈ 1.1)
    const sy = 1 + Math.max(-0.15, Math.min(0.08, st.x * 0.6));
    g.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));
  });

  return (
    <group ref={ref} position={[at[0], at[1] + (reduced ? 0 : DROP), at[2]]}>
      <primitive object={model.root} />
    </group>
  );
}

function Pet({ parts, reduced }: { parts: Placed[]; reduced: boolean }) {
  const ref = useRef<Group>(null);
  const camera = useThree((s) => s.camera);
  useLayoutEffect(() => camera.lookAt(0, 0.48, 0), [camera]);
  useFrame((_, dt) => {
    if (!reduced && ref.current) ref.current.rotation.y += (dt * Math.PI * 2) / 24;
  });
  return (
    <group ref={ref} rotation-y={-0.5}>
      {parts.map((p) => (
        // key = part id: a new part remounts and plays the drop; others stay put
        <Suspense key={p.key} fallback={null}>
          <Part file={p.file} at={p.at} reduced={reduced} />
        </Suspense>
      ))}
    </group>
  );
}

/** Pet Builder 3D: parts assembled at their sockets from pet-parts.json. Loaded via next/dynamic. */
export default function PetStage({
  parts,
  reduced,
  draggable,
  label,
  onContextLost,
}: {
  parts: Placed[];
  reduced: boolean;
  /** Drag-to-rotate only with a fine pointer: on touch one finger keeps scrolling the page */
  draggable: boolean;
  label: string;
  onContextLost: () => void;
}) {
  return (
    <ThreeCanvas
      role="img"
      aria-label={label}
      className={`size-full ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
      frameloop={reduced ? "demand" : "always"}
      camera={{ position: [0, 0.75, 2.6], fov: 35 }}
      onContextLost={onContextLost}
      style={draggable ? undefined : { pointerEvents: "none" }}
    >
      <StudioLights envIntensity={0.7} />
      <Pet parts={parts} reduced={reduced} />
      <ContactShadows position={[0, 0.001, 0]} scale={2} blur={2.5} opacity={0.35} far={1.2} color="#3A2E40" />
      {draggable && (
        <OrbitControls
          makeDefault
          target={[0, 0.48, 0]}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0.6}
          maxPolarAngle={Math.PI / 2}
        />
      )}
    </ThreeCanvas>
  );
}
