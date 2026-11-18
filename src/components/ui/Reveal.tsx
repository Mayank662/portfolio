"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/hooks";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Root margin for the in-view observer. The huge top value makes anything
 * the viewport has already scrolled past (hash navigation, scroll
 * restoration, instant jumps) count as "seen", so nothing stays hidden.
 * The negative bottom value delays the reveal until the element is a bit
 * inside the viewport.
 */
const VIEWPORT_MARGIN = "100000px 0px -12% 0px";

/** Fade + rise in when scrolled into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  once = true,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: "div" | "section" | "p" | "li" | "span";
}) {
  const reduced = usePrefersReducedMotion();
  const M = motion[Tag];
  return (
    <M
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </M>
  );
}

const lineVariants: Variants = {
  hidden: { y: "110%", rotate: 2, opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    rotate: 0,
    opacity: 1,
    transition: { duration: 1.05, ease: EASE, delay: 0.08 * i },
  }),
};

/**
 * Editorial headline reveal: each line slides up from behind a mask.
 * Pass lines as an array to control breaks.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  once = true,
  as: Tag = "h2",
}: {
  lines: React.ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  once?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "div";
}) {
  const reduced = usePrefersReducedMotion();
  const M = motion[Tag];
  return (
    <M
      className={className}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once, margin: VIEWPORT_MARGIN }}
      transition={{ delayChildren: delay }}
    >
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span custom={i} variants={lineVariants} className={cn("block origin-left", lineClassName)}>
            {line}
          </motion.span>
        </span>
      ))}
    </M>
  );
}
