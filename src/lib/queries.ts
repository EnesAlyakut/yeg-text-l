import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { db } from "./db";
import type { ContactSettings, GeneralSettings, HomepageSections, LookbookImage, SpecRow } from "./content-types";

const productInclude = {
  images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }] },
  category: true,
  collection: true,
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

/** Serializable shape handed to client components (Decimal → number). */
export type ProductCardData = {
  id: string;
  slug: string;
  code: string | null;
  nameEn: string;
  nameTr: string;
  nameFr: string | null;
  colorEn: string | null;
  colorTr: string | null;
  colorFr: string | null;
  price: number;
  category: { slug: string; nameEn: string; nameTr: string; nameFr: string | null } | null;
  collection: { slug: string; nameEn: string; nameTr: string; nameFr: string | null } | null;
  image: { url: string; width: number; height: number; blurDataUrl: string | null; objectPosition: string; altEn: string | null; altTr: string | null; altFr: string | null } | null;
  hoverImage: ProductCardData["image"];
  /** Highest-resolution portrait image — used where a card is rendered large */
  featureImage: ProductCardData["image"];
  /** Largest sharp landscape image, if any — used for wide, full-bleed cards */
  wideImage: ProductCardData["image"];
  /** Every portrait photo (primary first, max 5) — the card crossfades through these on hover */
  gallery: NonNullable<ProductCardData["image"]>[];
};

type Img = ProductWithRelations["images"][number];

/** Best image for a large crop: biggest portrait if it's sharp enough, else the biggest image overall. */
export function heroImageOf(images: Img[]): Img | null {
  if (!images.length) return null;
  const byArea = [...images].sort((a, b) => b.width * b.height - a.width * a.height);
  const portrait = byArea.find((i) => i.height >= i.width && i.height >= 1600);
  return portrait ?? byArea[0];
}

export function toCard(p: ProductWithRelations): ProductCardData {
  const portrait = p.images.filter((i) => i.height >= i.width);
  const main = p.images[0] ?? null;
  const feature = [...portrait].sort((a, b) => b.width * b.height - a.width * a.height)[0] ?? main;
  const wide = p.images.filter((i) => i.width > i.height && i.width >= 1600).sort((a, b) => b.width - a.width)[0];
  const pic = (i: (typeof p.images)[number] | undefined | null) =>
    i
      ? { url: i.url, width: i.width, height: i.height, blurDataUrl: i.blurDataUrl, objectPosition: i.objectPosition, altEn: i.altEn, altTr: i.altTr, altFr: i.altFr }
      : null;
  return {
    id: p.id,
    slug: p.slug,
    code: p.code,
    nameEn: p.nameEn,
    nameTr: p.nameTr,
    nameFr: p.nameFr,
    colorEn: p.colorEn,
    colorTr: p.colorTr,
    colorFr: p.colorFr,
    price: Number(p.price),
    category: p.category ? { slug: p.category.slug, nameEn: p.category.nameEn, nameTr: p.category.nameTr, nameFr: p.category.nameFr } : null,
    collection: p.collection ? { slug: p.collection.slug, nameEn: p.collection.nameEn, nameTr: p.collection.nameTr, nameFr: p.collection.nameFr } : null,
    image: pic(main),
    hoverImage: pic(portrait.find((i) => i.id !== main?.id)),
    featureImage: pic(feature),
    wideImage: pic(wide),
    gallery: portrait.slice(0, 5).map((i) => pic(i)!),
  };
}

export const getProducts = cache(async () => {
  const products = await db.product.findMany({
    where: { published: true },
    include: productInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return products;
});

export const getProductBySlug = cache(async (slug: string) => {
  return db.product.findFirst({ where: { slug, published: true }, include: productInclude });
});

export const getProductsBySlugs = cache(async (slugs: string[]) => {
  if (!slugs.length) return [];
  const products = await db.product.findMany({ where: { slug: { in: slugs }, published: true }, include: productInclude });
  return slugs.map((s) => products.find((p) => p.slug === s)).filter((p): p is ProductWithRelations => Boolean(p));
});

export const getCategories = cache(async () => db.category.findMany({ orderBy: { sortOrder: "asc" } }));

export const getCollections = cache(async () =>
  db.collection.findMany({
    where: { published: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: { where: { published: true } } } } },
  }),
);

export const getCollectionBySlug = cache(async (slug: string) =>
  db.collection.findFirst({
    where: { slug, published: true },
    include: {
      products: { where: { published: true }, include: productInclude, orderBy: { sortOrder: "asc" } },
    },
  }),
);

export const getPosts = cache(async (take?: number) =>
  db.blog.findMany({
    where: { published: true, publishedAt: { lte: new Date() } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take,
  }),
);

export const getPostBySlug = cache(async (slug: string) =>
  db.blog.findFirst({ where: { slug, published: true }, include: { category: true } }),
);

export const getHomepage = cache(async () => {
  const rows = await db.homepageSection.findMany({ orderBy: { sortOrder: "asc" } });
  const sections = {} as Partial<HomepageSections>;
  const order: { key: keyof HomepageSections; enabled: boolean }[] = [];
  for (const row of rows) {
    const key = row.key as keyof HomepageSections;
    (sections as Record<string, unknown>)[key] = row.data;
    order.push({ key, enabled: row.enabled });
  }
  return { sections, order };
});

const DEFAULT_CONTACT: ContactSettings = {
  email: "info@yegtextile.com",
  phone: "+90 212 000 00 00",
  whatsapp: "+90 500 000 00 00",
  addressEn: "Istanbul, Türkiye",
  addressTr: "İstanbul, Türkiye",
  addressFr: "Istanbul, Turquie",
  instagram: "yegtextile",
};

export const getSettings = cache(async () => {
  const rows = await db.setting.findMany();
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return {
    contact: { ...DEFAULT_CONTACT, ...(map.contact as Partial<ContactSettings> | undefined) } as ContactSettings,
    general: { currency: "USD", showPrices: true, ...(map.general as Partial<GeneralSettings> | undefined) } as GeneralSettings,
  };
});

/** Slugs to prerender at build time; an unreachable DB just means on-demand rendering. */
export async function staticSlugs(model: "product" | "collection" | "blog") {
  try {
    const where = { published: true };
    const rows =
      model === "product"
        ? await db.product.findMany({ where, select: { slug: true } })
        : model === "collection"
          ? await db.collection.findMany({ where, select: { slug: true } })
          : await db.blog.findMany({ where, select: { slug: true } });
    return rows.map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

/** Collection/blog extra images (same shape the admin GalleryField stores). */
export function readGallery(value: Prisma.JsonValue): LookbookImage[] {
  return Array.isArray(value) ? (value as unknown as LookbookImage[]).filter((i) => i && typeof i.url === "string") : [];
}

export function readSpecs(value: Prisma.JsonValue): SpecRow[] {
  return Array.isArray(value) ? (value as unknown as SpecRow[]) : [];
}
