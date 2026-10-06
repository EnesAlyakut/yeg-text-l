"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisContext);

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const instance = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), touchMultiplier: 1.4 });
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expose the instance once it exists
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // New page → jump to top and recompute every trigger once layout has settled.
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    lenis?.scrollTo(0, { immediate: true, force: true });
    if (!lenis) window.scrollTo(0, 0);
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, lenis]);

  // Late-loading images change document height.
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  // Any later change in page height (font swap, content edits, hot reload) would leave pinned
  // sections working from stale positions and let the next section slide over them.
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let last = main.offsetHeight;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      const height = main.offsetHeight;
      if (Math.abs(height - last) < 2) return;
      last = height;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(main);
    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  // LazyMotion + `m` components ship only the DOM animation feature set of Framer Motion.
  return (
    <LenisContext.Provider value={lenis}>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </LenisContext.Provider>
  );
}
