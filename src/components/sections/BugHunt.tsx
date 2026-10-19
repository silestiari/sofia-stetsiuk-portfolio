"use client";

import { useEffect, useRef } from "react";
import { color } from "@/lib/tokens";

export type BugHuntLabels = { counter: string; fixed: string; allFixed: string };

type Bug = { id: number; x: number; y: number; a: number; v: number; turn: number; step: number; caught: number };

const N = 7;
const ACCENT = color.accent; // the target on a bug you can catch
const SIGNAL = color.signal; // caught / fixed
const TEXT = color.text; // a crawling bug
const MUTED = color.text2; // counter
const CATCH_MS = 1600; // selection frame + label, then the bug fades out
const RESPAWN_MS = 3500; // after "all fixed"

/**
 * Hero mini-game "catch the bug" (QA × game design): white outline bugs crawl over the grid and run from the cursor;
 * a pink target marks the one in reach; a click or tap catches it — lime selection frame, "BUG-004 · fixed ✓" — and
 * the counter goes up. When all are caught: one RGB-split glitch of the frame, "release ready", then a new round.
 * Canvas 2D, runs only while on screen; reduced motion: bugs crawl at half speed, no glitch.
 */
export function BugHunt({ labels, className = "" }: { labels: BugHuntLabels; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = matchMedia("(pointer: coarse)").matches;
    const mono = getComputedStyle(document.documentElement).getPropertyValue("--font-mono").trim() || "monospace";
    let W = 0, H = 0, raf = 0, last = 0, visible = false, round = 0, doneAt = 0, glitched = false;
    const pointer = { x: -1e4, y: -1e4 };
    let bugs: Bug[] = [];

    const spawn = () => {
      round++;
      doneAt = 0;
      glitched = false;
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

    const reach = coarse ? 40 : 28;
    const target = () => {
      let best: Bug | undefined, bd = reach;
      for (const b of bugs) {
        const d = Math.hypot(b.x - pointer.x, b.y - pointer.y);
        if (!b.caught && d < bd) {
          best = b;
          bd = d;
        }
      }
      return best;
    };

    const drawBug = (b: Bug, now: number, hot: boolean) => {
      const t = b.caught ? Math.min(1, (now - b.caught) / CATCH_MS) : 0;
      const fade = b.caught ? 1 - Math.max(0, (now - b.caught - CATCH_MS) / 400) : 1;
      if (fade <= 0) return;
      const color = b.caught ? SIGNAL : TEXT;
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(b.x, b.y);
      ctx.lineWidth = 1;

      if (b.caught) {
        // selection gizmo: corner brackets close in, like selecting an object in an editor
        const s = reduced ? 18 : 26 - 8 * Math.min(1, t * 3);
        ctx.strokeStyle = SIGNAL;
        for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) {
          ctx.beginPath();
          ctx.moveTo(sx * s, sy * (s - 7));
          ctx.lineTo(sx * s, sy * s);
          ctx.lineTo(sx * (s - 7), sy * s);
          ctx.stroke();
        }
        ctx.font = `500 11px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillStyle = SIGNAL;
        ctx.fillText(`BUG-${String(b.id).padStart(3, "0")} · ${labels.fixed} ✓`, 0, -s - 8);
      } else if (hot) {
        // pink target: this one is in reach of a click
        ctx.strokeStyle = ACCENT;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          ctx.moveTo(dx * 14, dy * 14);
          ctx.lineTo(dx * 24, dy * 24);
        }
        ctx.stroke();
      }

      ctx.rotate(b.a);
      ctx.strokeStyle = color;
      // six legs, alternating tripod gait
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const swing = Math.sin(b.step + (i % 2 ? Math.PI : 0)) * (b.caught ? 0 : 2.5);
        const x = -4 + i * 4;
        for (const side of [-1, 1]) {
          ctx.moveTo(x, side * 5);
          ctx.lineTo(x + swing * side * 0.6 - 1, side * 9);
        }
      }
      ctx.moveTo(9, -1.5); // antennae
      ctx.lineTo(13, -5);
      ctx.moveTo(9, 1.5);
      ctx.lineTo(13, 5);
      ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(-1, 0, 7, 5, 0, 0, Math.PI * 2); // body: outline only
      ctx.moveTo(10, 0);
      ctx.arc(7, 0, 3, 0, Math.PI * 2); // head
      ctx.stroke();
      ctx.restore();
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      const hot = target();
      for (const b of bugs) drawBug(b, now, b === hot);
      const found = bugs.filter((b) => b.caught).length;
      // counter top-right (the frame's top-left belongs to the hint / tagline) + a 1px progress bar
      ctx.font = `500 11px ${mono}`;
      ctx.textAlign = "right";
      ctx.fillStyle = MUTED;
      const label = labels.counter.replace("{found}", String(found)).replace("{total}", String(N));
      ctx.fillText(label, W - 16, 24);
      const bar = ctx.measureText(label).width;
      ctx.fillStyle = `${TEXT}38`; // text at 22%
      ctx.fillRect(W - 16 - bar, 32, bar, 1);
      ctx.fillStyle = SIGNAL;
      ctx.fillRect(W - 16 - bar, 32, (bar * found) / N, 1);
      if (doneAt && now >= doneAt) {
        if (!glitched && !reduced) {
          // one RGB-split burst of the whole frame, once per round (≤ 1 flash, no white flash)
          canvas.animate(
            [
              { transform: "translateX(-4px)", filter: `drop-shadow(4px 0 ${ACCENT}) drop-shadow(-4px 0 ${TEXT})`, clipPath: "inset(10% 0 55% 0)" },
              { transform: "translateX(3px)", filter: `drop-shadow(-3px 0 ${ACCENT}) drop-shadow(3px 0 ${TEXT})`, clipPath: "inset(45% 0 20% 0)" },
              { transform: "none", filter: "none", clipPath: "inset(0)" },
            ],
            { duration: 280, easing: "steps(3)" },
          );
        }
        glitched = true;
        ctx.save();
        ctx.globalAlpha = Math.min(1, (now - doneAt) / 300);
        ctx.font = `500 14px ${mono}`;
        ctx.textAlign = "center";
        ctx.fillStyle = SIGNAL;
        ctx.fillText(labels.allFixed, W / 2, H / 2);
        ctx.restore();
      }
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      update(reduced ? dt / 2 : dt); // the game needs moving bugs: reduced motion only slows them down
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
      Object.assign(pointer, local(e));
      const best = target();
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
