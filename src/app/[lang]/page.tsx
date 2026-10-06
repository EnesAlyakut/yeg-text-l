import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import { Banner } from "@/components/home/Banner";
import { BrandStory } from "@/components/home/BrandStory";
import { CollectionsRail } from "@/components/home/CollectionsRail";
import { FEATURE_LAYOUT, arrangeFeatured } from "@/components/home/feature-layout";
import { FeaturedGrid } from "@/components/home/FeaturedGrid";
import { FeaturedPhoto } from "@/components/home/FeaturedPhoto";
import { Hero } from "@/components/home/Hero";
import { Lookbook } from "@/components/home/Lookbook";
import { Manifesto } from "@/components/home/Manifesto";
import { Marquee } from "@/components/home/Marquee";
import { RedBand } from "@/components/home/RedBand";
import { Showcase, type ShowcaseItem } from "@/components/home/Showcase";
import { Statement } from "@/components/home/Statement";
import { ButtonLink } from "@/components/site/Button";
import { ProductCard } from "@/components/site/ProductCard";
import { SectionHashScroll } from "@/components/site/SectionHashScroll";
import { SHOWCASE_DEFAULTS } from "@/content/showcase";
import { AR_GE_ID } from "@/content/site-sections";
import { SectionHeading } from "@/components/site/SectionHeading";
import { hasLocale, localePath, pick, pickList, type Locale } from "@/i18n/config";
import { getDictionary, type Dictionary } from "@/i18n/get-dictionary";
import type { HomepageKey, HomepageSections } from "@/lib/content-types";
import { formatPrice } from "@/lib/format";
import { getCollections, getHomepage, getProductsBySlugs, getSettings, heroImageOf, toCard } from "@/lib/queries";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  const { sections } = await getHomepage();
  const hero = sections.hero;
  return {
    ...buildMetadata({
      lang,
      path: "/",
      title: dict.meta.title,
      description: dict.meta.description,
      image: hero
        ? {
            url: hero.image.url,
            width: hero.image.width,
            height: hero.image.height,
          }
        : null,
    }),
    title: { absolute: dict.meta.title },
  };
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const [{ sections, order }, settings] = await Promise.all([getHomepage(), getSettings()]);

  // Each section renders independently; admin can toggle and reorder them.
  let n = 0;
  const next = () => String(++n).padStart(2, "0");
  const blocks: ReactNode[] = [];
  for (const { key, enabled } of order) {
    if (!enabled || !sections[key]) continue;
    blocks.push(await renderSection(key, sections, { lang, dict, settings, next }));
  }

  return (
    <>
      <SectionHashScroll />
      {blocks}
    </>
  );
}

type Ctx = {
  lang: Locale;
  dict: Dictionary;
  settings: Awaited<ReturnType<typeof getSettings>>;
  next: () => string;
};

