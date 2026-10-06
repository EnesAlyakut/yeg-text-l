"use client";

import { m } from "framer-motion";
import { useState, type ReactNode } from "react";

let hydrated = false;

/**
 * Client-side navigation transition: a curtain lifts while the page fades in.
 * Skipped on the initial (server-rendered) load so LCP is never hidden behind opacity:0,
 * and never uses transforms on the wrapper (that would break ScrollTrigger pinning).
 */
export default function Template({ children }: { children: ReactNode }) {
  const [animate] = useState(() => {
    if (typeof window === "undefined") return false;
    const should = hydrated;
    hydrated = true;
    return should;
  });

  if (!animate) return <>{children}</>;

  return (
    <>
      <m.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[70] origin-top bg-coal"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
      <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}>
        {children}
      </m.div>
    </>
  );
}
