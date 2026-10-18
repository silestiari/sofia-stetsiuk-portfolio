"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { BoxGeometry, Group, Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, type Object3D, type WebGLRenderer } from "three";

/** RENDER PASS stages (DESIGN_SYSTEM.md 1.1). "debug" = wireframe + bounding boxes, drawn by the scene. */
export type Pass = "wire" | "debug" | "clay" | "shaded" | "beauty";

// Shared override materials: one instance each for the whole page.
const wire = new MeshBasicMaterial({ color: "#F58FBA", wireframe: true, transparent: true, opacity: 0.75 });
const clay = new MeshStandardMaterial({ color: "#D8D2CB", roughness: 0.92, metalness: 0 });

/** scene.environmentIntensity per pass: shaded keeps reflections faint, beauty gets the full studio. */
export const envIntensity: Record<Pass, number> = { wire: 0, debug: 0, clay: 0.5, shaded: 0.15, beauty: 0.85 };

/**
 * Loads a .glb only when rendered. Draco files decode with the copy in /public/draco (from three, no CDN fetch)
 * and returns a private clone, so pass overrides on one instance never leak into another.
 */
export function useModel(url: string) {
  const { scene } = useGLTF(url, "/draco/", false);
  return useMemo(() => {
    const root = scene.clone(true);
    const originals = new Map<Mesh, Material | Material[]>();
    root.traverse((o) => {
      if (o instanceof Mesh) originals.set(o, o.material);
    });
    return { root, originals };
  }, [scene]);
}

function applyPass(originals: Map<Mesh, Material | Material[]>, pass: Pass) {
  for (const [mesh, original] of originals) {
    mesh.material = pass === "wire" || pass === "debug" ? wire : pass === "clay" ? clay : original;
  }
}

/** Swaps every mesh material of a cloned model for the pass override (or back to the original). */
export function usePass({ originals }: { root: Object3D; originals: Map<Mesh, Material | Material[]> }, pass: Pass) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    applyPass(originals, pass);
    invalidate();
  }, [originals, pass, invalidate]);
}

const warmed = new WeakSet<WebGLRenderer>();

/**
 * Compiles the wire/clay programs in the background right after the scene is up, so the first pass switch
 * doesn't stall on shader compilation (≈ 1 s on software WebGL, perf report). Once per renderer.
 */
export function useWarmPasses() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    if (warmed.has(gl)) return;
    warmed.add(gl);
    const geo = new BoxGeometry();
    const probe = new Group();
    probe.add(new Mesh(geo, wire), new Mesh(geo, clay));
    const run = () => gl.compileAsync(probe, camera, scene).finally(() => geo.dispose());
    const id = window.requestIdleCallback ? window.requestIdleCallback(run) : window.setTimeout(run, 300);
    return () => (window.cancelIdleCallback ?? window.clearTimeout)(id);
  }, [gl, scene, camera]);
}
