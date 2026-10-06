"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/site/Button";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { coverFactor, scaleSizes } from "@/lib/images";
import { cn } from "@/lib/utils";

export type LookbookFrame = { url: string; width: number; height: number; blur: string | null; position: string; caption: string };

type Props = { index: string; eyebrow: string; title: string; text: string; cta: { label: string; href: string }; frames: LookbookFrame[] };

/**
 * Frames for an even three-column grid: portraits first (they fill a 3:4 frame best), then landscape
 * shots of products that have no portrait yet, trimmed to whole rows of three.
 */
function pickGrid(frames: LookbookFrame[]) {
  const product = (f: LookbookFrame) => f.caption.split(" — ")[0];
  const portraits = frames.filter((f) => f.height >= f.width);
  const covered = new Set(portraits.map(product));
  const landscapes = frames.filter((f) => f.height < f.width && !covered.has(product(f)));
  const all = [...portraits, ...landscapes];
  return all.length >= 3 ? all.slice(0, all.length - (all.length % 3)) : all;
}

/** Campaign lookbook: an even grid of same-size frames that open row by row. */
export function Lookbook({ title, cta, frames }: Props) {
  const root = useRef<HTMLElement>(null);

  const grid = pickGrid(frames);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Each row opens left to right
        gsap.utils.toArray<HTMLElement>("[data-look]").forEach((el, i) => {
          gsap.from(el, {
            clipPath: "inset(12% 6% 12% 6%)",
            autoAlpha: 0,
            duration: 1.5,
            delay: (i % 3) * 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="container-x relative isolate overflow-hidden py-20 md:py-28">
      {/* A faint red wash across the full width of the open space above the photos, fading downwards */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[linear-gradient(180deg,rgba(216,0,0,0.15)_0%,rgba(143,0,0,0.07)_45%,transparent_100%)]"
      />
      {/* Only the call to action is shown; the title stays for screen readers */}
      <h2 className="sr-only">{title}</h2>
      <div className="flex justify-start">
        <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
      </div>

      {/* An even grid: every frame the same 3:4 size, equal gaps, captions inside the frame */}
      <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-3 md:gap-5">
        {grid.map((f, i) => (
          // An odd last frame is dropped on the 2-column mobile grid
          <figure key={f.url} data-look className={cn("group relative aspect-[3/4] overflow-hidden bg-graphite", i === grid.length - 1 && grid.length % 2 === 1 && "max-md:hidden")}>
            <Image
              src={f.url}
              alt={f.caption}
              fill
              sizes={scaleSizes("(min-width: 768px) 33vw, 50vw", coverFactor(f, 3 / 4, 1.05))}
              quality={95}
              placeholder={f.blur ? "blur" : "empty"}
              blurDataURL={f.blur ?? undefined}
              className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              style={{ objectPosition: f.position }}
            />
            {/* Name slides up on hover (always visible on touch screens) */}
            {f.caption && (
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 via-ink/45 to-transparent px-4 pb-4 pt-16 transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-3 md:px-6 md:pb-6 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                <span className="mb-2 block h-[2px] w-8 bg-brand" />
                <span className="display block text-[clamp(1.05rem,1.6vw,1.6rem)] leading-tight text-bone">{f.caption}</span>
              </figcaption>
            )}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
