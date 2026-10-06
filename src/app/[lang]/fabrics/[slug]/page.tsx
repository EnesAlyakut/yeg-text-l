import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RevealLines } from "@/components/about/RevealLines";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/site/Button";
import { FabricSwatch } from "@/components/site/FabricSwatch";
import { Glow } from "@/components/site/Glow";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { loadFabricDetails, loadFabrics } from "@/lib/page-content";
import type { FabricDetail } from "@/content/fabric-details";
import { FABRICS_PATH, fabricPath, fabricSlugs, findFabric } from "@/content/fabrics";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { absoluteUrl, breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return fabricSlugs().map((slug) => ({ slug }));
}

// Fabrics added in the admin get their page on first visit
export const dynamicParams = true;

/** A fabric added in the admin may not have detail texts yet. */
const EMPTY_DETAIL: FabricDetail = { structure: "", lead: "", body: [], features: [], uses: [], materialNotes: [], finishes: [] };

export async function generateMetadata({ params }: PageProps<"/[lang]/fabrics/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const [{ f }, { details }] = await Promise.all([loadFabrics(lang), loadFabricDetails(lang)]);
  const found = findFabric(f, slug);
  if (!found) return {};
  return buildMetadata({
    lang,
    path: fabricPath(slug),
    title: `${found.fabric.title} — ${f.title}`,
    description: (details as Record<string, FabricDetail | undefined>)[slug]?.lead || found.fabric.title,
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

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

export default async function FabricPage({ params }: PageProps<"/[lang]/fabrics/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const [{ f, swatches }, { details, labels: l }] = await Promise.all([loadFabrics(lang), loadFabricDetails(lang)]);
  const found = findFabric(f, slug);
  if (!found) notFound();
  const { fabric, group, index, total, prev, next, siblings } = found;
  const d: FabricDetail = (details as Record<string, FabricDetail | undefined>)[slug] ?? EMPTY_DETAIL;
  const dict = getDictionary(lang);
  const fabricsHref = localePath(lang, FABRICS_PATH);
  const sampleHref = `${localePath(lang, "/contact")}?fabric=${slug}`;

  return (
    <>
      {/* ———————————————— intro: title, specs and a large swatch */}
      <header className="relative isolate overflow-hidden pb-20 pt-[calc(var(--nav-h)+3.5rem)] md:pb-28 md:pt-[calc(var(--nav-h)+5rem)]">
        <Glow at="top-right" />
        <div className="container-x grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-7 md:flex md:flex-col">
            <nav aria-label="Breadcrumb" className="eyebrow flex flex-wrap items-center gap-2 text-ash">
              <Link href={fabricsHref} className="link-line transition-colors hover:text-bone">
                {f.title}
              </Link>
              <span aria-hidden className="text-brand">
                /
              </span>
              <Link href={`${fabricsHref}#${group.id}`} className="link-line transition-colors hover:text-bone">
                {group.label}
              </Link>
            </nav>

            <div className="mt-10 md:mt-14">
              <Kicker index={`${pad(index + 1)} / ${pad(total)}`}>{group.label}</Kicker>
              <SplitText as="h1" trigger="mount" lines={[fabric.title]} className="display mt-6 text-fluid-xl" />
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-2xl text-[clamp(1.15rem,1.7vw,1.6rem)] font-medium leading-[1.25] tracking-[-0.008em] text-bone">{d.lead}</p>
              </Reveal>
            </div>

            <Reveal delay={0.3} className="mt-10 md:mt-auto md:pt-12">
              <dl className="grid border-t border-line sm:grid-cols-3">
                {[
                  [l.structure, d.structure],
                  [l.group, group.label],
                  [l.materials, pad(fabric.materials.length)],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-line py-4 sm:border-b-0 sm:pr-6">
                    <dt className="eyebrow text-ash">{k}</dt>
                    <dd className="mt-2 text-sm leading-snug text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <ButtonLink href={sampleHref} variant="solid">
                  {l.sampleCta}
                </ButtonLink>
                <Link href={fabricsHref} className="eyebrow link-line text-ash transition-colors hover:text-bone">
                  ← {l.back}
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="md:col-span-5">
            <div className="group relative">
              <FabricSwatch weave={fabric.weave} image={swatches[fabric.slug]} sizes="(min-width: 768px) 42vw, 100vw" className="aspect-[4/5]" />
              {/* Corner marks and the running number over the cloth */}
              <span aria-hidden className="absolute left-3 top-3 h-5 w-5 border-l border-t border-brand" />
              <span aria-hidden className="absolute bottom-3 right-3 h-5 w-5 border-b border-r border-brand" />
              <p aria-hidden className="display absolute bottom-4 left-5 text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] text-bone/90 mix-blend-difference">
                {pad(index + 1)}
              </p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ———————————————— overview */}
      <section aria-labelledby="overview-title" className="border-t border-line py-20 md:py-28">
        <div className="container-x grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <div className="md:sticky md:top-[calc(var(--nav-h)+2rem)]">
              <Kicker index="01">{l.overview}</Kicker>
              <RevealLines as="h2" id="overview-title" lines={[d.structure]} className="display mt-5 text-[clamp(1.8rem,3vw,3rem)] leading-[0.95]" />
            </div>
          </div>
          <div className="space-y-6 md:col-span-7 md:col-start-6">
            {d.body.map((p, i) => (
              <Reveal key={i}>
                <p
                  className={cn(
                    i === 0
                      ? "border-l-2 border-brand pl-5 text-[clamp(1.1rem,1.5vw,1.4rem)] leading-snug tracking-normal text-bone"
                      : "text-base leading-relaxed text-mist md:text-lg",
                  )}
                >
                  {p}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ———————————————— highlights */}
      {d.features.length > 0 && (
        <section aria-labelledby="features-title" className="pb-20 md:pb-28">
          <div className="container-x">
            <Kicker index="02">
              <span id="features-title">{l.features}</span>
            </Kicker>
            <Reveal as="ul" stagger={0.08} className="mt-10 grid border-l border-t border-line md:grid-cols-3">
              {d.features.map((feat, i) => (
                <li key={feat.title} className="group relative border-b border-r border-line p-6 md:p-8">
                  <p className="font-mono text-[0.625rem] tracking-[0.14em] text-brand">{pad(i + 1)}</p>
                  <h3 className="display mt-6 text-[clamp(1.6rem,2.2vw,2.2rem)] leading-[0.95] transition-colors duration-500 group-hover:text-brand">
                    {feat.title}
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-mist">{feat.text}</p>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 block h-[2px] origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  />
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ———————————————— materials */}
      <section aria-labelledby="materials-title" className="relative isolate overflow-hidden bg-coal py-20 md:py-28">
        <Glow at="top-left" />
        <div className="container-x grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Kicker index="03">{l.materials}</Kicker>
            <p id="materials-title" className="display mt-5 text-[clamp(4rem,8vw,7rem)] leading-[0.8] text-brand">
              {pad(fabric.materials.length)}
            </p>
          </div>
          <Reveal as="ol" stagger={0.06} className="border-t border-line md:col-span-8">
            {fabric.materials.map((m, i) => (
              <li key={m} className="group grid gap-2 border-b border-line py-6 sm:grid-cols-[3rem_minmax(0,14rem)_1fr] sm:items-baseline sm:gap-6">
                <span className="font-mono text-[0.625rem] tracking-[0.14em] text-brand">{pad(i + 1)}</span>
                <h3 className="display text-[clamp(1.5rem,2vw,2rem)] leading-none transition-colors duration-500 group-hover:text-brand">{m}</h3>
                <p className="text-sm leading-relaxed text-mist">{d.materialNotes[i]}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ———————————————— uses & finishes */}
      {(d.uses.length > 0 || d.finishes.length > 0) && (
        <section className="py-20 md:py-28">
          <div className="container-x grid gap-16 md:grid-cols-2 md:gap-8">
            <div>
              <Kicker index="04">{l.uses}</Kicker>
              <Reveal as="ul" stagger={0.05} className="mt-8 border-t border-line">
                {d.uses.map((u) => (
                  <li key={u} className="flex items-baseline gap-4 border-b border-line py-4 text-[clamp(1.05rem,1.4vw,1.3rem)] tracking-normal text-bone">
                    <span aria-hidden className="h-px w-5 shrink-0 translate-y-[-0.3em] bg-brand" />
                    {u}
                  </li>
                ))}
              </Reveal>
            </div>
            <div className="md:pl-10">
              <Kicker index="05">{l.finishes}</Kicker>
              <Reveal as="ul" stagger={0.05} className="mt-8 flex flex-wrap gap-2">
                {d.finishes.map((x) => (
                  <li key={x} className="border border-line px-3 py-2 text-sm text-mist transition-colors duration-500 hover:border-brand/50 hover:text-bone">
                    {x}
                  </li>
                ))}
              </Reveal>
              <p className="eyebrow mt-6 text-ash">* {l.finishesNote}</p>
            </div>
          </div>
        </section>
      )}

      {/* ———————————————— sample request */}
      <section className="grain relative isolate overflow-hidden border-y border-line">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_85%_100%,rgba(143,0,0,0.55),transparent_70%)]" />
        <div className="container-x grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-7">
            <SplitText lines={[l.sampleTitle]} className="display text-fluid-xl" />
          </div>
          <div className="flex flex-col justify-end gap-8 md:col-span-4 md:col-start-9">
            <p className="text-base leading-relaxed text-mist">{l.sampleText}</p>
            <ButtonLink href={sampleHref} variant="solid" className="self-start">
              {l.sampleCta}
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ———————————————— same group */}
      {siblings.length > 0 && (
        <section aria-labelledby="related-title" className="py-20 md:py-28">
          <div className="container-x">
            <Kicker index="06">
              <span id="related-title">{l.related}</span>
            </Kicker>
            <Reveal
              as="ul"
              stagger={0.06}
              className={cn("mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5", siblings.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4")}
            >
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link href={localePath(lang, fabricPath(s.slug))} data-cursor={l.view} className="group block">
                    <FabricSwatch weave={s.weave} image={swatches[s.slug]} className="aspect-[4/3]" />
                    <p className="display mt-4 text-[clamp(1.1rem,1.4vw,1.4rem)] leading-[0.95] transition-colors duration-500 group-hover:text-brand">
                      {s.title}
                    </p>
                  </Link>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ———————————————— previous / next */}
      <nav aria-label={f.title} className="grid border-t border-line md:grid-cols-2">
        {[
          { fab: prev, label: l.prev, dir: "prev" as const },
          { fab: next, label: l.next, dir: "next" as const },
        ].map(({ fab, label, dir }) => (
          <Link
            key={dir}
            href={localePath(lang, fabricPath(fab.slug))}
            rel={dir}
            data-cursor={l.view}
            className={cn(
              "group relative isolate flex items-center gap-6 overflow-hidden px-[var(--gutter)] py-10 md:px-10 md:py-14",
              dir === "next" ? "border-t border-line md:flex-row-reverse md:border-l md:border-t-0 md:text-right" : "",
            )}
          >
            <Glow at="bottom" className="opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
            <FabricSwatch weave={fab.weave} image={swatches[fab.slug]} sizes="120px" className="h-20 w-20 shrink-0 md:h-28 md:w-28" />
            <div className="min-w-0">
              <p className="eyebrow text-ash">
                {dir === "prev" ? <span className="text-brand">← </span> : null}
                {label}
                {dir === "next" ? <span className="text-brand"> →</span> : null}
              </p>
              <p className="display mt-3 text-[clamp(1.5rem,2.6vw,2.6rem)] leading-[0.95] transition-colors duration-500 group-hover:text-brand">{fab.title}</p>
            </div>
          </Link>
        ))}
      </nav>

      <JsonLdScript
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: fabric.title,
            description: d.lead,
            url: absoluteUrl(localePath(lang, fabricPath(slug))),
            about: fabric.materials.map((m) => ({ "@type": "Thing", name: m })),
          },
          breadcrumbSchema([
            { name: dict.nav.home, url: localePath(lang, "/") },
            { name: f.title, url: fabricsHref },
            { name: fabric.title, url: localePath(lang, fabricPath(slug)) },
          ]),
        ]}
      />
    </>
  );
}
