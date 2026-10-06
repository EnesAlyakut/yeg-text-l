import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { SectionHashScroll } from "@/components/site/SectionHashScroll";
import { AboutIndex } from "@/components/about/AboutIndex";
import { RevealLines } from "@/components/about/RevealLines";
import { Rich } from "@/components/about/Rich";
import { Marquee } from "@/components/home/Marquee";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { ButtonLink } from "@/components/site/Button";
import { Glow } from "@/components/site/Glow";
import { JsonLdScript } from "@/components/site/JsonLdScript";
import { loadAbout } from "@/lib/page-content";
import { aboutMenu, type AboutSectionId } from "@/content/about-sections";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { coverFactor, scaleSizes, viewportFrameSizes } from "@/lib/images";
import { breadcrumbSchema, buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: PageProps<"/[lang]/about">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { a, img } = await loadAbout(lang);
  return buildMetadata({ lang, path: "/about", title: a.meta.title, description: a.meta.description, image: img.hero });
}

/* ———————————————————————————————— page-scoped building blocks */

type Menu = ReturnType<typeof aboutMenu>;

const GLOWS = {
  left: "bg-[radial-gradient(45%_40%_at_0%_15%,rgba(143,0,0,0.16),transparent_75%)]",
  right: "bg-[radial-gradient(45%_40%_at_100%_20%,rgba(143,0,0,0.16),transparent_75%)]",
};

/**
 * Anchor target. scroll-margin keeps the heading clear of the fixed header.
 * `rule` draws a hairline that turns red in the middle; `glow` adds a faint red light in a corner.
 */
function Section({ id, className, children, rule, glow }: { id: AboutSectionId; className?: string; children: ReactNode; rule?: boolean; glow?: keyof typeof GLOWS }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} tabIndex={-1} className={cn("relative isolate scroll-mt-[var(--nav-h)] outline-none", className)}>
      {glow && <div aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", GLOWS[glow])} />}
      {rule && <span aria-hidden className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand/55 to-transparent" />}
      {children}
    </section>
  );
}

/** —— SECTION LABEL as a solid red tag (same look as the homepage's AR-GE tag) */
function Kicker({ menu, id, className }: { menu: Menu; id: AboutSectionId; className?: string }) {
  const item = menu.items.find((i) => i.id === id)!;
  return (
    <p className={cn("flex items-center gap-4", className)}>
      <span aria-hidden className="h-[2px] w-10 bg-brand" />
      <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.35)]">
        {item.label}
      </span>
    </p>
  );
}

function Title({ id, lines, className }: { id: AboutSectionId; lines: string[]; className?: string }) {
  return (
    <RevealLines
      as="h2"
      id={`${id}-title`}
      lines={lines.map((l, i) => (
        <Rich key={i} text={l} upper />
      ))}
      className={cn("display mt-6 text-fluid-xl", className)}
    />
  );
}

/* Hairline grid cells (1 → 2 → 4 columns): left rule + gutter only where a neighbour sits to the left. */
const cell = ["sm:pr-6", "sm:border-l sm:px-6 lg:px-8", "sm:pr-6 lg:border-l lg:px-8", "sm:border-l sm:px-6 lg:px-8"];
const cellDot =["left-0", "left-0 sm:-left-[5px]", "left-0 lg:-left-[5px]", "left-0 sm:-left-[5px]"];

