import type { Category, Collection, Product, ProductImage } from "@prisma/client";
import { FormShell } from "@/components/admin/FormShell";
import { GalleryField } from "@/components/admin/GalleryField";
import { SlugInput } from "@/components/admin/SlugInput";
import { SpecsField } from "@/components/admin/SpecsField";
import { Bilingual, Card, Checkbox, Field, Input, Select } from "@/components/admin/ui";
import { readSpecs } from "@/lib/queries";
import { saveProduct } from "./actions";

type Props = {
  product?: Product & { images: ProductImage[] };
  categories: Category[];
  collections: Collection[];
  currency: string;
};

const list = (v: unknown) => (Array.isArray(v) ? v.join("\n") : "");

export function ProductForm({ product, categories, collections, currency }: Props) {
  const action = saveProduct.bind(null, product?.id ?? null);

  return (
    <FormShell action={action}>
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title="Temel bilgiler">
            <Bilingual label="Ürün adı *" name="name" en={product?.nameEn} tr={product?.nameTr} fr={product?.nameFr} required />
            <SlugInput defaultValue={product?.slug} sourceName="nameEn" prefix="/products/" />
            <Bilingual label="Kısa açıklama" name="short" en={product?.shortEn} tr={product?.shortTr} fr={product?.shortFr} textarea rows={2} hint="Kartlarda ve SEO açıklaması boşsa meta açıklamada kullanılır." />
            <Bilingual label="Ürün açıklaması" name="description" en={product?.descriptionEn} tr={product?.descriptionTr} fr={product?.descriptionFr} textarea rows={6} />
          </Card>

          <Card title="Görseller" description="İlk / ana görsel ürün kartlarında kullanılır. Ek galeri görselleri detay sayfasında gösterilir.">
            <GalleryField
              name="images"
              initial={(product?.images ?? [])
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((i) => ({
                  url: i.url,
                  width: i.width,
                  height: i.height,
                  blurDataUrl: i.blurDataUrl,
                  altEn: i.altEn ?? "",
                  altTr: i.altTr ?? "",
                  altFr: i.altFr ?? "",
                  objectPosition: i.objectPosition,
                  isPrimary: i.isPrimary,
                }))}
            />
          </Card>

          <Card title="Materyal & özellikler">
            <Bilingual label="Materyal" name="material" en={product?.materialEn} tr={product?.materialTr} fr={product?.materialFr} />
            <Bilingual label="Renk" name="color" en={product?.colorEn} tr={product?.colorTr} fr={product?.colorFr} />
            <Bilingual label="Özellikler" name="features" en={list(product?.featuresEn)} tr={list(product?.featuresTr)} fr={list(product?.featuresFr)} textarea rows={5} hint="Her satıra bir özellik yazın." />
          </Card>

          <Card title="Teknik bilgiler" description="Detay sayfasındaki teknik tablo.">
            <SpecsField name="specs" initial={product ? readSpecs(product.specs) : []} />
          </Card>

          <Card title="SEO">
            <Bilingual label="SEO başlığı" name="seoTitle" en={product?.seoTitleEn} tr={product?.seoTitleTr} fr={product?.seoTitleFr} hint="Boş bırakılırsa ürün adı kullanılır. ~60 karakter." />
            <Bilingual label="SEO açıklaması" name="seoDescription" en={product?.seoDescriptionEn} tr={product?.seoDescriptionTr} fr={product?.seoDescriptionFr} textarea rows={3} hint="~155 karakter." />
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Yayın">
            <Checkbox name="published" label="Yayında" defaultChecked={product?.published ?? true} />
            <Checkbox name="isFeatured" label="Öne çıkan ürün" hint="Ana sayfa 'Seçili parçalar' için önerilir." defaultChecked={product?.isFeatured} />
            <Checkbox name="isShowcase" label="Vitrin ürünü" hint="Tam ekran ürün tanıtımı için uygun." defaultChecked={product?.isShowcase} />
            <Field label="Sıralama" hint="Küçük sayı önce gösterilir.">
              <Input name="sortOrder" type="number" defaultValue={product?.sortOrder ?? 0} />
            </Field>
          </Card>

          <Card title="Fiyat & kod">
            <Field label={`Fiyat (${currency}) *`}>
              <Input name="price" inputMode="decimal" required defaultValue={product ? Number(product.price).toString() : ""} />
            </Field>
            <Field label="Ürün kodu" hint="Örn. YEG-26-004">
              <Input name="code" defaultValue={product?.code ?? ""} />
            </Field>
          </Card>

          <Card title="Sınıflandırma">
            <Field label="Kategori">
              <Select name="categoryId" defaultValue={product?.categoryId ?? ""}>
                <option value="">—</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameTr} / {c.nameEn}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Koleksiyon">
              <Select name="collectionId" defaultValue={product?.collectionId ?? ""}>
                <option value="">—</option>
                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameTr} / {c.nameEn}
                  </option>
                ))}
              </Select>
            </Field>
          </Card>
        </div>
      </div>
    </FormShell>
  );
}
