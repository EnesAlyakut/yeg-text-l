"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { coverSizes, coverFactor, scaleSizes } from "@/lib/images";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/motion/Lightbox";

export type GalleryImage = {
  url: string;
  width: number;
  height: number;
  blur: string | null;
  position: string;
  alt: string;
};

const SHARP_WIDTH = 1200;

/**
 * Ultra-Premium Product Gallery:
 * - Interactive Cinematic Showcase with silky crossfade & smooth Ken Burns
 * - Glassmorphism navigation arrows (← / →)
 * - Interactive horizontal thumbnail strip with glowing active states
 * - Story-style segmented progress bar
 * - View mode toggle: "Vitrin Slayt" ↔ "Izgara Liste" (Editorial Grid)
 * - Click-to-zoom Fullscreen Lightbox
 * - Mobile swipeable gesture support
 */
export function ProductGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [open, setOpen] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef<number | null>(null);
  const thumbRail = useRef<HTMLDivElement>(null);
  const mobileRail = useRef<HTMLDivElement>(null);

  const count = images.length;
  const current = images[active] ?? images[0];

  const go = useCallback((idx: number) => {
    setActive((idx + count) % count);
  }, [count]);

  const next = useCallback(() => go(active + 1), [go, active]);
  const prev = useCallback(() => go(active - 1), [go, active]);

  // Keep active thumbnail centered in view
  useEffect(() => {
    if (!thumbRail.current) return;
    const btn = thumbRail.current.children[active] as HTMLElement | undefined;
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (open !== null) return; // Lightbox handles keyboard
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, prev, open]);

  const lightboxItems = images.map((i) => ({
    url: i.url,
    width: i.width,
    height: i.height,
    blur: i.blur,
    alt: i.alt || name,
  }));

  // Touch handlers for mobile/desktop swipe
  const onPointerDown = (e: React.PointerEvent) => {
    touchStart.current = e.clientX;
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (touchStart.current === null) return;
    const dx = e.clientX - touchStart.current;
    touchStart.current = null;
    if (Math.abs(dx) > 40) {
      if (dx < 0) next();
      else prev();
    }
  };

  // Sync mobile scroll
  const onMobileScroll = () => {
    const el = mobileRail.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== active) setActive(idx);
  };

  const slideToMobile = (i: number) => {
    go(i);
    mobileRail.current?.scrollTo({ left: i * (mobileRail.current?.clientWidth ?? 0), behavior: "smooth" });
  };

  const slideRatio = current && current.height > current.width ? `${current.width} / ${current.height}` : "4 / 5";

  // Desktop editorial grid order
  const [main, ...rest] = images;
  const desktopOrder = main ? [main, ...rest.filter((x) => x.width < SHARP_WIDTH), ...rest.filter((x) => x.width >= SHARP_WIDTH)] : [];

  return (
    <div className="space-y-4">
      {/* View Switcher Header (Desktop) */}
      {count > 1 && (
        <div className="hidden md:flex items-center justify-between pb-1">
          <div className="eyebrow flex items-center gap-2 text-ash text-xs">
            <span className="text-brand font-semibold">({String(count).padStart(2, "0")})</span>
            <span>Görsel</span>
          </div>

          <div className="flex items-center gap-1 rounded-full border border-line bg-ink/60 p-1 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-all duration-300",
                viewMode === "slider" ? "bg-brand text-white shadow-[0_0_12px_rgba(216,0,0,0.4)]" : "text-ash hover:text-bone",
              )}
            >
              🎬 Vitrin Slayt
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "rounded-full px-3 py-1 font-medium transition-all duration-300",
                viewMode === "grid" ? "bg-brand text-white shadow-[0_0_12px_rgba(216,0,0,0.4)]" : "text-ash hover:text-bone",
              )}
            >
              📑 Izgara Görünüm
            </button>
          </div>
        </div>
      )}

      {/* 1. CINEMATIC SHOWCASE (Desktop Slider Mode) */}
      {viewMode === "slider" && (
        <div className="hidden md:block">
          <div
            className="group/viewer relative isolate overflow-hidden rounded-xl bg-graphite"
            style={{ aspectRatio: "4 / 5" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            {/* Multi-image Crossfade Layers */}
            {images.map((img, i) => {
              const isSelected = i === active;
              return (
                <div
                  key={img.url}
                  className="absolute inset-0 overflow-hidden cursor-zoom-in"
                  style={{
                    opacity: isSelected ? 1 : 0,
                    zIndex: isSelected ? 1 : 0,
                    transition: "opacity 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onClick={() => setOpen(active)}
                >
                  <div
                    className={cn(
                      "absolute inset-0 transition-transform duration-[4000ms] ease-out will-change-transform",
                      isSelected && !isPaused ? "scale-105" : "scale-100",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt={img.alt || name}
                      fill
                      sizes="(min-width: 1024px) 58vw, 100vw"
                      quality={90}
                      preload={i === 0}
                      placeholder={img.blur ? "blur" : "empty"}
                      blurDataURL={img.blur ?? undefined}
                      className="object-cover"
                      style={{ objectPosition: img.position }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Top Bar Overlay */}
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-ink/60 via-ink/20 to-transparent">
              <span className="eyebrow rounded-full bg-ink/70 px-3 py-1.5 text-bone backdrop-blur-md border border-line/40 text-xs tabular-nums">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>

              <button
                type="button"
                onClick={() => setOpen(active)}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-bone/30 bg-ink/60 px-3 py-1.5 text-xs text-bone backdrop-blur-md transition-all duration-300 hover:border-brand hover:bg-brand"
                title="Tam ekran büyüt"
              >
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>Büyüt</span>
              </button>
            </div>

            {/* Left / Right Navigation Arrows */}
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    prev();
                  }}
                  aria-label="Önceki görsel"
                  className="absolute left-4 top-1/2 z-20 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-bone/25 bg-ink/50 text-bone opacity-0 backdrop-blur-md transition-all duration-300 group-hover/viewer:opacity-100 hover:scale-110 hover:border-brand hover:bg-brand"
                >
                  <span className="text-xl leading-none">←</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    next();
                  }}
                  aria-label="Sonraki görsel"
                  className="absolute right-4 top-1/2 z-20 -translate-y-1/2 grid size-12 place-items-center rounded-full border border-bone/25 bg-ink/50 text-bone opacity-0 backdrop-blur-md transition-all duration-300 group-hover/viewer:opacity-100 hover:scale-110 hover:border-brand hover:bg-brand"
                >
                  <span className="text-xl leading-none">→</span>
                </button>
              </>
            )}

            {/* Bottom Progress Segments */}
            {count > 1 && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex gap-1.5 p-4 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 overflow-hidden rounded-full bg-bone/30 backdrop-blur-sm"
                  >
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        i === active ? "w-full bg-brand shadow-[0_0_8px_rgba(216,0,0,0.8)]" : "w-0",
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interactive Thumbnail Carousel */}
          {count > 1 && (
            <div
              ref={thumbRail}
              className="mt-3 flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin] scroll-smooth"
            >
              {images.map((img, i) => {
                const isSelected = i === active;
                return (
                  <button
                    key={img.url + i}
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Görsel ${i + 1}`}
                    className={cn(
                      "group relative h-24 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300 focus:outline-none",
                      isSelected
                        ? "border-brand scale-105 shadow-[0_0_16px_rgba(216,0,0,0.45)]"
                        : "border-transparent opacity-60 hover:opacity-100 hover:border-bone/40",
                    )}
                  >
                    <Image
                      src={img.url}
                      alt=""
                      fill
                      sizes="96px"
                      quality={60}
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ objectPosition: img.position }}
                    />
                    {isSelected && (
                      <span className="absolute bottom-1 right-1 size-2 rounded-full bg-brand" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. EDITORIAL GRID (Desktop Grid Mode) */}
      {viewMode === "grid" && (
        <div className="hidden grid-cols-2 gap-3 md:grid">
          {desktopOrder.map((img) => {
            const sharp = img.width >= SHARP_WIDTH;
            const lone = !sharp && images.filter((x) => x.width < SHARP_WIDTH).length === 1;
            const idx = images.findIndex((x) => x.url === img.url);
            return (
              <figure
                key={img.url}
                className={cn(
                  "group/fig relative cursor-zoom-in overflow-hidden rounded-xl bg-graphite",
                  sharp || lone ? "col-span-2" : "col-span-1",
                  lone && "mx-auto w-full max-w-[520px]",
                )}
                style={{ aspectRatio: sharp && img.width > img.height ? "4 / 3" : `${img.width} / ${img.height}` }}
                onClick={() => setOpen(idx >= 0 ? idx : 0)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || name}
                  fill
                  sizes={
                    lone
                      ? "(min-width: 768px) 520px, 100vw"
                      : scaleSizes(sharp ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 29vw, 100vw", sharp && img.width > img.height ? coverFactor(img, 4 / 3) : 1)
                  }
                  quality={85}
                  placeholder={img.blur ? "blur" : "empty"}
                  blurDataURL={img.blur ?? undefined}
                  className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/fig:scale-[1.04]"
                  style={{ objectPosition: img.position }}
                />
              </figure>
            );
          })}
        </div>
      )}

      {/* 3. MOBILE CAROUSEL */}
      <div className="relative md:hidden">
        <div
          ref={mobileRail}
          onScroll={onMobileScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] rounded-xl"
        >
          {images.map((img, i) => (
            <div
              key={img.url}
              onClick={() => setOpen(i)}
              className="relative w-full shrink-0 cursor-zoom-in snap-center overflow-hidden bg-graphite"
              style={{ aspectRatio: slideRatio }}
            >
              <Image
                src={img.url}
                alt={img.alt || name}
                fill
                sizes={coverSizes(img.width, img.height)}
                preload={i === 0}
                placeholder={img.blur ? "blur" : "empty"}
                blurDataURL={img.blur ?? undefined}
                quality={85}
                className="object-cover"
                style={{ objectPosition: img.position }}
              />
            </div>
          ))}
        </div>

        {/* Mobile Counter and Dots */}
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-between px-4">
            <div className="eyebrow rounded-full bg-ink/75 px-3 py-1.5 text-bone backdrop-blur-md text-xs tabular-nums border border-line/40">
              {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
            </div>
            <div className="flex items-center rounded-full bg-ink/75 px-2.5 py-1 backdrop-blur-md border border-line/40">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`${i + 1} / ${count}`}
                  onClick={() => slideToMobile(i)}
                  className="grid h-6 w-4 place-items-center"
                >
                  <span
                    className={cn(
                      "block h-[3px] rounded-full transition-all duration-300",
                      i === active ? "w-4 bg-brand shadow-[0_0_6px_rgba(216,0,0,0.8)]" : "w-1.5 bg-bone/40",
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {open !== null && (
        <Lightbox items={lightboxItems} start={open} onClose={() => setOpen(null)} />
      )}
    </div>
  );
}
