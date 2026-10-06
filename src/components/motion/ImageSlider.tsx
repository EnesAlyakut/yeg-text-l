"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { coverSizes } from "@/lib/images";
import { cn } from "@/lib/utils";

export type Slide = {
  url: string;
  width: number;
  height: number;
  blur?: string | null;
  position?: string;
  alt?: string;
};

const FADE_MS = 1400;
const EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

/** Autoplay state machine: pauses on hover/focus, in background tabs and for reduced-motion users. */
export function useSlideshow(count: number, { interval = 6500, autoplay = true }: { interval?: number; autoplay?: boolean } = {}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReduced(mq.matches);
    const syncVisible = () => setHidden(document.hidden);
    syncMotion();
    mq.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncVisible);
    return () => {
      mq.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncVisible);
    };
  }, []);

  const running = autoplay && count > 1 && !paused && !reduced && !hidden;

  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % count), interval);
    return () => clearTimeout(timer);
  }, [running, index, count, interval]);

  const go = useCallback((i: number) => setIndex(count ? ((i % count) + count) % count : 0), [count]);
  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  return { index: Math.min(index, Math.max(count - 1, 0)), running, interval, go, next, prev, setPaused };
}

type LayerProps = {
  slides: Slide[];
  index: number;
  /** Overrides the cover-aware default `sizes` */
  sizes?: string;
  quality?: number;
  /** Eagerly loads (and preloads) the first slide */
  preload?: boolean;
  /** Slow zoom-out on the slide that is in view */
  kenBurns?: boolean;
  fallbackAlt?: string;
};

/**
 * Stacked frames that crossfade. The Ken Burns zoom lives on a wrapper so the <img> itself stays free
 * for other scroll-driven transforms (e.g. the Statement frame's GSAP scale).
 */
export function SlideLayers({ slides, index, sizes, quality = 90, preload, kenBurns = true, fallbackAlt = "" }: LayerProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={`${s.url}-${i}`}
            aria-hidden={!active}
            className="absolute inset-0 overflow-hidden"
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0, transition: `opacity ${FADE_MS}ms ${EASE}` }}
          >
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: kenBurns && !(active && ready) ? "scale(1.12)" : "scale(1)",
                // Re-arm the zoom only after the fade-out has finished, so a leaving slide doesn't visibly jump
                transition: active ? "transform 9000ms cubic-bezier(0.25, 0.6, 0.2, 1)" : `transform 0ms linear ${FADE_MS}ms`,
              }}
            >
              <Image
                src={s.url}
                alt={s.alt || fallbackAlt}
                fill
                sizes={sizes ?? coverSizes(s.width, s.height)}
                quality={quality}
                preload={preload && i === 0}
                placeholder={s.blur ? "blur" : "empty"}
                blurDataURL={s.blur ?? undefined}
                className="object-cover"
                style={{ objectPosition: s.position ?? "50% 50%" }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

type DotsProps = {
  count: number;
  index: number;
  onSelect: (i: number) => void;
  running: boolean;
  interval: number;
  className?: string;
};

/** Segmented progress indicator: the active segment fills over the autoplay interval. */
export function SlideDots({ count, index, onSelect, running, interval, className }: DotsProps) {
  if (count < 2) return null;
  return (
    <div className={cn("flex items-center", className)} role="group" aria-label="Slides">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          aria-label={`${i + 1} / ${count}`}
          aria-current={i === index}
          onClick={() => onSelect(i)}
          className="group/dot grid h-6 w-7 place-items-center md:w-9"
        >
          <span className="relative block h-[2px] w-full overflow-hidden bg-bone/25 transition-[height] duration-300 group-hover/dot:h-[3px]">
            {i === index && (
              <span
                key={index}
                className="absolute inset-0 origin-left bg-brand"
                style={running ? { animation: `slidefill ${interval}ms linear forwards` } : undefined}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

function Arrow({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="group/arrow grid size-11 place-items-center rounded-full border border-bone/25 bg-ink/40 text-bone backdrop-blur-md transition-all duration-500 hover:border-brand hover:bg-brand"
    >
      <span aria-hidden className={cn("text-lg leading-none transition-transform duration-500", dir === "prev" ? "group-hover/arrow:-translate-x-0.5" : "group-hover/arrow:translate-x-0.5")}>
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}

type SliderProps = {
  slides: Slide[];
  className?: string;
  alt?: string;
  sizes?: string;
  interval?: number;
  autoplay?: boolean;
  kenBurns?: boolean;
  /** Dots, counter, arrows and swipe/keyboard navigation */
  controls?: boolean;
  preload?: boolean;
  quality?: number;
};

/** Self-contained slideshow for a framed area: size and shape come from `className`. */
export function ImageSlider({ slides, className, alt, sizes, interval = 6500, autoplay = true, kenBurns = true, controls = true, preload, quality }: SliderProps) {
  const show = useSlideshow(slides.length, { interval, autoplay });
  const start = useRef<{ x: number; y: number } | null>(null);
  const many = slides.length > 1;

  const onDown = (e: PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onUp = (e: PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || !controls) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - s.y)) (dx < 0 ? show.next : show.prev)();
  };
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") show.next();
    if (e.key === "ArrowLeft") show.prev();
  };

  return (
    <div
      className={cn("relative isolate overflow-hidden bg-graphite", className)}
      onMouseEnter={() => show.setPaused(true)}
      onMouseLeave={() => show.setPaused(false)}
      onFocus={() => show.setPaused(true)}
      onBlur={() => show.setPaused(false)}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onKeyDown={controls ? onKey : undefined}
      role={many ? "group" : undefined}
      aria-roledescription={many ? "carousel" : undefined}
      aria-label={alt}
      style={{ touchAction: "pan-y" }}
    >
      <SlideLayers slides={slides} index={show.index} sizes={sizes} quality={quality} preload={preload} kenBurns={kenBurns} fallbackAlt={alt} />
      {many && controls && (
        <>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-28 bg-gradient-to-t from-ink/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 z-[3] flex items-center justify-between gap-4 p-4 md:p-6">
            <div className="flex items-center gap-4">
              <span className="eyebrow tabular-nums text-bone">
                {String(show.index + 1).padStart(2, "0")} <span className="text-bone/50">/ {String(slides.length).padStart(2, "0")}</span>
              </span>
              <SlideDots count={slides.length} index={show.index} onSelect={show.go} running={show.running} interval={interval} />
            </div>
            <div className="hidden gap-2 md:flex">
              <Arrow dir="prev" onClick={show.prev} />
              <Arrow dir="next" onClick={show.next} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
