"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { ImageRef } from "@/lib/content-types";
import { coverSizes } from "@/lib/images";
import { SlideLayers, useSlideshow } from "@/components/motion/ImageSlider";

type Props = { image: ImageRef; images?: ImageRef[]; caption: string; words: string[]; eyebrow?: string; title?: string; text?: string };

/** Full-bleed campaign frame that grows from 0.8 to full screen while pinned. With a text, it tells it over the frame. */
export function Statement(props: Props) {
  return props.text?.trim() ? <StatementStory {...props} text={props.text} /> : <StatementWords {...props} />;
}

/** One step per line; a short line (e.g. "Üretimin içinde.") is shown as the big red punchline of the step before it. */
function toSteps(text: string) {
  const steps: { body: string; punch?: string }[] = [];
  for (const line of text.split(/\n+/).map((l) => l.trim()).filter(Boolean)) {
    const prev = steps[steps.length - 1];
    if (line.length < 40 && prev && !prev.punch) prev.punch = line;
    else steps.push({ body: line });
  }
  return steps;
}

function Frame({ image, images = [], caption, shade }: { image: ImageRef; images?: ImageRef[]; caption: string; shade?: boolean }) {
  const slides = [image, ...images].map((i) => ({ url: i.url, width: i.width, height: i.height, blur: i.blur, position: i.position }));
  const show = useSlideshow(slides.length, { interval: 7000 });
  return (
    <div data-frame className="absolute inset-0 overflow-hidden will-change-transform">
      {slides.length > 1 ? (
        <SlideLayers slides={slides} index={show.index} quality={95} kenBurns={false} fallbackAlt={caption} />
      ) : (
        <Image
          src={image.url}
          alt={caption}
          width={image.width}
          height={image.height}
          sizes={coverSizes(image.width, image.height)}
          quality={95}
          placeholder={image.blur ? "blur" : "empty"}
          blurDataURL={image.blur ?? undefined}
          className="h-full w-full object-cover will-change-transform"
          style={{ objectPosition: image.position }}
        />
      )}
      <div className="absolute inset-0 bg-ink/10" />
      {shade && (
        <>
          {/* Readability: a clean, neutral dark fade from the text side (no coloured glow — the photo brings its own red) */}
          <div
            data-shade
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/25 md:bg-[linear-gradient(90deg,rgba(5,5,5,0.94)_0%,rgba(5,5,5,0.86)_32%,rgba(5,5,5,0.45)_58%,rgba(5,5,5,0.08)_80%)]"
          />
          <div data-shade className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/70 to-transparent" />
        </>
      )}
    </div>
  );
}

function Caption({ caption, story }: { caption: string; story?: boolean }) {
  return (
    <p data-caption className={`eyebrow container-x absolute inset-x-0 bottom-8 justify-between text-bone/85 ${story ? "hidden md:flex" : "flex"}`}>
      <span>{caption}</span>
      {/* lang="en" keeps "Textile" from being uppercased with Turkish rules (TEXTİLE) */}
      <span lang="en">YEG — Textile</span>
    </p>
  );
}

