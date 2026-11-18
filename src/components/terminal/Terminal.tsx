"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site, stack, nav } from "@/content/site";
import { projects } from "@/content/projects";
import { services } from "@/content/services";
import { timeline, skills } from "@/content/about";
import { lockScroll } from "@/lib/lenis";

type Line = { kind: "in" | "out" | "err"; text: string };

const BANNER = [
  "mg-shell v0.1 — type `help` to get started.",
  "Press Esc or ` to close.",
];

function run(cmd: string): { lines: Line[]; action?: "clear" | "close" | `goto:${string}` | `open:${string}` } {
  const [c, ...args] = cmd.trim().split(/\s+/);
  const out = (text: string): Line => ({ kind: "out", text });
  switch ((c ?? "").toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
      return {
        lines: [
          "help            this list",
          "about           who I am",
          "projects        selected work",
          "experience      where I've worked",
          "skills          stack I use",
          "services        what you can hire me for",
          "contact         how to reach me",
          "open <section>  jump to a section (about, work, playground, beyond, contact)",
          "github / linkedin   open profile in a new tab",
          "clear           clear the screen",
          "exit            close the terminal",
        ].map(out),
      };
    case "about":
    case "whoami":
      return {
        lines: [
          `${site.name} — ${site.title}.`,
          "Backend systems, AI agents, and the glue between them.",
          `${site.availability}.`,
        ].map(out),
      };
    case "projects":
    case "ls":
      return {
        lines: projects.map((p) => out(`${p.index}  ${p.title.padEnd(36)} [${p.status}]  ${p.stack.slice(0, 4).join(", ")}`)),
      };
    case "experience":
    case "history":
      return { lines: timeline.map((m) => out(`${m.period.padEnd(20)} ${m.title} — ${m.org}`)) };
    case "skills":
    case "stack":
      return {
        lines: [out(stack.join(" · ")), ...Object.entries(skills).map(([g, items]) => out(`${g}: ${items.join(", ")}`))],
      };
    case "services":
      return { lines: services.map((s) => out(`${s.index}  ${s.title} — ${s.blurb}`)) };
    case "contact":
      return { lines: [out(`email     ${site.email}`), out(`github    ${site.github}`), out(`linkedin  ${site.linkedin}`)] };
    case "github":
      return { lines: [out("opening github…")], action: `open:${site.github}` };
    case "linkedin":
      return { lines: [out("opening linkedin…")], action: `open:${site.linkedin}` };
    case "open":
    case "cd": {
      const target = (args[0] ?? "").toLowerCase().replace(/^#/, "");
      const alias: Record<string, string> = { work: "work", projects: "work", services: "services", top: "top", home: "top" };
      const id = alias[target] ?? target;
      const ok = id === "top" || nav.some((n) => n.href === `#${id}`);
      return ok
        ? { lines: [out(`→ #${id}`)], action: `goto:${id}` }
        : { lines: [{ kind: "err", text: `no such section: ${target || "(none)"}` }] };
    }
    case "clear":
      return { lines: [], action: "clear" };
    case "exit":
    case "quit":
      return { lines: [], action: "close" };
    case "sudo":
      return { lines: [{ kind: "err", text: "nice try." }] };
    default:
      return { lines: [{ kind: "err", text: `command not found: ${c}. try \`help\`` }] };
  }
}

export function Terminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER.map((t) => ({ kind: "out", text: t })));
  const [input, setInput] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
      if (e.key === "`" && !typing) {
        e.preventDefault();
        toggle();
      } else if (e.key === "`" && open && t === inputRef.current) {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onCustom = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("mg:terminal", onCustom);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mg:terminal", onCustom);
    };
  }, [open, toggle]);

  useEffect(() => {
    lockScroll(open);
    const t = open ? window.setTimeout(() => inputRef.current?.focus(), 50) : 0;
    return () => {
      clearTimeout(t);
      lockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  function submit() {
    const cmd = input;
    setInput("");
    setHi(-1);
    if (cmd.trim()) setHist((h) => [cmd, ...h].slice(0, 50));
    const r = run(cmd);
    if (r.action === "clear") {
      setLines([]);
      return;
    }
    setLines((l) => [...l, { kind: "in", text: cmd }, ...r.lines]);
    if (r.action === "close") setOpen(false);
    else if (r.action?.startsWith("goto:")) {
      const id = r.action.slice(5);
      setOpen(false);
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 120);
    } else if (r.action?.startsWith("open:")) {
      window.open(r.action.slice(5), "_blank", "noopener,noreferrer");
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center bg-bg/60 p-4 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          data-lenis-prevent
        >
          <motion.div
            role="dialog"
            aria-label="Developer terminal"
            aria-modal="true"
            className="flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-line-2 bg-[#0b0b11] shadow-[0_40px_120px_-30px_rgba(168,85,247,0.35)]"
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 24, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="font-mono text-[11px] text-ink-3">mayank@portfolio — zsh</span>
              <button type="button" onClick={() => setOpen(false)} className="font-mono text-[11px] text-ink-3 hover:text-ink">
                esc
              </button>
            </div>
            <div ref={bodyRef} className="max-h-[50vh] min-h-[260px] overflow-y-auto p-4 font-mono text-[12.5px] leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className={l.kind === "in" ? "text-ink" : l.kind === "err" ? "text-[#fca5a5]" : "text-ink-2"}>
                  {l.kind === "in" && <span className="mr-2 text-accent">❯</span>}
                  <span className="whitespace-pre-wrap">{l.text}</span>
                </div>
              ))}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="mt-1 flex items-center gap-2"
              >
                <span className="text-accent">❯</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowUp") {
                      e.preventDefault();
                      const n = Math.min(hist.length - 1, hi + 1);
                      setHi(n);
                      setInput(hist[n] ?? "");
                    } else if (e.key === "ArrowDown") {
                      e.preventDefault();
                      const n = Math.max(-1, hi - 1);
                      setHi(n);
                      setInput(n === -1 ? "" : hist[n]);
                    } else if (e.key === "Tab") {
                      e.preventDefault();
                      const cmds = ["help", "about", "projects", "experience", "skills", "services", "contact", "open ", "github", "linkedin", "clear", "exit"];
                      const m = cmds.find((c) => c.startsWith(input.toLowerCase()) && input);
                      if (m) setInput(m);
                    }
                  }}
                  className="flex-1 bg-transparent text-ink caret-accent outline-none focus-visible:outline-none"
                  autoFocus
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  aria-label="Terminal input"
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
