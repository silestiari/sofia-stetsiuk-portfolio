"use client";

import { CanvasTexture, SRGBColorSpace } from "three";

// One soft radial texture for the whole page, created lazily on the client.
let texture: CanvasTexture | null = null;
function blob() {
  if (texture) return texture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, "rgba(0,0,0,1)");
  r.addColorStop(0.55, "rgba(0,0,0,0.45)");
  r.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  texture = new CanvasTexture(c);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

/**
 * Contact shadow as a single textured quad: 1 draw call, no extra depth/blur passes per frame
 * (drei ContactShadows re-rendered the scene every frame and leaked render targets on resize of `scale`).
 */
export function BlobShadow({ size, opacity = 0.5, color = "#000000", y = 0.002 }: { size: number; opacity?: number; color?: string; y?: number }) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={y} scale={size} renderOrder={1}>
      <planeGeometry />
      <meshBasicMaterial map={blob()} color={color} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
