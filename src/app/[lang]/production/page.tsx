import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/site/Button";
import { Glow } from "@/components/site/Glow";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { productionImages } from "@/content/production";
import { loadProduction } from "@/lib/page-content";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/production">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { p, img } = await loadProduction(lang);
  return buildMetadata({ lang, path: "/production", title: p.meta.title, description: p.meta.description, image: img.cutting });
}

type Img = (typeof productionImages)[keyof typeof productionImages];

/* Facts grid, 2 columns on phones / 4 on desktop: a left rule wherever a cell has a neighbour on its left. */
const FACT_CELL = ["", "border-l pl-6 lg:pl-8", "max-lg:border-t lg:border-l lg:pl-8", "max-lg:border-t border-l pl-6 lg:pl-8"];
const FACT_TICK = ["left-0", "left-6 lg:left-8", "left-0 lg:left-8", "left-6 lg:left-8"];

function Photo({
  image,
  alt,
  aspect,
  className,
  sizes,
  speed = 8,
}: {
  image: Img;
  alt: string;
  aspect: number;
  className?: string;
  sizes: string;
  speed?: number;
}) {
  return (
    <div className={cn("relative", className)}>
      <ParallaxImage
        src={image.url}
        alt={alt}
        width={image.width}
        height={image.height}
        blur={image.blur}
        position={image.position}
        sizes={sizes}
        speed={speed}
        frameAspect={aspect}
        className={cn("w-full", aspect === 3 / 2 ? "aspect-[3/2]" : "aspect-[4/3]")}
      />
      {/* Red corner marks, as on the contact map */}
      {["-left-2 -top-2 border-l border-t", "-bottom-2 -right-2 border-b border-r"].map((c) => (
        <span key={c} aria-hidden className={cn("pointer-events-none absolute size-6 border-brand", c)} />
      ))}
    </div>
  );
}

export default async function ProductionPage({ params }: PageProps<"/[lang]/production">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { p, img } = await loadProduction(lang);
  const dict = getDictionary(lang);
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <>
      {/* ———————————————— intro */}
      <header className="container-x relative isolate pb-20 pt-[calc(var(--nav-h)+5rem)] md:pb-28 md:pt-[calc(var(--nav-h)+7rem)]">
        <Glow className="-top-[var(--nav-h)]" />
        <div className="max-w-4xl">
          <p className="flex items-center gap-4">
            <span aria-hidden className="h-[2px] w-10 bg-brand" />
            <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.35)]">
              {p.eyebrow}
            </span>
          </p>
          <SplitText as="h1" trigger="mount" lines={[p.title]} className="display mt-6 text-fluid-hero" />
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-2xl text-[clamp(1.35rem,2.2vw,2.1rem)] font-medium leading-[1.2] tracking-[-0.012em] text-bone">{p.lead}</p>
          </Reveal>
        </div>
      </header>

      {/* ———————————————— facts */}
      <section className="border-y border-line bg-coal">
        <Reveal as="ul" stagger={0.08} className="container-x grid grid-cols-2 lg:grid-cols-4">
          {p.facts.map((f, i) => (
            <li key={f.label} className={cn("relative border-line py-10 md:py-14", FACT_CELL[i])}>
              <span aria-hidden className={cn("absolute top-0 block h-px w-10 bg-brand", FACT_TICK[i])} />
              <p className={cn("display text-[clamp(2.75rem,6vw,5.5rem)] leading-[0.85]", i === 0 ? "text-brand" : "text-bone")}>{f.value}</p>
              <p className="eyebrow mt-4 text-ash">{f.label}</p>
            </li>
          ))}
        </Reveal>
      </section>

      {/* ———————————————— chapters */}
      <div>
        {p.chapters.map((ch, i) => {
          const flip = i % 2 === 1;
          return (
            <section key={ch.title} className={cn("container-x py-20 md:py-28", i > 0 && "border-t border-line")}>
              <div className="grid items-center gap-12 md:grid-cols-12 md:gap-8">
                <Photo
                  image={img[ch.image as keyof typeof img] ?? img.cutting}
                  alt={ch.title}
                  aspect={4 / 3}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={cn("md:col-span-6", flip && "md:order-2 md:col-start-7")}
                />
                <div className={cn("md:col-span-5", flip ? "md:order-1 md:col-start-1" : "md:col-start-8")}>
                  <p className="eyebrow flex items-center gap-3 text-ash">
                    <span className="text-brand">{pad(i + 1)}</span>
                    <span aria-hidden className="h-px w-8 bg-line" />
                    {pad(p.chapters.length)}
                  </p>
                  <SplitText lines={[ch.title]} className="display mt-5 text-fluid-lg" />
                  <span aria-hidden className="mt-6 block h-px w-12 bg-brand" />
                  <Reveal>
                    <p className="mt-6 text-base leading-relaxed text-mist">{ch.text}</p>
                  </Reveal>
                  {ch.stages && (
                    <Reveal as="ul" stagger={0.1} className="relative mt-10 space-y-5 border-l border-line pl-7">
                      {ch.stages.map((s) => (
                        <li key={s} className="relative text-sm text-bone/90">
                          <span aria-hidden className="absolute -left-7 top-[0.45em] block size-2.5 -translate-x-1/2 rounded-full bg-brand" />
                          {s}
                        </li>
                      ))}
                    </Reveal>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ———————————————— call to action */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <Glow at="bottom" />
        <div className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            <SplitText lines={[p.ctaTitle]} className="display text-fluid-xl" />
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-mist">{p.ctaText}</p>
            <ButtonLink href={localePath(lang, "/contact")} variant="solid" className="self-start">
              {p.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <JsonLdScript
        data={breadcrumbSchema([
          { name: dict.nav.home, url: localePath(lang, "/") },
          { name: p.title, url: localePath(lang, "/production") },
        ])}
      />
    </>
  );
}
