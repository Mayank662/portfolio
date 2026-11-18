"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { interests, type Interest } from "@/content/beyond";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

function Tile({ it, className, shift = 40 }: { it: Interest; className?: string; shift?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : shift, reduced ? 0 : -shift]);

  return (
    <div ref={ref} className={cn("group relative overflow-hidden rounded-3xl bg-card", className)} data-cursor="text" data-cursor-text="View">
      <motion.div style={{ y }} className="absolute inset-[-12%]">
        <Image
          src={it.src}
          alt={it.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          className="object-cover saturate-[0.85] transition-[transform,filter] duration-[1.2s] ease-out-expo group-hover:scale-[1.04] group-hover:saturate-100"
        />
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,13,0.05)_0%,rgba(9,9,13,0.15)_50%,rgba(9,9,13,0.85)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <div className="eyebrow mb-2 text-accent-2/80">{it.title}</div>
        <p className="display translate-y-1 text-[clamp(1.4rem,2.4vw,2.2rem)] text-ink transition-transform duration-700 ease-out-expo group-hover:translate-y-0">
          {it.caption}
        </p>
      </div>
      <a
        href={it.credit.href}
        target="_blank"
        rel="noreferrer noopener"
        className="absolute right-4 top-4 rounded-full bg-bg/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-ink-2 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 focus:opacity-100"
      >
        Photo · {it.credit.name}
      </a>
    </div>
  );
}

export function Beyond() {
  const [swim, music, cricket] = interests;
  return (
    <section id="beyond" className="relative scroll-mt-16 py-28 md:py-40">
      <div className="mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading index="05" eyebrow="Beyond code" lines={["Beyond the", "terminal."]} />
          <Reveal delay={0.2} className="max-w-sm text-ink-2 lg:pb-3">
            The stuff that keeps the engineering honest: water, noise and a bit of competition.
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-16 grid gap-4 md:grid-cols-12 md:grid-rows-[280px_280px] lg:grid-rows-[320px_320px]">
          <Tile it={swim} className="min-h-[420px] md:col-span-5 md:row-span-2 md:min-h-0" shift={50} />
          <Tile it={music} className="min-h-[300px] md:col-span-7 md:min-h-0" shift={30} />
          <Tile it={cricket} className="min-h-[300px] md:col-span-4 md:col-start-9 md:min-h-0" shift={36} />
          <Reveal
            delay={0.2}
            className="panel flex min-h-[200px] flex-col justify-between rounded-3xl p-6 md:col-span-3 md:col-start-6 md:min-h-0"
          >
            <span className="eyebrow">Off-hours rule</span>
            <p className="font-display text-lg leading-snug text-ink">
              If I&apos;m stuck on a bug, I go for a swim. The fix usually arrives somewhere around lap twelve.
            </p>
          </Reveal>
        </Reveal>
      </div>
    </section>
  );
}
