"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content/site";
import { WhatsAppIcon } from "./Icons";

/**
 * Floating "WhatsApp" pill. Appears once the hero is scrolled past and steps aside
 * while the Contact section (which has its own WhatsApp
 * button) is on screen. Sits below the nav menu, terminal and loader layers.
 */
export function WhatsAppFab() {
  const [pastHero, setPastHero] = useState(false);
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    const first = requestAnimationFrame(onScroll); // initial check (e.g. page restored mid-scroll)
    window.addEventListener("scroll", onScroll, { passive: true });

    const targets = ["contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      }
      setCovered(visible.size > 0);
    });
    targets.forEach((t) => io.observe(t));

    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const show = pastHero && !covered;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          key="wa"
          href={site.whatsapp}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat on WhatsApp"
          data-cursor="link"
          className="fixed bottom-5 right-5 z-[80] inline-flex h-12 items-center gap-2 rounded-full border border-line-2 bg-bg/80 pl-3.5 pr-4 text-sm text-ink shadow-[0_18px_50px_-18px_rgba(168,85,247,0.6)] backdrop-blur transition-colors hover:border-accent md:bottom-8 md:right-8"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366]">
            <WhatsAppIcon className="h-4 w-4" />
          </span>
          WhatsApp
        </motion.a>
      )}
    </AnimatePresence>
  );
}
