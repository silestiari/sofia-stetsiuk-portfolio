"use client";

import { useEffect, useRef } from "react";

export type BugHuntLabels = { counter: string; fixed: string; allFixed: string };

type Bug = { id: number; x: number; y: number; a: number; v: number; turn: number; step: number; caught: number };

const N = 7;
const ACCENT = "#F58FBA"; // --color-qa-accent
const OK = "#5ED39A"; // --color-status-pass
const TEXT = "#ECEEF2";
const MUTED = "#7D8390";
const CATCH_MS = 1600; // selection frame + label, then the bug fades out
const RESPAWN_MS = 3500; // after "all fixed"

/**
 * Hero mini-game "catch the bug" (QA × game design): glowing bugs crawl over the grid and run from the cursor;
 * a click or tap catches one — selection frame, "BUG-004 · fixed ✓" — and the counter goes up. When all are
 * caught, "release ready", then a new round. Canvas 2D, runs only while on screen; reduced motion: bugs stand still.
 */
export function BugHunt({ labels, className = "" }: { labels: BugHuntLabels; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
    let W = 0, H = 0, raf = 0, last = 0, visible = false, round = 0, doneAt = 0;
    const pointer = { x: -1e4, y: -1e4 };
    let bugs: Bug[] = [];

    const spawn = () => {
      round++;
      doneAt = 0;
      bugs = Array.from({ length: N }, (_, i) => ({
        id: (round - 1) * N + i + 1,
        x: W * (0.15 + 0.7 * Math.random()),
        y: H * (0.15 + 0.7 * Math.random()),
        a: Math.random() * Math.PI * 2,
        v: 0,
        turn: 0,
        step: Math.random() * 10,
        caught: 0,
      }));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const [ow, oh] = [W, H];
      W = r.width;
      H = r.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!bugs.length) spawn();
      else if (ow && oh)
        for (const b of bugs) {
          b.x *= W / ow;
          b.y *= H / oh;
        }
      draw(performance.now());
    };

    const update = (dt: number) => {
      const margin = 28;
      for (const b of bugs) {
        if (b.caught) continue;
        const dx = b.x - pointer.x, dy = b.y - pointer.y;
        const d = Math.hypot(dx, dy);
        let speed = 38;
        if (d < 120) {
          // run from the cursor: steer towards the escape direction, faster the closer it is
          const away = Math.atan2(dy, dx);
          b.a += Math.atan2(Math.sin(away - b.a), Math.cos(away - b.a)) * Math.min(1, dt * 8);
          speed = 38 + (120 - d) * 1.6;
        } else {
          b.turn += (Math.random() - 0.5) * dt * 6;
          b.turn *= 0.96;
          b.a += b.turn * dt;
        }
        // soft walls: turn back towards the centre
        if (b.x < margin || b.x > W - margin || b.y < margin || b.y > H - margin) {
          const home = Math.atan2(H / 2 - b.y, W / 2 - b.x);
          b.a += Math.atan2(Math.sin(home - b.a), Math.cos(home - b.a)) * Math.min(1, dt * 4);
        }
        b.v += (speed - b.v) * Math.min(1, dt * 5);
        b.x = Math.min(W - 4, Math.max(4, b.x + Math.cos(b.a) * b.v * dt));
        b.y = Math.min(H - 4, Math.max(4, b.y + Math.sin(b.a) * b.v * dt));
        b.step += b.v * dt * 0.35;
      }
    };

    const drawBug = (b: Bug, now: number) => {
      const t = b.caught ? Math.min(1, (now - b.caught) / CATCH_MS) : 0;
      const fade = b.caught ? 1 - Math.max(0, (now - b.caught - CATCH_MS) / 400) : 1;
      if (fade <= 0) return;
      const color = b.caught ? OK : ACCENT;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(b.x, b.y);

      if (b.caught) {
        // selection gizmo: corner brackets close in, like selecting an object in an editor
        const s = 26 - 8 * Math.min(1, t * 3);
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1.5;
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          ctx.beginPath();
          ctx.moveTo(sx * s, sy * (s - 7));
          ctx.lineTo(sx * s, sy * s);
          ctx.lineTo(sx * (s - 7), sy * s);
          ctx.stroke();
        }
        ctx.font = `600 11px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillStyle = TEXT;
        ctx.fillText(`BUG-${String(b.id).padStart(3, "0")} · ${labels.fixed} ✓`, 0, -s - 8);
      }

      ctx.rotate(b.a);
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1.4;
      // six legs, alternating tripod gait
      for (let i = 0; i < 3; i++) {
        const swing = Math.sin(b.step + (i % 2 ? Math.PI : 0)) * (b.caught ? 0 : 2.5);
        const x = -4 + i * 4;
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(x, side * 3);
          ctx.lineTo(x + swing * side * 0.6 - 1, side * 9);
          ctx.stroke();
        }
      }
      ctx.beginPath();
      ctx.ellipse(-1, 0, 7, 5, 0, 0, Math.PI * 2); // body
      ctx.fill();
      ctx.beginPath();
      ctx.arc(7, 0, 3, 0, Math.PI * 2); // head
      ctx.fill();
      ctx.beginPath(); // antennae
      ctx.moveTo(9, -1.5);
      ctx.lineTo(13, -5);
      ctx.moveTo(9, 1.5);
      ctx.lineTo(13, 5);
      ctx.stroke();
      ctx.restore();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      for (const b of bugs) drawBug(b, now);
      const found = bugs.filter((b) => b.caught).length;
      ctx.font = `600 11px ${mono}`;
      ctx.textAlign = "left";
      ctx.fillStyle = MUTED;
      ctx.fillText(labels.counter.replace("{found}", String(found)).replace("{total}", String(N)), 16, 24);
      if (doneAt) {
        ctx.save();
        ctx.globalAlpha = Math.min(1, (now - doneAt) / 300);
        ctx.font = `600 14px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillStyle = OK;
        ctx.shadowColor = OK;
        ctx.shadowBlur = 12;
        ctx.fillText(labels.allFixed, W / 2, H / 2);
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      if (!reduced) update(dt);
      if (doneAt && now - doneAt > RESPAWN_MS) spawn();
      draw(now);
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const run = () => {
      if (!raf && visible && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const local = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onMove = (e: PointerEvent) => Object.assign(pointer, local(e));
    const onLeave = () => Object.assign(pointer, { x: -1e4, y: -1e4 });
    const onDown = (e: PointerEvent) => {
      const p = local(e);
      const reach = coarse ? 40 : 28;
      let best: Bug | undefined, bd = reach;
      for (const b of bugs) {
        const d = Math.hypot(b.x - p.x, b.y - p.y);
        if (!b.caught && d < bd) {
          best = b;
          bd = d;
        }
      }
      if (!best) return;
      const now = performance.now();
      best.caught = now;
      if (bugs.every((b) => b.caught)) doneAt = now + CATCH_MS;
      run();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      run();
    });
    io.observe(canvas);
    const onVis = () => run();
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [labels.counter, labels.fixed, labels.allFixed]); // the strings, not the object: a new object must not restart the round

  return <canvas ref={ref} className={`cursor-crosshair touch-manipulation ${className}`} />;
}
