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

export const absoluteUrl = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);

export function buildMetadata({ lang, path, title, description, image, type = "website", publishedTime, noIndex }: BuildMeta): Metadata {
  const relUrl = localePath(lang, path);
  const canonicalUrl = absoluteUrl(relUrl);
  const og = image ?? { url: "/media/campaign/neon-room.jpg", width: 2752, height: 1536, alt: "YEG Textile" };
  const ogImageUrl = absoluteUrl(og.url);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: absoluteUrl(localePath("en", path)),
        tr: absoluteUrl(localePath("tr", path)),
        fr: absoluteUrl(localePath("fr", path)),
        "x-default": absoluteUrl(localePath("en", path)),
      },
    },
    openGraph: {
      type,
      url: canonicalUrl,
      title,
      description,
      siteName: "YEG Textile",
      locale: OG_LOCALE[lang],
      alternateLocale: locales.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      images: [
        {
          url: ogImageUrl,
          width: og.width,
          height: og.height,
          alt: og.alt ?? title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
      creator: "@yegtextile",
      site: "@yegtextile",
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return {
    __html: JSON.stringify(data).replace(/</g, "\\u003c"),
  };
}

export function organizationSchema(contact: { email: string; phone: string; instagram: string; addressEn?: string; addressTr?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Brand"],
    name: "YEG Textile",
    legalName: "YEG Textile",
    url: SITE_URL,
    logo: absoluteUrl("/media/brand/logo-badge-red.svg"),
    image: absoluteUrl("/media/campaign/neon-room.jpg"),
    description: "Istanbul-based contemporary menswear atelier & luxury garment manufacturer.",
    email: contact.email,
    telephone: contact.phone,
    sameAs: [
      contact.instagram ? `https://instagram.com/${contact.instagram}` : "https://instagram.com/yegtextile",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: contact.phone,
        contactType: "customer service",
        availableLanguage: ["Turkish", "English", "French"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "TR",
      addressLocality: "Istanbul",
      streetAddress: contact.addressTr || contact.addressEn || "Istanbul, Türkiye",
    },
  };
}

export function websiteSchema(lang: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YEG Textile",
    url: SITE_URL,
    inLanguage: [OG_LOCALE[lang], "en_US", "tr_TR", "fr_FR"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${lang}/products?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
