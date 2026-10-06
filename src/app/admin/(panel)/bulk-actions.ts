"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { revalidateSite } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

type Result = { ok: boolean; error?: string; count?: number };

const duplicate = (e: unknown) => e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002";

// ——————————————————————————— collections

const collectionRow = z.object({
  id: z.string(),
  nameTr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  seasonTr: z.string().trim(),
  seasonEn: z.string().trim(),
  slug: z.string().trim().min(1),
  sortOrder: z.number().int(),
  published: z.boolean(),
  isFeatured: z.boolean(),
});
export type CollectionRow = z.infer<typeof collectionRow>;

export async function bulkUpdateCollections(rows: CollectionRow[]): Promise<Result> {
  await requireAdmin();
  const parsed = z.array(collectionRow).safeParse(rows);
  if (!parsed.success) return { ok: false, error: "Ad (TR/EN) ve slug boş olamaz." };
  try {
    await db.$transaction(
      parsed.data.map(({ id, slug, seasonTr, seasonEn, ...data }) =>
        db.collection.update({ where: { id }, data: { ...data, slug: slugify(slug), seasonTr: seasonTr || null, seasonEn: seasonEn || null } }),
      ),
    );
  } catch (e) {
    if (duplicate(e)) return { ok: false, error: "Aynı slug birden fazla koleksiyonda kullanılamaz." };
    throw e;
  }
  revalidateSite();
  revalidatePath("/admin/collections");
  return { ok: true, count: parsed.data.length };
}

// ——————————————————————————— categories (product + blog)

const taxonomyRow = z.object({
  id: z.string(),
  nameTr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  nameFr: z.string().trim().nullable(),
  slug: z.string().trim().min(1),
  sortOrder: z.number().int(),
});
export type TaxonomyRow = z.infer<typeof taxonomyRow>;

export async function bulkUpdateTaxonomy(kind: "category" | "blogCategory", rows: TaxonomyRow[]): Promise<Result> {
  await requireAdmin();
  const parsed = z.array(taxonomyRow).safeParse(rows);
  if (!parsed.success) return { ok: false, error: "Ad (TR/EN) ve slug boş olamaz." };
  try {
    await db.$transaction(
      parsed.data.map(({ id, slug, nameFr, ...data }) =>
        kind === "category"
          ? db.category.update({ where: { id }, data: { ...data, nameFr: nameFr || null, slug: slugify(slug) } })
          : db.blogCategory.update({ where: { id }, data: { ...data, nameFr: nameFr || null, slug: slugify(slug) } }),
      ),
    );
  } catch (e) {
    if (duplicate(e)) return { ok: false, error: "Aynı slug birden fazla kayıtta kullanılamaz." };
    throw e;
  }
  revalidateSite();
  revalidatePath(kind === "category" ? "/admin/categories" : "/admin/blog-categories");
  return { ok: true, count: parsed.data.length };
}

// ——————————————————————————— blog posts

const postRow = z.object({
  id: z.string(),
  titleTr: z.string().trim().min(1),
  titleEn: z.string().trim().min(1),
  categoryId: z.string().nullable(),
  publishedAt: z.string().min(10),
  published: z.boolean(),
  isFeatured: z.boolean(),
});
export type PostRow = z.infer<typeof postRow>;

export async function bulkUpdatePosts(rows: PostRow[]): Promise<Result> {
  await requireAdmin();
  const parsed = z.array(postRow).safeParse(rows);
  if (!parsed.success) return { ok: false, error: "Başlık (TR/EN) ve tarih boş olamaz." };
  await db.$transaction(
    parsed.data.map(({ id, publishedAt, ...data }) => db.blog.update({ where: { id }, data: { ...data, publishedAt: new Date(publishedAt) } })),
  );
  revalidateSite();
  revalidatePath("/admin/blog");
  return { ok: true, count: parsed.data.length };
}
