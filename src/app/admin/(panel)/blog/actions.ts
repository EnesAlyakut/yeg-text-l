"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { bool, json, optStr, revalidateSite, str, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import type { ImageRef, LookbookImage } from "@/lib/content-types";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function savePost(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const titleEn = str(fd, "titleEn");
  const titleTr = str(fd, "titleTr");
  if (!titleEn || !titleTr) return { error: "Başlık (EN ve TR) zorunludur." };
  if (!str(fd, "contentEn") || !str(fd, "contentTr")) return { error: "İçerik (EN ve TR) zorunludur." };
  const cover = json<ImageRef | null>(fd, "cover", null);
  const date = str(fd, "publishedAt");

  const data = {
    slug: slugify(str(fd, "slug") || titleEn),
    titleEn,
    titleTr,
    titleFr: optStr(fd, "titleFr"),
    excerptEn: optStr(fd, "excerptEn"),
    excerptTr: optStr(fd, "excerptTr"),
    excerptFr: optStr(fd, "excerptFr"),
    contentEn: str(fd, "contentEn"),
    contentTr: str(fd, "contentTr"),
    contentFr: optStr(fd, "contentFr"),
    coverUrl: cover?.url ?? null,
    coverWidth: cover?.width ?? null,
    coverHeight: cover?.height ?? null,
    coverBlur: cover?.blur ?? null,
    coverPosition: cover?.position ?? "50% 50%",
    gallery: json<LookbookImage[]>(fd, "gallery", []) as unknown as Prisma.InputJsonValue,
    categoryId: optStr(fd, "categoryId"),
    author: str(fd, "author") || "YEG Textile",
    published: bool(fd, "published"),
    isFeatured: bool(fd, "isFeatured"),
    publishedAt: date ? new Date(date) : new Date(),
    seoTitleEn: optStr(fd, "seoTitleEn"),
    seoTitleTr: optStr(fd, "seoTitleTr"),
    seoDescriptionEn: optStr(fd, "seoDescriptionEn"),
    seoDescriptionTr: optStr(fd, "seoDescriptionTr"),
    seoTitleFr: optStr(fd, "seoTitleFr"),
    seoDescriptionFr: optStr(fd, "seoDescriptionFr"),
  };

  let rowId = id;
  try {
    const row = id ? await db.blog.update({ where: { id }, data }) : await db.blog.create({ data });
    rowId = row.id;
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "Bu slug zaten kullanılıyor." };
    throw e;
  }

  revalidateSite();
  if (!id) redirect(`/admin/blog/${rowId}`);
  return { ok: true, message: "Yazı kaydedildi." };
}

export async function deletePost(id: string) {
  await requireAdmin();
  await db.blog.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/blog");
}
