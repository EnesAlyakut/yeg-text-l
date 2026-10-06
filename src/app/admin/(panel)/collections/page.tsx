import { Empty, LinkButton, PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { readGallery } from "@/lib/queries";
import { CollectionsTable } from "./CollectionsTable";

export const metadata = { title: "Koleksiyonlar" };

export default async function AdminCollections() {
  const collections = await db.collection.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } });
  return (
    <>
      <PageTitle title="Koleksiyonlar" description={`${collections.length} koleksiyon`} actions={<LinkButton href="/admin/collections/new" primary>+ Yeni koleksiyon</LinkButton>} />
      {collections.length === 0 ? (
        <Empty>Henüz koleksiyon yok.</Empty>
      ) : (
        <CollectionsTable
          rows={collections.map((c) => ({
            id: c.id,
            nameTr: c.nameTr,
            nameEn: c.nameEn,
            seasonTr: c.seasonTr ?? "",
            seasonEn: c.seasonEn ?? "",
            slug: c.slug,
            sortOrder: c.sortOrder,
            published: c.published,
            isFeatured: c.isFeatured,
          }))}
          meta={Object.fromEntries(
            collections.map((c) => [
              c.id,
              { id: c.id, cover: c.coverUrl ? { url: c.coverUrl, position: c.coverPosition } : null, productCount: c._count.products, galleryCount: readGallery(c.gallery).length },
            ]),
          )}
        />
      )}
    </>
  );
}
