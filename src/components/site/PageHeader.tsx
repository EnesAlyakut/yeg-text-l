import type { ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";
import { Glow } from "./Glow";

type Props = { eyebrow: string; title: string; intro?: string; count?: number; children?: ReactNode; className?: string };

/** Top-of-page heading shared by listing pages. */
export function PageHeader({ eyebrow, title, intro, count, children, className }: Props) {
  return (
    <header className={cn("container-x relative isolate pb-12 pt-[calc(var(--nav-h)+4rem)] md:pb-16 md:pt-[calc(var(--nav-h)+6rem)]", className)}>
      <Glow className="-top-[var(--nav-h)]" />
      <p className="eyebrow flex items-center gap-3 text-ash">
        {count !== undefined && <span className="text-brand">({String(count).padStart(2, "0")})</span>}
        {eyebrow}
        <span aria-hidden className="h-px w-10 bg-brand/50" />
      </p>
      <SplitText as="h1" trigger="mount" delay={0.1} lines={[title]} className="display mt-5 text-fluid-xl" />
      <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        {intro && <p className="max-w-lg border-l border-brand/60 pl-5 text-base leading-relaxed text-mist">{intro}</p>}
        {children}
      </div>
    </header>
  );
}
