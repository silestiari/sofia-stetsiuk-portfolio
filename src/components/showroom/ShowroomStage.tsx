"use client";

import { Grid, OrbitControls, useGLTF, useProgress } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useTranslations } from "next-intl";
import {
  Component,
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
  type ReactNode,
} from "react";
import { Box3, MathUtils, PerspectiveCamera, Sphere, Vector3, type Group } from "three";
import type { Model3D } from "@/content/types";
import { envIntensity, useModel, usePass, useWarmPasses, type Pass } from "@/components/three/passes";
import { BlobShadow } from "@/components/three/BlobShadow";
import { Bloom } from "@/components/three/Bloom";
import { StudioLights } from "@/components/three/StudioLights";
import { ThreeCanvas } from "@/components/three/ThreeCanvas";
import { color } from "@/lib/tokens";

export type StageCommand = { kind: "left" | "right" | "in" | "out" | "reset"; id: number };
export type Backdrop = "grid" | "studio";

const STEP = MathUtils.degToRad(15);
const ZOOM = [1.35, 1, 0.75, 0.56]; // distance multipliers, index 1 = fitted view
const VIEW_DIR = new Vector3(0, 0.28, 1).normalize();
const FULL_TURN_S = 24; // DESIGN_SYSTEM.md 8.2: idle 360° in ≥ 24s

interface Fit {
  radius: number;
  floor: number;
  footprint: number;
}

class ModelBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Model({ model, pass, onFit }: { model: Model3D; pass: Pass; onFit: (f: Fit) => void }) {
  const m = useModel(model.file);
  usePass(m, pass);
  const center = useMemo(() => {
    const box = new Box3().setFromObject(m.root);
    const size = box.getSize(new Vector3());
    const c = box.getCenter(new Vector3());
    // Fit by bounding sphere, not height: the dragon is 4× wider than tall.
    const radius = box.getBoundingSphere(new Sphere()).radius;
    return { c, fit: { radius, floor: box.min.y - c.y, footprint: Math.max(size.x, size.z) / 2 } };
  }, [m.root]);
  useLayoutEffect(() => onFit(center.fit), [center, onFit]);
  return <primitive object={m.root} position={[-center.c.x, -center.c.y, -center.c.z]} />;
}

