"use server";

import { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import type { GalleryItem } from "@/components/admin/GalleryField";
import { bool, int, json, lines, optStr, revalidateSite, str, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import type { SpecRow } from "@/lib/content-types";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";

export async function saveProduct(id: string | null, _prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();

  const slug = slugify(str(fd, "slug") || str(fd, "nameEn"));
  const price = Number.parseFloat(str(fd, "price").replace(",", "."));
  if (!str(fd, "nameEn") || !str(fd, "nameTr")) return { error: "Ürün adı (EN ve TR) zorunludur." };
  if (!slug) return { error: "Geçerli bir slug girin." };
  if (!Number.isFinite(price) || price < 0) return { error: "Geçerli bir fiyat girin." };

  const images = json<GalleryItem[]>(fd, "images", []);
  const data = {
    slug,
    code: optStr(fd, "code"),
    nameEn: str(fd, "nameEn"),
    nameTr: str(fd, "nameTr"),
    nameFr: optStr(fd, "nameFr"),
    shortEn: optStr(fd, "shortEn"),
    shortTr: optStr(fd, "shortTr"),
    shortFr: optStr(fd, "shortFr"),
    descriptionEn: optStr(fd, "descriptionEn"),
    descriptionTr: optStr(fd, "descriptionTr"),
    descriptionFr: optStr(fd, "descriptionFr"),
    materialEn: optStr(fd, "materialEn"),
    materialTr: optStr(fd, "materialTr"),
    materialFr: optStr(fd, "materialFr"),
    colorEn: optStr(fd, "colorEn"),
    colorTr: optStr(fd, "colorTr"),
    colorFr: optStr(fd, "colorFr"),
    featuresEn: lines(fd, "featuresEn"),
    featuresTr: lines(fd, "featuresTr"),
    featuresFr: lines(fd, "featuresFr"),
    specs: json<SpecRow[]>(fd, "specs", []) as unknown as Prisma.InputJsonValue,
    price: new Prisma.Decimal(price),
    categoryId: optStr(fd, "categoryId"),
    collectionId: optStr(fd, "collectionId"),
    isFeatured: bool(fd, "isFeatured"),
    isShowcase: bool(fd, "isShowcase"),
    published: bool(fd, "published"),
    sortOrder: int(fd, "sortOrder"),
    seoTitleEn: optStr(fd, "seoTitleEn"),
    seoTitleTr: optStr(fd, "seoTitleTr"),
    seoDescriptionEn: optStr(fd, "seoDescriptionEn"),
    seoDescriptionTr: optStr(fd, "seoDescriptionTr"),
    seoTitleFr: optStr(fd, "seoTitleFr"),
    seoDescriptionFr: optStr(fd, "seoDescriptionFr"),
  };

  let productId = id;
  try {
    await db.$transaction(async (tx) => {
      const row = id ? await tx.product.update({ where: { id }, data }) : await tx.product.create({ data });
      productId = row.id;
      await tx.productImage.deleteMany({ where: { productId: row.id } });
      if (images.length) {
        const primary = Math.max(0, images.findIndex((i) => i.isPrimary));
        await tx.productImage.createMany({
          data: images.map((img, i) => ({
            productId: row.id,
            url: img.url,
            width: img.width,
            height: img.height,
            blurDataUrl: img.blurDataUrl,
            altEn: img.altEn || null,
            altTr: img.altTr || null,
            altFr: img.altFr || null,
            objectPosition: img.objectPosition || "50% 30%",
            isPrimary: i === primary,
            sortOrder: i,
          })),
        });
      }
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") return { error: "Bu slug veya ürün kodu zaten kullanılıyor." };
    throw e;
  }

  revalidateSite();
  if (!id) redirect(`/admin/products/${productId}?created=1`);
  return { ok: true, message: "Ürün kaydedildi." };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await db.product.delete({ where: { id } });
  revalidateSite();
  redirect("/admin/products");
}

export async function duplicateProduct(id: string) {
  await requireAdmin();
  const p = await db.product.findUniqueOrThrow({ where: { id }, include: { images: true } });
  const { id: _id, createdAt: _c, updatedAt: _u, images, category: _cat, collection: _col, ...rest } = p as typeof p & { category?: unknown; collection?: unknown };
  const suffix = Date.now().toString(36).slice(-4);
  const copy = await db.product.create({
    data: {
      ...rest,
      specs: rest.specs as Prisma.InputJsonValue,
      featuresEn: rest.featuresEn as Prisma.InputJsonValue,
      featuresTr: rest.featuresTr as Prisma.InputJsonValue,
      featuresFr: (rest.featuresFr ?? []) as Prisma.InputJsonValue,
      slug: `${p.slug}-${suffix}`,
      code: p.code ? `${p.code}-${suffix}` : null,
      nameEn: `${p.nameEn} (copy)`,
      nameTr: `${p.nameTr} (kopya)`,
      nameFr: p.nameFr ? `${p.nameFr} (copie)` : null,
      published: false,
      images: { create: images.map(({ id: _i, productId: _p, ...img }) => img) },
    },
  });
  redirect(`/admin/products/${copy.id}`);
}
