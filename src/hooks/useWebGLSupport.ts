"use client";

import { useSyncExternalStore } from "react";

let cached: boolean | undefined;

function detect() {
  if (cached === undefined) {
    try {
      const gl = "WebGL2RenderingContext" in window && document.createElement("canvas").getContext("webgl2");
      cached = !!gl;
      // Free the probe context right away: browsers cap the number of live WebGL contexts.
      if (gl) gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      cached = false;
    }
  }
  return cached;
}

const noopSubscribe = () => () => {};

/**
 * WebGL2 availability. `null` on the server and before hydration — render the poster in that case.
 * Runtime context loss (webglcontextlost) is handled by the canvas component itself.
 */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore(noopSubscribe, detect, () => null);
}
