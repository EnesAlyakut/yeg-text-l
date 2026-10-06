"use client";

import { AnimatePresence, m } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { Locale } from "@/i18n/config";
import type { ProductCardData } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

type Option = { slug: string; label: string; count: number };

type Labels = {
  all: string;
  view: string;
  viewProduct: string;
  empty: string;
  category: string;
  collection: string;
  results: string;
  clear: string;
};

type Props = {
  products: ProductCardData[];
  categories: Option[];
  collections: Option[];
  lang: Locale;
  labels: Labels;
  currency: string;
  showPrice: boolean;
};

/**
 * Filters run client-side (the catalogue is small) so the page itself stays static/cached.
 * The active filter is mirrored in the URL for sharing.
 */
export function ProductBrowser({ products, categories, collections, lang, labels, currency, showPrice }: Props) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const category = params.get("category");
  const collection = params.get("collection");

  const visible = useMemo(
    () =>
      products.filter(
        (p) => (!category || p.category?.slug === category) && (!collection || p.collection?.slug === collection),
      ),
    [products, category, collection],
  );

  const setFilter = (key: "category" | "collection", value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const clearAll = () => router.replace(pathname, { scroll: false });
  const filtered = Boolean(category || collection);

  return (
    <div>
      <div className="sticky top-0 z-20 -mx-[var(--gutter)] border-y border-line bg-ink/90 px-[var(--gutter)] backdrop-blur-xl">
        <FilterRow
          label={labels.category}
          allLabel={labels.all}
          options={categories}
          active={category}
          onChange={(v) => setFilter("category", v)}
          aside={
            <p className="eyebrow whitespace-nowrap text-ash">
              <span className="tabular-nums text-bone">{visible.length}</span> {labels.results}
            </p>
          }
        />
        <FilterRow
          label={labels.collection}
          allLabel={labels.all}
          options={collections}
          active={collection}
          onChange={(v) => setFilter("collection", v)}
          className="border-t border-line/70"
          aside={
            filtered ? (
              <button type="button" onClick={clearAll} className="eyebrow whitespace-nowrap text-ash transition-colors hover:text-brand">
                {labels.clear} ×
              </button>
            ) : null
          }
        />
      </div>

      {visible.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-mist">{labels.empty}</p>
          <button type="button" onClick={clearAll} className="eyebrow link-line mt-6 text-bone">
            {labels.clear}
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-12 md:mt-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-y-16 2xl:grid-cols-5">
          <AnimatePresence initial={false}>
            {visible.map((p, i) => (
              <m.li
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: Math.min(i, 8) * 0.04 } }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
              >
                <ProductCard
                  product={p}
                  lang={lang}
                  labels={{ view: labels.view, viewProduct: labels.viewProduct }}
                  currency={currency}
                  showPrice={showPrice}
                  sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  preload={i < 4}
                />
              </m.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </div>
  );
}

/** One filter line: fixed label column, text options with a red tab indicator, optional right-hand slot. */
function FilterRow({
  label,
  allLabel,
  options,
  active,
  onChange,
  aside,
  className,
}: {
  label: string;
  allLabel: string;
  options: Option[];
  active: string | null;
  onChange: (v: string | null) => void;
  aside?: React.ReactNode;
  className?: string;
}) {
  const item = (value: string | null, text: string, count?: number) => {
    const on = active === value;
    return (
      <button
        key={value ?? "all"}
        type="button"
        onClick={() => onChange(on && value ? null : value)}
        aria-pressed={on}
        className={cn("eyebrow relative shrink-0 whitespace-nowrap py-4 transition-colors duration-300", on ? "text-bone" : "text-ash hover:text-mist")}
      >
        {text}
        {count !== undefined && <sup className="ml-1 text-[0.55rem] tabular-nums text-ash/70">{count}</sup>}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-brand transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            on ? "scale-x-100" : "scale-x-0",
          )}
        />
      </button>
    );
  };

  return (
    <div className={cn("flex items-center gap-6", className)}>
      <span className="eyebrow hidden w-28 shrink-0 text-ash/60 md:block">{label}</span>
      <div role="group" aria-label={label} className="flex min-w-0 flex-1 items-center gap-7 overflow-x-auto pr-6 [mask-image:linear-gradient(90deg,#000_calc(100%-2.5rem),transparent)] [scrollbar-width:none]">
        {item(null, allLabel)}
        {options.map((o) => item(o.slug, o.label, o.count))}
      </div>
      {aside && <div className="shrink-0 pl-2">{aside}</div>}
    </div>
  );
}
