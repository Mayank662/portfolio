"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown } from "lucide-react";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { RevealLines } from "@/components/ui/Reveal";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { useMediaQuery, usePrefersReducedMotion, useWebGL } from "@/lib/hooks";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => <SceneFallback />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

function SceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute left-1/2 top-1/2 h-[46vmin] w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,#c4b5fd_0%,#a855f7_28%,#2a2438_60%,#09090d_100%)] opacity-80 blur-[2px] animate-float" />
      <div className="absolute left-1/2 top-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
    </div>
  );
}

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGL();
  const mobile = useMediaQuery("(max-width: 1023px)");
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 700], [0, reduced ? 0 : -80]);
  const yArt = useTransform(scrollY, [0, 700], [0, reduced ? 0 : 120]);
  const fade = useTransform(scrollY, [0, 500], [1, 0]);

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-40 top-1/3 h-[60vmax] w-[60vmax] rounded-full bg-accent/[0.07] blur-[140px]" />
        <div className="absolute -right-32 -top-20 h-[50vmax] w-[50vmax] rounded-full bg-[#5b21b6]/[0.12] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_60%,#09090d_100%)]" />
      </div>

      {/* Art */}
      <motion.div
        style={{ y: yArt }}
        className="absolute inset-y-0 right-0 w-full lg:left-[42%] lg:w-[58%]"
        aria-hidden
      >
        <div className="absolute inset-0 opacity-50 lg:opacity-100">
          {webgl === false ? <SceneFallback /> : <HeroScene mobile={mobile} />}
        </div>
        {/* soft edge so the canvas melts into the page */}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#09090d_0%,transparent_28%)] max-lg:bg-[linear-gradient(180deg,#09090d_0%,transparent_30%,transparent_70%,#09090d_100%)]" />
      </motion.div>

      {/* Copy */}
      <motion.div
        style={{ y: yText, opacity: fade }}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1440px] flex-col justify-end px-5 pb-14 pt-32 md:px-10 md:pb-20 lg:justify-center lg:pt-24"
      >
        <motion.div
          className="mb-6 flex flex-wrap items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
        >
          <span className="eyebrow">AI Engineer / Backend Engineer</span>
          <span className="hidden h-px w-10 bg-line-2 sm:block" />
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg-2/60 px-3 py-1 font-mono text-[10.5px] uppercase tracking-[0.18em] text-ink-2 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-dot" />
            {site.availability}
          </span>
        </motion.div>

        <RevealLines
          as="h1"
          delay={0.35}
          className="display max-w-[12ch] text-[clamp(2.9rem,9vw,8.2rem)] text-ink"
          lines={["I build", <>intelligent <span className="text-glow">things</span></>, "for the real world."]}
        />

        <motion.p
          className="mt-8 max-w-xl text-[17px] leading-relaxed text-ink-2 md:text-lg"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.85 }}
        >
          I&apos;m Mayank — a software engineer focused on building reliable backend systems and AI-powered
          applications. I turn complex ideas into practical, well-engineered products.
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 1 }}
        >
          <Button href="#contact" size="lg" arrow>
            Have a project in mind?
          </Button>
          <Button href="#work" size="lg" variant="outline">
            Explore my work
          </Button>
          <div className="ml-1 flex items-center gap-1">
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="GitHub"
              className="rounded-full p-3 text-ink-2 transition-colors hover:text-ink"
              data-cursor="link"
            >
              <GitHubIcon className="h-[18px] w-[18px]" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="LinkedIn"
              className="rounded-full p-3 text-ink-2 transition-colors hover:text-ink"
              data-cursor="link"
            >
              <LinkedInIcon className="h-[18px] w-[18px]" />
            </a>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to about"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3 transition-colors hover:text-ink md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: fade }}
      >
        Scroll
        <ArrowDown className="h-3 w-3 animate-bounce" />
      </motion.a>
    </section>
  );
}
