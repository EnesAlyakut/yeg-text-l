"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { coverFactor, coverSizes, scaleSizes } from "@/lib/images";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blur?: string | null;
  position?: string;
  /** Defaults to a cover-aware value for full-bleed frames */
  sizes?: string;
  className?: string;
  /** Parallax travel in percent of the frame (0 disables) */
  speed?: number;
  /** Clip-path wipe + scale settle when entering the viewport */
  reveal?: boolean;
  preload?: boolean;
  quality?: number;
  /** Width / height of the frame when it has a fixed aspect (e.g. 4/5) — lets wide photos fetch enough pixels */
  frameAspect?: number;
};

/** Cropped image frame with scroll parallax and an optional reveal wipe. The frame's size comes from className. */
export function ParallaxImage({ src, alt, width, height, blur, position = "50% 50%", sizes, className, speed = 10, reveal = true, preload, quality = 95, frameAspect }: Props) {
  // Parallax draws the photo larger than its frame (see the scale below); fetch a file to match.
  const zoom = speed ? 1 + speed / 100 + 0.04 : 1;
  const drawnSizes = scaleSizes(sizes ?? coverSizes(width, height), frameAspect ? coverFactor({ width, height }, frameAspect, zoom) : zoom);
  const frame = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const el = frame.current!;
        const img = el.querySelector("img")!;
        if (reveal) {
          gsap.fromTo(
            el,
            { clipPath: "inset(18% 8% 18% 8%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } },
          );
        }
        if (speed) {
          gsap.fromTo(
            img,
            { yPercent: -speed / 2, scale: 1 + speed / 100 + 0.04 },
            { yPercent: speed / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } },
          );
        }
      });
    },
    { scope: frame },
  );

  return (
    <div ref={frame} className={cn("relative overflow-hidden bg-graphite", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={drawnSizes}
        quality={quality}
        placeholder={blur ? "blur" : "empty"}
        blurDataURL={blur ?? undefined}
        preload={preload}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ objectPosition: position }}
      />
    </div>
  );
}
