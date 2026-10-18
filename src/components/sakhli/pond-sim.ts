// Copied from the Sakhli project (components/pond-sim.ts). Changes: colours are read from the pond element; endless swimming (AWAKE).
// Living pond: a few koi wander on smooth paths (heading-based steering), keep inside the pond oval,
// keep apart, flee the cursor/finger, and every tap/click drops a ripple. Canvas 2D, no deps.
// Runs only while the pond is on screen and the tab is visible. Loaded lazily by <KoiPond>.
// WCAG 2.2.2: unprompted motion is short. The koi swim for a few seconds when the pond comes into view, then
// glide to a stop and the loop ends (0 CPU). Hovering, moving or tapping over the pond wakes them again.

type P = { x: number; y: number };
type Koi = P & { a: number; v: number; turn: number; boost: number; len: number; body: string; patch: string; spots: number[]; spine: P[]; t: number };

const SEG = 12;
const WIDTH = [0.5, 0.78, 0.92, 1, 0.97, 0.88, 0.76, 0.62, 0.48, 0.36, 0.26, 0.18]; // body radius profile, head → tail

export function startPond(root: HTMLElement): VoidFunction {
  const canvas = root.querySelector("canvas")!;
  const ctx = canvas.getContext("2d")!;
  const css = getComputedStyle(root);
  const c = (n: string) => css.getPropertyValue(`--color-${n}`).trim();
  const [lamp, lampSoft, plaster, saperavi, pad] = ["lamp", "lamp-soft", "plaster", "saperavi", "garden-2"].map(c);

  // Touch devices: 30fps and ≤1.5x backing store (soft shapes; ~half the pixels of 2x). QA Phase 2 CPU budget.
  const coarse = matchMedia("(pointer: coarse)").matches;
  let W = 0, H = 0, dpr = 1;
  let running = false, visible = false, raf = 0, last = 0;
  // Portfolio change: the koi keep swimming while the pond is on screen (Sakhli stops after 2.8 s), so touch
  // screens without hover see it alive too. Off-screen, hidden tab and reduced motion still stop it.
  const AWAKE = Infinity;
  let awakeUntil = 0;
  const pointer = { x: 0, y: 0, until: 0 };
  const ripples: (P & { t: number })[] = [];
  const pads: (P & { r: number; rot: number })[] = [];

  const kinds = [
    [lamp, plaster],
    [lamp, saperavi],
    [plaster, lamp],
    [lampSoft, plaster],
    [lamp, plaster],
  ].slice(0, coarse ? 3 : 5); // fewer koi on phones
  const fish: Koi[] = kinds.map(([body, patch], i) => ({
    x: 0.2 + 0.15 * i, y: 0.35 + 0.1 * (i % 3), a: i * 1.9, v: 0, turn: 0, boost: 0, len: 0, body, patch, t: Math.random() * 10,
    spots: [1 + (i % 3), 3 + (i % 2), 6 - (i % 2)], spine: [],
  }));

  const resize = () => {
    const r = root.getBoundingClientRect();
    const [ow, oh] = [W || r.width, H || r.height];
    W = r.width;
    H = r.height;
    dpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    pads.length = 0;
    pads.push({ x: W * 0.12, y: H * 0.3, r: H * 0.13, rot: 0.4 }, { x: W * 0.84, y: H * 0.68, r: H * 0.16, rot: 3.4 }, { x: W * 0.45, y: H * 0.82, r: H * 0.1, rot: 2 });
    for (const f of fish) {
      const fresh = !f.spine.length;
      f.len = Math.min(H * 0.42, 150);
      if (fresh) {
        f.x *= W;
        f.y *= H;
      } else {
        f.x *= W / ow;
        f.y *= H / oh;
      }
      f.spine = Array.from({ length: SEG }, (_, k) => ({ x: f.x - Math.cos(f.a) * k * (f.len / SEG), y: f.y - Math.sin(f.a) * k * (f.len / SEG) }));
    }
  };

  const wrapAngle = (d: number) => Math.atan2(Math.sin(d), Math.cos(d));

  const step = (dt: number, now: number) => {
    const cx = W / 2, cy = H / 2;
    const rx = W / 2 - H * 0.18, ry = H / 2 - H * 0.16;
    const scared = now < pointer.until;
    const calm = now > awakeUntil;
    for (const f of fish) {
      const base = H * 0.09;
      const pace = Math.min(1, f.v / base); // 0 at rest: no wiggle, no turning on the spot
      f.t += dt * pace;
      // Wander: a slowly drifting turn rate.
      f.turn += (Math.random() - 0.5) * 2.4 * dt;
      f.turn *= 0.985;
      let want = f.a + f.turn * 0.9;
      let pull = 0;
      // Stay inside the oval: steer towards the centre, harder near the edge.
      const u = (f.x - cx) / rx, w = (f.y - cy) / ry, d = u * u + w * w;
      if (d > 0.55) {
        want = Math.atan2(cy - f.y, cx - f.x);
        pull = Math.min(1, (d - 0.55) * 2.5);
      }
      // Keep apart.
      for (const o of fish) {
        if (o === f) continue;
        const dx = f.x - o.x, dy = f.y - o.y, dd = Math.hypot(dx, dy);
        if (dd < f.len * 0.6 && dd > 0) {
          want = Math.atan2(dy, dx);
          pull = Math.max(pull, 0.35);
        }
      }
      // Flee the cursor / finger.
      if (scared) {
        const dx = f.x - pointer.x, dy = f.y - pointer.y, dd = Math.hypot(dx, dy);
        if (dd < H * 0.55) {
          want = Math.atan2(dy, dx);
          pull = 1;
          f.boost = Math.min(1, f.boost + dt * 6);
        }
      }
      const maxTurn = (1.1 + pull * 2.6 + f.boost * 2) * dt;
      f.a += pace * Math.max(-maxTurn, Math.min(maxTurn, wrapAngle(want - f.a) * (pull ? 1 : 0.6)));
      f.boost = Math.max(0, f.boost - dt * 0.7);
      const speed = calm ? 0 : base + H * f.boost * 0.5;
      f.v += (speed - f.v) * Math.min(1, dt * (calm ? 2.2 : 3));
      // Swim wiggle: the head sways, the spine carries it to the tail.
      const sway = Math.sin(f.t * (5 + f.boost * 6)) * 0.35 * pace;
      f.x += Math.cos(f.a + sway * 0.25) * f.v * dt;
      f.y += Math.sin(f.a + sway * 0.25) * f.v * dt;
      const seg = f.len / SEG;
      f.spine[0] = { x: f.x, y: f.y };
      for (let k = 1; k < SEG; k++) {
        const p = f.spine[k - 1], q = f.spine[k];
        const ang = Math.atan2(q.y - p.y, q.x - p.x);
        f.spine[k] = { x: p.x + Math.cos(ang) * seg, y: p.y + Math.sin(ang) * seg };
      }
    }
    for (let i = ripples.length - 1; i >= 0; i--) if ((ripples[i].t += dt) > 1.6) ripples.splice(i, 1);
  };

  const drawFish = (f: Koi, shadow: boolean) => {
    const r0 = f.len * 0.11;
    const off = shadow ? H * 0.05 : 0;
    ctx.fillStyle = shadow ? "rgba(0,0,0,0.18)" : f.body;
    // Tail fin: two curves fanned from the last spine point, swinging with the body.
    const t1 = f.spine[SEG - 1], t0 = f.spine[SEG - 3];
    const ta = Math.atan2(t1.y - t0.y, t1.x - t0.x);
    const fl = f.len * 0.26;
    ctx.globalAlpha = shadow ? 1 : 0.85;
    ctx.beginPath();
    ctx.moveTo(t0.x + off, t0.y + off);
    ctx.quadraticCurveTo(t1.x + Math.cos(ta - 0.9) * fl * 0.5 + off, t1.y + Math.sin(ta - 0.9) * fl * 0.5 + off, t1.x + Math.cos(ta - 0.45) * fl + off, t1.y + Math.sin(ta - 0.45) * fl + off);
    ctx.lineTo(t1.x + Math.cos(ta) * fl * 0.6 + off, t1.y + Math.sin(ta) * fl * 0.6 + off);
    ctx.lineTo(t1.x + Math.cos(ta + 0.45) * fl + off, t1.y + Math.sin(ta + 0.45) * fl + off);
    ctx.quadraticCurveTo(t1.x + Math.cos(ta + 0.9) * fl * 0.5 + off, t1.y + Math.sin(ta + 0.9) * fl * 0.5 + off, t0.x + off, t0.y + off);
    ctx.fill();
    // Pectoral fins.
    const s2 = f.spine[2], s1 = f.spine[1];
    const ba = Math.atan2(s1.y - s2.y, s1.x - s2.x);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(s2.x + Math.cos(ba + side * 1.6) * r0 + off, s2.y + Math.sin(ba + side * 1.6) * r0 + off, r0 * 0.9, r0 * 0.38, ba + side * 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    // Body: round-capped strokes along the spine, tapering head → tail, read as one smooth bending body.
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineCap = "round";
    for (let k = SEG - 2; k >= 0; k--) {
      const p = f.spine[k], q = f.spine[k + 1];
      ctx.lineWidth = 2 * r0 * WIDTH[k];
      ctx.beginPath();
      ctx.moveTo(p.x + off, p.y + off);
      ctx.lineTo(q.x + off, q.y + off);
      ctx.stroke();
    }
    if (shadow) return;
    ctx.fillStyle = f.patch;
    for (const k of f.spots) {
      const p = f.spine[k];
      ctx.beginPath();
      ctx.arc(p.x, p.y, r0 * WIDTH[k] * 0.62, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const draw = () => {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    // Lamp light on the water.
    const g = ctx.createRadialGradient(W * 0.62, H * 0.38, 0, W * 0.62, H * 0.38, W * 0.32);
    g.addColorStop(0, "rgba(244,217,108,0.10)");
    g.addColorStop(1, "rgba(244,217,108,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    if (!coarse) for (const f of fish) drawFish(f, true); // shadows: desktop only
    for (const f of fish) drawFish(f, false);
    ctx.fillStyle = pad;
    for (const p of pads) {
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.arc(p.x, p.y, p.r, p.rot + 0.25, p.rot + Math.PI * 2 - 0.25);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = lampSoft;
    ctx.lineWidth = 1.5;
    for (const r of ripples) {
      for (const lag of [0, 0.22]) {
        const t = r.t - lag;
        if (t <= 0) continue;
        ctx.globalAlpha = Math.max(0, 0.6 * (1 - t / 1.4));
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, t * H * 0.5, t * H * 0.32, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  };

  const frameMs = coarse ? 32 : 15;
  const loop = (now: number) => {
    // Frame cap: ~60fps on desktop (90/120Hz screens gain nothing for slow koi), ~30fps on touch devices to save
    // phone CPU/battery (QA: ~54% main thread at 4x CPU throttle uncapped). ponytail: fixed caps, adapt to measured frame cost if needed.
    if (now - last < frameMs) {
      raf = requestAnimationFrame(loop);
      return;
    }
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    step(dt, now);
    draw();
    // At rest with no ripples left: stop until the next interaction.
    if (now > awakeUntil && !ripples.length && fish.every((f) => f.v < H * 0.003)) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(loop);
  };

  const wake = (ms = AWAKE) => {
    awakeUntil = Math.max(awakeUntil, performance.now() + ms);
    sync();
  };
  const sync = () => {
    const should = visible && !document.hidden && (performance.now() < awakeUntil || ripples.length > 0);
    if (should === running) return;
    running = should;
    if (running) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    } else cancelAnimationFrame(raf);
  };

  const local = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
  };
  const onMove = (e: PointerEvent) => {
    local(e);
    pointer.until = performance.now() + 400;
    wake(2500);
  };
  const onDown = (e: PointerEvent) => {
    local(e);
    pointer.until = performance.now() + 1200;
    ripples.push({ x: pointer.x, y: pointer.y, t: 0 });
    wake();
  };

  const ro = new ResizeObserver(resize);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) wake();
    else sync();
  });
  resize();
  ro.observe(root);
  io.observe(root);
  document.addEventListener("visibilitychange", sync);
  canvas.addEventListener("pointermove", onMove, { passive: true });
  canvas.addEventListener("pointerdown", onDown, { passive: true });
  draw();
  canvas.dataset.live = "";

  return () => {
    ro.disconnect();
    io.disconnect();
    document.removeEventListener("visibilitychange", sync);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerdown", onDown);
    cancelAnimationFrame(raf);
    delete canvas.dataset.live;
  };
}
