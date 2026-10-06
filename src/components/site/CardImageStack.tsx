"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type CardPhoto = { url: string; width: number; height: number; blurDataUrl: string | null; objectPosition: string; sizes: string };

type Props = {
  photos: CardPhoto[];
  alt: string;
  preload?: boolean;
  /** Extra zoom classes for the shown photo (hover Ken Burns) */
  zoomClass?: string;
  stepMs?: number;
};

/**
 * Product-card photo stack. The first photo is what you see at rest; while the pointer is over the card
 * (the nearest <a>), the others crossfade in turn. Touch devices keep the first photo (and the dots hint at more).
 */
export function CardImageStack({ photos, alt, preload, zoomClass, stepMs = 1300 }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);
  // Extra photos are only requested once the card has been hovered
  const [armed, setArmed] = useState(false);
  const many = photos.length > 1;

  useEffect(() => {
    const card = root.current?.closest("a");
    if (!card || !many) return;
    const enter = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setHovering(true);
      setArmed(true);
    };
    const leave = () => {
      setHovering(false);
      setIndex(0);
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    };
  }, [many]);

  useEffect(() => {
    if (!hovering || !many) return;
    // First switch after a short beat (lets the photo load), then keep cycling
    let timer: ReturnType<typeof setInterval>;
    const first = setTimeout(() => {
      setIndex(1);
      timer = setInterval(() => setIndex((i) => (i + 1) % photos.length), stepMs);
    }, 500);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [hovering, many, photos.length, stepMs]);

  return (
    <div ref={root} className="absolute inset-0">
      {photos.map((p, i) =>
        i === 0 || armed ? (
          <Image
            key={p.url}
            src={p.url}
            alt={i === 0 ? alt : ""}
            fill
            sizes={p.sizes}
            preload={preload && i === 0}
            quality={85}
            placeholder={p.blurDataUrl ? "blur" : "empty"}
            blurDataURL={p.blurDataUrl ?? undefined}
            className={cn("object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]", i === index ? "opacity-100" : "opacity-0", zoomClass)}
            style={{ objectPosition: p.objectPosition }}
          />
        ) : null,
      )}

      {many && (
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-3 z-[2] hidden justify-center gap-1.5 md:flex">
          {photos.map((p, i) => (
            <span key={p.url} className={cn("h-[3px] rounded-full bg-bone transition-all duration-500", i === index ? "w-5 opacity-100" : "w-1.5 opacity-40", !hovering && "md:opacity-0")} />
          ))}
        </span>
      )}
    </div>
  );
}
