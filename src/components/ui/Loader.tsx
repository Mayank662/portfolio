"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { lockScroll } from "@/lib/lenis";

const EASE = [0.76, 0, 0.24, 1] as const;
const KEY = "mg-intro";

const noop = () => () => {};
function readSeen() {
  try {
    return sessionStorage.getItem(KEY) === "1";
  } catch {
    return true; // storage blocked → don't risk a stuck curtain
  }
}

/**
 * Page-load intro: a counter and the name, then the curtain lifts.
 * Skipped under reduced-motion and on repeat visits within the session.
 * Server renders nothing (seen = true) so there is no flash on hydration.
 */
export function Loader() {
  const reduced = usePrefersReducedMotion();
  const seen = useSyncExternalStore(noop, readSeen, () => true);
  const [done, setDone] = useState(false);
  const [n, setN] = useState(0);
  const show = !reduced && !seen && !done;

  useEffect(() => {
    if (!show) return;
    lockScroll(true);
    const start = performance.now();
    const dur = 1100;
    let raf = 0;
    let timer = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        timer = window.setTimeout(() => {
          setDone(true);
          try {
            sessionStorage.setItem(KEY, "1");
          } catch {}
        }, 250);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      lockScroll(false);
    };
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="loader"
          className="fixed inset-0 z-[150] flex flex-col justify-between bg-bg px-6 py-6 md:px-10 md:py-8"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.9, ease: EASE } }}
          aria-hidden
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-sm font-medium tracking-tight">MAYANK GOEL</span>
            <span className="eyebrow">Loading</span>
          </div>
          <div className="flex items-end justify-between">
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.6 } }}
            >
              AI Engineer / Backend Engineer
            </motion.p>
            <span className="display text-[clamp(4rem,14vw,11rem)] tabular-nums text-ink">
              {n}
              <span className="text-accent">.</span>
            </span>
          </div>
          <div className="absolute bottom-0 left-0 h-px bg-accent" style={{ width: `${n}%` }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
