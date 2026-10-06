import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { PageHeader } from "@/components/site/PageHeader";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCategories, getCollections, getProducts, getSettings, toCard } from "@/lib/queries";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]/products">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({ lang, path: "/products", title: dict.products.title, description: dict.products.intro });
}

export default async function ProductsPage({ params }: PageProps<"/[lang]/products">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [products, categories, collections, settings] = await Promise.all([getProducts(), getCategories(), getCollections(), getSettings()]);
  const cards = products.map(toCard);

  const count = (key: "category" | "collection", slug: string) => cards.filter((c) => c[key]?.slug === slug).length;

  return (
    <>
      <PageHeader eyebrow={dict.nav.products} count={cards.length} title={dict.products.title} intro={dict.products.intro} />
      <section className="container-x pb-32">
        <Suspense>
          <ProductBrowser
            products={cards}
            categories={categories.map((c) => ({ slug: c.slug, label: pick(c, "name", lang), count: count("category", c.slug) })).filter((c) => c.count > 0)}
            collections={collections.map((c) => ({ slug: c.slug, label: pick(c, "name", lang), count: count("collection", c.slug) })).filter((c) => c.count > 0)}
            lang={lang}
            labels={{
              all: dict.common.all,
              view: dict.common.view,
              viewProduct: dict.common.viewProduct,
              empty: dict.products.empty,
              category: dict.common.category,
              collection: dict.common.collection,
              results: dict.products.results,
              clear: dict.products.clear,
            }}
            currency={settings.general.currency}
            showPrice={settings.general.showPrices}
          />
        </Suspense>
        <p className="eyebrow mt-24 max-w-xl text-ash">{dict.common.showroomNote}</p>
      </section>
      <JsonLdScript
        data={[
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: dict.nav.products, url: localePath(lang, "/products") },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: cards.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: absoluteUrl(localePath(lang, `/products/${c.slug}`)),
              name: pick(c, "name", lang),
            })),
          },
        ]}
      />
    </>
  );
}
