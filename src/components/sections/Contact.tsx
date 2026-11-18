"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Check, Loader2, Mail, Phone } from "lucide-react";
import { site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

const TYPES = ["Backend Engineering", "AI / LLM Application", "Architecture & Consulting", "Something else"] as const;
type Status = "idle" | "sending" | "sent" | "fallback" | "error";

export function Contact() {
  const [type, setType] = useState<(typeof TYPES)[number]>(TYPES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [err, setErr] = useState<string>("");

  const mailto = () => {
    const subject = encodeURIComponent(`[Portfolio] ${type} — ${name || "New inquiry"}`);
    const body = encodeURIComponent(`Hi Mayank,\n\n${message}\n\n— ${name}\n${email}`);
    return `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const valid = name.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && message.trim().length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || status === "sending") return;
    setStatus("sending");
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, type, message, website }),
      });
      if (res.status === 503) {
        // Email delivery isn't configured on this deployment — hand off to the mail client.
        setStatus("fallback");
        window.location.href = mailto();
        return;
      }
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { reason?: string };
        setErr(
          j.reason === "rate_limited"
            ? "Too many messages from this network. Try again in a few minutes or email me directly."
            : "Couldn't send that. Email me directly and I'll get back to you.",
        );
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setErr("Network hiccup. Email me directly and I'll get back to you.");
      setStatus("error");
    }
  }

  const field =
    "w-full rounded-2xl border border-line bg-bg-2/60 px-4 py-3.5 text-[15px] text-ink placeholder:text-ink-3 outline-none transition-colors focus:border-accent";

  return (
    <section id="contact" className="relative scroll-mt-16 overflow-hidden border-t border-line py-28 md:py-40">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute left-1/2 top-0 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[160px]" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 md:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading
              index="06"
              eyebrow="Contact"
              lines={["Have an", "interesting problem?", <span key="g" className="text-glow">Let&apos;s build something.</span>]}
              description="Whether you need a scalable backend, an AI-powered application or help bringing an interesting technical idea to life, I'd love to hear about it."
            />

            <Reveal delay={0.25} className="mt-12 flex flex-col gap-4">
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex w-fit items-center gap-3 text-lg text-ink transition-colors hover:text-accent-2"
                data-cursor="link"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent">
                  <Mail className="h-4 w-4" />
                </span>
                {site.email}
              </a>
              <a
                href={site.phone.href}
                className="group inline-flex w-fit items-center gap-3 text-lg text-ink transition-colors hover:text-accent-2"
                data-cursor="link"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors group-hover:border-accent">
                  <Phone className="h-4 w-4" />
                </span>
                {site.phone.display}
              </a>
              <div className="mt-2 flex gap-3">
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                >
                  <LinkedInIcon className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
                <a
                  href={site.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2.5 text-sm text-ink-2 transition-colors hover:border-accent hover:text-ink"
                >
                  <GitHubIcon className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
              <p className="mt-4 max-w-sm text-sm text-ink-3">
                Usual reply time is within a day or two. If it&apos;s urgent, say so in the subject line.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:col-span-6">
            <form onSubmit={submit} className="panel relative rounded-3xl p-6 md:p-8" noValidate>
              <AnimatePresence mode="wait">
                {status === "sent" ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20 text-accent-2">
                      <Check className="h-6 w-6" />
                    </span>
                    <h3 className="display mt-6 text-3xl text-ink">Got it.</h3>
                    <p className="mt-3 max-w-xs text-ink-2">
                      Thanks {name.split(" ")[0]} — I&apos;ll read this properly and reply from {site.email}.
                    </p>
                    <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm text-ink-2 underline-offset-4 hover:underline">
                      Send another
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    <fieldset>
                      <legend className="eyebrow mb-3">Project type</legend>
                      <div className="flex flex-wrap gap-2">
                        {TYPES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            aria-pressed={type === t}
                            className={cn(
                              "rounded-full border px-3.5 py-2 text-[13px] transition-all duration-300",
                              type === t
                                ? "border-accent bg-accent/15 text-ink"
                                : "border-line text-ink-2 hover:border-line-2 hover:text-ink",
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <span className="eyebrow mb-2 block">Name</span>
                        <input
                          className={field}
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name"
                          autoComplete="name"
                          required
                        />
                      </label>
                      <label className="block">
                        <span className="eyebrow mb-2 block">Email</span>
                        <input
                          className={field}
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          autoComplete="email"
                          required
                        />
                      </label>
                    </div>

                    <label className="block">
                      <span className="eyebrow mb-2 block">What are you building?</span>
                      <textarea
                        className={cn(field, "min-h-[150px] resize-y")}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="A few lines on the problem, where things stand, and any timeline."
                        required
                        minLength={10}
                      />
                    </label>

                    {/* Honeypot — hidden from humans */}
                    <label className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden tabIndex={-1}>
                      Website
                      <input value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
                    </label>

                    {status === "error" && (
                      <p role="alert" className="text-sm text-[#fca5a5]">
                        {err}{" "}
                        <a href={mailto()} className="underline underline-offset-4">
                          Open email
                        </a>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <Button type="submit" size="lg" arrow disabled={!valid || status === "sending"} magnetic={false}>
                        {status === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Sending
                          </>
                        ) : (
                          "Send message"
                        )}
                      </Button>
                      <a href={mailto()} className="text-sm text-ink-2 underline-offset-4 hover:text-ink hover:underline">
                        or open in your mail app
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