function Scene({
  model,
  pass,
  backdrop,
  autoRotate,
  command,
  engaged,
  onError,
}: {
  model: Model3D;
  pass: Pass;
  backdrop: Backdrop;
  autoRotate: boolean;
  command: StageCommand | null;
  engaged: boolean;
  onError: () => void;
}) {
  const fov = useThree((s) => (s.camera as PerspectiveCamera).fov);
  const get = useThree((s) => s.get);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const invalidate = useThree((s) => s.invalidate);
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const pivot = useRef<Group>(null);
  const [fit, setFit] = useState<Fit | null>(null);
  const yaw = useRef(0);
  const zoom = useRef(1);
  const tween = useRef<Vector3 | null>(null);
  const pop = useRef({ x: 1, v: 0 });
  useWarmPasses();

  // Distance that keeps the whole bounding sphere inside the narrower of the two FOVs.
  const base = useMemo(() => {
    if (!fit) return 5;
    const v = MathUtils.degToRad(fov) / 2;
    const h = Math.atan(Math.tan(v) * aspect);
    return (fit.radius / Math.sin(Math.min(v, h))) * 1.02;
  }, [fit, fov, aspect]);

  // New model: reset the view instantly and pop it in with the default spring (scale 0.9 → 1).
  useLayoutEffect(() => {
    if (!fit) return;
    const camera = get().camera as PerspectiveCamera;
    zoom.current = 1;
    yaw.current = 0;
    if (pivot.current) pivot.current.rotation.y = 0;
    camera.position.copy(VIEW_DIR).multiplyScalar(base);
    camera.near = base / 50;
    camera.far = base * 20;
    camera.updateProjectionMatrix();
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
    pop.current = { x: 0.9, v: 0 };
    invalidate();
  }, [fit, base, get, invalidate]);

  useEffect(() => {
    if (!command || !controls.current) return;
    const c = controls.current;
    const k = command.kind;
    if (k === "left" || k === "right") yaw.current += k === "left" ? -STEP : STEP;
    if (k === "in" || k === "out") {
      zoom.current = MathUtils.clamp(zoom.current + (k === "in" ? 1 : -1), 0, ZOOM.length - 1);
      tween.current = get().camera.position.clone().sub(c.target).setLength(base * ZOOM[zoom.current]).add(c.target);
    }
    if (k === "reset") {
      zoom.current = 1;
      yaw.current = Math.round(yaw.current / (Math.PI * 2)) * Math.PI * 2;
      c.target.set(0, 0, 0);
      tween.current = VIEW_DIR.clone().multiplyScalar(base);
    }
    invalidate();
  }, [command, base, get, invalidate]);

  useFrame(({ camera }, dt) => {
    const p = pivot.current;
    const c = controls.current;
    if (!p || !c) return;
    if (autoRotate) yaw.current += (dt * Math.PI * 2) / FULL_TURN_S;
    // Critically damped approach for buttons (spring 3D camera: no overshoot).
    p.rotation.y = MathUtils.damp(p.rotation.y, yaw.current, 9, dt);
    let moving = Math.abs(p.rotation.y - yaw.current) > 1e-4;
    if (tween.current) {
      camera.position.lerp(tween.current, 1 - Math.exp(-9 * dt));
      c.update();
      if (camera.position.distanceTo(tween.current) < base * 1e-3) tween.current = null;
      moving = true;
    }
    // Model switch: spring { stiffness 170, damping 22 }.
    const s = pop.current;
    if (s.x !== 1) {
      const h = Math.min(dt, 1 / 30); // explicit integration: big frame gaps would blow the spring up
      s.v += (-170 * (s.x - 1) - 22 * s.v) * h;
      s.x += s.v * h;
      if (Math.abs(s.x - 1) < 1e-3 && Math.abs(s.v) < 1e-2) s.x = 1;
      p.scale.setScalar(s.x);
      moving = true;
    }
    if (moving) invalidate();
  });

  return (
    <>
      <StudioLights envIntensity={envIntensity[pass]} />
      <group ref={pivot}>
        <ModelBoundary key={model.id} onError={onError}>
          <Suspense fallback={null}>
            <Model model={model} pass={pass} onFit={setFit} />
          </Suspense>
        </ModelBoundary>
      </group>
      {fit && (
        <group position={[0, fit.floor, 0]}>
          {/* podium */}
          <mesh position={[0, -fit.radius * 0.03, 0]} receiveShadow>
            <cylinderGeometry args={[fit.footprint * 1.2, fit.footprint * 1.26, fit.radius * 0.06, 64]} />
            <meshStandardMaterial color={backdrop === "studio" ? color.panel : color.surface2} roughness={0.8} metalness={0.1} />
          </mesh>
          {backdrop === "grid" && (
            <Grid
              position={[0, -fit.radius * 0.06, 0]}
              infiniteGrid
              cellSize={fit.radius / 8}
              sectionSize={fit.radius / 2}
              cellColor={color.line}
              sectionColor={color.lineStrong}
              fadeDistance={fit.radius * 8}
              fadeStrength={1.5}
            />
          )}
          {pass === "beauty" && <BlobShadow size={fit.footprint * 2.4} opacity={0.6} />}
        </group>
      )}
      <OrbitControls
        ref={controls}
        makeDefault
        enablePan={false}
        enableZoom={engaged}
        enableDamping={false}
        minDistance={base * 0.5}
        maxDistance={base * 1.5}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2 + 0.05}
        onStart={() => (tween.current = null)}
      />
    </>
  );
}

function LoadingOverlay() {
  const t = useTranslations("sections.showroom");
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center">
      <div className="grid size-40 place-items-center border border-dashed border-text-3">
        <span className="hud text-mono-xs text-text-2">
          {progress > 0 ? t("loadingMesh", { progress: Math.round(progress) }) : t("loadingMeshIndeterminate")}
        </span>
      </div>
    </div>
  );
}

/**
 * The WebGL part of the Showroom, loaded with next/dynamic (ssr: false) only when the section is near.
 * Mouse wheel zooms only after the user clicks the scene (page scroll is never hijacked).
 */
export default function ShowroomStage({
  model,
  pass,
  backdrop,
  autoRotate,
  command,
  retry,
  label,
  onError,
  onContextLost,
}: {
  model: Model3D;
  pass: Pass;
  backdrop: Backdrop;
  autoRotate: boolean;
  command: StageCommand | null;
  /** Bumped by the Retry button: drops the cached failure and remounts the model */
  retry: number;
  label: string;
  onError: () => void;
  onContextLost: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    if (!engaged) return;
    const off = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setEngaged(false);
    };
    document.addEventListener("pointerdown", off);
    return () => document.removeEventListener("pointerdown", off);
  }, [engaged]);

  useEffect(() => {
    if (retry > 0) useGLTF.clear(model.file);
  }, [retry, model.file]);

  return (
    <div ref={wrap} className="absolute inset-0" onPointerDown={() => setEngaged(true)}>
      <ThreeCanvas
        key={retry}
        role="img"
        aria-label={label}
        className="size-full cursor-grab active:cursor-grabbing"
        frameloop={autoRotate ? "always" : "demand"}
        camera={{ position: [0, 1, 5], fov: 35 }}
        onContextLost={onContextLost}
      >
        <Scene
          model={model}
          pass={pass}
          backdrop={backdrop}
          autoRotate={autoRotate}
          command={command}
          engaged={engaged}
          onError={onError}
        />
        <Bloom />
      </ThreeCanvas>
      <LoadingOverlay />
    </div>
  );
}
