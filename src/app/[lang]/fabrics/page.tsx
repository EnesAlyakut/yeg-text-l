import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RevealLines } from "@/components/about/RevealLines";
import { Marquee } from "@/components/home/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/site/Button";
import { FabricSwatch } from "@/components/site/FabricSwatch";
import { Glow } from "@/components/site/Glow";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { SectionHashScroll } from "@/components/site/SectionHashScroll";
import { SectionLink } from "@/components/site/SectionLink";
import { loadFabricDetails, loadFabrics } from "@/lib/page-content";
import { FABRICS_PATH, allMaterials, fabricPath } from "@/content/fabrics";
import { hasLocale, localePath, pickList } from "@/i18n/config";
import { getHomepage } from "@/lib/queries";
import { getDictionary } from "@/i18n/get-dictionary";
import { viewportFrameSizes } from "@/lib/images";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/fabrics">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { f, hero: fabricsHero } = await loadFabrics(lang);
  return buildMetadata({ lang, path: FABRICS_PATH, title: f.meta.title, description: f.meta.description, image: fabricsHero });
}

function Kicker({ children }: { index?: string; children: ReactNode }) {
  return (
    // Solid red tag, same as the About, Production and Contact pages
    <p className="flex items-center gap-4">
      <span aria-hidden className="h-[2px] w-10 bg-brand" />
      <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.35)]">
        {children}
      </span>
    </p>
  );
}

const pad = (n: number) => String(n).padStart(2, "0");

