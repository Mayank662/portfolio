"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Plus } from "lucide-react";
import { services } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { useFinePointer } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Services() {
  const fine = useFinePointer();
  const [active, setActive] = useState<string | null>(null);

  return (
    <section id="services" className="relative scroll-mt-16 border-t border-line bg-bg-2/30 py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute right-[-10%] top-0 h-[40vmax] w-[40vmax] rounded-full bg-accent/[0.05] blur-[120px]" />
      </div>
      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="02" eyebrow="What I do" lines={["Where I do", <span key="g" className="text-glow">my best work.</span>]} />
          <Reveal delay={0.2} className="max-w-sm text-ink-2 lg:pb-3">
            Three ways I usually show up on a project. Most engagements are a mix — a backend that needs an AI
            layer, or an AI idea that needs a real backend.
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 flex flex-col gap-3 lg:h-[560px] lg:flex-row">
          {services.map((s) => {
            const open = active === s.id;
            return (
              <motion.article
                key={s.id}
                layout
                onPointerEnter={() => fine && setActive(s.id)}
                onPointerLeave={() => fine && setActive(null)}
                onClick={() => !fine && setActive(open ? null : s.id)}
                className={cn(
                  "spot panel group relative cursor-pointer overflow-hidden rounded-3xl p-6 transition-colors duration-500 md:p-8",
                  open ? "border-accent/40" : "hover:border-line-2",
                )}
                style={{ flex: open ? 2.2 : 1 }}
                transition={{ layout: { duration: 0.7, ease: EASE } }}
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
                data-cursor="link"
                aria-expanded={open}
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-start justify-between">
                    <span className="font-mono text-xs text-accent">{s.index}</span>
                    <span
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-2 transition-all duration-500 ease-out-expo",
                        open ? "rotate-45 border-accent text-accent-2" : "group-hover:text-ink",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </div>

                  <motion.h3 layout="position" className="display mt-auto text-[clamp(1.6rem,2.6vw,2.4rem)] text-ink">
                    {s.title}
                  </motion.h3>
                  <motion.p layout="position" className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-2">
                    {s.blurb}
                  </motion.p>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="details"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto", transition: { duration: 0.6, ease: EASE, delay: 0.1 } }}
                        exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-6 grid gap-x-6 gap-y-2 border-t border-line pt-6 sm:grid-cols-2">
                          {s.items.map((it) => (
                            <li key={it} className="flex items-start gap-2 text-sm text-ink/90">
                              <span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-accent" />
                              {it}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-6 flex flex-wrap gap-1.5">
                          {s.tools.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-line bg-bg/60 px-2.5 py-1 font-mono text-[10.5px] uppercase tracking-wider text-ink-2"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                        <a
                          href="#contact"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-6 inline-flex items-center gap-1.5 text-sm text-accent-2 hover:text-ink"
                        >
                          Start a conversation <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
