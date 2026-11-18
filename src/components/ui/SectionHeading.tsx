import { cn } from "@/lib/utils";
import { Reveal, RevealLines } from "./Reveal";

export function SectionHeading({
  index,
  eyebrow,
  lines,
  description,
  className,
  align = "left",
}: {
  index: string;
  eyebrow: string;
  lines: React.ReactNode[];
  description?: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("relative", align === "center" && "text-center", className)}>
      <Reveal className={cn("mb-6 flex items-center gap-3", align === "center" && "justify-center")}>
        <span className="font-mono text-xs text-accent">{index}</span>
        <span className="h-px w-8 bg-line-2" />
        <span className="eyebrow">{eyebrow}</span>
      </Reveal>
      <RevealLines
        lines={lines}
        className="display text-[clamp(2.4rem,6.4vw,5.6rem)] text-ink"
      />
      {description && (
        <Reveal delay={0.15} className={cn("mt-7 max-w-xl text-lg leading-relaxed text-ink-2", align === "center" && "mx-auto")}>
          {description}
        </Reveal>
      )}
    </div>
  );
}
