import type { Locale } from "@/i18n/config";

const NUMBER_LOCALE: Record<Locale, string> = { en: "en-US", tr: "tr-TR", fr: "fr-FR" };
const DATE_LOCALE: Record<Locale, string> = { en: "en-GB", tr: "tr-TR", fr: "fr-FR" };

export function formatPrice(value: number, currency: string, lang: Locale) {
  return new Intl.NumberFormat(NUMBER_LOCALE[lang], {
    style: "currency",
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatDate(date: Date | string, lang: Locale) {
  return new Intl.DateTimeFormat(DATE_LOCALE[lang], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
