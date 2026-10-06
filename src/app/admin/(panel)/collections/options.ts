import "server-only";
import type { PickOption } from "@/components/admin/PickList";
import { db } from "@/lib/db";

export async function productOptions(): Promise<PickOption[]> {
  const products = await db.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 }, collection: true },
  });
  return products.map((p) => ({
    value: p.id,
    label: p.nameTr,
    sub: [p.code, p.collection?.nameTr].filter(Boolean).join(" · "),
    image: p.images[0]?.url ?? null,
  }));
}