export default async function FabricsPage({ params }: PageProps<"/[lang]/fabrics">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { f, hero: fabricsHero, swatches } = await loadFabrics(lang);
  const dict = getDictionary(lang);
  // The band shows the homepage's marquee words, so both stay in sync from the admin
  const { sections } = await getHomepage();
  const bandItems = sections.marquee ? pickList(sections.marquee, "items", lang) : allMaterials(f);
  const { labels } = await loadFabricDetails(lang);
  const total = f.groups.reduce((n, g) => n + g.fabrics.length, 0);
  // Numbering runs on across groups (01–12).
  const starts = f.groups.map((_, i) => f.groups.slice(0, i).reduce((n, g) => n + g.fabrics.length, 0));

  return (
    <>
      <SectionHashScroll />

      {/* ———————————————— intro over the knitting floor */}
      <header className="relative isolate flex min-h-[82svh] items-end overflow-hidden pb-16 pt-[calc(var(--nav-h)+5rem)] md:pb-24">
        <div aria-hidden className="absolute inset-0 -z-10">
          <Image
            src={fabricsHero.url}
            alt=""
            fill
            preload
            sizes={["(max-width: 767px) 400vw", ...viewportFrameSizes(fabricsHero, { vw: 100, vh: 82 })].join(", ")}
            placeholder="blur"
            blurDataURL={fabricsHero.blur}
            className="object-cover opacity-45"
            style={{ objectPosition: fabricsHero.position }}
          />
          {/* Red-tinted, darkening towards the copy */}
          <div className="absolute inset-0 bg-brand-deep/45 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
          <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_80%_20%,rgba(216,0,0,0.25),transparent_70%)]" />
        </div>

        <div className="container-x grid w-full gap-12 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-8">
            <Kicker index="01">{f.eyebrow}</Kicker>
            <SplitText as="h1" trigger="mount" lines={[f.title]} className="display mt-6 text-fluid-hero" />
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-2xl text-[clamp(1.2rem,1.9vw,1.75rem)] font-medium leading-[1.2] tracking-[-0.012em] text-bone">{f.lead}</p>
            </Reveal>
          </div>
          <Reveal delay={0.35} className="md:col-span-4">
            <p className="display text-[clamp(4.5rem,11vw,10rem)] leading-[0.8] text-brand md:text-right">{total}</p>
            <p className="eyebrow mt-3 text-ash md:text-right">{f.countLabel}</p>
            <nav aria-label={f.groupsLabel} className="mt-8 border-t border-line">
              <ul>
                {f.groups.map((g) => (
                  <li key={g.id} className="border-b border-line">
                    <SectionLink
                      lang={lang}
                      path={FABRICS_PATH}
                      id={g.id}
                      className="group flex items-baseline justify-between gap-4 py-3 text-sm text-mist transition-colors hover:text-bone"
                    >
                      <span>{g.label}</span>
                      <span className="flex items-center gap-3 font-mono text-[0.625rem] tracking-[0.14em] text-ash">
                        {pad(g.fabrics.length)}
                        <span aria-hidden className="text-brand transition-transform duration-500 group-hover:translate-y-0.5">
                          ↓
                        </span>
                      </span>
                    </SectionLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>
        </div>
      </header>

      {/* ———————————————— materials band */}
      {/* Same band as the homepage: its words (from the admin), bright red core */}
      <section className="grain relative isolate space-y-1 overflow-hidden bg-ink py-4 md:py-6" aria-label={bandItems.join(", ")}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(28%_95%_at_50%_50%,rgba(216,0,0,0.6),transparent_75%),radial-gradient(65%_150%_at_50%_50%,rgba(143,0,0,0.7),rgba(70,0,0,0.3)_55%,transparent_88%)]"
        />
        <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-line via-brand to-line" />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-line via-brand to-line" />
        <Marquee items={bandItems} size="sm" duration={62} />
        <Marquee items={bandItems} size="sm" reverse outline duration={75} />
      </section>

      {/* ———————————————— groups */}
      {f.groups.map((g, gi) => {
        const start = starts[gi];
        const single = g.fabrics.length === 1;
        return (
          <section
            key={g.id}
            id={g.id}
            aria-labelledby={`${g.id}-title`}
            tabIndex={-1}
            className={cn("scroll-mt-[var(--nav-h)] py-20 outline-none md:py-28", gi % 2 === 1 && "bg-coal")}
          >
            <div className="container-x">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <Kicker index={pad(gi + 2)}>{f.groupsLabel}</Kicker>
                  <RevealLines as="h2" id={`${g.id}-title`} lines={[g.label]} className="display mt-5 text-fluid-xl" />
                </div>
                <p className="eyebrow flex items-center gap-3 text-ash">
                  <span className="display text-4xl leading-none text-bone">{pad(g.fabrics.length)}</span>
                  {f.countLabel}
                </p>
              </div>

              <Reveal
                as="ul"
                stagger={0.06}
                className={cn("mt-12 grid border-l border-t border-line md:mt-16", single ? "" : "sm:grid-cols-2 lg:grid-cols-3")}
              >
                {g.fabrics.map((fab, i) => (
                  <li key={fab.slug} className={cn("group relative border-b border-r border-line", gi % 2 === 1 ? "bg-coal" : "bg-ink")}>
                    <Link
                      href={localePath(lang, fabricPath(fab.slug))}
                      data-cursor={labels.view}
                      className={cn("block h-full p-5 md:p-7", single && "md:grid md:grid-cols-2 md:items-center md:gap-10")}
                    >
                      <FabricSwatch weave={fab.weave} image={swatches[fab.slug]} className={single ? "aspect-[16/9]" : "aspect-[16/10]"} />
                      <div className={cn("mt-6", single && "md:mt-0")}>
                        <p className="font-mono text-[0.625rem] tracking-[0.14em] text-brand">{pad(start + i + 1)}</p>
                        <h3 className="display mt-3 text-[clamp(1.6rem,2.1vw,2.2rem)] leading-[0.95] transition-colors duration-500 group-hover:text-brand">
                          {fab.title}
                        </h3>
                        <p className="eyebrow mt-5 text-ash">{f.materialsLabel}</p>
                        <ul className="mt-3 flex flex-wrap gap-2">
                          {fab.materials.map((m) => (
                            <li
                              key={m}
                              className="border border-line px-2.5 py-1 text-[0.8125rem] text-mist transition-colors duration-500 group-hover:border-brand/40 group-hover:text-bone"
                            >
                              {m}
                            </li>
                          ))}
                        </ul>
                        <p className="eyebrow mt-6 flex items-center gap-2 text-ash transition-colors duration-500 group-hover:text-bone">
                          {labels.view}
                          <span aria-hidden className="text-brand transition-transform duration-500 group-hover:translate-x-1">
                            →
                          </span>
                        </p>
                      </div>
                    </Link>
                    <span
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 block h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                    />
                  </li>
                ))}
              </Reveal>
            </div>
          </section>
        );
      })}

      {/* ———————————————— call to action */}
      <section className="relative isolate overflow-hidden border-t border-line">
        <Glow at="bottom" />
        <div className="container-x grid gap-10 py-24 md:grid-cols-12 md:py-32">
          <div className="md:col-span-7">
            <SplitText lines={[f.ctaTitle]} className="display text-fluid-xl" />
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-mist">{f.ctaText}</p>
            <ButtonLink href={localePath(lang, "/contact")} variant="solid" className="self-start">
              {f.cta}
            </ButtonLink>
          </div>
        </div>
      </section>

      <JsonLdScript
        data={breadcrumbSchema([
          { name: dict.nav.home, url: localePath(lang, "/") },
          { name: f.title, url: localePath(lang, FABRICS_PATH) },
        ])}
      />
    </>
  );
}
