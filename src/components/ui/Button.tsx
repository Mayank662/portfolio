"use client";

import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Magnetic } from "./Magnetic";

type Common = {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
  size?: "md" | "lg";
  arrow?: boolean;
  className?: string;
  magnetic?: boolean;
};

type AnchorProps = Common & { href: string; external?: boolean; onClick?: never; type?: never };
type ButtonProps = Common & {
  href?: never;
  external?: never;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button(props: AnchorProps | ButtonProps) {
  const { children, variant = "primary", size = "md", arrow = false, className, magnetic = true } = props;

  const base = cn(
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full font-medium tracking-tight transition-all duration-500 ease-out-expo",
    "focus-visible:outline-accent-2",
    size === "md" ? "h-12 px-6 text-[15px]" : "h-14 px-8 text-base",
    variant === "primary" &&
      "bg-ink text-bg hover:bg-accent-2 hover:text-bg shadow-[0_0_0_0_rgba(168,85,247,0)] hover:shadow-[0_0_48px_-8px_rgba(168,85,247,0.6)]",
    variant === "outline" && "border border-line-2 text-ink hover:border-accent hover:text-accent-2 bg-bg-2/40 backdrop-blur",
    variant === "ghost" && "text-ink-2 hover:text-ink px-2",
    className,
  );

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            strokeWidth={2}
          />
        )}
      </span>
    </>
  );

  const el =
    "href" in props && props.href ? (
      <a
        href={props.href}
        className={base}
        data-cursor="link"
        {...(props.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
      >
        {inner}
      </a>
    ) : (
      <button
        type={(props as ButtonProps).type ?? "button"}
        onClick={(props as ButtonProps).onClick}
        disabled={(props as ButtonProps).disabled}
        className={cn(base, "disabled:cursor-not-allowed disabled:opacity-60")}
        data-cursor="link"
      >
        {inner}
      </button>
    );

  return magnetic ? <Magnetic className="inline-block">{el}</Magnetic> : el;
}
