"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* ------------------------------------------------------------------ */
/* Shared canvas loop: DPR-aware, pauses off-screen & under reduced motion */
/* ------------------------------------------------------------------ */
function useCanvasLoop(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, p: { x: number; y: number; in: boolean }) => void,
) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const pointer = useRef({ x: -1e3, y: -1e3, in: false });

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      const r = c.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width;
      h = r.height;
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);
    resize();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(c);

    const start = performance.now();
    const loop = (now: number) => {
      raf = 0;
      if (!visible) return;
      draw(ctx, w, h, (now - start) / 1000, pointer.current);
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      pointer.current = { x: e.clientX - r.left, y: e.clientY - r.top, in: true };
      if (reduced && !raf) raf = requestAnimationFrame(loop);
    };
    const onLeave = () => {
      pointer.current = { x: -1e3, y: -1e3, in: false };
      if (reduced && !raf) raf = requestAnimationFrame(loop);
    };
    c.addEventListener("pointermove", onMove, { passive: true });
    c.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      c.removeEventListener("pointermove", onMove);
      c.removeEventListener("pointerleave", onLeave);
    };
  }, [draw, reduced]);

  return ref;
}

/* ------------------------------ Lattice ------------------------------ */
export function LatticeDemo() {
  const ref = useCanvasLoop((ctx, w, h, t, p) => {
    ctx.clearRect(0, 0, w, h);
    const gap = 24;
    const cols = Math.ceil(w / gap) + 1;
    const rows = Math.ceil(h / gap) + 1;
    // A slow wave travels across the grid so the tile visibly lives even without a pointer;
    // when the pointer is inside, nodes are pulled toward it.
    const wave = { x: w * (0.5 + 0.5 * Math.sin(t * 0.35)), y: h * (0.5 + 0.5 * Math.cos(t * 0.27)) };
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x0 = i * gap;
        const y0 = j * gap;
        const dx = p.x - x0;
        const dy = p.y - y0;
        const d = Math.hypot(dx, dy);
        const pull = p.in ? Math.max(0, 1 - d / 220) : 0;
        const wd = Math.hypot(wave.x - x0, wave.y - y0);
        const glow = Math.max(0, 1 - wd / 160) * (p.in ? 0.35 : 1);
        const k = Math.max(pull, glow * 0.6);
        const x = x0 + dx * pull * 0.3 + Math.sin(t * 1.1 + j * 0.45) * 2.2;
        const y = y0 + dy * pull * 0.3 + Math.cos(t * 1.1 + i * 0.45) * 2.2;
        const r = 1.2 + k * 2.8;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = k > 0.02 ? `rgba(196,181,253,${0.4 + k * 0.6})` : "rgba(146,144,159,0.5)";
        ctx.fill();
        if (pull > 0.55) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = `rgba(168,85,247,${(pull - 0.55) * 0.5})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  });
  return (
    <div className="relative h-full w-full">
      <canvas ref={ref} className="h-full w-full cursor-crosshair touch-none" aria-label="Interactive dot lattice" />
      <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink-3">
        move your pointer
      </span>
    </div>
  );
}

/* ---------------------------- Token stream --------------------------- */
const SAMPLE =
  "Streaming means the client renders tokens as they arrive — the first byte matters more than the last. Buffer by sentence, flush on punctuation, always show a cursor.";

export function TokensDemo() {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState("");
  const [running, setRunning] = useState(false);
  const [chunks, setChunks] = useState(0);

  useEffect(() => {
    if (!running) return;
    const tokens = SAMPLE.match(/\S+\s*/g) ?? [];
    let i = 0;
    let n = 0;
    let timer = 0;
    // Each tick sets the absolute prefix (not "previous + chunk"), so a re-run of this
    // effect (StrictMode, Fast Refresh) can never duplicate or drop tokens.
    const step = () => {
      if (i >= tokens.length) {
        setRunning(false);
        return;
      }
      i = Math.min(tokens.length, i + 1 + Math.floor(Math.random() * 3));
      n += 1;
      setOut(tokens.slice(0, i).join(""));
      setChunks(n);
      timer = window.setTimeout(step, reduced ? 0 : 40 + Math.random() * 120);
    };
    timer = window.setTimeout(step, 0);
    return () => clearTimeout(timer);
  }, [running, reduced]);

  const start = () => {
    setOut("");
    setChunks(0);
    setRunning(true);
  };

  return (
    // The whole tile is the trigger (so it works on touch and without hunting for a button);
    // the explicit button is there for keyboard users and as the visible affordance.
    <div
      className="flex h-full cursor-pointer flex-col gap-3 font-mono text-[12px]"
      onClick={() => {
        if (!running) start();
      }}
    >
      <div className="flex items-center justify-between gap-3 text-ink-3">
        <span className="truncate">SSE · text/event-stream · {chunks} chunks</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            start();
          }}
          disabled={running}
          className="shrink-0 rounded-full border border-line-2 px-3 py-1 text-[11px] uppercase tracking-wider text-ink transition-colors hover:border-accent hover:text-accent-2 disabled:opacity-50"
        >
          {running ? "streaming…" : out ? "run again" : "▶ run"}
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden leading-relaxed text-ink/90">
        {out || <span className="text-ink-3">click anywhere in this tile to stream a response token by token →</span>}
        {running && <span className="ml-0.5 inline-block h-3.5 w-[6px] translate-y-[2px] bg-accent motion-safe:animate-pulse" />}
      </div>
    </div>
  );
}

/* ------------------------------- Orbit ------------------------------- */
type Job = { a: number; r: number; speed: number; retries: number; hue: number };

export function OrbitDemo() {
  const jobs = useRef<Job[]>(
    Array.from({ length: 7 }, (_, i) => ({
      a: (i / 7) * Math.PI * 2,
      r: 0.55 + (i % 3) * 0.15,
      speed: 0.3 + (i % 4) * 0.12,
      retries: i % 3,
      hue: 265 + (i % 2) * 20,
    })),
  );
  const ref = useCanvasLoop((ctx, w, h, t) => {
    ctx.clearRect(0, 0, w, h);
    const cx = w / 2;
    const cy = h / 2;
    // Elliptical orbits so the jobs use the whole (wide) tile instead of a tiny circle.
    const RX = w * 0.44;
    const RY = h * 0.42;
    // core
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, RY * 0.6);
    g.addColorStop(0, "rgba(168,85,247,0.55)");
    g.addColorStop(1, "rgba(168,85,247,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.beginPath();
    ctx.arc(cx, cy, 7, 0, Math.PI * 2);
    ctx.fillStyle = "#c4b5fd";
    ctx.fill();
    // rings
    [0.4, 0.55, 0.7, 0.85].forEach((k) => {
      ctx.beginPath();
      ctx.ellipse(cx, cy, RX * k, RY * k, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(146,144,159,0.22)";
      ctx.setLineDash([2, 6]);
      ctx.stroke();
      ctx.setLineDash([]);
    });
    jobs.current.forEach((j) => {
      const k = j.r - j.retries * 0.12;
      const a = j.a + t * j.speed;
      const x = cx + Math.cos(a) * RX * k;
      const y = cy + Math.sin(a) * RY * k;
      // tail
      ctx.beginPath();
      ctx.ellipse(cx, cy, RX * k, RY * k, 0, a - 0.7, a);
      ctx.strokeStyle = `hsla(${j.hue} 90% 75% / 0.4)`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 3.5 + j.retries, 0, Math.PI * 2);
      ctx.fillStyle = j.retries >= 2 ? "#f5f3fa" : `hsl(${j.hue} 90% 75%)`;
      ctx.fill();
    });
  });
  return (
    <div className="relative h-full w-full">
      <canvas
        ref={ref}
        className="h-full w-full cursor-crosshair"
        aria-label="Orbiting job scheduler; click to enqueue a job"
        onClick={() => {
          jobs.current.push({
            a: Math.random() * Math.PI * 2,
            r: 0.85,
            speed: 0.25 + Math.random() * 0.4,
            retries: 0,
            hue: 265,
          });
          if (jobs.current.length > 16) jobs.current.shift();
        }}
      />
      <span className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] uppercase tracking-wider text-ink-3">
        click anywhere to enqueue a job
      </span>
    </div>
  );
}

/* -------------------------------- Noise ------------------------------ */
export function NoiseDemo() {
  const ref = useCanvasLoop((ctx, w, h, t, p) => {
    ctx.clearRect(0, 0, w, h);
    const cell = 12;
    const cols = Math.ceil(w / cell);
    const rows = Math.ceil(h / cell);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cell;
        const y = j * cell;
        // pointer disturbs the field like a stone in water
        const d = p.in ? Math.hypot(p.x - x, p.y - y) : 1e9;
        const ripple = d < 120 ? Math.sin(d * 0.12 - t * 6) * (1 - d / 120) : 0;
        const v =
          Math.sin(i * 0.3 + t * 0.9) * Math.cos(j * 0.35 - t * 0.6) +
          Math.sin((i + j) * 0.15 + t * 1.3) * 0.6 +
          ripple;
        const a = Math.min(1, Math.max(0, (v + 1.6) / 3.2));
        ctx.fillStyle = `rgba(${Math.round(120 + a * 76)}, ${Math.round(60 + a * 121)}, ${Math.round(200 + a * 53)}, ${0.06 + a * 0.5})`;
        ctx.fillRect(x, y, cell - 1, cell - 1);
      }
    }
  });
  return <canvas ref={ref} className="h-full w-full touch-none" aria-label="Animated noise field" />;
}
