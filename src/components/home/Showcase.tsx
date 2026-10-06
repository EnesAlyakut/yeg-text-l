"use client";

import Image from "next/image";
import { coverSizes, viewportFrameSizes } from "@/lib/images";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, DESKTOP } from "@/lib/gsap";

export type ShowcaseItem = {
  slug: string;
  href: string;
  name: string;
  collection: string;
  material: string;
  color: string;
  description: string;
  price: string | null;
  image: { url: string; width: number; height: number; blur: string | null; position: string; alt: string };
};

type Labels = { collection: string; material: string; color: string; price: string; discover: string; eyebrow: string; index: string };

/**
 * Desktop: the section pins, the image column wipes from one product to the next and the
 * copy on the right swaps in sync. Mobile: a simple stacked editorial layout.
 */
export function Showcase({ items, labels }: { items: ShowcaseItem[]; labels: Labels }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(DESKTOP, () => {
        const images = gsap.utils.toArray<HTMLElement>("[data-sc-image]");
        const panels = gsap.utils.toArray<HTMLElement>("[data-sc-panel]");
        const count = items.length;

        gsap.set(images.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(panels.slice(1), { autoAlpha: 0, y: 40 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${window.innerHeight * count}`,
            scrub: 0.8,
            pin: "[data-sc-stage]",
          },
        });

        for (let i = 1; i < count; i++) {
          // Each product holds on screen for a while before the next one wipes in.
          const at = i - 1 + 0.55;
          tl.to(panels[i - 1], { autoAlpha: 0, y: -40, duration: 0.3 }, at)
            .to(images[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power2.inOut" }, at)
            .fromTo(images[i].querySelector("img"), { scale: 1.2 }, { scale: 1, duration: 0.7, ease: "power2.out" }, at)
            .to(images[i - 1].querySelector("img"), { scale: 1.08, duration: 0.7 }, at)
            .to(panels[i], { autoAlpha: 1, y: 0, duration: 0.35 }, at + 0.35)
            .to("[data-sc-progress]", { scaleY: (i + 1) / count, duration: 0.7, ease: "none" }, at);
        }
        tl.to({}, { duration: 0.3 });
      });
    },
    { scope: root, dependencies: [items.length] },
  );

  return (
    <section ref={root} className="relative bg-coal">
      {/* Desktop */}
      <div data-sc-stage className="relative hidden h-[100svh] lg:grid lg:grid-cols-2">
        <div className="relative h-full overflow-hidden">
          {items.map((item, i) => (
            <div key={item.slug} data-sc-image className="absolute inset-0 overflow-hidden" style={{ zIndex: i }}>
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes={viewportFrameSizes(item.image, { vw: 50, vh: 100 }, 1.08).join(", ")}
                quality={95}
                placeholder={item.image.blur ? "blur" : "empty"}
                blurDataURL={item.image.blur ?? undefined}
                className="object-cover will-change-transform"
                style={{ objectPosition: item.image.position }}
              />
            </div>
          ))}
        </div>

        <div className="relative flex h-full flex-col justify-between px-[5vw] pb-12 pt-[calc(var(--nav-h)+3rem)]">
          <p className="eyebrow flex items-center gap-3 text-ash">
            {labels.eyebrow}
          </p>

          <div className="relative flex-1">
            {items.map((item, i) => (
              <article key={item.slug} data-sc-panel className="absolute inset-x-0 top-1/2 -translate-y-1/2">
                <p className="eyebrow text-ash">
                  {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                </p>
                <h3 className="display mt-6 text-[clamp(2.2rem,3.1vw,3.6rem)]">{item.name}</h3>
                <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-mist">{item.description}</p>
                {/* Photo-only slots (uploaded without a product) have no details */}
                {item.material && (
                  <dl className="mt-10 grid max-w-md grid-cols-2 gap-x-8 gap-y-5 border-t border-line pt-6">
                    {item.collection && <Detail label={labels.collection} value={item.collection} />}
                    <Detail label={labels.color} value={item.color} />
                    <Detail label={labels.material} value={item.material} wide />
                    {item.price && <Detail label={labels.price} value={item.price} />}
                  </dl>
                )}
                <Link
                  href={item.href}
                  className="eyebrow group mt-10 inline-flex items-center gap-3 border-b border-bone/30 pb-2 transition-colors duration-500 hover:border-brand hover:text-brand"
                >
                  {labels.discover}
                  <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </article>
            ))}
          </div>

          <div className="absolute bottom-12 right-8 h-32 w-px bg-line">
            <span data-sc-progress className="absolute inset-0 origin-top bg-brand" style={{ transform: `scaleY(${1 / Math.max(items.length, 1)})` }} />
          </div>
        </div>
      </div>

      {/* Mobile / tablet */}
      <div className="container-x space-y-20 py-24 lg:hidden">
        <p className="eyebrow flex items-center gap-3 text-ash">
          {labels.eyebrow}
        </p>
        {items.map((item, i) => (
          <article key={item.slug}>
            <Link href={item.href} className="relative block aspect-[4/5] overflow-hidden bg-graphite">
              <Image
                src={item.image.url}
                alt={item.image.alt}
                fill
                sizes={coverSizes(item.image.width, item.image.height)}
                placeholder={item.image.blur ? "blur" : "empty"}
                blurDataURL={item.image.blur ?? undefined}
                className="object-cover"
                style={{ objectPosition: item.image.position }}
              />
            </Link>
            <p className="eyebrow mt-6 text-ash">
              {String(i + 1).padStart(2, "0")}
              {item.collection && ` — ${item.collection}`}
            </p>
            <h3 className="display mt-3 text-3xl">{item.name}</h3>
            <p className="mt-4 text-sm leading-relaxed text-mist">{item.description}</p>
            <div className="eyebrow mt-6 flex items-center justify-between border-t border-line pt-4">
              <span className="text-ash">{item.color}</span>
              {item.price && <span>{item.price}</span>}
            </div>
            <Link href={item.href} className="eyebrow mt-6 inline-flex items-center gap-3 border-b border-bone/30 pb-2">
              {labels.discover} →
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

function Detail({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : undefined}>
      <dt className="eyebrow text-ash">{label}</dt>
      <dd className="mt-2 text-sm text-bone">{value}</dd>
    </div>
  );
}
