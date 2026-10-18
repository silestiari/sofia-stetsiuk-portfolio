"use client";

import { Environment, Lightformer } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import type { Scene } from "three";

const setEnvIntensity = (scene: Scene, v: number) => {
  scene.environmentIntensity = v;
};

/**
 * Key / fill / rim rig plus a local studio environment built from Lightformers
 * (rendered once into a 256px cube map — no HDR download). Chrome and gold need it to read as metal.
 */
export function StudioLights({ envIntensity = 1 }: { envIntensity?: number }) {
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setEnvIntensity(scene, envIntensity);
    invalidate();
  }, [scene, envIntensity, invalidate]);

  return (
    <>
      <hemisphereLight args={["#ECEEF2", "#2A2E37", 0.6]} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#F58FBA" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 2]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.5} position={[-4, 1, 1]} scale={[2, 4, 1]} rotation-y={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.2} color="#FF7AB8" position={[4, 1, -1]} scale={[2, 4, 1]} rotation-y={-Math.PI / 2} />
        <Lightformer form="ring" intensity={1} color="#6FC9FF" position={[0, 1, -5]} scale={3} />
      </Environment>
    </>
  );
}
