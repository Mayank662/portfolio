"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/utils";

/**
 * Animated mini-dashboards for the observability project cards.
 * Charts move like a live Grafana board but carry no numbers on purpose —
 * they illustrate the kind of panels built, not real metrics.
 * Ticks ~12 fps only while on screen; static under reduced motion.
 */

/* ------------------------------ helpers ------------------------------ */

function useLiveTime() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const start = performance.now();
    let id = 0;
    const io = new IntersectionObserver(([e]) => {
      window.clearInterval(id);
      if (e.isIntersecting) id = window.setInterval(() => setT((performance.now() - start) / 1000), 80);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearInterval(id);
    };
  }, [reduced]);
  return { ref, t };
}

/** Smooth deterministic noise in roughly [-1, 1]. */
const wave = (x: number) => Math.sin(x * 1.7) * 0.5 + Math.sin(x * 0.63 + 1.3) * 0.3 + Math.sin(x * 3.1 + 0.7) * 0.2;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const frac = (v: number) => v - Math.floor(v);

/** Values in [0,1] → SVG path in a 100×40 box (0 = bottom). */
function linePath(vals: number[], h = 40) {
  return vals
    .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (vals.length - 1)) * 100).toFixed(2)} ${(h - v * h).toFixed(2)}`)
    .join(" ");
}
function areaPath(vals: number[], h = 40) {
  return `${linePath(vals, h)} L100 ${h} L0 ${h} Z`;
}

const stroke = { fill: "none", stroke: "currentColor", vectorEffect: "non-scaling-stroke" as const };

function Panel({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex min-h-0 flex-col rounded-xl border border-line bg-bg/70 p-2.5", className)}>
      <div className="mb-1.5 flex items-center justify-between font-mono text-[8.5px] uppercase tracking-[0.16em] text-ink-3">
        <span className="truncate">{label}</span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

function Legend({ items }: { items: { c: string; l: string; dashed?: boolean }[] }) {
  return (
    <div className="absolute right-0 top-0 flex gap-2 font-mono text-[8px] uppercase tracking-wider text-ink-3">
      {items.map((it) => (
        <span key={it.l} className="flex items-center gap-1">
          <span className={cn("inline-block h-px w-3", it.dashed ? "border-t border-dashed" : "h-[2px]", it.c)} />
          {it.l}
        </span>
      ))}
    </div>
  );
}

function Window({ title, children, innerRef }: { title: string; children: React.ReactNode; innerRef: React.Ref<HTMLDivElement> }) {
  return (
    <div
      ref={innerRef}
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line-2 bg-[#0b0b11]/90 shadow-[0_30px_80px_-30px_rgba(168,85,247,0.45)]"
    >
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-3/60" />
          <span className="h-2 w-2 rounded-full bg-ink-3/60" />
          <span className="h-2 w-2 rounded-full bg-ink-3/60" />
          <span className="ml-2 font-mono text-[10px] text-ink-2">{title}</span>
        </div>
        <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-accent-2">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" /> live
        </span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-[1.15fr_1fr_1.15fr] gap-2 p-2.5">{children}</div>
    </div>
  );
}

/* --------------------------- agent dashboard -------------------------- */

const TOOLS = [
  { k: "llm", base: 0.86 },
  { k: "retriever", base: 0.5 },
  { k: "ner", base: 0.3 },
  { k: "tools", base: 0.2 },
];

const SPANS = [
  { k: "agent.run", s: 0, w: 1, depth: 0 },
  { k: "retrieve", s: 0.04, w: 0.22, depth: 1 },
  { k: "ner", s: 0.06, w: 0.12, depth: 2 },
  { k: "llm.plan", s: 0.28, w: 0.3, depth: 1 },
  { k: "tool.call", s: 0.6, w: 0.14, depth: 1 },
  { k: "llm.answer", s: 0.76, w: 0.22, depth: 1 },
];

export function AgentDashboard() {
  const { ref, t } = useLiveTime();
  const N = 40;
  const p50 = Array.from({ length: N }, (_, i) => clamp01(0.3 + 0.1 * wave(t * 0.9 + i * 0.22)));
  const p99 = p50.map((v, i) => clamp01(v + 0.32 + 0.12 * wave(t * 0.7 + i * 0.31 + 4)));
  const pass = clamp01(0.8 + 0.07 * wave(t * 0.5 + 2));
  const ARC = Math.PI * 30;
  const cursor = frac(t * 0.14);

  return (
    <Window title="agent-observability" innerRef={ref}>
      <Panel label="Latency · p50 / p99" className="col-span-2">
        <Legend
          items={[
            { c: "bg-accent", l: "p50" },
            { c: "border-accent-2/70", l: "p99", dashed: true },
          ]}
        />
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
          {[10, 20, 30].map((y) => (
            <line key={y} x1="0" x2="100" y1={y} y2={y} {...stroke} className="text-line" strokeWidth={0.6} />
          ))}
          <path d={areaPath(p99)} className="fill-accent/[0.07]" />
          <path d={linePath(p99)} {...stroke} strokeDasharray="3 3" strokeWidth={1.1} className="text-accent-2/70" />
          <path d={areaPath(p50)} className="fill-accent/15" />
          <path d={linePath(p50)} {...stroke} strokeWidth={1.6} className="text-accent" />
        </svg>
      </Panel>

      <Panel label="Cost · by tool">
        <div className="flex h-full flex-col justify-evenly">
          {TOOLS.map((tool, i) => {
            const w = clamp01(tool.base + 0.06 * wave(t * 0.6 + i * 1.9));
            return (
              <div key={tool.k} className="flex min-h-0 items-center gap-2">
                <span className="w-14 shrink-0 font-mono text-[8px] uppercase leading-none tracking-wider text-ink-3">{tool.k}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent/60 to-accent-2 transition-[width] duration-300"
                    style={{ width: `${w * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel label="Eval pass rate">
        <svg viewBox="0 0 80 46" className="h-full w-full">
          <path d="M10 42 A30 30 0 0 1 70 42" {...stroke} strokeWidth={6} strokeLinecap="round" className="text-line" />
          <path
            d="M10 42 A30 30 0 0 1 70 42"
            {...stroke}
            strokeWidth={6}
            strokeLinecap="round"
            className="text-accent"
            strokeDasharray={ARC}
            strokeDashoffset={ARC * (1 - pass)}
          />
          <circle cx="40" cy="42" r="2.5" className="fill-accent-2" />
          <line
            x1="40"
            y1="42"
            x2={40 + Math.cos(Math.PI * (1 - pass)) * 22}
            y2={42 - Math.sin(Math.PI * (1 - pass)) * 22}
            {...stroke}
            strokeWidth={1.5}
            className="text-accent-2"
          />
        </svg>
      </Panel>

      <Panel label="Trace · single run" className="col-span-2">
        <div className="relative flex h-full flex-col">
          {SPANS.map((sp) => {
            const active = cursor >= sp.s && cursor <= sp.s + sp.w;
            return (
              <div key={sp.k} className="flex min-h-0 flex-1 items-center gap-2">
                <span
                  className={cn(
                    "w-14 shrink-0 truncate font-mono text-[7.5px] uppercase leading-none tracking-wider transition-colors duration-300",
                    active ? "text-accent-2" : "text-ink-3",
                  )}
                  style={{ paddingLeft: sp.depth * 5 }}
                >
                  {sp.k}
                </span>
                <div className="relative h-full flex-1">
                  <div
                    className={cn(
                      "absolute top-1/2 h-[5px] -translate-y-1/2 rounded-full transition-colors duration-300",
                      active ? "bg-accent shadow-[0_0_8px_rgba(168,85,247,0.8)]" : sp.depth === 0 ? "bg-accent/35" : "bg-accent-2/25",
                    )}
                    style={{ left: `${sp.s * 100}%`, width: `${sp.w * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
          <div
            className="pointer-events-none absolute inset-y-0 w-px bg-accent-2/70"
            style={{ left: `calc(64px + (100% - 64px) * ${cursor.toFixed(4)})` }}
          />
        </div>
      </Panel>
    </Window>
  );
}

/* -------------------------- service dashboard ------------------------- */

const PODS = 12;

export function ServiceDashboard() {
  const { ref, t } = useLiveTime();
  const N = 60;
  // Memory: climbs between GC cycles, drops on collection (sawtooth) + jitter.
  const mem: number[] = [];
  const gcAt: number[] = [];
  for (let i = 0; i < N; i++) {
    const x = t * 0.18 + (i / (N - 1)) * 3;
    const ph = frac(x);
    mem.push(clamp01(0.22 + 0.62 * Math.pow(ph, 0.85) + 0.03 * wave(x * 7)));
    if (i > 0 && frac(t * 0.18 + ((i - 1) / (N - 1)) * 3) > ph) gcAt.push((i / (N - 1)) * 100);
  }
  const traffic = Array.from({ length: 14 }, (_, i) => clamp01(0.5 + 0.38 * wave(t * 0.8 + i * 0.5)));
  const load = clamp01(0.55 + 0.4 * wave(t * 0.35));
  const pods = Math.max(4, Math.round(4 + load * (PODS - 4)));
  const netIn = Array.from({ length: 40 }, (_, i) => clamp01(0.55 + 0.35 * wave(t * 0.9 + i * 0.25)));
  const netOut = Array.from({ length: 40 }, (_, i) => clamp01(0.45 + 0.3 * wave(t * 0.75 + i * 0.27 + 3)));
  const half = (vals: number[], up: boolean) =>
    vals
      .map((v, i) => `${i === 0 ? "M" : "L"}${((i / (vals.length - 1)) * 100).toFixed(2)} ${(20 + (up ? -1 : 1) * v * 18).toFixed(2)}`)
      .join(" ") + " L100 20 L0 20 Z";

  return (
    <Window title="service-health" innerRef={ref}>
      <Panel label="Memory · heap & GC" className="col-span-2">
        <Legend
          items={[
            { c: "bg-accent", l: "heap" },
            { c: "bg-accent-2/70", l: "gc" },
          ]}
        />
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
          <line x1="0" x2="100" y1="6" y2="6" {...stroke} strokeDasharray="2 3" strokeWidth={0.8} className="text-ink-3/60" />
          <path d={areaPath(mem)} className="fill-accent/15" />
          <path d={linePath(mem)} {...stroke} strokeWidth={1.5} className="text-accent" />
          {gcAt.map((x) => (
            <line key={x.toFixed(1)} x1={x} x2={x} y1="34" y2="40" {...stroke} strokeWidth={1.4} className="text-accent-2/80" />
          ))}
        </svg>
      </Panel>

      <Panel label="Pods">
        <div className="grid h-full grid-cols-6 content-center gap-1.5">
          {Array.from({ length: PODS }, (_, i) => {
            const on = i < pods;
            const newest = i === pods - 1;
            return (
              <span
                key={i}
                className={cn(
                  "aspect-square rounded-[4px] border transition-all duration-500",
                  on ? "border-accent/60 bg-accent/40" : "border-line bg-transparent",
                  newest && "bg-accent-2/80 shadow-[0_0_10px_rgba(196,181,253,0.7)]",
                )}
              />
            );
          })}
        </div>
      </Panel>

      <Panel label="Traffic · req/s">
        <div className="flex h-full items-end gap-[3px]">
          {traffic.map((v, i) => (
            <span
              key={i}
              className="flex-1 rounded-t-[2px] bg-gradient-to-t from-accent/40 to-accent-2/90 transition-[height] duration-300"
              style={{ height: `${Math.max(8, v * 100)}%` }}
            />
          ))}
        </div>
      </Panel>

      <Panel label="Network · in / out" className="col-span-2">
        <Legend
          items={[
            { c: "bg-accent", l: "in" },
            { c: "bg-accent-2/70", l: "out" },
          ]}
        />
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-full w-full">
          <path d={half(netIn, true)} className="fill-accent/30" />
          <path d={half(netOut, false)} className="fill-accent-2/20" />
          <line x1="0" x2="100" y1="20" y2="20" {...stroke} strokeWidth={0.6} className="text-line-2" />
        </svg>
      </Panel>
    </Window>
  );
}
