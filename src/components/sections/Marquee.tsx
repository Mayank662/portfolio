import { stack } from "@/content/site";

export function Marquee() {
  const items = [...stack, ...stack];
  return (
    <div className="relative overflow-hidden border-y border-line bg-bg-2/40 py-4 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]" aria-hidden>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap hover:[animation-play-state:paused] motion-reduce:animate-none">
        {items.map((s, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-xs uppercase tracking-[0.25em] text-ink-2">
            {s}
            <span className="h-1 w-1 rounded-full bg-accent/70" />
          </span>
        ))}
      </div>
    </div>
  );
}
