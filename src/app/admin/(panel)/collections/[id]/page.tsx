import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { deleteCollection } from "../actions";
import { CollectionForm } from "../CollectionForm";
import { productOptions } from "../options";

export const metadata = { title: "Koleksiyonu düzenle" };

export default async function EditCollection({ params }: PageProps<"/admin/collections/[id]">) {
  const { id } = await params;
  const [collection, options] = await Promise.all([
    db.collection.findUnique({ where: { id }, include: { products: { select: { id: true }, orderBy: { sortOrder: "asc" } } } }),
    productOptions(),
  ]);
  if (!collection) notFound();
  return (
    <>
      <PageTitle
        title={collection.nameTr}
        description={collection.nameEn}
        actions={
          <>
            <Link href={`/collections/${collection.slug}`} target="_blank" className="admin-btn">
              Sitede gör ↗
            </Link>
            <DeleteButton action={deleteCollection.bind(null, collection.id)} confirmText="Koleksiyon silinecek; ürünler silinmez, sadece koleksiyondan çıkarılır. Emin misiniz?" />
          </>
        }
      />
      <CollectionForm collection={collection} products={options} assigned={collection.products.map((p) => p.id)} />
    </>
  );
}
