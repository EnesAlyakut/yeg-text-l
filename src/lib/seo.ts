import type { Metadata } from "next";
import { localePath, locales, type Locale } from "@/i18n/config";
import { SITE_URL } from "./site";

const OG_LOCALE: Record<Locale, string> = { en: "en_US", tr: "tr_TR", fr: "fr_FR" };

type BuildMeta = {
  lang: Locale;
  /** Locale-less path, e.g. "/products/foo" */
  path: string;
  title: string;
  description: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  type?: "website" | "article";
  publishedTime?: string;
  noIndex?: boolean;
};

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path}`);

export function buildMetadata({ lang, path, title, description, image, type = "website", publishedTime, noIndex }: BuildMeta): Metadata {
  const url = localePath(lang, path);
  const og = image ?? { url: "/media/campaign/neon-room.jpg", width: 2752, height: 1536, alt: "YEG Textile" };
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: localePath("en", path), tr: localePath("tr", path), fr: localePath("fr", path), "x-default": localePath("en", path) },
    },
    openGraph: {
      type,
      url,
      title,
      description,
      siteName: "YEG Textile",
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [{ url: og.url, width: og.width, height: og.height, alt: og.alt ?? title }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [og.url] },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export function organizationSchema(contact: { email: string; phone: string; instagram: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YEG Textile",
    url: SITE_URL,
    logo: absoluteUrl("/media/brand/logo-badge-red.svg"),
    email: contact.email,
    telephone: contact.phone,
    sameAs: [`https://instagram.com/${contact.instagram}`],
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.url) })),
  };
}
