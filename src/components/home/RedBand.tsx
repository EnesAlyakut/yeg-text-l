"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

/** A thin full-bleed red band with black type; it wipes open from the left as it scrolls into view. */
export function RedBand({ title, text }: { title: string; text: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: "top 90%", once: true } })
          .from("[data-band]", { clipPath: "inset(0% 100% 0% 0%)", duration: 1.2, ease: "expo.inOut" })
          .from("[data-band-glow]", { opacity: 0, duration: 1.2, ease: "power2.out" }, "-=0.6")
          .from("[data-band-copy]", { autoAlpha: 0, x: -16, duration: 0.8, ease: "expo.out", stagger: 0.1 }, "<");
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative isolate">
      {/* A faint red glow spilling above and below the band (outside the band, so its wipe doesn't clip it) */}
      <div
        data-band-glow
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -inset-y-16 -z-10 bg-[radial-gradient(55%_50%_at_50%_50%,rgba(216,0,0,0.22),rgba(143,0,0,0.08)_55%,transparent_80%)] md:-inset-y-24"
      />
      <div data-band className="grain relative isolate overflow-hidden bg-brand text-ink shadow-[0_0_40px_rgba(216,0,0,0.25)]">
        {/* Darker edges keep the band from reading flat */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.25),transparent_30%,transparent_70%,rgba(0,0,0,0.25))]" />
        {/* Title and line sit together, centred, joined by a small black dot */}
        <div className="container-x flex flex-col items-center gap-1.5 py-3.5 text-center md:flex-row md:justify-center md:gap-5 md:py-4">
          <p data-band-copy className="display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none">
            {title}
          </p>
          <span data-band-copy aria-hidden className="hidden size-2 shrink-0 rounded-full bg-ink md:block" />
          <p data-band-copy className="text-[0.95rem] font-medium leading-snug md:text-[clamp(1rem,1.3vw,1.25rem)]">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
