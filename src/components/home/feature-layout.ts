import type { ProductCardData } from "@/lib/queries";

// One large, full-width landscape photo on top, then two equal landscape photos side by side
// (stacked on mobile). Every gap in the grid is the same size.
export const FEATURE_LAYOUT = [
  { className: "col-span-2 md:col-span-12", shape: "wide" as const, sizes: "100vw", speed: 0 },
  { className: "col-span-2 md:col-span-6", shape: "wide" as const, sizes: "(min-width: 768px) 50vw, 100vw", speed: 0 },
  { className: "col-span-2 md:col-span-6", shape: "wide" as const, sizes: "(min-width: 768px) 50vw, 100vw", speed: 0 },
];

/** Products with a sharp landscape image fill the slots first, in their admin order. */
export function arrangeFeatured(cards: ProductCardData[]) {
  const ordered = [...cards.filter((c) => c.wideImage), ...cards.filter((c) => !c.wideImage)];
  return ordered.slice(0, FEATURE_LAYOUT.length).map((product, i) => ({ slot: FEATURE_LAYOUT[i], product }));
}
