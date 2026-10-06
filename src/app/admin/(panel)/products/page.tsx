import { Empty, LinkButton, PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { BulkTable } from "./BulkTable";

export const metadata = { title: "Ürünler" };

export default async function AdminProducts({ searchParams }: PageProps<"/admin/products">) {
  const { q, collection } = (await searchParams) as { q?: string; collection?: string };
  const [products, collections, { general }, categories] = await Promise.all([
    db.product.findMany({
      where: {
        ...(q ? { OR: [{ nameEn: { contains: q, mode: "insensitive" } }, { nameTr: { contains: q, mode: "insensitive" } }, { code: { contains: q, mode: "insensitive" } }] } : {}),
        ...(collection ? { collection: { slug: collection } } : {}),
      },
      include: { images: { orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }], take: 1 }, category: true, collection: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    db.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <>
      <PageTitle title="Ürünler" description={`${products.length} ürün`} actions={<LinkButton href="/admin/products/new" primary>+ Yeni ürün</LinkButton>} />

      <form className="mb-6 flex flex-wrap gap-2">
        <input name="q" defaultValue={q} placeholder="Ad veya kod ile ara…" className="admin-input max-w-xs" />
        <select name="collection" defaultValue={collection ?? ""} className="admin-input max-w-[220px]">
          <option value="">Tüm koleksiyonlar</option>
          {collections.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.nameTr}
            </option>
          ))}
        </select>
        <button className="admin-btn">Filtrele</button>
      </form>

      {products.length === 0 ? (
        <Empty>Ürün bulunamadı.</Empty>
      ) : (
        <BulkTable
          currency={general.currency}
          categories={categories.map((c) => ({ id: c.id, name: c.nameTr }))}
          collections={collections.map((c) => ({ id: c.id, name: c.nameTr }))}
          products={products.map((p) => ({
            id: p.id,
            nameTr: p.nameTr,
            nameEn: p.nameEn,
            code: p.code,
            image: p.images[0] ? { url: p.images[0].url, position: p.images[0].objectPosition } : null,
            price: Number(p.price),
            sortOrder: p.sortOrder,
            categoryId: p.categoryId,
            collectionId: p.collectionId,
            published: p.published,
            isFeatured: p.isFeatured,
          }))}
        />
      )}
    </>
  );
}
