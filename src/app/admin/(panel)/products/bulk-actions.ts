"use server";

import { Prisma } from "@prisma/client";
import { z } from "zod";
import { revalidateSite } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const row = z.object({
  id: z.string().min(1),
  price: z.number().nonnegative(),
  sortOrder: z.number().int(),
  categoryId: z.string().nullable(),
  collectionId: z.string().nullable(),
  published: z.boolean(),
  isFeatured: z.boolean(),
});

export type BulkRow = z.infer<typeof row>;

/** Saves every changed row of the admin product table in one transaction. */
export async function bulkUpdateProducts(rows: BulkRow[]): Promise<{ ok: boolean; error?: string; count?: number }> {
  await requireAdmin();
  const parsed = z.array(row).safeParse(rows);
  if (!parsed.success) return { ok: false, error: "Geçersiz değer var (fiyat/sıra alanlarını kontrol edin)." };
  if (!parsed.data.length) return { ok: true, count: 0 };

  await db.$transaction(
    parsed.data.map((r) =>
      db.product.update({
        where: { id: r.id },
        data: {
          price: new Prisma.Decimal(r.price),
          sortOrder: r.sortOrder,
          categoryId: r.categoryId,
          collectionId: r.collectionId,
          published: r.published,
          isFeatured: r.isFeatured,
        },
      }),
    ),
  );
  revalidateSite();
  return { ok: true, count: parsed.data.length };
}
