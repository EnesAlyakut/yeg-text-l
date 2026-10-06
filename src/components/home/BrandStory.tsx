"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { ImageRef } from "@/lib/content-types";

type Step = { title: string; text: string; image: ImageRef };
type Props = { index: string; eyebrow: string; lines: string[]; text: string; texture: ImageRef; steps: Step[] };

/**
 * FROM IDEA → TO FABRIC → TO PRODUCT: the title steps down like a process, the steps sit on a
 * line that fills red as you scroll. Clean dark-to-red backdrop, no photo texture.
 */
export function BrandStory({ eyebrow, lines, text, steps }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-orb]", { xPercent: -10, yPercent: 8, scale: 1.1, duration: 10, ease: "sine.inOut", repeat: -1, yoyo: true });

        // Label and text arrive together
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-story-label]", start: "top 85%", once: true } })
          .from("[data-story-label]", { autoAlpha: 0, x: -20, duration: 0.8, ease: "expo.out" })
          .from("[data-story-text]", { autoAlpha: 0, y: 24, duration: 1, ease: "expo.out" }, 0.15);

        // Steps: the process line fills red with the scroll, each step arrives as the line reaches it.
        gsap.fromTo(
          "[data-process-fill]",
          { scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-process]", start: "top 80%", end: "bottom 55%", scrub: 0.6 } },
        );
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i) => {
          gsap
            .timeline({ scrollTrigger: { trigger: "[data-process]", start: `top ${80 - i * 8}%`, once: true } })
            .from(step.querySelector("[data-step-dot]"), { scale: 0, duration: 0.6, ease: "back.out(2)" })
            .from(step.querySelectorAll("[data-step-copy]"), { autoAlpha: 0, y: 24, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.1);
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="grain relative isolate overflow-hidden bg-ink py-24 md:py-36">
      {/* Backdrop: black at the top deepening into red at the foot, one slow light */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#050505_0%,#0b0202_35%,#2a0000_100%)]" />
        <div data-orb className="absolute -bottom-[30vmax] -right-[15vmax] size-[75vmax] rounded-full bg-brand/20 blur-[150px] will-change-transform" />
        {/* Pixel-dissolved YEG monogram on the right, fading into the text side */}
        <div
          className="absolute inset-y-0 right-0 w-full bg-[url('/media/campaign/story-pixels-3.png')] bg-[length:auto_136%] bg-[position:right_-4%_center] bg-no-repeat opacity-30 [image-rendering:pixelated] [mask-image:linear-gradient(90deg,transparent_10%,#000_45%)] md:w-[80%]"
        />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/50 to-transparent" />
      </div>

      <div className="container-x">
        {/* Label, then the supporting text beneath it on the left */}
        <p data-story-label className="flex items-center gap-4">
          <span aria-hidden className="h-[2px] w-10 bg-brand" />
          <span className="display text-[clamp(1.5rem,2.4vw,2.4rem)] leading-none tracking-[0.04em] text-bone">{eyebrow}</span>
        </p>
        <p data-story-text className="mt-6 max-w-3xl text-[clamp(1.2rem,1.8vw,1.75rem)] font-medium leading-[1.35] tracking-[-0.012em] text-bone md:mt-8">
          {text}
        </p>

        {/* The big lines are no longer shown; they stay as the heading for screen readers */}
        <h2 className="sr-only">{lines.join(" ")}</h2>

        {/* Steps on a process line (horizontal on desktop, vertical on phones) */}
        <ol data-process className="relative mt-16 grid gap-12 pl-8 md:mt-20 md:grid-cols-3 md:gap-8 md:pl-0 md:pt-10">
          <span aria-hidden className="absolute bottom-0 left-[5px] top-0 w-px bg-bone/15 md:inset-x-0 md:bottom-auto md:left-0 md:top-[5px] md:h-px md:w-auto" />
          <span
            data-process-fill
            aria-hidden
            className="absolute bottom-0 left-[5px] top-0 w-px origin-top bg-brand md:inset-x-0 md:bottom-auto md:left-0 md:top-[5px] md:h-px md:w-auto md:origin-left"
          />
          {steps.map((step, i) => (
            <li key={i} data-step className="group relative">
              <span
                data-step-dot
                aria-hidden
                className="absolute -left-8 top-1 block size-[11px] rounded-full bg-brand shadow-[0_0_0_4px_rgba(216,0,0,0.18)] md:-top-10 md:left-0"
              />
              <h3 data-step-copy className="display text-[clamp(1.6rem,2vw,2.1rem)] leading-none text-bone transition-colors duration-500 group-hover:text-brand">
                {step.title}
              </h3>
              <p data-step-copy className="mt-4 max-w-sm text-sm leading-relaxed text-mist md:text-[0.95rem]">
                {step.text}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
