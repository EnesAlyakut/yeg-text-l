"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  lines: ReactNode[];
  as?: ElementType;
  id?: string;
  className?: string;
  lineClassName?: string;
  stagger?: number;
  delay?: number;
};

/** SplitText's masked line reveal, but lines may hold markup (accented words, brand spans). */
export function RevealLines({ lines, as: Tag = "p", id, className, lineClassName, stagger = 0.09, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current!.querySelectorAll(".reveal-line > span"), {
          yPercent: 110,
          rotate: 2,
          duration: 1.4,
          ease: "expo.out",
          stagger,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} id={id} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={cn("reveal-line", lineClassName)}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