function StatementStory({ image, images, caption, eyebrow, title, text }: Props & { text: string }) {
  const root = useRef<HTMLElement>(null);
  const steps = toSteps(text);
  const titleLines = (title ?? "").split(/\n+/).map((l) => l.trim()).filter(Boolean);
  const pad = (n: number) => String(n).padStart(2, "0");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-step]");
        const nums = gsap.utils.toArray<HTMLElement>("[data-num]");
        // Stack the steps in one grid cell: the box takes the tallest step's height, no measuring needed.
        gsap.set("[data-steps]", { display: "grid" });
        gsap.set(items, { gridArea: "1 / 1", marginTop: 0 });
        gsap.set([...items.slice(1), ...nums.slice(1)], { autoAlpha: 0, y: 30 });
        gsap.set("[data-punch] > span", { yPercent: 110 });

        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root.current, start: "top top", end: `+=${(steps.length + 1.5) * 75}%`, scrub: 0.8, pin: true },
        });

        tl.fromTo("[data-frame]", { scale: 0.8, borderRadius: "4px" }, { scale: 1, borderRadius: "0px", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo("[data-frame] img", { scale: 1.25 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo("[data-shade]", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0.3)
          .from("[data-head]", { autoAlpha: 0, y: 30, duration: 0.5 }, 0.55)
          .from("[data-title-line] > span", { yPercent: 110, stagger: 0.12, duration: 0.7 }, 0.6)
          .from(items[0], { autoAlpha: 0, y: 30, duration: 0.5 }, 1)
          .from("[data-meter]", { autoAlpha: 0, duration: 0.4 }, 1)
          .from("[data-caption]", { autoAlpha: 0, duration: 0.4 }, 1);

        // Each step holds for a while; a step with a red punchline reveals it early and holds longer.
        let shown = 1;
        items.forEach((item, i) => {
          if (i > 0) {
            tl.to(items[i - 1], { autoAlpha: 0, y: -30, duration: 0.4 }, shown - 0.2)
              .to(nums[i - 1], { autoAlpha: 0, y: -30, duration: 0.4 }, shown - 0.2)
              .to(item, { autoAlpha: 1, y: 0, duration: 0.5 }, shown)
              .to(nums[i], { autoAlpha: 1, y: 0, duration: 0.5 }, shown)
              .to("[data-progress]", { scaleX: (i + 1) / steps.length, ease: "none", duration: 0.6 }, shown - 0.2);
          }
          const punch = item.querySelector("[data-punch] > span");
          if (punch) tl.to(punch, { yPercent: 0, duration: 0.45 }, shown + 0.3);
          shown += punch ? 1.7 : 1.1;
        });
        tl.to({}, { duration: 0.6 });
      });
    },
    { scope: root, dependencies: [text] },
  );

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-ink">
      <Frame image={image} images={images} caption={caption} shade />

      <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-20 pt-[calc(var(--nav-h)+2rem)] md:justify-center md:pb-24">
        <div className="max-w-[44rem]">
          {eyebrow && (
            // The section name as a solid red tag, so it reads clearly as "AR-GE"
            <p data-head className="flex items-center gap-4">
              <span aria-hidden className="h-[2px] w-10 bg-brand" />
              <span className="display bg-brand px-3 pb-1.5 pt-2 text-[clamp(1.25rem,1.8vw,1.75rem)] leading-none tracking-[0.06em] text-white shadow-[0_0_30px_rgba(216,0,0,0.45)]">
                {eyebrow}
              </span>
            </p>
          )}
          {titleLines.length > 0 && (
            <h2 className="display mt-5 text-brand text-[clamp(2.4rem,5.2vw,5.6rem)] leading-[0.9] [text-shadow:0_0_50px_rgba(0,0,0,0.35)]">
              {titleLines.map((line, i) => (
                <span key={i} data-title-line className="reveal-line">
                  <span>{line}</span>
                </span>
              ))}
            </h2>
          )}

          <div data-steps className="mt-8 space-y-6 md:mt-12">
            {steps.map((step, i) => (
              <div key={i} data-step className="max-w-xl">
                <p className="text-[clamp(1.02rem,1.5vw,1.4rem)] leading-[1.45] tracking-normal text-bone/90">{step.body}</p>
                {step.punch && (
                  // The spacing sits on a wrapper: .reveal-line's negative margins would cancel a margin on the line itself
                  <div className="mt-5 md:mt-6">
                    <p data-punch className="reveal-line display text-[clamp(2.4rem,5vw,5rem)] leading-[0.9] text-brand">
                      <span>{step.punch}</span>
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {steps.length > 1 && (
            <div data-meter className="eyebrow mt-10 flex items-center gap-4 text-ash md:mt-14">
              <span className="relative grid">
                {steps.map((_, i) => (
                  <span key={i} data-num className="tabular-nums text-bone [grid-area:1/1]">
                    {pad(i + 1)}
                  </span>
                ))}
              </span>
              <span className="relative block h-px w-28 bg-bone/20">
                <span
                  data-progress
                  className="absolute inset-0 origin-left bg-brand"
                  style={{ transform: `scaleX(${1 / steps.length})` }}
                />
              </span>
              <span className="tabular-nums">{pad(steps.length)}</span>
            </div>
          )}
        </div>
      </div>

      <Caption caption={caption} story />
    </section>
  );
}

/** Original look: the hero title split in two, words drifting apart as the frame grows. */
function StatementWords({ image, images, caption, words }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top top", end: "+=160%", scrub: 0.8, pin: true },
        });
        tl.fromTo("[data-frame]", { scale: 0.8, borderRadius: "4px" }, { scale: 1, borderRadius: "0px", ease: "power2.inOut" }, 0)
          .fromTo("[data-frame] img", { scale: 1.25 }, { scale: 1, ease: "power2.inOut" }, 0)
          .fromTo("[data-word-left]", { xPercent: 0 }, { xPercent: -60, ease: "none" }, 0)
          .fromTo("[data-word-right]", { xPercent: 0 }, { xPercent: 60, ease: "none" }, 0)
          .fromTo("[data-caption]", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.3 }, 0.55);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden bg-ink">
      <Frame image={image} images={images} caption={caption} />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-center overflow-hidden [text-shadow:0_0_60px_rgba(0,0,0,0.35)]" aria-hidden>
        <p data-word-left className="display whitespace-nowrap pl-[4vw] text-fluid-xl text-bone">
          {words[0]}
        </p>
        <p data-word-right className="display whitespace-nowrap pr-[4vw] text-right text-fluid-xl text-bone">
          {words[1]}
        </p>
      </div>

      <Caption caption={caption} />
    </section>
  );
}
