"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { bool, int, json, optStr, revalidateSite, str, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import type { ImageRef, LookbookImage } from "@/lib/content-types";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function saveCollection(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const slug = slugify(str(fd, "slug") || str(fd, "nameEn"));
  if (!str(fd, "nameEn") || !str(fd, "nameTr")) return { error: "Koleksiyon adı (EN ve TR) zorunludur." };
  const cover = json<ImageRef | null>(fd, "cover", null);
  const productIds = json<string[]>(fd, "productIds", []);

  const data = {
    slug,
    nameEn: str(fd, "nameEn"),
    nameTr: str(fd, "nameTr"),
    nameFr: optStr(fd, "nameFr"),
    seasonEn: optStr(fd, "seasonEn"),
    seasonTr: optStr(fd, "seasonTr"),
    seasonFr: optStr(fd, "seasonFr"),
    taglineEn: optStr(fd, "taglineEn"),
    taglineTr: optStr(fd, "taglineTr"),
    taglineFr: optStr(fd, "taglineFr"),
    descriptionEn: optStr(fd, "descriptionEn"),
    descriptionTr: optStr(fd, "descriptionTr"),
    descriptionFr: optStr(fd, "descriptionFr"),
    coverUrl: cover?.url ?? null,
    coverWidth: cover?.width ?? null,
    coverHeight: cover?.height ?? null,
    coverBlur: cover?.blur ?? null,
    coverPosition: cover?.position ?? "50% 50%",
    gallery: json<LookbookImage[]>(fd, "gallery", []) as unknown as Prisma.InputJsonValue,
    isFeatured: bool(fd, "isFeatured"),
    published: bool(fd, "published"),
    sortOrder: int(fd, "sortOrder"),
    seoTitleEn: optStr(fd, "seoTitleEn"),
    seoTitleTr: optStr(fd, "seoTitleTr"),
    seoDescriptionEn: optStr(fd, "seoDescriptionEn"),
    seoDescriptionTr: optStr(fd, "seoDescriptionTr"),
    seoTitleFr: optStr(fd, "seoTitleFr"),
    seoDescriptionFr: optStr(fd, "seoDescriptionFr"),
  };

  let rowId = id;
  try {
    await db.$transaction(async (tx) => {
      const row = id ? await tx.collection.update({ where: { id }, data }) : await tx.collection.create({ data });
      rowId = row.id;
      // Assign products chosen in the form; unassign the ones removed.
      await tx.product.updateMany({ where: { collectionId: row.id, id: { notIn: productIds } }, data: { collectionId: null } });
      if (productIds.length) await tx.product.updateMany({ where: { id: { in: productIds } }, data: { collectionId: row.id } });
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "Bu slug zaten kullanılıyor." };
    throw e;
  }

  revalidateSite();
  if (!id) redirect(`/admin/collections/${rowId}`);
  return { ok: true, message: "Koleksiyon kaydedildi." };
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await db.collection.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/collections");
}
