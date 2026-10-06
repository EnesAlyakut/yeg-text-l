import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { deleteProduct, duplicateProduct } from "../actions";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Ürünü düzenle" };

export default async function EditProduct({ params, searchParams }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const { created } = (await searchParams) as { created?: string };
  const [product, categories, collections, { general }] = await Promise.all([
    db.product.findUnique({ where: { id }, include: { images: true } }),
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageTitle
        title={product.nameTr}
        description={created ? "Ürün oluşturuldu ✓" : product.nameEn}
        actions={
          <>
            <Link href={`/products/${product.slug}`} target="_blank" className="admin-btn">
              Sitede gör ↗
            </Link>
            <form action={duplicateProduct.bind(null, product.id)}>
              <button className="admin-btn">Kopyala</button>
            </form>
            <DeleteButton action={deleteProduct.bind(null, product.id)} />
          </>
        }
      />
      <ProductForm product={product} categories={categories} collections={collections} currency={general.currency} />
    </>
  );
}
