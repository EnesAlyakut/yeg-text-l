"use client";

import { useLenis } from "@/components/motion/SmoothScroll";
import { handleSectionClick } from "@/components/site/section-scroll";

type Props = { label: string; items: { id: string; label: string; index: string }[]; className?: string };

/** Compact in-page table of contents under the About title: small inline links. Plain #hash links that still work without JS. */
export function AboutIndex({ label, items, className }: Props) {
  const lenis = useLenis();

  return (
    <nav aria-label={label} className={className}>
      <p className="eyebrow flex items-center gap-3 text-ash">
        <span aria-hidden className="h-px w-6 bg-brand" />
        {label}
      </p>
      <ul className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleSectionClick(e, item.id, lenis)}
              className="group inline-flex items-center gap-2 text-[0.8125rem] leading-snug text-mist transition-colors duration-300 hover:text-bone"
            >
              <span aria-hidden className="block size-1 rounded-full bg-brand/60 transition-colors duration-300 group-hover:bg-brand" />
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
