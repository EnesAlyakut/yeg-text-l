"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, DESKTOP, MOTION_OK } from "@/lib/gsap";

type Item = { className: string; speed: number; node: ReactNode };

export function FeaturedGrid({ items }: { items: Item[] }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-feature]").forEach((el, i) => {
          gsap.from(el.querySelector("[data-feature-frame]"), {
            clipPath: "inset(100% 0% 0% 0%)",
            duration: 1.6,
            delay: (i % 4) * 0.1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
      });
      mm.add(DESKTOP, () => {
        gsap.utils.toArray<HTMLElement>("[data-feature]").forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.speed || 0),
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
      {items.map((item, i) => (
        <div key={i} data-feature data-speed={item.speed} className={item.className}>
          <div data-feature-frame>{item.node}</div>
        </div>
      ))}
    </div>
  );
}