const lead = "text-[clamp(1.15rem,1.6vw,1.5rem)] leading-snug tracking-[-0.004em] text-bone";
const body = "text-base leading-relaxed text-mist";
/* Reading paragraphs, the size used across the reworked sections */
const para = "text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/85";
const statement ="text-[clamp(1.35rem,2.4vw,2.25rem)] font-medium leading-[1.15] tracking-[-0.012em] text-bone";

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { a, img } = await loadAbout(lang);
  const dict = getDictionary(lang);
  const menu = aboutMenu(lang);

  return (
    <>
      <SectionHashScroll />

      {/* ———————————————— intro */}
      <header className="container-x relative isolate pt-[calc(var(--nav-h)+5rem)] md:pt-[calc(var(--nav-h)+8rem)]">
        <Glow className="-top-[var(--nav-h)]" />
        <p className="eyebrow flex items-center gap-3 text-ash">
          <span aria-hidden className="h-px w-8 bg-brand" />
          {a.hero.eyebrow}
        </p>
        <SplitText as="h1" trigger="mount" lines={[a.hero.title]} className="display mt-6 text-fluid-hero" />
        {/* Small chapter links right under the title */}
        <AboutIndex label={menu.onThisPage} items={menu.items} className="mt-8 max-w-4xl md:mt-10" />
      </header>

      <div className="mt-14 md:mt-20">
        <ParallaxImage
          src={img.hero.url}
          alt={a.hero.imageAlt}
          width={img.hero.width}
          height={img.hero.height}
          blur={img.hero.blur}
          position={img.hero.position}
          speed={16}
          preload
          className="h-[70svh] w-full md:h-[92svh]"
        />
      </div>

      {/* ———————————————— 01 Biz Kimiz — large title + two columns */}
      <Section id="biz-kimiz" glow="left" className="container-x py-24 md:py-36">
        <Kicker menu={menu} id="biz-kimiz" />
        <Title id="biz-kimiz" lines={a.who.title} className="max-w-5xl text-fluid-hero" />

        {/* One column, read top to bottom: who we are → where it started → founding → today */}
        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
          {/* Every paragraph in the same size, colour and spacing; only the years are marked in red */}
          <Reveal stagger={0.1} className="space-y-7 md:col-span-6 md:pr-6">
            {[a.who.lead, a.who.start, a.who.founded, ...a.who.paragraphs].map((p) => (
              <p key={p.slice(0, 24)} className="text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/85">
                <Rich text={p} />
              </p>
            ))}
          </Reveal>
          {/* The studio beside the text: same width as the text column and exactly as tall as it */}
          <div className="relative md:col-span-6">
            <ParallaxImage
              src={img.studio.url}
              alt={{ tr: "YEG Textile atölyesi", en: "The YEG Textile studio", fr: "L’atelier YEG Textile" }[lang]}
              width={img.studio.width}
              height={img.studio.height}
              blur={img.studio.blur}
              position={img.studio.position}
              sizes="(min-width: 768px) 50vw, 100vw"
              frameAspect={5 / 6}
              className="aspect-[4/5] w-full md:absolute md:inset-0 md:aspect-auto md:h-full"
            />
          </div>
        </div>
      </Section>

      {/* ———————————————— 02 Hikâyemiz — timeline */}
      <Section id="hikayemiz" rule glow="right" className="border-t border-line bg-coal py-24 md:py-36">
        <div className="container-x">
          <Kicker menu={menu} id="hikayemiz" />
          <Title id="hikayemiz" lines={a.story.title} className="max-w-4xl" />

          {/* Same proportions as "Who we are": text and photo in two equal columns, the photo as tall as the text */}
          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 md:pr-6">
              <Reveal>
                <p className={lead}>{a.story.intro}</p>
              </Reveal>
              <ol className="relative mt-10 space-y-8 border-l border-line pl-8 md:mt-12">
                {a.story.steps.map((p, i) => (
                  <li key={p.slice(0, 24)} className="relative">
                    <span
                      aria-hidden
                      className={cn(
                        "absolute -left-8 top-[0.6em] block size-2.5 -translate-x-1/2 rounded-full",
                        i === 0 ? "border border-brand bg-coal" : "bg-brand",
                      )}
                    />
                    <Reveal y={24}>
                      <p className="text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/85">{p}</p>
                    </Reveal>
                  </li>
                ))}
              </ol>
              <div className="relative mt-10 pl-8 md:mt-12">
                <span aria-hidden className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-line to-brand" />
                <RevealLines lines={[<Rich key="e" text={a.story.emphasis} />]} className={statement} />
              </div>
            </div>

            <div className="relative md:col-span-6">
              <ParallaxImage
                src={img.portraitA.url}
                alt=""
                width={img.portraitA.width}
                height={img.portraitA.height}
                blur={img.portraitA.blur}
                position={img.portraitA.position}
                sizes="(min-width: 768px) 50vw, 100vw"
                frameAspect={5 / 6}
                className="aspect-[4/5] w-full md:absolute md:inset-0 md:aspect-auto md:h-full"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ———————————————— 03 Marka Bakışı — editorial typography */}
      <Section id="marka-bakisi" className="overflow-hidden py-24 md:py-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_35%,rgba(143,0,0,0.2),transparent_70%)]"
        />
        <div className="container-x relative">
          <Kicker menu={menu} id="marka-bakisi" />
          <Title id="marka-bakisi" lines={a.brand.title} className="max-w-4xl" />

          {/* One reading column on the left (intro → the crowd → who it is for), the photo beside it at the same height */}
          <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-6 md:pr-6">
              <Reveal stagger={0.12} className="space-y-7">
                {a.brand.intro.map((p) => (
                  <p key={p.slice(0, 24)} className="text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/85">
                    {p}
                  </p>
                ))}
              </Reveal>
              <Reveal stagger={0.12} className="mt-12 space-y-6 md:mt-14">
                <p className={statement}>{a.brand.crowd}</p>
                <p className={statement}>{a.brand.selective}</p>
              </Reveal>
              <Reveal stagger={0.12} className="mt-12 space-y-7 md:mt-14">
                {a.brand.audience.map((p) => (
                  <p key={p.slice(0, 24)} className="text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/85">
                    {p}
                  </p>
                ))}
                <p className={statement}>{a.brand.ownLine}</p>
              </Reveal>
            </div>
            <div className="relative md:col-span-6">
              <ParallaxImage
                src={img.portraitB.url}
                alt=""
                width={img.portraitB.width}
                height={img.portraitB.height}
                blur={img.portraitB.blur}
                position={img.portraitB.position}
                sizes="(min-width: 768px) 50vw, 100vw"
                frameAspect={3 / 4}
                className="aspect-[4/5] w-full md:absolute md:inset-0 md:aspect-auto md:h-full"
              />
            </div>
          </div>
        </div>

        {/* "Not a purchase, a stance" over a soft red glow that spreads full width behind it */}
        {/* Full-bleed solid red band; the red accent word turns black so it still reads */}
        <div className="grain relative isolate -mb-24 mt-20 bg-brand py-16 md:-mb-40 md:mt-28 md:py-24 [&_.text-brand]:text-ink">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),transparent_35%,transparent_65%,rgba(0,0,0,0.22))]" />
        <div className="container-x relative">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <RevealLines
              lines={a.brand.stance.map((l, i) => (
                <Rich key={i} text={l} upper />
              ))}
              className="display text-[clamp(2.25rem,6vw,6.5rem)] md:col-span-7"
            />
            <Reveal className="md:col-span-4 md:col-start-9 md:self-end">
              <p className="text-base leading-relaxed text-white/90 md:text-lg">{a.brand.outro}</p>
            </Reveal>
          </div>
        </div>
        </div>
      </Section>

      {/* ———————————————— 04 Şirket Olarak YEG — text + big questions */}
      <Section id="sirket-olarak-yeg" rule glow="left" className="border-t border-line bg-coal py-24 md:py-36">
        <div className="container-x">
          {/* Title, then the text on the left beneath it */}
          <Kicker menu={menu} id="sirket-olarak-yeg" />
          <Title id="sirket-olarak-yeg" lines={a.company.title} className="max-w-4xl" />
          <Reveal stagger={0.1} className="mt-12 max-w-3xl space-y-7 md:mt-16">
            <p className={para}>{a.company.intro}</p>
            <p className={statement}>{a.company.strength}</p>
            {a.company.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className={para}>
                {p}
              </p>
            ))}
            {a.company.before.map((p, i) => (
              <p key={p.slice(0, 24)} className={i === 1 ? cn(para, "text-bone") : para}>
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal as="ul" stagger={0.08} className="mt-16 border-t border-line md:mt-24">
            {a.company.questions.map((q) => (
              <li key={q} className="group border-b border-line">
                {/* All left-aligned; the quote marks sit right against the words */}
                <p className="py-5 text-[clamp(1.4rem,3.4vw,3.4rem)] font-medium leading-[1.05] tracking-[-0.019em] text-bone/90 transition-[color,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 group-hover:text-bone md:py-7">
                  <span aria-hidden className="text-brand">“</span>
                  {q}
                  <span aria-hidden className="text-brand">”</span>
                </p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-14 grid md:mt-20 md:grid-cols-12">
            <p className={cn(lead, "flex gap-5 md:col-span-7")}>
              <span aria-hidden className="mt-[0.7em] block h-px w-10 shrink-0 bg-brand" />
              {a.company.outro}
            </p>
          </Reveal>
        </div>
      </Section>

      {/* Solid red band; the separator dots turn black so they still show */}
      <section
        className="grain relative isolate overflow-hidden bg-brand py-4 md:py-5 [&_.bg-brand]:bg-ink"
        aria-label={a.capabilities.join(", ")}
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.22),transparent_35%,transparent_65%,rgba(0,0,0,0.22))]" />
        <Marquee items={a.capabilities} duration={50} size="sm" />
      </section>

      {/* ———————————————— 05 Üretim Kapasitesi — big numbers */}
      <Section id="uretim-kapasitesi" className="overflow-hidden py-24 md:py-36">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_10%_30%,rgba(143,0,0,0.18),transparent_70%)]"
        />
        <div className="container-x relative">
          <Kicker menu={menu} id="uretim-kapasitesi" />
          <Title id="uretim-kapasitesi" lines={a.capacity.title} className="max-w-6xl" />

          <Reveal as="ul" stagger={0.08} className="mt-14 grid border-t border-line sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {a.capacity.stats.map((s, i) =>
              i === 0 ? (
                <li
                  key={s.label}
                  className="flex flex-col gap-4 border-b border-line py-10 sm:col-span-2 md:flex-row md:items-end md:justify-between md:py-14 lg:col-span-4"
                >
                  <p className="display text-[clamp(4.5rem,17vw,16rem)] leading-[0.8] text-brand">{s.value}</p>
                  <p className="flex flex-col gap-2 md:items-end md:pb-3 md:text-right">
                    <span className="eyebrow text-ash">{a.capacity.unit}</span>
                    <span className="text-[clamp(1.4rem,2.6vw,2.5rem)] font-medium tracking-[-0.016em]">{s.label}</span>
                  </p>
                </li>
              ) : (
                <li key={s.label} className={cn("group relative border-b border-line py-10", cell[i - 1])}>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute top-0 block h-px w-8 bg-brand transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-24",
                      i - 1 === 0 ? "left-0" : i - 1 === 2 ? "left-0 lg:left-8" : "left-0 sm:left-6 lg:left-8",
                    )}
                  />
                  <p className="display text-[clamp(3.25rem,6.4vw,6.5rem)] leading-[0.85]">{s.value}</p>
                  <p className="eyebrow mt-3 text-ash">{a.capacity.unit}</p>
                  <p className="mt-5 text-base font-medium tracking-normal text-bone/90">{s.label}</p>
                </li>
              ),
            )}
          </Reveal>

          <div className="mt-16 grid gap-10 md:mt-24 md:grid-cols-12 md:gap-8">
            <Reveal stagger={0.1} className="space-y-6 md:col-span-5">
              {a.capacity.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium leading-[1.55] tracking-[-0.01em] text-bone">
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal className="md:col-span-6 md:col-start-7">
              <p className="border-l-2 border-brand pl-6 text-[clamp(1.5rem,3vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.016em] md:pl-10">
                <Rich text={a.capacity.emphasis} />
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ———————————————— 06 Üretim Alanları — editorial list */}
      <Section id="uretim-alanlari" rule glow="right" className="border-t border-line bg-coal py-24 md:py-36">
        <div className="container-x">
          <Kicker menu={menu} id="uretim-alanlari" />
          <Title id="uretim-alanlari" lines={a.areas.title} className="max-w-4xl" />

          {/* Four cards: a photo per production area, the name and its lines beneath */}
          <Reveal as="ul" stagger={0.08} className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
            {a.areas.items.map((area, i) => {
              const areaPhotos = [img.areaDenim, img.areaKnit, img.areaKnitwear, img.areaWoven];
              const photo = areaPhotos[i % areaPhotos.length];
              return (
                <li key={area.name} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-graphite">
                    <Image
                      src={photo.url}
                      alt={area.name}
                      fill
                      sizes={scaleSizes("(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw", coverFactor(photo, 4 / 5, 1.06))}
                      quality={88}
                      placeholder={photo.blur ? "blur" : "empty"}
                      blurDataURL={photo.blur ?? undefined}
                      className="object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                      style={{ objectPosition: photo.position }}
                    />
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                    <span aria-hidden className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
                  </div>
                  <h3 className="display mt-6 text-[clamp(2.4rem,3.4vw,3.4rem)] leading-[0.85] transition-colors duration-500 group-hover:text-brand">{area.name}</h3>
                  <div className="mt-4 space-y-2">
                    {area.lines.map((line, j) => (
                      <p key={line} className={j === 0 ? "text-[clamp(1.05rem,1.3vw,1.2rem)] font-medium leading-snug text-bone" : "text-base leading-relaxed text-bone/75"}>
                        {line}
                      </p>
                    ))}
                  </div>
                </li>
              );
            })}
          </Reveal>

          <Reveal className="mt-14 grid md:mt-20 md:grid-cols-12">
            <p className="max-w-3xl text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.55] text-bone md:col-span-8">{a.areas.outro}</p>
          </Reveal>
        </div>
      </Section>

      {/* ———————————————— 08 Kalite — certificates */}
      <Section id="kalite" rule glow="right" className="border-t border-line bg-coal py-24 md:py-36">
        <div className="container-x">
          {/* Title, then the text on the left beneath it */}
          <Kicker menu={menu} id="kalite" />
          <Title id="kalite" lines={a.quality.title} className="max-w-4xl" />
          <Reveal stagger={0.1} className="mt-12 max-w-3xl space-y-7 md:mt-16">
            {a.quality.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium leading-[1.55] tracking-[-0.01em] text-bone">
                {p}
              </p>
            ))}
            <p className={statement}>
              <Rich text={a.quality.purpose} />
            </p>
          </Reveal>

          <Reveal className="mt-16 md:mt-24">
            <p className="flex items-center gap-4 text-base text-bone/90">
              <span aria-hidden className="block h-px w-8 shrink-0 bg-brand" />
              {a.quality.certsIntro}
            </p>
          </Reveal>

          {/* Certificates as rubber stamps: double red ring, the issuer text running round, slightly tilted */}
          <Reveal as="ul" stagger={0.06} className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-6">
            {a.quality.certs.map((c, i) => (
              <li key={c.code} className="group flex flex-col items-center text-center">
                <div
                  className="relative aspect-square w-full max-w-[11rem] text-brand transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-0 group-hover:scale-105"
                  style={{ transform: `rotate(${[-8, 6, -4, 9, -6, 4][i % 6]}deg)` }}
                >
                  <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 size-full">
                    <defs>
                      <path id={`stamp-ring-${i}`} d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                    </defs>
                    <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
                    <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <circle cx="100" cy="100" r="56" fill="none" stroke="currentColor" strokeWidth="1.2" />
                    <text fill="currentColor" fontSize="11.5" letterSpacing="3" fontFamily="var(--font-mono)">
                      <textPath href={`#stamp-ring-${i}`} startOffset="0">
                        YEG TEXTILE · CERTIFIED · YEG TEXTILE · CERTIFIED ·
                      </textPath>
                    </text>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-[22%]">
                    <p className="display text-[clamp(1.05rem,1.4vw,1.35rem)] leading-[0.95]" lang="en">
                      {c.code}
                    </p>
                  </div>
                </div>
                {/* Under the stamp: which certificate it is, then what it covers */}
                <p className="display mt-6 text-[clamp(1.35rem,1.7vw,1.7rem)] leading-none text-bone" lang="en">
                  {c.code}
                </p>
                <p className="mt-2.5 max-w-[14rem] text-[clamp(0.95rem,1.1vw,1.1rem)] leading-snug text-bone/80">{c.label}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-12 grid md:grid-cols-12">
            <p className={cn(body, "md:col-span-6")}>{a.quality.outro}</p>
          </Reveal>
        </div>
      </Section>

      {/* ———————————————— 09 İş Yapma Biçimimiz — minimal text flow */}
      <Section id="is-yapma-bicimimiz" rule glow="left" className="border-t border-line py-24 md:py-40">
        <div className="container-x grid md:grid-cols-12">
          <div className="md:col-span-9">
            <Kicker menu={menu} id="is-yapma-bicimimiz" />
            <Title id="is-yapma-bicimimiz" lines={a.conduct.title} />

            <Reveal className="mt-14 md:mt-20">
              <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.008em] font-medium text-bone">{a.conduct.lead}</p>
            </Reveal>

            <Reveal as="ul" stagger={0.08} className="mt-10 space-y-5">
              {a.conduct.commitments.map((c) => (
                <li key={c} className="flex gap-5 text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.008em] text-bone/90">
                  <span aria-hidden className="mt-[0.75em] block h-px w-6 shrink-0 bg-brand" />
                  {c}
                </li>
              ))}
            </Reveal>

            <Reveal stagger={0.1} className="mt-12 space-y-6">
              <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.008em] text-bone/90">{a.conduct.honesty}</p>
              <div className="space-y-2 border-y border-line py-8">
                <p className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.008em] text-ash">{a.conduct.easy}</p>
                <p className="text-[clamp(1.5rem,2.5vw,2.25rem)] font-medium leading-snug tracking-[-0.012em] text-brand">{a.conduct.matters}</p>
              </div>
              {a.conduct.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className="text-[clamp(1.25rem,2vw,1.75rem)] leading-snug tracking-[-0.008em] text-bone/90">
                  {p}
                </p>
              ))}
            </Reveal>

            <RevealLines
              lines={[<Rich key="e" text={a.conduct.emphasis} upper />]}
              className="display mt-16 text-[clamp(1.9rem,3.8vw,3.9rem)] md:mt-24"
            />
          </div>
        </div>
      </Section>

      {/* ———————————————— 10 Uluslararası Yapılanma — locations */}
      {/* Full-width export photo between the two sections (set in the admin), slightly faded and melting into black above and the section below */}
      {img.global && (
        <div className="relative isolate w-full overflow-hidden bg-ink" style={{ aspectRatio: `${img.global.width} / ${img.global.height}`, maxHeight: "80svh" }}>
          <Image
            src={img.global.url}
            alt={{ tr: "Türkiye'den dünyaya YEG Textile", en: "YEG Textile, from Türkiye to the world", fr: "YEG Textile, de la Turquie au monde" }[lang]}
            fill
            sizes="100vw"
            quality={95}
            placeholder={img.global.blur ? "blur" : "empty"}
            blurDataURL={img.global.blur ?? undefined}
            className="object-cover opacity-75"
            style={{ objectPosition: img.global.position }}
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,rgba(0,0,0,0.25)_22%,rgba(0,0,0,0.1)_55%,#0a0a0a_100%)]" />
        </div>
      )}

      <Section id="uluslararasi" rule glow="right" className="overflow-hidden border-t border-line bg-coal py-24 md:py-36">
        <div className="container-x">
          <Kicker menu={menu} id="uluslararasi" />
          <Title id="uluslararasi" lines={a.global.title} className="text-fluid-hero" />

          {/* One readable column on the left */}
          <Reveal stagger={0.1} className="mt-12 max-w-3xl space-y-7 md:mt-16">
            {/* All paragraphs in one size, a step up from the default reading size */}
            {a.global.intro.map((p) => (
              <p key={p} className="text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.55] text-bone">
                {p}
              </p>
            ))}
            {a.global.milestones.map((p) => (
              <p key={p.slice(0, 24)} className="text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.55] text-bone">
                <Rich text={p} />
              </p>
            ))}
            <p className="text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.55] text-bone">{a.global.today}</p>
          </Reveal>

          <Reveal as="ul" stagger={0.08} className="mt-16 grid border-t border-line sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
            {a.global.locations.map((loc, i) => (
              <li key={loc.city} className={cn("group relative border-b border-line py-10", cell[i])}>
                <span
                  aria-hidden
                  className={cn(
                    "absolute -top-[5px] block size-[9px] rounded-full bg-brand shadow-[0_0_0_4px_rgba(216,0,0,0.15)] transition-shadow duration-500 group-hover:shadow-[0_0_0_7px_rgba(216,0,0,0.2)]",
                    cellDot[i],
                  )}
                />
                <p className="font-mono text-[0.625rem] tracking-[0.14em] text-ash">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-6 text-[clamp(2.4rem,4vw,4rem)] leading-[0.85]" lang={loc.lang}>
                  {loc.city}
                </h3>
                <p className="eyebrow mt-3 text-brand" lang={loc.lang}>
                  {loc.country}
                </p>
                <p className="mt-6 text-base leading-relaxed text-bone/85 md:text-lg">{loc.role}</p>
              </li>
            ))}
          </Reveal>

          <Reveal className="mt-14 grid md:mt-20 md:grid-cols-12">
            <p className="text-[clamp(1.2rem,1.7vw,1.6rem)] font-medium leading-[1.55] text-bone md:col-span-8">{a.global.outro}</p>
          </Reveal>
        </div>
      </Section>

      {/* ———————————————— 11 Geleceğe Bakış — final */}
      <Section id="gelecege-bakis" rule className="isolate overflow-hidden border-t border-line py-28 md:py-44">
        <div aria-hidden className="absolute inset-0 -z-10 opacity-25">
          <Image src={img.dusk.url} alt="" fill sizes={["(max-width: 767px) 400vw", ...viewportFrameSizes(img.dusk, { vw: 100, vh: 240 })].join(", ")} quality={85} className="object-cover" style={{ objectPosition: img.dusk.position }} />
        </div>
        <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_50%_100%,rgba(143,0,0,0.28),transparent_70%),linear-gradient(to_bottom,#000_0%,rgba(0,0,0,0.75)_45%,rgba(0,0,0,0.6)_100%)]" />

        <div className="container-x">
          <Kicker menu={menu} id="gelecege-bakis" />
          <Title id="gelecege-bakis" lines={a.future.title} className="max-w-6xl" />

          {/* Text on the left, the goals list beside it on the right */}
          <div className="mt-12 grid gap-14 md:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <Reveal stagger={0.1} className="space-y-7">
              {a.future.paragraphs.map((p) => (
                <p key={p.slice(0, 24)} className={para}>
                  {p}
                </p>
              ))}
            </Reveal>
            <Reveal stagger={0.1} className="mt-12 space-y-6 md:mt-14">
              <p className={statement}>
                <Rich text={a.future.grow} />
              </p>
              <p className={para}>{a.future.measure}</p>
            </Reveal>
          </div>

          {/* The goals as a quiet list: a red rule leads each line, which slides a touch on hover */}
          <Reveal as="ul" stagger={0.08} className="self-start border-t border-bone/15 lg:col-span-6">
            {a.future.goals.map((g) => (
              <li key={g} className="group border-b border-bone/15">
                <p className="flex items-center gap-5 py-5 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 md:py-6">
                  <span aria-hidden className="block h-[2px] w-8 shrink-0 bg-brand transition-[width] duration-700 group-hover:w-12" />
                  <span className="display text-[clamp(1.4rem,2.1vw,2.1rem)] leading-[1.05] text-bone/90 transition-colors duration-500 group-hover:text-bone">{g}</span>
                </p>
              </li>
            ))}
          </Reveal>
          </div>

          {/* The closing line on one row, sized to sit with the list */}
          <RevealLines
            lines={[
              <span key="f">
                {a.future.final.map((l, i) => (
                  <Rich key={i} text={l} upper />
                ))}
              </span>,
            ]}
            className="display mt-16 text-[clamp(2rem,4.4vw,4.5rem)] leading-[0.9] md:mt-20"
          />
        </div>
      </Section>

      {/* ———————————————— contact */}
      <section className="container-x grid gap-10 border-t border-line py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-6">
          <SplitText lines={[a.ctaTitle]} className="display text-fluid-xl" />
        </div>
        <div className="flex flex-col justify-end gap-8 md:col-span-5 md:col-start-8">
          <p className="text-base leading-relaxed text-mist">{a.ctaText}</p>
          <ButtonLink href={localePath(lang, "/contact")} variant="solid" className="self-start">
            {a.cta}
          </ButtonLink>
        </div>
      </section>

      <JsonLdScript
        data={breadcrumbSchema([
          { name: dict.nav.home, url: localePath(lang, "/") },
          { name: dict.nav.about, url: localePath(lang, "/about") },
        ])}
      />
    </>
  );
}