async function renderSection(key: HomepageKey, s: Partial<HomepageSections>, { lang, dict, settings, next }: Ctx): Promise<ReactNode> {
  const t = (record: object, field: string) => pick(record, field, lang);
  const { currency, showPrices } = settings.general;

  switch (key) {
    case "hero": {
      const h = s.hero!;
      const title = t(h, "title");
      return (
        <Hero
          key={key}
          image={h.image}
          images={h.images}
          mobileImage={h.mobileImage}
          videoUrl={h.videoUrl}
          titleLines={splitTitle(title)}
          subtitle={t(h, "subtitle")}
          eyebrow={dict.home.heroEyebrow}
          cta={{ label: t(h, "ctaLabel"), href: localePath(lang, h.ctaHref) }}
          scrollHint={dict.home.scrollHint}
        />
      );
    }

    case "intro": {
      const i = s.intro!;
      return <Manifesto key={key} index={next()} label={t(i, "label") || "Manifesto"} title={t(i, "title") || undefined} text={t(i, "text")} />;
    }

    case "marquee": {
      const items = pickList(s.marquee!, "items", lang);
      return (
        <section key={key} className="grain relative isolate space-y-1 overflow-hidden bg-ink py-4 md:py-6" aria-label="Marquee">
          {/* Deep red band: a bright core in the centre fading into dark red, red-tinted hairlines like the footer's */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(28%_95%_at_50%_50%,rgba(216,0,0,0.6),transparent_75%),radial-gradient(65%_150%_at_50%_50%,rgba(143,0,0,0.7),rgba(70,0,0,0.3)_55%,transparent_88%)]"
          />
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-line via-brand to-line" />
          <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-line via-brand to-line" />
          <Marquee items={items} size="sm" duration={62} />
          <Marquee items={items} size="sm" reverse outline duration={75} />
        </section>
      );
    }

    case "featured": {
      const f = s.featured!;
      const photos = (f.gallery ?? []).slice(0, FEATURE_LAYOUT.length);
      const cards = photos.length ? [] : (await getProductsBySlugs(f.productSlugs)).map(toCard);
      if (!photos.length && !cards.length) return null;
      const arranged = arrangeFeatured(cards);
      return (
        <Fragment key={key}>
          <section className="container-x pb-16 pt-20 md:pb-24 md:pt-28">
            <SectionHeading
              index={next()}
              eyebrow={dict.home.featuredEyebrow}
              title={t(f, "title")}
              aside={<ButtonLink href={localePath(lang, "/products")}>{dict.common.allProducts}</ButtonLink>}
            />
            <div className="mt-12 md:mt-16">
              <FeaturedGrid
                items={
                  photos.length
                    ? // Campaign photos: 1 large + 2, each leading to the products page
                      photos.map((image, idx) => ({
                        className: FEATURE_LAYOUT[idx].className,
                        speed: 0,
                        node: (
                          <FeaturedPhoto
                            image={image}
                            href={localePath(lang, "/products")}
                            alt={`${t(f, "title")} — YEG Textile`}
                            cursor={dict.common.explore}
                            sizes={FEATURE_LAYOUT[idx].sizes}
                          />
                        ),
                      }))
                    : arranged.map(({ slot, product }, idx) => ({
                        className: slot.className,
                        speed: slot.speed,
                        node: (
                          <ProductCard
                            product={product}
                            lang={lang}
                            labels={{
                              view: dict.common.view,
                              viewProduct: dict.common.viewProduct,
                            }}
                            currency={currency}
                            showPrice={showPrices}
                            variant="overlay"
                            feature
                            shape={slot.shape}
                            sizes={slot.sizes}
                            index={idx}
                          />
                        ),
                      }))
                }
              />
            </div>
          </section>
          {/* Thin red band between the photos and the next scene */}
          <RedBand title={dict.home.bandTitle} text={dict.home.bandText} />
        </Fragment>
      );
    }

    case "statement": {
      const st = s.statement!;
      const heroTitle = s.hero ? t(s.hero, "title") : "YEG Textile";
      const words = splitTitle(heroTitle);
      const story = t(st, "text").trim() !== "";
      return (
        <Fragment key={key}>
          {/* Anchor for /#ar-ge: lands a little into the pinned scene, where the title and first paragraph are on screen */}
          {story && <div id={AR_GE_ID} tabIndex={-1} className="h-0 outline-none" style={{ scrollMarginTop: "-105svh" }} />}
          <Statement
            image={st.image}
            images={st.images}
            caption={t(st, "caption")}
            words={[words[0], words.slice(1).join(" ") || words[0]]}
            eyebrow={t(st, "eyebrow")}
            title={t(st, "title")}
            text={t(st, "text")}
          />
        </Fragment>
      );
    }

    case "showcase": {
      const products = await getProductsBySlugs(s.showcase!.productSlugs);
      const uploads = s.showcase!.images ?? [];
      // Admin text for slot i; empty fields fall back to the product (or the defaults for photo-only slots)
      const txt = (i: number, f: "name" | "description" | "collection" | "color" | "material") => {
        const tx = s.showcase!.texts?.[i];
        return tx ? pick(tx as Record<string, string>, f, lang) : "";
      };
      const items: ShowcaseItem[] = products.map((p, i) => {
        const own = heroImageOf(p.images)!;
        // A photo uploaded for this slot in the admin replaces the product's own
        const custom = uploads[i];
        const img = custom
          ? {
              ...own,
              url: custom.url,
              width: custom.width,
              height: custom.height,
              blurDataUrl: custom.blur ?? null,
              objectPosition: custom.position ?? "50% 50%",
            }
          : own;
        return {
          slug: p.slug,
          href: localePath(lang, `/products/${p.slug}`),
          name: txt(i, "name") || pick(p, "name", lang),
          collection: txt(i, "collection") || (p.collection ? pick(p.collection, "name", lang) : "—"),
          material: txt(i, "material") || pick(p, "material", lang),
          color: txt(i, "color") || pick(p, "color", lang),
          description: txt(i, "description") || pick(p, "short", lang) || pick(p, "description", lang),
          price: showPrices ? formatPrice(Number(p.price), currency, lang) : null,
          image: {
            url: img.url,
            width: img.width,
            height: img.height,
            blur: img.blurDataUrl,
            position: img.objectPosition,
            alt: pick(img, "alt", lang) || pick(p, "name", lang),
          },
        };
      });
      // Uploaded photos without a product in their slot are shown on their own, leading to the products page
      uploads.forEach((u, i) => {
        if (!u || i < products.length) return;
        const d = SHOWCASE_DEFAULTS[lang][i % 5];
        const name = txt(i, "name") || d.name;
        items.push({
          slug: `photo-${i}`,
          href: localePath(lang, "/products"),
          name,
          collection: txt(i, "collection"),
          material: txt(i, "material") || d.material,
          color: txt(i, "color") || d.color,
          description: txt(i, "description") || d.description,
          price: null,
          image: { url: u.url, width: u.width, height: u.height, blur: u.blur ?? null, position: u.position ?? "50% 50%", alt: `${name} — YEG Textile` },
        });
      });
      if (!items.length) return null;
      return (
        <Showcase
          key={key}
          items={items}
          labels={{
            collection: dict.common.collection,
            material: dict.common.material,
            color: dict.common.color,
            price: dict.common.price,
            discover: dict.common.discover,
            eyebrow: dict.home.showcaseEyebrow,
            index: next(),
          }}
        />
      );
    }

    case "lookbook": {
      const lb = s.lookbook!;
      if (!lb.images?.length) return null;
      return (
        <Fragment key={key}>
          {/* Soft fade from the showcase's grey into the lookbook's red-tinted black */}
          <div aria-hidden className="h-24 bg-[linear-gradient(180deg,#0a0a0a_0%,#120202_50%,#240404_100%)] md:h-32" />
          <Lookbook
            index={next()}
            eyebrow={dict.home.lookbookEyebrow}
            title={t(lb, "title")}
            text={t(lb, "text")}
            cta={{
              label: dict.home.lookbookCta,
              href: localePath(lang, "/collections"),
            }}
            frames={lb.images.map((img) => ({
              url: img.url,
              width: img.width,
              height: img.height,
              blur: img.blurDataUrl,
              position: img.objectPosition,
              caption: t(img, "alt"),
            }))}
          />
        </Fragment>
      );
    }

    case "story": {
      const st = s.story!;
      return (
        <BrandStory
          key={key}
          index={next()}
          eyebrow={dict.home.storyEyebrow}
          lines={pickList(st, "lines", lang)}
          text={t(st, "text")}
          texture={st.texture}
          steps={st.steps.map((step) => ({
            title: t(step, "title"),
            text: t(step, "text"),
            image: step.image,
          }))}
        />
      );
    }

    case "collections": {
      const c = s.collections!;
      const all = await getCollections();
      const chosen = c.collectionSlugs.length ? c.collectionSlugs.map((slug) => all.find((x) => x.slug === slug)).filter((x) => x !== undefined) : all;
      return (
        <CollectionsRail
          key={key}
          index={next()}
          eyebrow={dict.home.collectionsEyebrow}
          title={t(c, "title")}
          cta={dict.common.explore}
          scrollLabel={dict.common.scroll}
          items={chosen.map((col) => ({
            slug: col.slug,
            href: localePath(lang, `/collections/${col.slug}`),
            name: pick(col, "name", lang),
            season: pick(col, "season", lang),
            tagline: pick(col, "tagline", lang),
            count: `${col._count.products} ${col._count.products === 1 ? dict.common.piece : dict.common.pieces}`,
            image: col.coverUrl
              ? {
                  url: col.coverUrl,
                  width: col.coverWidth ?? 1600,
                  height: col.coverHeight ?? 1000,
                  blur: col.coverBlur,
                  position: col.coverPosition,
                }
              : null,
          }))}
        />
      );
    }

    case "banner": {
      // The closing banner only; the latest blog posts are no longer listed on the homepage
      const b = s.banner!;
      return (
        <Banner key={key} image={b.image} images={b.images} title={t(b, "title")} text={t(b, "text")} cta={{ label: t(b, "ctaLabel"), href: localePath(lang, b.ctaHref) }} />
      );
    }
  }
}

/** "Built For The Few" → ["Built For", "The Few"]; respects explicit line breaks. */
function splitTitle(title: string) {
  if (title.includes("\n"))
    return title
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
  const words = title.trim().split(/\s+/);
  if (words.length < 3) return [title];
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(" "), words.slice(mid).join(" ")];
}
