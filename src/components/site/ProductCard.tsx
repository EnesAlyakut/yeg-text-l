import Link from "next/link";
import { localePath, pick, type Locale } from "@/i18n/config";
import { formatPrice } from "@/lib/format";
import { coverFactor, scaleSizes } from "@/lib/images";
import type { ProductCardData } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { CardImageStack } from "./CardImageStack";

type Props = {
  product: ProductCardData;
  lang: Locale;
  labels: { view: string; viewProduct: string };
  currency: string;
  showPrice: boolean;
  sizes?: string;
  /** "overlay": name & price slide in over the image on hover (desktop) */
  variant?: "default" | "overlay";
  index?: number;
  className?: string;
  preload?: boolean;
  /** Use the highest-resolution portrait instead of the primary image (large slots) */
  feature?: boolean;
  /** "wide": a 16:9 frame filled with the product's landscape image (full-width slots) */
  shape?: "portrait" | "wide";
};

export function ProductCard({ product, lang, labels, currency, showPrice, sizes = "(min-width: 1024px) 25vw, 50vw", variant = "default", index, className, preload, feature, shape = "portrait" }: Props) {
  const name = pick(product, "name", lang);
  const color = pick(product, "color", lang);
  const category = product.category ? pick(product.category, "name", lang) : null;
  const price = showPrice ? formatPrice(product.price, currency, lang) : null;
  const wide = shape === "wide";
  const img = wide ? (product.wideImage ?? product.featureImage ?? product.image) : feature ? (product.featureImage ?? product.image) : product.image;
  // Frame aspect + hover zoom: fetch enough pixels for the drawn size. Wide photos sit slightly zoomed
  // so stray edge lines or letterbox bars in campaign shots are cropped away.
  const drawn = (i: typeof img) => scaleSizes(sizes, coverFactor(i, wide ? 16 / 9 : 2 / 3, wide ? 1.1 : 1.06));
  // Photos the card cycles through on hover (portrait frames only: a landscape shot would crop badly)
  const photos = img ? (wide ? [img] : [img, ...product.gallery.filter((g) => g.url !== img.url)].slice(0, 5)).map((p) => ({ url: p.url, width: p.width, height: p.height, blurDataUrl: p.blurDataUrl, objectPosition: p.objectPosition, sizes: drawn(p) })) : [];
  const alt = (img && pick(img, "alt", lang)) || name;

  return (
    <Link href={localePath(lang, `/products/${product.slug}`)} data-cursor={labels.view} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-graphite", wide ? "aspect-[16/9]" : "aspect-[2/3]")}>
        {photos.length > 0 && (
          <CardImageStack
            photos={photos}
            alt={alt}
            preload={preload}
            zoomClass={wide ? "scale-[1.05] group-hover:scale-[1.1]" : "group-hover:scale-[1.06]"}
          />
        )}

        {/* Red rule that draws across the foot of the image on hover */}
        <span aria-hidden className="absolute bottom-0 left-0 z-[1] h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />

        {typeof index === "number" && (
          <span className="eyebrow absolute left-3 top-3 text-ink/70 mix-blend-difference">{String(index + 1).padStart(2, "0")}</span>
        )}

        {variant === "overlay" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden translate-y-full bg-gradient-to-t from-ink/90 via-ink/50 to-transparent p-5 pt-16 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 md:block">
            <p className="display text-3xl">{name}</p>
            <div className="eyebrow mt-2 flex justify-between text-mist">
              <span>{color}</span>
              {price && <span className="text-bone">{price}</span>}
            </div>
          </div>
        )}
      </div>

      <div className={cn("mt-4 flex items-start justify-between gap-4", variant === "overlay" && "md:hidden")}>
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-[0.8125rem] font-medium uppercase leading-snug tracking-[0.06em] transition-colors duration-500 group-hover:text-brand">{name}</h3>
          <p className="eyebrow mt-1.5 truncate text-ash">{[category, color].filter(Boolean).join(" · ")}</p>
        </div>
        {price && <p className="shrink-0 text-[0.8125rem] tabular-nums text-mist">{price}</p>}
      </div>
      {variant === "default" && (
        <span className="eyebrow mt-3 inline-flex items-center gap-2 text-ash transition-colors duration-500 group-hover:text-brand">
          {labels.viewProduct} <span aria-hidden>→</span>
        </span>
      )}
    </Link>
  );
}
