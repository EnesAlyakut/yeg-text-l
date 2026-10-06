"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  /** Animate direct children one after another instead of the wrapper as a whole */
  stagger?: number;
  y?: number;
  delay?: number;
  as?: "div" | "section" | "ul" | "ol" | "article" | "header";
};

/** Fade-up on scroll. Content is fully visible without JS / with reduced motion. */
export function Reveal({ children, className, stagger, y = 48, delay = 0, as: Tag = "div" }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = ref.current!;
        const targets = stagger ? Array.from(el.children) : [el];
        gsap.from(targets, {
          y,
          autoAlpha: 0,
          duration: 1.3,
          delay,
          ease: "expo.out",
          stagger: stagger ?? 0,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as never} className={cn(className)}>
      {children}
    </Tag>
  );
}
