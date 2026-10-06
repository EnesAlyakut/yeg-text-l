"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/motion/SmoothScroll";
import { scrollToSection } from "./section-scroll";

/**
 * Lands on /page#section when arriving from another page (or a fresh load), and follows
 * Back/Forward between section hashes. SmoothScroll resets to the top on every route change
 * and refreshes ScrollTrigger ~120ms later, so the jump waits until both have happened.
 */
export function SectionHashScroll() {
  const lenis = useLenis();

  useEffect(() => {
    const currentId = () => decodeURIComponent(window.location.hash.slice(1));

    // Content above the target (images, pinned sections) may still be settling after the first jump,
    // so re-aim a couple of times — unless the visitor has started scrolling on their own.
    let landedAt: number | null = null;
    const land = () => {
      const id = currentId();
      if (!id) return;
      if (landedAt !== null && Math.abs(window.scrollY - landedAt) > 4) return;
      scrollToSection(id, lenis, { immediate: true });
      landedAt = window.scrollY;
    };
    const timers = [160, 700, 1500].map((ms) => window.setTimeout(land, ms));

    const onHashChange = () => {
      const id = currentId();
      if (id) scrollToSection(id, lenis);
      else if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [lenis]);

  return null;
}
