import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/queries";
import { ProductForm } from "../ProductForm";

export const metadata = { title: "Yeni ürün" };

export default async function NewProduct() {
  const [categories, collections, { general }] = await Promise.all([
    db.category.findMany({ orderBy: { sortOrder: "asc" } }),
    db.collection.findMany({ orderBy: { sortOrder: "asc" } }),
    getSettings(),
  ]);
  return (
    <>
      <PageTitle title="Yeni ürün" />
      <ProductForm categories={categories} collections={collections} currency={general.currency} />
    </>
  );
}
