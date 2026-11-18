"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { nav, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { lockScroll } from "@/lib/lenis";
import { Magnetic } from "@/components/ui/Magnetic";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 24);
    setHidden(y > prev && y > 240 && !open);
  });

  // Track the section in view for the active indicator
  useEffect(() => {
    const ids = nav.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Lock scroll when the mobile menu is open
  useEffect(() => {
    lockScroll(open);
    return () => lockScroll(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[90]"
        animate={{ y: hidden ? -96 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <div
          className={cn(
            "mx-auto flex h-18 max-w-[1440px] items-center justify-between px-5 transition-all duration-500 md:px-10",
            scrolled && "h-16",
          )}
        >
          <a href="#top" className="display text-sm font-semibold tracking-tight text-ink" aria-label="Back to top">
            MAYANK GOEL
          </a>

          <nav
            aria-label="Primary"
            className={cn(
              "hidden items-center gap-1 rounded-full border px-2 py-1.5 transition-all duration-500 ease-out-expo lg:flex",
              scrolled ? "border-line bg-bg-2/70 backdrop-blur-md" : "border-transparent bg-transparent",
            )}
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-1.5 text-[13.5px] text-ink-2 transition-colors duration-300 hover:text-ink",
                  active === item.href && "text-ink",
                )}
                data-cursor="link"
              >
                {active === item.href && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-ink/8"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Magnetic className="hidden sm:block">
              <a
                href="#contact"
                className="group inline-flex h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13.5px] font-medium text-bg transition-colors duration-300 hover:bg-accent-2"
                data-cursor="link"
              >
                Let&apos;s Talk
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg-2/60 backdrop-blur lg:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-ink transition-transform duration-500 ease-out-expo",
                  open ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-ink transition-transform duration-500 ease-out-expo",
                  open ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-[85] flex flex-col bg-bg px-6 pb-8 pt-28"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
            data-lenis-prevent
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="display flex items-baseline justify-between border-b border-line py-5 text-4xl text-ink"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.2 + i * 0.06, duration: 0.6, ease: EASE } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  {item.label}
                  <span className="font-mono text-xs text-ink-3">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>
            <motion.div
              className="mt-auto flex items-end justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col gap-2">
                <span className="eyebrow">Say hello</span>
                <a href={`mailto:${site.email}`} className="text-ink-2 hover:text-ink">
                  {site.email}
                </a>
              </div>
              <div className="flex gap-3">
                <a href={site.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="rounded-full border border-line p-3 text-ink-2 hover:text-ink">
                  <GitHubIcon className="h-4 w-4" />
                </a>
                <a href={site.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="rounded-full border border-line p-3 text-ink-2 hover:text-ink">
                  <LinkedInIcon className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
