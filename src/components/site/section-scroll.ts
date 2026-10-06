import type Lenis from "lenis";
import type { MouseEvent } from "react";

/**
 * Scrolls to an in-page section. Both Lenis and native scrollIntoView honour the
 * target's scroll-margin-top, so the fixed header never covers the heading.
 */
export function scrollToSection(id: string, lenis: Lenis | null, { immediate = false } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  if (lenis) {
    lenis.scrollTo(el, { immediate, force: true, duration: 1.4 });
  } else {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: immediate || reduce ? "auto" : "smooth", block: "start" });
  }
  // Move the reading/focus position like a native anchor jump would.
  el.focus({ preventScroll: true });
  return true;
}

const isPlainClick = (e: MouseEvent) => e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;

/**
 * Same-page anchor click: smooth scroll + update the URL hash (history entry, so Back works).
 * Returns false (and leaves the event alone) for modified clicks or missing targets.
 */
export function handleSectionClick(e: MouseEvent, id: string, lenis: Lenis | null, { delay = 0 } = {}) {
  if (!isPlainClick(e) || !document.getElementById(id)) return false;
  e.preventDefault();
  if (window.location.hash !== `#${id}`) window.history.pushState(null, "", `#${id}`);
  if (delay) window.setTimeout(() => scrollToSection(id, lenis), delay);
  else scrollToSection(id, lenis);
  return true;
}
