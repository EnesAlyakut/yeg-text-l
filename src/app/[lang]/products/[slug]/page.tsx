import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { Accordion } from "@/components/product/Accordion";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ButtonLink } from "@/components/site/Button";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { ProductCard } from "@/components/site/ProductCard";
import { hasLocale, localePath, pick, pickList } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts, getSettings, readSpecs, toCard, staticSlugs } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return staticSlugs("product");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/products/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const img = product.images[0];
  return buildMetadata({
    lang,
    path: `/products/${slug}`,
    title: pick(product, "seoTitle", lang) || pick(product, "name", lang),
    description: pick(product, "seoDescription", lang) || pick(product, "short", lang) || pick(product, "description", lang).slice(0, 160),
    image: img ? { url: img.url, width: img.width, height: img.height, alt: pick(img, "alt", lang) } : null,
  });
}

export default async function ProductPage({ params }: PageProps<"/[lang]/products/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [product, settings, all] = await Promise.all([getProductBySlug(slug), getSettings(), getProducts()]);
  if (!product) notFound();

  const dict = getDictionary(lang);
  const name = pick(product, "name", lang);
  const color = pick(product, "color", lang);
  const material = pick(product, "material", lang);
  const description = pick(product, "description", lang);
  const features = pickList(product, "features", lang);
  const specs = readSpecs(product.specs);
  const { currency, showPrices } = settings.general;
  const price = formatPrice(Number(product.price), currency, lang);
  const wa = settings.contact.whatsapp.replace(/[^\d]/g, "");
  const waIntro = {
    en: "Hello, I'd like more information about",
    tr: "Merhaba, şu ürün hakkında bilgi almak istiyorum",
    fr: "Bonjour, je souhaiterais plus d'informations sur",
  }[lang];
  const waText = encodeURIComponent(`${waIntro}: ${name} (${product.code ?? product.slug})`);

  const related = all
    .filter((p) => p.id !== product.id && p.collectionId && p.collectionId === product.collectionId)
    .slice(0, 4)
    .map(toCard);

  const images = product.images.map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
    blur: img.blurDataUrl,
    position: img.objectPosition,
    alt: pick(img, "alt", lang) || name,
  }));

  return (
    <>
      <article className="container-x relative isolate grid gap-10 pb-24 pt-[calc(var(--nav-h)+1.5rem)] md:grid-cols-12 md:gap-8 md:pt-[calc(var(--nav-h)+3rem)]">
        {/* Red light in the gap between the photo and the text */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(28%_60%_at_63%_45%,rgba(216,0,0,0.26),transparent_75%)]"
        />
        <div className="-mx-[var(--gutter)] md:col-span-7 md:mx-0">
          <ProductGallery images={images} name={name} />
        </div>

        <div className="md:col-span-5 md:col-start-8 lg:col-span-4 lg:col-start-9">
          <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)]">
            <nav className="eyebrow flex flex-wrap items-center gap-2 text-ash" aria-label="Breadcrumb">
              <Link href={localePath(lang, "/products")} className="link-line hover:text-bone">
                {dict.nav.products}
              </Link>
              {product.collection && (
                <>
                  <span className="text-brand">/</span>
                  <Link href={localePath(lang, `/collections/${product.collection.slug}`)} className="link-line hover:text-bone">
                    {pick(product.collection, "name", lang)}
                  </Link>
                </>
              )}
            </nav>

            <h1 className="display mt-6 text-[clamp(2rem,2.7vw,3rem)]">{name}</h1>
            <span aria-hidden className="mt-5 block h-[2px] w-16 bg-brand shadow-[0_0_14px_rgba(216,0,0,0.6)]" />

            <div className="mt-6 flex items-end justify-between gap-6 border-b border-line pb-6">
              <div className="eyebrow space-y-2 text-ash">
                <p>
                  {dict.common.color} <span className="text-brand">—</span> <span className="text-bone">{color}</span>
                </p>
                {product.code && (
                  <p>
                    {dict.common.code} <span className="text-brand">—</span> <span className="text-bone">{product.code}</span>
                  </p>
                )}
              </div>
              {showPrices && <p className="display text-[clamp(1.6rem,2vw,2.1rem)] leading-none tabular-nums text-brand">{price}</p>}
            </div>

            {pick(product, "short", lang) && (
              <p className="mt-6 border-l-2 border-brand pl-4 text-base leading-relaxed text-bone/90">{pick(product, "short", lang)}</p>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row md:flex-col 2xl:flex-row">
              <ButtonLink href={`${localePath(lang, "/contact")}?product=${product.slug}`} variant="solid" className="flex-1">
                {dict.common.requestInfo}
              </ButtonLink>
              <ButtonLink
                href={`https://wa.me/${wa}?text=${waText}`}
                target="_blank"
                rel="noreferrer"
                variant="outline"
                className="flex-1 hover:border-brand hover:text-brand"
              >
                WhatsApp
              </ButtonLink>
            </div>

            <div className="mt-10">
              <Accordion title={dict.products.details} open>
                <p>{description}</p>
                {material && (
                  <p className="mt-4">
                    <span className="eyebrow text-ash">{dict.common.material}</span>
                    <br />
                    <span className="text-bone">{material}</span>
                  </p>
                )}
                {product.collection && (
                  <p className="mt-4">
                    <span className="eyebrow text-ash">{dict.common.collection}</span>
                    <br />
                    <Link className="link-line text-bone" href={localePath(lang, `/collections/${product.collection.slug}`)}>
                      {pick(product.collection, "name", lang)} — {pick(product.collection, "season", lang)}
                    </Link>
                  </p>
                )}
              </Accordion>
              {features.length > 0 && (
                <Accordion title={dict.products.features}>
                  <ul className="space-y-2">
                    {features.map((f) => (
                      <li key={f} className="flex gap-3">
                        <span className="mt-2.5 h-px w-3 shrink-0 bg-brand" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Accordion>
              )}
              {specs.length > 0 && (
                <Accordion title={dict.products.specs}>
                  <dl className="divide-y divide-line">
                    {specs.map((s) => (
                      <div key={s.labelEn} className="flex justify-between gap-6 py-2.5">
                        <dt className="text-ash">{pick(s, "label", lang)}</dt>
                        <dd className="text-right text-bone">{pick(s, "value", lang)}</dd>
                      </div>
                    ))}
                  </dl>
                </Accordion>
              )}
              <p className="eyebrow border-t border-line pt-6 leading-relaxed text-ash">
                <span className="text-brand">— </span>
                {dict.common.showroomNote}
              </p>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="container-x border-t border-line py-24 md:py-32">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display flex items-center gap-4 text-fluid-md">
              <span aria-hidden className="block h-px w-10 bg-brand" />
              {dict.common.related}
            </h2>
            <Link href={localePath(lang, "/products")} className="eyebrow link-line text-ash hover:text-bone">
              {dict.common.allProducts}
            </Link>
          </div>
          <Reveal stagger={0.08} className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-4 md:gap-x-5">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                labels={{ view: dict.common.view, viewProduct: dict.common.viewProduct }}
                currency={currency}
                showPrice={showPrices}
              />
            ))}
          </Reveal>
        </section>
      )}

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name,
            description,
            sku: product.code ?? product.slug,
            image: product.images.map((i) => absoluteUrl(i.url)),
            brand: { "@type": "Brand", name: "YEG Textile" },
            color,
            material,
            category: product.category ? pick(product.category, "name", lang) : undefined,
            url: absoluteUrl(localePath(lang, `/products/${product.slug}`)),
            ...(showPrices
              ? {
                  offers: {
                    "@type": "Offer",
                    price: Number(product.price).toFixed(2),
                    priceCurrency: currency,
                    availability: "https://schema.org/InStock",
                    url: absoluteUrl(localePath(lang, `/products/${product.slug}`)),
                    seller: { "@type": "Organization", name: "YEG Textile" },
                  },
                }
              : {}),
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.nav.products, url: localePath(lang, "/products") },
            { name, url: localePath(lang, `/products/${product.slug}`) },
          ]),
        ]}
      />
    </>
  );
}
