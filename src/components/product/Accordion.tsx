import type { ReactNode } from "react";

/** Native <details> accordion — zero JS, accessible by default. */
export function Accordion({ title, children, open }: { title: string; children: ReactNode; open?: boolean }) {
  return (
    <details className="group relative border-t border-line" open={open}>
      <span aria-hidden className="absolute -top-px left-0 h-px w-0 bg-brand transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:w-16" />
      <summary className="eyebrow flex cursor-pointer list-none items-center justify-between py-5 text-bone transition-colors duration-300 hover:text-brand [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden className="relative block size-3">
          <span className="absolute left-0 top-1/2 h-px w-full bg-bone transition-colors duration-300 group-open:bg-brand" />
          <span className="absolute left-1/2 top-0 h-full w-px bg-bone transition-transform duration-500 group-open:scale-y-0" />
        </span>
      </summary>
      <div className="pb-7 text-sm leading-relaxed text-mist">{children}</div>
    </details>
  );
}
