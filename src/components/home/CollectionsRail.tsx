"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, DESKTOP } from "@/lib/gsap";
import { coverFactor, scaleSizes, viewportFrameSizes } from "@/lib/images";

export type RailItem = {
  slug: string;
  href: string;
  name: string;
  season: string;
  tagline: string;
  count: string;
  image: { url: string; width: number; height: number; blur: string | null; position: string } | null;
};

/**
 * Desktop card image: ~31vw × 68vh frame, drawn at 1.18× (parallax headroom). Mobile: 4:5 frame.
 * Landscape covers are cropped to the frame height, so they are drawn much wider than the frame.
 */
function railSizes(img: { width: number; height: number }) {
  const desktop = viewportFrameSizes(img, { vw: 31, vh: 68 }, RAIL_ZOOM).map((s) => `(min-width: 1024px) and ${s}`);
  return [...desktop, scaleSizes("100vw", coverFactor(img, 4 / 5, RAIL_ZOOM))].join(", ");
}
const RAIL_ZOOM = 1.18;

type Props = { index: string; eyebrow: string; title: string; cta: string; scrollLabel?: string; items: RailItem[] };

/** Desktop: pinned horizontal scroll through the collections. Mobile: stacked cards. */
export function CollectionsRail({ eyebrow, title, cta, scrollLabel = "Scroll", items }: Props) {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - window.innerWidth;
        const tween = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.8,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        gsap.utils.toArray<HTMLElement>("[data-rail-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            },
          );
        });
      });
    },
    { scope: root, dependencies: [items.length] },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-ink lg:h-[100svh]">
      <div ref={track} className="flex flex-col gap-16 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-[4vw] lg:py-0 lg:pl-[var(--gutter)] lg:pr-[8vw]">
        <header className="container-x shrink-0 lg:w-[26vw] lg:px-0">
          <p className="eyebrow flex items-center gap-3 text-ash">
            {eyebrow}
          </p>
          <h2 className="display mt-6 text-fluid-lg text-brand">{title}</h2>
          <p className="eyebrow mt-8 hidden items-center gap-3 text-ash lg:flex">
            <span className="block h-px w-12 bg-brand" /> {scrollLabel} →
          </p>
        </header>

        {items.map((item, i) => (
          <Link
            key={item.slug}
            href={item.href}
            data-cursor={cta}
            className="group container-x relative block shrink-0 lg:grid lg:h-[68vh] lg:w-[58vw] lg:grid-cols-[1fr_1.25fr] lg:gap-8 lg:px-0"
          >
            <div className="order-2 flex flex-col justify-between py-2 lg:order-1">
              <p className="eyebrow hidden text-ash lg:block">{String(i + 1).padStart(2, "0")}</p>
              <div>
                <p className="eyebrow text-brand">{item.season}</p>
                <h3 className="display mt-4 text-[clamp(2rem,2.8vw,3.25rem)] transition-colors duration-500 group-hover:text-brand">{item.name}</h3>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-mist">{item.tagline}</p>
                <p className="eyebrow mt-8 flex items-center gap-4 text-ash">
                  <span>{item.count}</span>
                  <span className="h-px w-10 bg-line transition-all duration-700 group-hover:w-20 group-hover:bg-brand" />
                  <span className="text-bone">{cta}</span>
                </p>
              </div>
            </div>
            <div className="relative order-1 mb-6 aspect-[4/5] overflow-hidden bg-graphite lg:order-2 lg:mb-0 lg:aspect-auto lg:h-full">
              {item.image && (
                <Image
                  data-rail-img
                  src={item.image.url}
                  alt={item.name}
                  fill
                  sizes={railSizes(item.image)}
                  placeholder={item.image.blur ? "blur" : "empty"}
                  blurDataURL={item.image.blur ?? undefined}
                  className="scale-[1.18] object-cover transition-[filter] duration-700 group-hover:brightness-110"
                  style={{ objectPosition: item.image.position }}
                />
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
