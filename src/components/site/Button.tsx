import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  solid: "bg-bone text-ink before:bg-brand hover:text-white",
  outline: "border border-bone/35 text-bone before:bg-brand hover:border-brand hover:text-white",
  ghost: "text-bone before:bg-transparent",
};

const base =
  "eyebrow group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden whitespace-nowrap px-6 py-3.5 transition-[color,border-color] duration-500 " +
  "before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.76,0,0.24,1)] hover:before:scale-y-100 " +
  "disabled:pointer-events-none disabled:opacity-50";

function Arrow() {
  return (
    <span aria-hidden className="relative inline-block overflow-hidden">
      <span className="block transition-transform duration-500 group-hover:translate-x-[120%]">→</span>
      <span className="absolute inset-0 -translate-x-[120%] transition-transform duration-500 group-hover:translate-x-0">→</span>
    </span>
  );
}

export function ButtonLink({ variant = "outline", className, children, arrow = true, ...props }: ComponentProps<typeof Link> & { variant?: Variant; arrow?: boolean; children: ReactNode }) {
  return (
    <Link className={cn(base, styles[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({ variant = "solid", className, children, arrow = true, ...props }: ComponentProps<"button"> & { variant?: Variant; arrow?: boolean }) {
  return (
    <button className={cn(base, styles[variant], className)} {...props}>
      {children}
      {arrow && <Arrow />}
    </button>
  );
}
