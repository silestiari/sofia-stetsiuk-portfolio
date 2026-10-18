"use client";

import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import { Material, Mesh, MeshBasicMaterial, MeshStandardMaterial, type Object3D } from "three";

/** RENDER PASS stages (DESIGN_SYSTEM.md 1.1). "debug" = wireframe + bounding boxes, drawn by the scene. */
export type Pass = "wire" | "debug" | "clay" | "shaded" | "beauty";

// Shared override materials: one instance each for the whole page.
const wire = new MeshBasicMaterial({ color: "#9D8CFF", wireframe: true, transparent: true, opacity: 0.75 });
const clay = new MeshStandardMaterial({ color: "#D8D2CB", roughness: 0.92, metalness: 0 });

/** scene.environmentIntensity per pass: shaded keeps reflections faint, beauty gets the full studio. */
export const envIntensity: Record<Pass, number> = { wire: 0, debug: 0, clay: 0.5, shaded: 0.15, beauty: 0.85 };

/**
 * Loads a .glb only when rendered (no Draco/meshopt decoders: our files use neither, so no CDN fetch)
 * and returns a private clone, so pass overrides on one instance never leak into another.
 */
export function useModel(url: string) {
  const { scene } = useGLTF(url, false, false);
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
