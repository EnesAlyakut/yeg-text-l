import type { Collection } from "@prisma/client";
import { FormShell } from "@/components/admin/FormShell";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { readGallery } from "@/lib/queries";
import { PickList, type PickOption } from "@/components/admin/PickList";
import { SlugInput } from "@/components/admin/SlugInput";
import { Bilingual, Card, Checkbox, Field, Input } from "@/components/admin/ui";
import { saveCollection } from "./actions";

type Props = { collection?: Collection; products: PickOption[]; assigned: string[] };

export function CollectionForm({ collection: c, products, assigned }: Props) {
  const action = saveCollection.bind(null, c?.id ?? null);
  return (
    <FormShell action={action}>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Temel bilgiler">
            <Bilingual label="Koleksiyon adı *" name="name" en={c?.nameEn} tr={c?.nameTr} fr={c?.nameFr} required />
            <SlugInput defaultValue={c?.slug} sourceName="nameEn" prefix="/collections/" />
            <Bilingual label="Sezon / etiket" name="season" en={c?.seasonEn} tr={c?.seasonTr} fr={c?.seasonFr} hint="Örn. SS26 / İY26, Premium, Core" />
            <Bilingual label="Slogan" name="tagline" en={c?.taglineEn} tr={c?.taglineTr} fr={c?.taglineFr} />
            <Bilingual label="Açıklama" name="description" en={c?.descriptionEn} tr={c?.descriptionTr} fr={c?.descriptionFr} textarea rows={5} />
          </Card>
          <Card title="Kapak görseli" description="Koleksiyon sayfası ve ana sayfadaki yatay kaydırma bölümünde kullanılır. 1600px+ genişlikteki görseller tam ekran gösterilir.">
            <ImageField
              label="Kapak"
              name="cover"
              value={c?.coverUrl ? { url: c.coverUrl, width: c.coverWidth ?? 0, height: c.coverHeight ?? 0, blur: c.coverBlur, position: c.coverPosition } : null}
            />
          </Card>
          <Card
            title="Galeri görselleri"
            description="Koleksiyon sayfasında kapaktan sonra, görseller kırpılmadan editoryal bir galeri olarak gösterilir. Birden fazla görsel yükleyebilir, sıralayabilir ve alt metinlerini altyazı olarak kullanabilirsiniz."
          >
            <GalleryField primary={false} name="gallery" initial={(readGallery(c?.gallery ?? []).map((i) => ({ ...i, blurDataUrl: i.blurDataUrl ?? null, isPrimary: false })))} />
          </Card>
          <Card title="Ürünler" description="Bu koleksiyona atanacak ürünler. Bir ürün yalnızca bir koleksiyonda olabilir.">
            <PickList name="productIds" options={products} initial={assigned} />
          </Card>
          <Card title="SEO">
            <Bilingual label="SEO başlığı" name="seoTitle" en={c?.seoTitleEn} tr={c?.seoTitleTr} fr={c?.seoTitleFr} />
            <Bilingual label="SEO açıklaması" name="seoDescription" en={c?.seoDescriptionEn} tr={c?.seoDescriptionTr} fr={c?.seoDescriptionFr} textarea rows={3} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Yayın">
            <Checkbox name="published" label="Yayında" defaultChecked={c?.published ?? true} />
            <Checkbox name="isFeatured" label="Öne çıkan koleksiyon" defaultChecked={c?.isFeatured} />
            <Field label="Sıralama">
              <Input name="sortOrder" type="number" defaultValue={c?.sortOrder ?? 0} />
            </Field>
          </Card>
        </div>
      </div>
    </FormShell>
  );
}
