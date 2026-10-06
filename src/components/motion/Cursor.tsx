"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "@/lib/gsap";

/**
 * Desktop-only cursor. Elements opt in with:
 *   data-cursor="View"   → red disc with a label
 *   data-cursor-hover    → enlarged dot (links, buttons get this automatically)
 * Hidden entirely on touch devices via CSS (hover:hover and pointer:fine).
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const pathname = usePathname();

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
    gsap.set(el, { opacity: 0 });

    const move = (e: PointerEvent) => {
      x(e.clientX);
      y(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" });

      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const hoverable = target?.closest("a, button, [data-cursor-hover], input, textarea, select, label");
      el.classList.toggle("is-label", Boolean(labelled));
      el.classList.toggle("is-hover", !labelled && Boolean(hoverable));
      setLabel(labelled?.dataset.cursor ?? "");
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  // Reset state after navigation (the hovered element may be gone).
  useEffect(() => {
    ref.current?.classList.remove("is-label", "is-hover");
  }, [pathname]);

  return (
    <div ref={ref} className="cursor" aria-hidden>
      <div className="cursor__dot" />
      <div className="cursor__label">{label}</div>
    </div>
  );
}
