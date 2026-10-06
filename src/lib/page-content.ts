import "server-only";
import { cache } from "react";
import { aboutContent, aboutImages } from "@/content/about";
import { contactContent } from "@/content/contact";
import { fabricDetailsContent, fabricLabelsContent } from "@/content/fabric-details";
import { fabricSlugs, fabricsContent, fabricsHero } from "@/content/fabrics";
import type { ImageRef } from "@/lib/content-types";
import { PRODUCTION_ADDRESS, productionContent, productionImages } from "@/content/production";
import { sustainabilityContent } from "@/content/sustainability";
import type { Locale } from "@/i18n/config";
import { db } from "./db";

/**
 * Editable static pages. Each entry is the full default content (all languages plus shared images);
 * the admin saves an edited copy to PageContent and the site merges it over these defaults.
 */
export const PAGE_DEFAULTS = {
  about: { ...aboutContent, images: aboutImages },
  production: { ...productionContent, images: productionImages, address: PRODUCTION_ADDRESS },
  // `swatches[slug]`: optional photo per fabric, replacing the drawn weave pattern
  fabrics: { ...fabricsContent, images: { hero: fabricsHero, swatches: Object.fromEntries(fabricSlugs().map((s) => [s, null])) as Record<string, ImageRef | null> } },
  "fabric-details": { ...fabricDetailsContent, labels: fabricLabelsContent },
  contact: contactContent,
  sustainability: sustainabilityContent,
};

export type PageKey = keyof typeof PAGE_DEFAULTS;
export const PAGE_KEYS = Object.keys(PAGE_DEFAULTS) as PageKey[];

export const PAGE_LABELS: Record<PageKey, { title: string; description: string }> = {
  about: { title: "Hakkımızda", description: "Tüm bölümlerin metinleri, listeler, sertifikalar, lokasyonlar ve görseller." },
  production: { title: "Üretim", description: "Açılış, rakamlar, üretim aşamaları, kalite adımları, üretim merkezi adresi ve görseller." },
  fabrics: { title: "Kumaşlar", description: "Kumaş grupları, kumaş adları, malzemeler, açılış metni ve görseli." },
  "fabric-details": { title: "Kumaş detay sayfaları", description: "Her kumaşın detay sayfası: açıklama, öne çıkanlar, malzeme notları, kullanım alanları." },
  contact: { title: "İletişim", description: "İletişim sayfasındaki ek metinler. Telefon, e-posta ve adres Ayarlar'dan değişir." },
  sustainability: { title: "Sürdürülebilirlik", description: "Şimdilik boş. Metin ekleyip “Yayında” işaretlenince arama motorlarına açılır." },
};

type Json = unknown;

/** Objects merge key by key; arrays and plain values from the saved copy replace the default. */
export function mergeContent<T>(base: T, over: Json): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || typeof base !== "object" || base === null) return over as T;
  if (typeof over !== "object" || Array.isArray(over)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [k, v] of Object.entries(over as Record<string, unknown>)) {
    out[k] = k in out ? mergeContent(out[k], v) : v;
  }
  return out as T;
}

/** Saved copy merged over the defaults; falls back to the defaults if the database is unavailable. */
export const loadPage = cache(async <K extends PageKey>(key: K): Promise<(typeof PAGE_DEFAULTS)[K]> => {
  const base = PAGE_DEFAULTS[key];
  try {
    const row = await db.pageContent.findUnique({ where: { key } });
    return row ? mergeContent(base, row.data) : base;
  } catch {
    return base;
  }
});

/* ——— per-page helpers, so pages read one language at a time */

export const loadAbout = async (lang: Locale) => {
  const p = await loadPage("about");
  return { a: p[lang], img: p.images };
};

export const loadProduction = async (lang: Locale) => {
  const p = await loadPage("production");
  return { p: p[lang], img: p.images, address: p.address };
};

export const loadFabrics = async (lang: Locale) => {
  const p = await loadPage("fabrics");
  return { f: p[lang], hero: p.images.hero, swatches: p.images.swatches ?? {} };
};

export const loadFabricDetails = async (lang: Locale) => {
  const p = await loadPage("fabric-details");
  return { details: p[lang], labels: p.labels[lang] };
};

export const loadContact = async (lang: Locale) => (await loadPage("contact"))[lang];

export const loadSustainability = async (lang: Locale) => {
  const p = await loadPage("sustainability");
  return { s: p[lang], published: p.published, image: p.image };
};
