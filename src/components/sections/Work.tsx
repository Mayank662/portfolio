"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Minus, Plus } from "lucide-react";
import { projects, type Project } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Diagram } from "./Diagram";
import { cn } from "@/lib/utils";

const EASE = [0.16, 1, 0.3, 1] as const;

const statusLabel: Record<Project["status"], string> = {
  concept: "Concept",
  "in-progress": "In progress",
  shipped: "Shipped",
};

function ProjectCard({ p, i }: { p: Project; i: number }) {
  const [open, setOpen] = useState(false);
  const flip = i % 2 === 1;

  return (
    <Reveal as="li" delay={0.05}>
      <article
        className={cn(
          "spot panel group relative overflow-hidden rounded-3xl transition-colors duration-500",
          open ? "border-accent/40" : "hover:border-line-2",
        )}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
          e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
      >
        <div className={cn("grid lg:grid-cols-12", flip && "lg:[&>*:first-child]:order-2")}>
          {/* Visual */}
          <div className="relative min-h-[240px] overflow-hidden border-b border-line lg:col-span-5 lg:min-h-[360px] lg:border-b-0 lg:border-r">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.10),transparent_60%)]" />
            <div className="absolute inset-0 p-6 transition-transform duration-700 ease-out-expo group-hover:scale-[1.03] md:p-10">
              <Diagram kind={p.diagram} />
            </div>
            <span className="absolute left-5 top-5 font-mono text-xs text-accent">{p.index}</span>
            <span className="absolute right-5 top-5 rounded-full border border-line bg-bg/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink-2 backdrop-blur">
              {statusLabel[p.status]}
            </span>
          </div>

          {/* Copy */}
          <div className="flex flex-col p-6 md:p-10 lg:col-span-7">
            <div className="eyebrow">{p.kicker}</div>
            <h3 className="display mt-3 text-[clamp(1.7rem,3vw,2.6rem)] text-ink">{p.title}</h3>
            <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-2">{p.summary}</p>

            <div className="mt-6 flex flex-wrap gap-1.5">
              {p.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line bg-bg/50 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-2"
                >
                  {t}
                </span>
              ))}
            </div>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="more"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { duration: 0.6, ease: EASE } }}
                  exit={{ height: 0, opacity: 0, transition: { duration: 0.35, ease: EASE } }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-2">
                    <div>
                      <div className="eyebrow mb-3">Problem</div>
                      <p className="text-sm leading-relaxed text-ink/90">{p.problem}</p>
                    </div>
                    <div>
                      <div className="eyebrow mb-3">Approach</div>
                      <ul className="space-y-2">
                        {p.approach.map((a) => (
                          <li key={a} className="flex gap-2 text-sm leading-relaxed text-ink/90">
                            <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-auto flex flex-wrap items-center gap-3 pt-8">
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className="inline-flex h-11 items-center gap-2 rounded-full border border-line-2 px-5 text-sm text-ink transition-colors hover:border-accent hover:text-accent-2"
                data-cursor="link"
              >
                {open ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {open ? "Less" : "Problem & approach"}
              </button>
              {p.links?.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm text-ink-2 hover:text-ink"
                >
                  {l.label} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
              {!p.links?.length && (
                <a href="#contact" className="inline-flex h-11 items-center gap-1.5 px-2 text-sm text-ink-2 hover:text-ink">
                  Discuss something similar <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function Work() {
  return (
    <section id="work" className="relative scroll-mt-16 py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="03" eyebrow="Selected work" lines={["Problems I like", "to work on."]} />
          <Reveal delay={0.2} className="max-w-sm text-ink-2 lg:pb-3">
            Work from the last few years across HRTech, FinTech and B2B platforms — agents in production, services
            under real load, and the observability that keeps both honest.
          </Reveal>
        </div>

        <ul className="mt-16 space-y-6">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} p={p} i={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
