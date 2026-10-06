/**
 * Fills the French (…Fr) fields from prisma/fr-content.ts.
 * Only empty French values are written, so French text edited in the admin is never overwritten.
 * Run: npm run db:fr
 */
import { Prisma, PrismaClient } from "@prisma/client";
import {
  addressFr,
  blogCategoriesFr,
  captionsFr,
  categoriesFr,
  collectionsFr,
  homepageFr,
  postsFr,
  productsFr,
  specLabelsFr,
  specValuesFr,
} from "../prisma/fr-content";

const db = new PrismaClient();
const missing: string[] = [];
const empty = (v: unknown) => v === null || v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
/** Only the keys whose current value is empty. */
const onlyEmpty = <T extends Record<string, unknown>>(current: Record<string, unknown>, next: T) =>
  Object.fromEntries(Object.entries(next).filter(([k]) => empty(current[k]))) as Partial<T>;

type Row = Record<string, unknown>;
const json = (v: unknown) => v as Prisma.InputJsonValue;

function translateGallery(value: Prisma.JsonValue) {
  if (!Array.isArray(value)) return value;
  return (value as Row[]).map((img) => {
    if (!empty(img.altFr) || empty(img.altEn)) return img;
    const fr = captionsFr[String(img.altEn)];
    if (!fr) missing.push(`caption: ${img.altEn}`);
    return { ...img, altFr: fr ?? img.altEn };
  });
}

async function products() {
  const rows = await db.product.findMany({ include: { images: true } });
  for (const p of rows) {
    const fr = productsFr[p.slug];
    if (!fr) {
      missing.push(`product: ${p.slug}`);
      continue;
    }
    const specs = (Array.isArray(p.specs) ? (p.specs as Row[]) : []).map((s) => {
      const value = String(s.valueEn ?? "");
      if (!(String(s.labelEn) in specLabelsFr)) missing.push(`spec label: ${s.labelEn}`);
      return {
        ...s,
        labelFr: empty(s.labelFr) ? (specLabelsFr[String(s.labelEn)] ?? s.labelEn) : s.labelFr,
        valueFr: empty(s.valueFr) ? (specValuesFr[value] ?? value) : s.valueFr,
      };
    });
    await db.product.update({
      where: { id: p.id },
      data: {
        ...onlyEmpty(p, {
          nameFr: fr.name,
          shortFr: fr.short,
          descriptionFr: fr.description,
          materialFr: fr.material,
          colorFr: fr.color,
          seoTitleFr: `${fr.name} — ${fr.color}`,
          seoDescriptionFr: fr.short,
        }),
        ...(empty(p.featuresFr) ? { featuresFr: fr.features } : {}),
        specs: json(specs),
      },
    });
    for (const img of p.images.filter((i) => empty(i.altFr))) {
      await db.productImage.update({ where: { id: img.id }, data: { altFr: `${fr.name} — ${fr.color} — YEG Textile` } });
    }
  }
  return rows.length;
}

async function taxonomies() {
  for (const c of await db.category.findMany()) {
    if (!empty(c.nameFr)) continue;
    if (!categoriesFr[c.slug]) missing.push(`category: ${c.slug}`);
    await db.category.update({ where: { id: c.id }, data: { nameFr: categoriesFr[c.slug] ?? c.nameEn } });
  }
  for (const c of await db.blogCategory.findMany()) {
    if (!empty(c.nameFr)) continue;
    if (!blogCategoriesFr[c.slug]) missing.push(`blog category: ${c.slug}`);
    await db.blogCategory.update({ where: { id: c.id }, data: { nameFr: blogCategoriesFr[c.slug] ?? c.nameEn } });
  }
}

async function collections() {
  for (const c of await db.collection.findMany()) {
    const fr = collectionsFr[c.slug];
    if (!fr) missing.push(`collection: ${c.slug}`);
    await db.collection.update({
      where: { id: c.id },
      data: {
        ...(fr ? onlyEmpty(c, { nameFr: fr.name, seasonFr: fr.season, taglineFr: fr.tagline, descriptionFr: fr.description }) : {}),
        gallery: json(translateGallery(c.gallery)),
      },
    });
  }
}

async function posts() {
  for (const p of await db.blog.findMany()) {
    const fr = postsFr[p.slug];
    if (!fr) missing.push(`post: ${p.slug}`);
    await db.blog.update({
      where: { id: p.id },
      data: {
        ...(fr
          ? onlyEmpty(p, { titleFr: fr.title, excerptFr: fr.excerpt, contentFr: fr.content, seoTitleFr: fr.title, seoDescriptionFr: fr.excerpt })
          : {}),
        gallery: json(translateGallery(p.gallery)),
      },
    });
  }
}

async function homepage() {
  for (const row of await db.homepageSection.findMany()) {
    const data = { ...(row.data as Row) };
    const fr = (homepageFr as Record<string, Row>)[row.key];
    if (fr) {
      const { stepsFr, ...flat } = fr as Row & { stepsFr?: Row[] };
      Object.assign(data, onlyEmpty(data, flat));
      if (stepsFr && Array.isArray(data.steps)) {
        data.steps = (data.steps as Row[]).map((step, i) => ({ ...step, ...onlyEmpty(step, stepsFr[i] ?? {}) }));
      }
    }
    if (Array.isArray(data.images)) data.images = translateGallery(data.images as Prisma.JsonValue);
    await db.homepageSection.update({ where: { id: row.id }, data: { data: json(data) } });
  }
}

async function settings() {
  const row = await db.setting.findUnique({ where: { key: "contact" } });
  if (!row) return;
  const value = row.value as Row;
  if (empty(value.addressFr)) await db.setting.update({ where: { key: "contact" }, data: { value: json({ ...value, addressFr }) } });
}

async function main() {
  const count = await products();
  await taxonomies();
  await collections();
  await posts();
  await homepage();
  await settings();
  console.log(`French content applied (${count} products, plus categories, collections, journal, homepage, settings).`);
  if (missing.length) console.log(`No French copy found for:\n  ${[...new Set(missing)].join("\n  ")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
