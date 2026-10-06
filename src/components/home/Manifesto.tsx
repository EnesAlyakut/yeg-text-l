"use client";

import { Fragment, useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Props = { text: string; index: string; label: string; title?: string };

/**
 * Long, structured texts (a line ending with ":" splits them into "what we have" and "what we do")
 * get an editorial layout; short statements keep the pinned word-by-word reveal.
 */
export function Manifesto(props: Props) {
  const lines = props.text
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean);
  const pivot = lines.findIndex((l) => l.endsWith(":"));
  if (lines.length >= 5 && pivot > 1 && pivot < lines.length - 2) {
    return (
      <ManifestoEditorial
        {...props}
        intro={lines[0]}
        assets={lines.slice(1, pivot)}
        turn={lines[pivot]}
        principles={lines.slice(pivot + 1, -1)}
        closing={lines[lines.length - 1]}
      />
    );
  }
  return <ManifestoPinned {...props} lines={lines} />;
}

/** "YEG Textile" stays in Latin casing inside uppercase labels (Turkish rules would print TEXTİLE). */
function BrandSafe({ text }: { text: string }) {
  return text.split(/(YEG Textile)/i).map((part, i) =>
    /^YEG Textile$/i.test(part) ? (
      <span key={i} lang="en">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** Words as separate spans so they can be animated one by one; spaces stay real text. */
function Words({ text, attr, className }: { text: string; attr: "data-lead" | "data-word"; className?: string }) {
  return text.split(/\s+/).map((word, i) => (
    <Fragment key={i}>
      <span {...{ [attr]: "" }} className={className}>
        {word}
      </span>{" "}
    </Fragment>
  ));
}

function EditorialColumn({ lead, flow, className }: { lead: string; flow: string; className?: string }) {
  return (
    <div data-col className={cn("text-[clamp(1.2rem,1.7vw,1.6rem)] leading-[1.5] tracking-[-0.008em]", className)}>
      <p className="text-balance font-medium text-bone">
        <Words text={lead} attr="data-lead" className="inline-block will-change-transform" />
      </p>
      <p data-flow className="mt-4 text-bone/70 md:mt-5">
        <Words text={flow} attr="data-word" />
      </p>
    </div>
  );
}

function ManifestoEditorial({
  label,
  title,
  intro,
  assets,
  turn,
  principles,
  closing,
}: Props & { intro: string; assets: string[]; turn: string; principles: string[]; closing: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Headline rises out of its mask.
        gsap.from("[data-why]", { yPercent: 105, duration: 1.3, ease: "expo.out", scrollTrigger: { trigger: "[data-why]", start: "top 88%", once: true } });

        gsap.utils.toArray<HTMLElement>("[data-col]").forEach((col, ci) => {
          // Lead-in: words drift up out of a blur.
          gsap.from(col.querySelectorAll("[data-lead]"), {
            yPercent: 70,
            autoAlpha: 0,
            filter: "blur(10px)",
            duration: 1,
            delay: ci * 0.15,
            ease: "expo.out",
            stagger: 0.035,
            scrollTrigger: { trigger: col, start: "top 82%", once: true },
          });
          // The flowing sentence lights up word by word as it scrolls through the screen.
          gsap.fromTo(
            col.querySelectorAll("[data-word]"),
            { opacity: 0.12 },
            { opacity: 1, stagger: 0.06, ease: "none", scrollTrigger: { trigger: col.querySelector("[data-flow]"), start: "top 85%", end: "bottom 55%", scrub: 0.6 } },
          );
        });

        // Each principle lights up as it crosses the middle of the screen, its red dash drawing in.
        gsap.utils.toArray<HTMLElement>("[data-principle]").forEach((el) => {
          const st = { trigger: el, start: "top 80%", end: "top 50%", scrub: true };
          gsap.fromTo(el, { opacity: 0.18 }, { opacity: 1, ease: "none", scrollTrigger: st });
          gsap.fromTo(el.querySelector("[data-dash]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: st });
        });
        // Closing: the rule fills red, the sentence lights up word by word, the mark turns into place.
        const closing = { trigger: "[data-closing]", start: "top 85%", end: "bottom 65%", scrub: 0.6 };
        gsap.fromTo("[data-closing-rule]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { ...closing, end: "top 45%" } });
        gsap.fromTo("[data-closing-title]", { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, ease: "none", scrollTrigger: { ...closing, end: "top 50%" } });
        gsap.fromTo("[data-cword]", { opacity: 0.12 }, { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: closing });
        gsap.fromTo(
          "[data-closing-mark]",
          { rotate: -10, scale: 0.75, autoAlpha: 0 },
          { rotate: 0, scale: 1, autoAlpha: 1, ease: "none", scrollTrigger: closing },
        );
        gsap.fromTo("[data-closing-sign]", { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, ease: "none", scrollTrigger: { ...closing, start: "top 60%" } });
        gsap.fromTo("[data-closing-glow]", { opacity: 0.35, scale: 0.9 }, { opacity: 0.9, scale: 1.15, duration: 2.4, ease: "sine.inOut", repeat: -1, yoyo: true });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative isolate overflow-hidden bg-ink py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_85%_35%,rgba(143,0,0,0.22),transparent_75%)]" />

      <div className="container-x">
        {/* The question is the headline; the answer (title) closes the section. */}
        {/* Mask with headroom so the dots of İ are never clipped */}
        <h2 className="display max-w-5xl overflow-hidden pt-[0.12em] text-fluid-xl text-brand">
          <span data-why className="block will-change-transform">
            <BrandSafe text={label} />
          </span>
        </h2>

        {/* Two columns with the same rhythm: an emphasised lead-in, then one flowing sentence */}
        <div className="mt-10 grid gap-16 md:mt-14 md:grid-cols-12 md:gap-8">
          <EditorialColumn lead={intro} flow={assets.join(" ")} className="md:col-span-5" />
          {/* What matters more: the principles as a list, each lighting up as it crosses the screen */}
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-base leading-relaxed text-mist">{turn}</p>
            <ol className="mt-10 space-y-5 md:space-y-6">
              {principles.map((line) => (
                <li
                  key={line}
                  data-principle
                  className="flex items-baseline gap-4 text-[clamp(1.35rem,2.5vw,2.4rem)] font-medium leading-[1.12] tracking-[-0.016em] text-bone"
                >
                  <span data-dash aria-hidden className="block h-[2px] w-6 shrink-0 origin-left translate-y-[-0.3em] bg-brand" />
                  {line}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div data-closing className="relative mt-20 grid items-end gap-12 pt-12 md:mt-32 md:grid-cols-12 md:gap-8 md:pt-20">
          <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" />
          <span data-closing-rule aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-brand via-brand to-brand/0" />

          <div className="md:col-span-9">
            {title && (
              <h3 data-closing-title className="display mb-6 flex items-center gap-4 text-[clamp(1.6rem,2.6vw,2.6rem)] leading-none text-brand md:mb-8">
                <span aria-hidden className="h-[2px] w-10 bg-brand" />
                {title}
              </h3>
            )}
            <p className="text-balance text-[clamp(1.85rem,4.2vw,4.4rem)] font-medium leading-[1.04] tracking-[-0.022em]">
              {closing.split(/\s+/).map((word, i) => (
                <span key={i} data-cword className="inline-block pr-[0.22em]">
                  {word}
                </span>
              ))}
            </p>
            <p data-closing-sign className="eyebrow mt-8 flex items-center gap-3 text-ash">
              <span aria-hidden className="h-px w-8 bg-brand" />
              <span lang="en">YEG TEXTILE</span>
            </p>
          </div>

          <div className="relative flex md:col-span-3 md:justify-end">
            <div className="relative w-24 md:w-32">
              <div data-closing-glow aria-hidden className="absolute -inset-10 rounded-full bg-brand/30 blur-[50px]" />
              <div data-closing-mark className="relative drop-shadow-[0_0_30px_rgba(216,0,0,0.45)]">
                <Logo monogramClassName="text-brand" wordmarkClassName="text-bone" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pinned statement whose words light up one by one as the user scrolls. */
function ManifestoPinned({ label, title, lines }: Props & { lines: string[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", scrub: 0.6, pin: true },
        });
        tl.fromTo("[data-word]", { opacity: 0.12 }, { opacity: 1, stagger: 0.12, ease: "none" }).fromTo(
          "[data-mark]",
          { rotate: -8, scale: 0.8, opacity: 0 },
          { rotate: 0, scale: 1, opacity: 1, ease: "none" },
          0,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink">
      {/* Soft brand glow behind the mark */}
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-[120px]" />

      <div className="container-x relative flex flex-col items-center text-center">
        <div data-mark className="w-24 drop-shadow-[0_0_30px_rgba(216,0,0,0.35)] md:w-32">
          <Logo monogramClassName="text-brand" wordmarkClassName="text-bone" />
        </div>
        <p className="eyebrow mt-8 flex items-center gap-3 text-ash">
          <span className="h-px w-8 bg-line" />
          <BrandSafe text={label} />
          <span className="h-px w-8 bg-line" />
        </p>
        {title && <h2 className="display mt-6 text-fluid-lg text-brand">{title}</h2>}
        <div className="mt-8 max-w-4xl text-balance text-[clamp(1.35rem,2.4vw,2.4rem)] font-medium leading-[1.2] tracking-[-0.008em]">
          {lines.map((line, li) => (
            <p key={li}>
              {line.split(/\s+/).map((w, i) => (
                <span key={i} data-word className="inline-block pr-[0.25em]">
                  {w}
                </span>
              ))}
            </p>
          ))}
        </div>
        <span aria-hidden className="mt-10 block h-12 w-px bg-gradient-to-b from-brand to-transparent" />
      </div>
    </section>
  );
}
