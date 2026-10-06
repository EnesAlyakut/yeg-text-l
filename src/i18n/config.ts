export const locales = ["en", "tr", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** English lives at the root, Turkish under /tr, French under /fr. */
export function localePath(lang: Locale, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

/** Strip a /tr or /fr prefix from a browser pathname. */
export function stripLocale(pathname: string) {
  const match = pathname.match(/^\/(tr|en|fr)(?=\/|$)/);
  return match ? pathname.slice(match[0].length) || "/" : pathname;
}

const SUFFIX: Record<Locale, string> = { en: "En", tr: "Tr", fr: "Fr" };

/**
 * Pick the localized field of a record: pick(product, "name", "tr") → product.nameTr.
 * French is newer than the other two languages, so an empty French value falls back to English.
 */
export function pick<T extends object>(record: T, field: string, lang: Locale): string {
  const rec = record as Record<string, unknown>;
  const own = rec[`${field}${SUFFIX[lang]}`];
  const value = lang === "fr" && !own ? rec[`${field}En`] : (own ?? rec[`${field}En`]);
  return typeof value === "string" ? value : "";
}

export function pickList<T extends object>(record: T, field: string, lang: Locale): string[] {
  const rec = record as Record<string, unknown>;
  const read = (l: Locale) => {
    const value = rec[`${field}${SUFFIX[l]}`];
    return Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : [];
  };
  const own = read(lang);
  return lang === "fr" && !own.length ? read("en") : own;
}
