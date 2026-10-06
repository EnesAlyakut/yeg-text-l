import { TaxonomyTable } from "@/components/admin/TaxonomyTable";
import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";

export const metadata = { title: "Kategoriler" };

export default async function AdminCategories() {
  const rows = await db.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <PageTitle title="Ürün kategorileri" description="Ürünler sayfasındaki filtrelerde kullanılır." />
      <TaxonomyTable kind="category" countLabel="Ürün"
        rows={rows.map((r) => ({ id: r.id, nameTr: r.nameTr, nameEn: r.nameEn, nameFr: r.nameFr, slug: r.slug, sortOrder: r.sortOrder, count: r._count.products }))} />
    </>
  );
}
