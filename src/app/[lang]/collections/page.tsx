import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { PageHeader } from "@/components/site/PageHeader";
import { hasLocale, localePath, pick } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getCollections } from "@/lib/queries";
import { coverFactor, scaleSizes } from "@/lib/images";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/collections">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return buildMetadata({ lang, path: "/collections", title: dict.collections.title, description: dict.collections.intro });
}

export default async function CollectionsPage({ params }: PageProps<"/[lang]/collections">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const collections = await getCollections();

  return (
    <>
      <PageHeader eyebrow={dict.nav.collections} count={collections.length} title={dict.collections.title} intro={dict.collections.intro} />
      <section className="container-x space-y-24 pb-32 md:space-y-40">
        {collections.map((col, i) => {
          const flip = i % 2 === 1;
          const landscape = (col.coverWidth ?? 0) > (col.coverHeight ?? 0);
          const count = col._count.products;
          return (
            <Reveal key={col.id} as="article">
              <Link href={localePath(lang, `/collections/${col.slug}`)} data-cursor={dict.common.explore} className="group grid items-end gap-8 md:grid-cols-12">
                <div
                  className={cn(
                    "relative overflow-hidden bg-graphite",
                    landscape ? "aspect-[16/10] md:col-span-7" : "aspect-[4/5] md:col-span-4",
                    flip && (landscape ? "md:order-2 md:col-start-6" : "md:order-2 md:col-start-9"),
                  )}
                >
                  {col.coverUrl && (
                    <Image
                      src={col.coverUrl}
                      alt={pick(col, "name", lang)}
                      fill
                      sizes={scaleSizes(
                        landscape ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 33vw, 100vw",
                        coverFactor({ width: col.coverWidth ?? 0, height: col.coverHeight ?? 0 }, landscape ? 16 / 10 : 4 / 5, 1.05),
                      )}
                      placeholder={col.coverBlur ? "blur" : "empty"}
                      blurDataURL={col.coverBlur ?? undefined}
                      className="object-cover transition-transform duration-[1.8s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                      style={{ objectPosition: col.coverPosition }}
                    />
                  )}
                </div>
                <div
                  className={cn(
                    landscape ? "md:col-span-4" : "md:col-span-5",
                    flip ? "md:order-1 md:col-start-1" : landscape ? "md:col-start-9" : "md:col-start-7",
                  )}
                >
                  <p className="eyebrow flex gap-3 text-ash">
                    <span className="text-brand">{String(i + 1).padStart(2, "0")}</span>
                    {pick(col, "season", lang)}
                  </p>
                  <h2 className="display mt-4 text-fluid-lg transition-colors duration-500 group-hover:text-brand">{pick(col, "name", lang)}</h2>
                  <p className="mt-4 text-base text-bone/90">{pick(col, "tagline", lang)}</p>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-mist">{pick(col, "description", lang)}</p>
                  <p className="eyebrow mt-8 flex items-center gap-4">
                    <span className="text-ash">
                      {count} {count === 1 ? dict.common.piece : dict.common.pieces}
                    </span>
                    <span className="h-px w-10 bg-line transition-all duration-700 group-hover:w-20 group-hover:bg-brand" />
                    {dict.common.viewCollection}
                  </p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </section>
    </>
  );
}
