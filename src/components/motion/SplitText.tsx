"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  /** Each entry renders as its own masked line */
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  /** "scroll" waits for the viewport, "mount" plays immediately (e.g. above the fold) */
  trigger?: "scroll" | "mount";
  delay?: number;
  stagger?: number;
};

/** Masked line-by-line reveal for display typography. */
export function SplitText({ lines, as: Tag = "h2", className, lineClassName, trigger = "scroll", delay = 0, stagger = 0.09 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const inner = ref.current!.querySelectorAll(".reveal-line > span");
        gsap.from(inner, {
          yPercent: 110,
          rotate: 2,
          duration: 1.4,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: trigger === "scroll" ? { trigger: ref.current, start: "top 85%", once: true } : undefined,
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("reveal-line", lineClassName)}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
