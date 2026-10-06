import { PageTitle } from "@/components/admin/ui";
import { CollectionForm } from "../CollectionForm";
import { productOptions } from "../options";

export const metadata = { title: "Yeni koleksiyon" };

export default async function NewCollection() {
  return (
    <>
      <PageTitle title="Yeni koleksiyon" />
      <CollectionForm products={await productOptions()} assigned={[]} />
    </>
  );
}
