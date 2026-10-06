"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import type { ImageRef } from "@/lib/content-types";
import { coverSizes } from "@/lib/images";
import { SlideDots, SlideLayers, useSlideshow, type Slide } from "@/components/motion/ImageSlider";

type Props = {
  image: ImageRef;
  /** Extra slides after `image` */
  images?: ImageRef[];
  mobileImage?: ImageRef | null;
  videoUrl?: string | null;
  titleLines: string[];
  subtitle: string;
  eyebrow: string;
  cta: { label: string; href: string };
  scrollHint: string;
};

export function Hero({ image, images = [], mobileImage, videoUrl, titleLines, subtitle, eyebrow, cta, scrollHint }: Props) {
  const root = useRef<HTMLElement>(null);
  const slides: Slide[] = videoUrl || !images.length ? [] : [image, ...images].map((i) => ({ url: i.url, width: i.width, height: i.height, blur: i.blur, position: i.position }));
  const show = useSlideshow(slides.length, { interval: 6500 });

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // Wait for the intro loader on a first visit.
        const delay = document.documentElement.classList.contains("no-loader") ? 0.15 : 1.45;
        const tl = gsap.timeline({ delay });
        tl.from("[data-hero-media]", { scale: 1.22, duration: 2.6, ease: "expo.out" }, 0)
          .from("[data-hero-line] > span", { yPercent: 112, duration: 1.5, ease: "expo.out", stagger: 0.1 }, 0.1)
          .from("[data-hero-fade]", { autoAlpha: 0, y: 16, duration: 1.2, stagger: 0.08 }, 0.6);

        gsap.to("[data-hero-media]", {
          yPercent: 18,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-title]", {
          yPercent: -35,
          autoAlpha: 0.1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to("[data-hero-shade]", {
          opacity: 0.85,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope: root },
  );

  const common = { alt: titleLines.join(" "), quality: 95, loading: "eager" as const, fetchPriority: "high" as const };
  const desktop = getImageProps({ ...common, sizes: coverSizes(image.width, image.height), src: image.url, width: image.width, height: image.height });
  const mobile = mobileImage
    ? getImageProps({ ...common, sizes: "100vw", src: mobileImage.url, width: mobileImage.width, height: mobileImage.height })
    : null;

  return (
    <section ref={root} className="relative h-[100svh] min-h-[560px] overflow-hidden bg-ink" aria-label={titleLines.join(" ")}>
      <div data-hero-media className="absolute inset-0 will-change-transform">
        {slides.length > 1 ? (
          <SlideLayers slides={slides} index={show.index} quality={95} preload fallbackAlt={common.alt} />
        ) : videoUrl ? (
          <video
            className="h-full w-full object-cover"
            src={videoUrl}
            poster={desktop.props.src}
            autoPlay
            muted
            loop
            playsInline
            style={{ objectPosition: image.position }}
          />
        ) : (
          <picture>
            {mobile && <source media="(max-width: 767px)" srcSet={mobile.props.srcSet} sizes={coverSizes(mobileImage!.width, mobileImage!.height)} />}
            <img
              {...desktop.props}
              alt={common.alt}
              fetchPriority="high"
              className="h-full w-full object-cover"
              style={{
                objectPosition: image.position,
                backgroundImage: image.blur ? `url(${image.blur})` : undefined,
                backgroundSize: "cover",
              }}
            />
          </picture>
        )}
      </div>

      <div data-hero-shade className="absolute inset-0 bg-ink opacity-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/65" />

      <div className="container-x relative flex h-full flex-col justify-between pb-8 pt-[calc(var(--nav-h)+1.5rem)] md:pb-10">
        <div className="eyebrow flex items-start justify-between gap-6 text-bone/80" data-hero-fade>
          <span>{eyebrow}</span>
          {slides.length > 1 && <SlideDots count={slides.length} index={show.index} onSelect={show.go} running={show.running} interval={show.interval} className="-mt-1.5" />}
        </div>

        <div>
          <h1 data-hero-title className="display text-fluid-hero text-brand will-change-transform [text-shadow:0_2px_40px_rgba(0,0,0,0.35)]">
            {titleLines.map((line, i) => (
              <span key={i} data-hero-line className="reveal-line">
                <span>{line}</span>
              </span>
            ))}
          </h1>

          <div className="mt-6 flex flex-col gap-6 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div data-hero-fade>
              <p className="max-w-sm text-sm leading-relaxed text-bone/80 md:text-base">{subtitle}</p>
              <span className="eyebrow mt-5 hidden items-center gap-3 text-bone/60 md:flex">
                <span className="relative block h-8 w-px overflow-hidden bg-bone/20">
                  <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-brand" />
                </span>
                {scrollHint}
              </span>
            </div>
            <div data-hero-fade className="flex items-center gap-8">
              <Link
                href={cta.href}
                className="eyebrow group relative isolate inline-flex items-center gap-3 overflow-hidden bg-bone px-6 py-3.5 text-ink transition-colors duration-500 before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-brand before:transition-transform before:duration-500 before:ease-[cubic-bezier(0.76,0,0.24,1)] hover:text-white hover:before:scale-y-100"
              >
                {cta.label}
                <span aria-hidden className="transition-transform duration-500 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
