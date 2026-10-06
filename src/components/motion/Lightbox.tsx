"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

export type LightboxItem = { url: string; width: number; height: number; blur?: string | null; alt?: string };

type Props = { items: LightboxItem[]; start: number; onClose: () => void };

/**
 * Full-screen viewer: crossfading, gently sliding frames, thumbnail rail,
 * keyboard (← → Esc), swipe and click-the-edges navigation.
 */
export function Lightbox({ items, start, onClose }: Props) {
  const [index, setIndex] = useState(start);
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const touch = useRef<number | null>(null);
  const rail = useRef<HTMLDivElement>(null);
  const count = items.length;

  const go = useCallback((i: number) => setIndex(((i % count) + count) % count), [count]);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, onClose]);

  // Keep the active thumbnail centred in the rail
  useEffect(() => {
    const el = rail.current?.children[index] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gallery"
      data-lenis-prevent
      className="fixed inset-0 z-[300] flex flex-col bg-ink/95 backdrop-blur-xl"
      style={{ animation: "lightbox-in 500ms ease both" }}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => (touch.current = e.clientX)}
      onPointerUp={(e) => {
        const s = touch.current;
        touch.current = null;
        if (s === null) return;
        const dx = e.clientX - s;
        if (Math.abs(dx) > 56) go(index + (dx < 0 ? 1 : -1));
      }}
    >
      <header className="flex items-center justify-between px-5 py-4 md:px-8">
        <span className="eyebrow tabular-nums text-bone">
          {String(index + 1).padStart(2, "0")} <span className="text-bone/50">/ {String(count).padStart(2, "0")}</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="grid size-11 place-items-center rounded-full border border-bone/25 text-bone transition-all duration-500 hover:rotate-90 hover:border-brand hover:bg-brand"
        >
          <span aria-hidden className="text-xl leading-none">✕</span>
        </button>
      </header>

      <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
        {items.map((it, i) => {
          const offset = i - index;
          const active = offset === 0;
          return (
            <div
              key={`${it.url}-${i}`}
              aria-hidden={!active}
              className="pointer-events-none absolute inset-0 px-4 pb-2 md:px-24"
              style={{
                opacity: active ? 1 : 0,
                transform: `translate3d(${active ? 0 : Math.sign(offset) * 5}%, 0, 0) scale(${active ? 1 : 0.97})`,
                transition: "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 900ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div className="relative h-full w-full">
                <Image
                  src={it.url}
                  alt={it.alt || ""}
                  fill
                  sizes="100vw"
                  quality={90}
                  placeholder={it.blur ? "blur" : "empty"}
                  blurDataURL={it.blur ?? undefined}
                  className="select-none object-contain"
                  draggable={false}
                />
              </div>
            </div>
          );
        })}

        {count > 1 && (
          <>
            <NavButton dir="prev" onClick={() => go(index - 1)} />
            <NavButton dir="next" onClick={() => go(index + 1)} />
          </>
        )}
      </div>

      {(items[index]?.alt || count > 1) && (
        <footer className="px-5 pb-5 pt-2 md:px-8">
          <p className="eyebrow mb-3 h-4 truncate text-center text-bone/70">{items[index]?.alt}</p>
          {count > 1 && (
            <div ref={rail} className="mx-auto flex max-w-full justify-start gap-2 overflow-x-auto px-1 [scrollbar-width:none] md:justify-center">
              {items.map((it, i) => (
                <button
                  key={`${it.url}-${i}`}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`${i + 1} / ${count}`}
                  aria-current={i === index}
                  className={cn(
                    "relative h-16 w-12 shrink-0 overflow-hidden border transition-all duration-500 md:h-20 md:w-14",
                    i === index ? "border-brand opacity-100" : "border-transparent opacity-45 hover:opacity-90",
                  )}
                >
                  <Image src={it.url} alt="" fill sizes="64px" quality={60} className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </footer>
      )}
    </div>,
    document.body,
  );
}

function NavButton({ dir, onClick }: { dir: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={cn(
        "group absolute top-1/2 z-10 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-bone/25 bg-ink/50 text-bone backdrop-blur-md transition-all duration-500 hover:border-brand hover:bg-brand md:grid",
        dir === "prev" ? "left-6" : "right-6",
      )}
    >
      <span aria-hidden className={cn("text-xl leading-none transition-transform duration-500", dir === "prev" ? "group-hover:-translate-x-1" : "group-hover:translate-x-1")}>
        {dir === "prev" ? "←" : "→"}
      </span>
    </button>
  );
}
