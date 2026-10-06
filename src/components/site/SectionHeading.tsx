import type { ReactNode } from "react";
import { SplitText } from "@/components/motion/SplitText";
import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: string | string[];
  aside?: ReactNode;
  className?: string;
  as?: "h1" | "h2";
  size?: "lg" | "xl";
};

export function SectionHeading({ eyebrow, title, aside, className, as = "h2", size = "lg" }: Props) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <div className={cn("flex flex-col gap-8 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <p className="eyebrow flex items-center gap-3 text-ash">
          {eyebrow}
        </p>
        <SplitText as={as} lines={lines} className={cn("display mt-5 text-brand", size === "xl" ? "text-fluid-xl" : "text-fluid-lg")} />
      </div>
      {aside && <div className="shrink-0">{aside}</div>}
    </div>
  );
}
