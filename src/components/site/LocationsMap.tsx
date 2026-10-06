"use client";

import { useState } from "react";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export type MapLocation = { city: string; country: string; role: string; query: string; zoom: number; lang?: string };

type Props = { locations: MapLocation[]; lang: Locale; openInMaps: string };

/**
 * Four location tabs over a full-width Google Maps embed (no API key). The map is turned dark with a
 * CSS filter, and a card on top names the selected site.
 */
export function LocationsMap({ locations, lang, openInMaps }: Props) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState<number | null>(null);
  const loc = locations[active];
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(loc.query)}&z=${loc.zoom}&hl=${lang}&output=embed`;
  const external = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.query)}`;

  return (
    <div>
      {/* Tabs: the selected site fills red */}
      <ul className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
        {locations.map((l, i) => {
          const on = i === active;
          return (
            <li key={l.query}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={cn(
                  "group relative isolate flex h-full w-full flex-col items-start overflow-hidden p-5 text-left transition-colors duration-500 md:p-7",
                  on ? "bg-brand text-white" : "bg-ink text-bone hover:bg-coal",
                )}
              >
                <span className="display block text-[clamp(1.6rem,2.4vw,2.4rem)] leading-[0.9]" lang={l.lang}>
                  {l.city}
                </span>
                <span className={cn("eyebrow mt-2 block", on ? "text-white/80" : "text-brand")} lang={l.lang}>
                  {l.country}
                </span>
                <span className={cn("mt-4 block text-sm leading-relaxed md:text-base", on ? "text-white/90" : "text-mist")}>{l.role}</span>
                <span
                  aria-hidden
                  className={cn("absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand transition-transform duration-700", on ? "scale-x-0" : "scale-x-0 group-hover:scale-x-100")}
                />
              </button>
            </li>
          );
        })}
      </ul>

      {/* Full-width dark map */}
      <div className="relative mt-px aspect-[4/5] min-h-[380px] overflow-hidden border border-t-0 border-line bg-coal sm:aspect-[16/9] lg:aspect-[21/9]">
        <iframe
          key={src}
          src={src}
          title={`${loc.city}, ${loc.country}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoaded(active)}
          className={cn(
            "absolute inset-0 h-full w-full border-0 transition-opacity duration-700 [filter:invert(92%)_hue-rotate(180deg)_saturate(40%)_contrast(105%)_brightness(80%)]",
            loaded === active ? "opacity-100" : "opacity-0",
          )}
        />
        {/* Vignette and a red undertone so the map sits in the page */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_80%_at_50%_50%,transparent_45%,rgba(0,0,0,0.8))]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-brand/[0.08] mix-blend-color" />
        {["left-3 top-3 border-l border-t", "right-3 top-3 border-r border-t", "bottom-3 left-3 border-b border-l", "bottom-3 right-3 border-b border-r"].map((c) => (
          <span key={c} aria-hidden className={cn("pointer-events-none absolute size-5 border-brand", c)} />
        ))}

        {/* Selected-site card */}
        <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4 md:bottom-8 md:left-8 md:right-8">
          <div className="border border-line bg-ink/85 px-5 py-4 backdrop-blur-sm md:px-6 md:py-5">
            <p className="eyebrow flex items-center gap-2 text-ash">
              <span aria-hidden className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-brand" />
              </span>
              <span lang={loc.lang}>{loc.country}</span>
            </p>
            <p className="display mt-2 text-[clamp(1.8rem,3vw,3rem)] leading-[0.9] text-bone" lang={loc.lang}>
              {loc.city}
            </p>
            <p className="mt-2 text-sm text-mist md:text-base">{loc.role}</p>
          </div>
          <a
            href={external}
            target="_blank"
            rel="noreferrer"
            className="eyebrow pointer-events-auto inline-flex items-center gap-2 bg-bone px-5 py-3 text-ink transition-colors hover:bg-brand hover:text-white"
          >
            {openInMaps} <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
