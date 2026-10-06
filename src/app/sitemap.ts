import type { MetadataRoute } from "next";
import { fabricPath, flatFabrics } from "@/content/fabrics";
import { localePath, locales } from "@/i18n/config";
import { db } from "@/lib/db";
import { loadPage } from "@/lib/page-content";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, posts, sustainability] = await Promise.all([
    db.product.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.collection.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.blog.findMany({ where: { published: true, publishedAt: { lte: new Date() } }, select: { slug: true, updatedAt: true } }),
    loadPage("sustainability"),
  ]);
  const fabrics = await loadPage("fabrics");

  const entry = (path: string, lastModified?: Date, priority = 0.7): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}${localePath("en", path)}`,
    lastModified,
    priority,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}${localePath(l, path)}`])) },
  });

  return [
    entry("/", undefined, 1),
    entry("/products", undefined, 0.9),
    entry("/collections", undefined, 0.9),
    entry("/about", undefined, 0.6),
    entry("/production", undefined, 0.6),
    entry("/fabrics", undefined, 0.6),
    // Listed only once it is marked as published in the admin
    ...(sustainability.published ? [entry("/sustainability", undefined, 0.6)] : []),
    ...flatFabrics(fabrics.en).map(({ fabric }) => entry(fabricPath(fabric.slug), undefined, 0.5)),
    entry("/blog", undefined, 0.6),
    entry("/contact", undefined, 0.6),
    ...collections.map((c) => entry(`/collections/${c.slug}`, c.updatedAt, 0.8)),
    ...products.map((p) => entry(`/products/${p.slug}`, p.updatedAt, 0.8)),
    ...posts.map((p) => entry(`/blog/${p.slug}`, p.updatedAt, 0.5)),
  ];
}
