"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function deleteMedia(id: string) {
  await requireAdmin();
  const asset = await db.mediaAsset.findUnique({ where: { id }, select: { url: true, source: true } });
  if (!asset) return { error: "Bulunamadı" };
  if (asset.source === "brand") return { error: "Marka paketi görselleri silinemez." };
  const url = asset.url;
  const like = `%${url}%`;

  // Any product image, cover, gallery or homepage block that still points at this file?
  const [images, refs] = await Promise.all([
    db.productImage.count({ where: { url } }),
    db.$queryRaw<{ n: bigint }[]>`
      select (
        (select count(*) from "Collection" where "coverUrl" = ${url} or gallery::text like ${like}) +
        (select count(*) from "Blog" where "coverUrl" = ${url} or gallery::text like ${like}) +
        (select count(*) from "HomepageSection" where data::text like ${like})
      )::bigint as n`,
  ]);
  if (images + Number(refs[0]?.n ?? 0) > 0) return { error: "Bu görsel kullanımda; önce ilgili kayıtlardan kaldırın." };

  await db.mediaAsset.delete({ where: { id } });
  revalidatePath("/admin/media");
  return { ok: true };
}
