"use client";

import { ArrowUpRight, TerminalSquare } from "lucide-react";
import { experiments, type Experiment } from "@/content/experiments";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { LatticeDemo, NoiseDemo, OrbitDemo, TokensDemo } from "@/components/playground/demos";
import { cn } from "@/lib/utils";

const demoMap: Record<NonNullable<Experiment["demo"]>, React.ComponentType> = {
  lattice: LatticeDemo,
  tokens: TokensDemo,
  orbit: OrbitDemo,
  noise: NoiseDemo,
};

const spans: Record<NonNullable<Experiment["size"]>, string> = {
  lg: "md:col-span-2 md:row-span-2 min-h-[320px]",
  md: "md:col-span-2 min-h-[300px]",
  sm: "min-h-[220px]",
};

export function Playground() {
  return (
    <section id="playground" className="relative scroll-mt-16 border-t border-line bg-bg-2/30 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute left-[-10%] bottom-0 h-[40vmax] w-[40vmax] rounded-full bg-accent/[0.05] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="04" eyebrow="Experiments" lines={["The", "playground."]} />
          <Reveal delay={0.2} className="max-w-sm text-ink-2 lg:pb-3">
            A creative lab for prototypes, interface ideas and technical explorations. Things here are
            unfinished on purpose — poke at them.
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 grid auto-rows-[minmax(200px,auto)] gap-4 md:grid-cols-4">
          {experiments.map((x) => {
            const Demo = x.demo ? demoMap[x.demo] : null;
            const isTerminal = x.id === "terminal";
            return (
              <article
                key={x.id}
                className={cn(
                  "spot panel group relative flex flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-line-2",
                  spans[x.size ?? "sm"],
                )}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div className="relative flex-1 overflow-hidden">
                  {Demo ? (
                    <div className={cn("absolute inset-0", x.demo === "tokens" && "p-5")}>
                      <Demo />
                    </div>
                  ) : isTerminal ? (
                    <button
                      type="button"
                      onClick={() => window.dispatchEvent(new CustomEvent("mg:terminal"))}
                      className="flex h-full w-full items-center justify-center text-ink-3 transition-colors hover:text-accent-2"
                      aria-label="Open the terminal"
                    >
                      <TerminalSquare className="h-10 w-10" strokeWidth={1.2} />
                    </button>
                  ) : null}
                </div>
                <div className="relative flex items-end justify-between gap-4 border-t border-line bg-bg/70 p-5 backdrop-blur">
                  <div>
                    <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">{x.tag}</div>
                    <h3 className="mt-1 font-display text-lg text-ink">{x.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-ink-2">{x.note}</p>
                  </div>
                  {x.href && (
                    <a
                      href={x.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="shrink-0 rounded-full border border-line p-2 text-ink-2 hover:text-ink"
                      aria-label={`Open ${x.title}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
