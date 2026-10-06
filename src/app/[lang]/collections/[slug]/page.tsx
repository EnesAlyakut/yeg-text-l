import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageSlider, type Slide } from "@/components/motion/ImageSlider";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { GalleryGrid } from "@/components/site/GalleryGrid";
import { Glow } from "@/components/site/Glow";
import { ProductCard } from "@/components/site/ProductCard";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCollectionBySlug, getCollections, getSettings, toCard, readGallery, staticSlugs } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticSlugs("collection");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/collections/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const col = await getCollectionBySlug(slug);
  if (!col) return {};
  return buildMetadata({
    lang,
    path: `/collections/${slug}`,
    title: pick(col, "seoTitle", lang) || pick(col, "name", lang),
    description: pick(col, "seoDescription", lang) || pick(col, "description", lang).slice(0, 160),
    image: col.coverUrl ? { url: col.coverUrl, width: col.coverWidth ?? undefined, height: col.coverHeight ?? undefined } : null,
  });
}

export default async function CollectionPage({ params }: PageProps<"/[lang]/collections/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [col, all, settings] = await Promise.all([getCollectionBySlug(slug), getCollections(), getSettings()]);
  if (!col) notFound();
  const dict = getDictionary(lang);
  const cards = col.products.map(toCard);
  const idx = all.findIndex((c) => c.id === col.id);
  const next = all[(idx + 1) % all.length];
  const coverSharp = (col.coverWidth ?? 0) >= 1600;
  const gallery = readGallery(col.gallery);
  const toSlide = (i: { url: string; width: number; height: number; blurDataUrl: string | null; objectPosition: string }): Slide => ({
    url: i.url,
    width: i.width,
    height: i.height,
    blur: i.blurDataUrl,
    position: i.objectPosition,
    alt: pick(col, "name", lang),
  });
  const coverSlide: Slide | null = col.coverUrl
    ? { url: col.coverUrl, width: col.coverWidth ?? 1600, height: col.coverHeight ?? 1000, blur: col.coverBlur, position: col.coverPosition, alt: pick(col, "name", lang) }
    : null;
  // Wide header: only sharp landscape gallery photos; the portrait side frame takes any gallery photo
  const heroSlides = coverSlide ? [coverSlide, ...gallery.filter((g) => g.width > g.height && g.width >= 1600).map(toSlide)].slice(0, 6) : [];
  const sideSlides = coverSlide ? [coverSlide, ...gallery.map(toSlide)].slice(0, 6) : [];

  return (
    <>
      <section className="relative">
        {col.coverUrl && coverSharp ? (
          <div className="relative h-[78svh] min-h-[480px]">
            {heroSlides.length > 1 ? (
              <ImageSlider slides={heroSlides} alt={pick(col, "name", lang)} interval={7000} preload quality={90} controls={false} className="h-full w-full" />
            ) : (
              <ParallaxImage
                src={col.coverUrl}
                alt={pick(col, "name", lang)}
                width={col.coverWidth ?? 1600}
                height={col.coverHeight ?? 1000}
                blur={col.coverBlur}
                position={col.coverPosition}
                speed={14}
                reveal={false}
                preload
                className="h-full w-full"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-ink/25" />
            <div className="container-x absolute inset-x-0 bottom-0 pb-12">
              <p className="eyebrow flex items-center gap-3 text-bone/80"><span aria-hidden className="h-px w-8 bg-brand" />{pick(col, "season", lang)}</p>
              <SplitText as="h1" trigger="mount" lines={[pick(col, "name", lang)]} className="display mt-4 text-fluid-xl" />
            </div>
          </div>
        ) : (
          <div className="container-x relative isolate grid gap-10 pt-[calc(var(--nav-h)+5rem)] md:grid-cols-12">
            <Glow at="top-left" className="-top-[var(--nav-h)]" />
            <div className="md:col-span-7">
              <p className="eyebrow flex items-center gap-3 text-ash"><span aria-hidden className="h-px w-8 bg-brand" />{pick(col, "season", lang)}</p>
              <SplitText as="h1" trigger="mount" lines={[pick(col, "name", lang)]} className="display mt-4 text-fluid-xl" />
            </div>
            {col.coverUrl && (
              <div className="md:col-span-4 md:col-start-9">
                {sideSlides.length > 1 ? (
                  <ImageSlider slides={sideSlides} alt={pick(col, "name", lang)} sizes="(min-width: 768px) 33vw, 100vw" preload className="aspect-[4/5]" />
                ) : (
                  <ParallaxImage
                    src={col.coverUrl}
                    alt={pick(col, "name", lang)}
                    width={col.coverWidth ?? 800}
                    height={col.coverHeight ?? 1200}
                    blur={col.coverBlur}
                    position={col.coverPosition}
                    sizes="(min-width: 768px) 33vw, 100vw"
                    preload
                    frameAspect={4 / 5}
                    className="aspect-[4/5]"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section className="container-x grid gap-8 py-20 md:grid-cols-12 md:py-28">
        <p className="eyebrow flex items-center gap-3 text-ash md:col-span-3 md:self-start">
          <span className="text-brand">({String(cards.length).padStart(2, "0")})</span>
          {cards.length === 1 ? dict.common.piece : dict.common.pieces}
        </p>
        <div className="md:col-span-7 md:col-start-5">
          <p className="border-l-2 border-brand pl-5 text-[clamp(1.15rem,1.6vw,1.5rem)] font-medium leading-tight tracking-[-0.008em]">{pick(col, "tagline", lang)}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist">{pick(col, "description", lang)}</p>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="container-x pb-20 md:pb-28">
          <p className="eyebrow mb-8 flex items-center gap-3 text-ash"><span aria-hidden className="h-px w-8 bg-brand/60" />Lookbook</p>
          <GalleryGrid images={gallery} lang={lang} />
        </section>
      )}

      <section className="container-x pb-28">
        <Reveal stagger={0.06} className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-y-16 2xl:grid-cols-5">
          {cards.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              lang={lang}
              index={i}
              labels={{ view: dict.common.view, viewProduct: dict.common.viewProduct }}
              currency={settings.general.currency}
              showPrice={settings.general.showPrices}
              sizes="(min-width: 1536px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ))}
        </Reveal>
      </section>

      {next && next.id !== col.id && (
        <Link
          href={localePath(lang, `/collections/${next.slug}`)}
          data-cursor={dict.common.explore}
          className="group container-x relative isolate block overflow-hidden border-t border-line py-20 md:py-28"
        >
          <Glow at="bottom" className="opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <p className="eyebrow flex items-center gap-3 text-ash"><span aria-hidden className="h-px w-8 bg-brand" />{{ en: "Next collection", tr: "Sonraki koleksiyon", fr: "Collection suivante" }[lang]}</p>
          <p className="display mt-4 text-fluid-xl transition-colors duration-500 group-hover:text-brand">{pick(next, "name", lang)} <span className="text-brand">→</span></p>
        </Link>
      )}

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pick(col, "name", lang),
            description: pick(col, "description", lang),
            url: absoluteUrl(localePath(lang, `/collections/${col.slug}`)),
            hasPart: cards.map((c) => ({ "@type": "Product", name: pick(c, "name", lang), url: absoluteUrl(localePath(lang, `/products/${c.slug}`)) })),
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.nav.collections, url: localePath(lang, "/collections") },
            { name: pick(col, "name", lang), url: localePath(lang, `/collections/${col.slug}`) },
          ]),
        ]}
      />
    </>
  );
}
