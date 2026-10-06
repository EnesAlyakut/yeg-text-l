"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox } from "@/components/motion/Lightbox";
import { Reveal } from "@/components/motion/Reveal";
import { pick, type Locale } from "@/i18n/config";
import type { LookbookImage } from "@/lib/content-types";
import { cn } from "@/lib/utils";

/** Masonry gallery: every image keeps its own aspect ratio (nothing is cropped). Click opens the full-screen viewer. */
export function GalleryGrid({ images, lang, columns = 3, className }: { images: LookbookImage[]; lang: Locale; columns?: 2 | 3; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!images.length) return null;
  const items = images.map((i) => ({ url: i.url, width: i.width, height: i.height, blur: i.blurDataUrl, alt: pick(i, "alt", lang) }));

  return (
    <>
      <Reveal stagger={0.06} className={cn("columns-2 gap-3 md:gap-5", columns === 3 && "lg:columns-3", className)}>
        {images.map((img, i) => {
          const caption = pick(img, "alt", lang);
          return (
            <figure key={img.url + i} className="mb-3 break-inside-avoid md:mb-5">
              <button type="button" onClick={() => setOpen(i)} aria-label={caption || `${i + 1} / ${images.length}`} data-cursor-hover className="group/fig relative block w-full cursor-zoom-in overflow-hidden bg-graphite" style={{ aspectRatio: `${img.width} / ${img.height}` }}>
                <Image
                  src={img.url}
                  alt={caption || ""}
                  fill
                  sizes={columns === 3 ? "(min-width: 1024px) 34vw, 53vw" : "53vw"}
                  quality={95}
                  placeholder={img.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={img.blurDataUrl ?? undefined}
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fig:scale-[1.04]"
                />
                <span aria-hidden className="absolute inset-0 bg-ink/0 transition-colors duration-700 group-hover/fig:bg-ink/15" />
              </button>
              {caption && <figcaption className="eyebrow mt-2.5 text-ash">{caption}</figcaption>}
            </figure>
          );
        })}
      </Reveal>
      {open !== null && <Lightbox items={items} start={open} onClose={() => setOpen(null)} />}
    </>
  );
}
