import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { RevealLines } from "@/components/about/RevealLines";
import { Rich } from "@/components/about/Rich";
import { Reveal } from "@/components/motion/Reveal";
import { Glow } from "@/components/site/Glow";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { loadSustainability } from "@/lib/page-content";
import { buildMetadata } from "@/lib/seo";

const plain = (s: string) => s.replace(/\*/g, "").replace(/\s*\n\s*/g, " ");

export async function generateMetadata({ params }: PageProps<"/[lang]/sustainability">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { s, published, image } = await loadSustainability(lang);
  const label = getDictionary(lang).nav.sustainability;
  const title = s.title ? `${plain(s.title)} — ${label}` : label;
  // Out of search results until it is marked as published in the admin
  return buildMetadata({ lang, path: "/sustainability", title, description: s.lead || title, image, noIndex: !published });
}

/** Solid red tag, as on the About, Production and Contact pages. */
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-4">
      <span aria-hidden className="h-[2px] w-10 bg-brand" />
      <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.1rem,1.5vw,1.5rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.35)]">
        {children}
      </span>
    </p>
  );
}

/** Sustainability — every text and the photo come from the admin (Pages → Sustainability). */
export default async function SustainabilityPage({ params }: PageProps<"/[lang]/sustainability">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { s, image } = await loadSustainability(lang);
  const label = getDictionary(lang).nav.sustainability;
  const [statementLead, ...statementLines] = s.statement ?? [];

  return (
    <>
      {/* ———————————————— intro */}
      <header className="container-x relative isolate pb-16 pt-[calc(var(--nav-h)+5rem)] md:pb-24 md:pt-[calc(var(--nav-h)+8rem)]">
        <Glow className="-top-[var(--nav-h)]" />
        <Tag>{label}</Tag>
        {/* Each line of the title (Enter in the admin) is its own row */}
        <RevealLines
          as="h1"
          lines={(s.title || label).split("\n").map((line, i) => (
            <Rich key={i} text={line} upper />
          ))}
          className="display mt-6 max-w-6xl text-fluid-hero leading-[0.88]"
        />
        {s.lead && (
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-3xl text-[clamp(1.35rem,2.2vw,2.1rem)] font-medium leading-[1.25] tracking-[-0.012em] text-bone">{s.lead}</p>
          </Reveal>
        )}
      </header>

      {/* ———————————————— photo, edge to edge, fading into black above and below */}
      {image && (
        <div className="relative isolate w-full overflow-hidden bg-ink" style={{ aspectRatio: `${image.width} / ${image.height}`, maxHeight: "85svh" }}>
          <Image
            src={image.url}
            alt=""
            fill
            sizes="100vw"
            quality={95}
            priority
            placeholder={image.blur ? "blur" : "empty"}
            blurDataURL={image.blur ?? undefined}
            className="object-cover opacity-80"
            style={{ objectPosition: image.position }}
          />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,#000_0%,transparent_22%,transparent_70%,#000_100%)]" />
        </div>
      )}

      {/* ———————————————— approach */}
      {s.paragraphs.length > 0 && (
        <section className="container-x py-20 md:py-28">
          <div className="grid gap-10 md:grid-cols-12 md:gap-8">
            <Reveal className="md:col-span-7">
              <p className="border-l-2 border-brand pl-6 text-[clamp(1.3rem,2vw,1.9rem)] font-medium leading-[1.4] tracking-[-0.01em] text-bone">{s.paragraphs[0]}</p>
            </Reveal>
            {s.paragraphs.length > 1 && (
              <Reveal stagger={0.1} className="space-y-6 md:col-span-7">
                {s.paragraphs.slice(1).map((p) => (
                  <p key={p.slice(0, 32)} className="text-[clamp(1.05rem,1.35vw,1.3rem)] leading-[1.7] text-bone/80">
                    {p}
                  </p>
                ))}
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ———————————————— statement: what we make, how, with what, what remains */}
      {statementLines.length > 0 && (
        <section className="relative isolate overflow-hidden border-t border-line bg-coal py-20 md:py-32">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_100%_100%,rgba(143,0,0,0.35),transparent_70%)]" />
          <div className="container-x">
            {statementLead && (
              <Reveal>
                <p className="text-[clamp(1.2rem,1.8vw,1.7rem)] leading-snug text-mist">{statementLead}</p>
              </Reveal>
            )}
            <Reveal as="ul" stagger={0.12} className="mt-8 space-y-2 md:mt-10">
              {statementLines.map((line) => (
                <li key={line} className="flex items-center gap-5">
                  <span aria-hidden className="h-[3px] w-[clamp(1.5rem,3vw,3rem)] shrink-0 bg-brand" />
                  <span className="display text-[clamp(1.9rem,4.2vw,4.2rem)] leading-[0.95] text-bone">{line}</span>
                </li>
              ))}
            </Reveal>
          </div>
        </section>
      )}

      {/* ———————————————— motto on a full red band */}
      {s.motto && (
        <section className="grain relative isolate overflow-hidden border-y border-brand/40 bg-coal py-16 md:py-24">
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(55%_120%_at_0%_50%,rgba(216,0,0,0.18),transparent_70%)]" />
          {/* One line in the page's language, left-aligned, in red italic serif */}
          <div className="container-x">
            <Reveal>
              {/* Same display face as the closing signature line */}
              <p lang={lang} className="display text-[clamp(2.6rem,5.6vw,6rem)] leading-[0.95] text-brand">
                {s.mottoNote || s.motto}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ———————————————— optional extra blocks (added from the admin) */}
      {s.blocks.length > 0 && (
        <section className="container-x py-20 md:py-28">
          <Reveal as="ul" stagger={0.08} className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {s.blocks.map((b) => (
              <li key={b.title} className="relative bg-ink p-7 md:p-9">
                <span aria-hidden className="absolute left-0 top-0 h-[2px] w-12 bg-brand" />
                <h2 className="display text-[clamp(1.6rem,2.2vw,2.2rem)] leading-none">{b.title}</h2>
                <p className="mt-4 text-base leading-relaxed text-bone/80">{b.text}</p>
              </li>
            ))}
          </Reveal>
        </section>
      )}

      {/* ———————————————— signature */}
      {s.signature && (
        <section className="container-x py-16 md:py-24">
          <Reveal>
            <p className="display flex items-center gap-4 text-[clamp(1.4rem,2.4vw,2.4rem)] leading-tight text-bone">
              <span aria-hidden className="h-[2px] w-10 shrink-0 bg-brand" />
              <Rich text={s.signature} upper />
            </p>
          </Reveal>
        </section>
      )}
    </>
  );
}
