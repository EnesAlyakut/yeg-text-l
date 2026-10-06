import type { Blog, BlogCategory } from "@prisma/client";
import { FormShell } from "@/components/admin/FormShell";
import { GalleryField } from "@/components/admin/GalleryField";
import { ImageField } from "@/components/admin/ImageField";
import { readGallery } from "@/lib/queries";
import { SlugInput } from "@/components/admin/SlugInput";
import { Bilingual, Card, Checkbox, Field, Input, Select } from "@/components/admin/ui";
import { savePost } from "./actions";

const FORMAT_HINT = "Biçimlendirme: boş satırla paragraf, '## ' ara başlık, '> ' alıntı, '- ' liste, **kalın**, *italik*, [bağlantı](https://…).";

export function PostForm({ post, categories }: { post?: Blog; categories: BlogCategory[] }) {
  const action = savePost.bind(null, post?.id ?? null);
  const date = (post?.publishedAt ?? new Date()).toISOString().slice(0, 16);
  return (
    <FormShell action={action}>
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <Card title="Yazı">
            <Bilingual label="Başlık *" name="title" en={post?.titleEn} tr={post?.titleTr} fr={post?.titleFr} required />
            <SlugInput defaultValue={post?.slug} sourceName="titleEn" prefix="/blog/" />
            <Bilingual label="Özet" name="excerpt" en={post?.excerptEn} tr={post?.excerptTr} fr={post?.excerptFr} textarea rows={3} hint="Liste sayfasında ve paylaşımlarda görünür." />
          </Card>
          <Card title="İçerik (English) *">
            <textarea name="contentEn" defaultValue={post?.contentEn ?? ""} rows={18} required className="admin-input font-mono text-[0.8rem]" />
            <p className="admin-hint">{FORMAT_HINT}</p>
          </Card>
          <Card title="İçerik (Türkçe) *">
            <textarea name="contentTr" defaultValue={post?.contentTr ?? ""} rows={18} required className="admin-input font-mono text-[0.8rem]" />
          </Card>
          <Card title="İçerik (Français)" description="Boş bırakılırsa Fransızca sitede İngilizce içerik gösterilir.">
            <textarea name="contentFr" defaultValue={post?.contentFr ?? ""} rows={18} className="admin-input font-mono text-[0.8rem]" />
          </Card>
          <Card title="Kapak görseli">
            <ImageField
              label="Kapak"
              name="cover"
              value={post?.coverUrl ? { url: post.coverUrl, width: post.coverWidth ?? 0, height: post.coverHeight ?? 0, blur: post.coverBlur, position: post.coverPosition } : null}
              hint="1600px+ genişlikte görseller yazı sayfasında tam genişlik gösterilir."
            />
          </Card>
          <Card title="Galeri görselleri" description="Yazının sonunda, içerikten sonra gösterilir. Birden fazla görsel yükleyebilir ve sıralayabilirsiniz; alt metinler altyazı olur.">
            <GalleryField primary={false} name="gallery" initial={(readGallery(post?.gallery ?? []).map((i) => ({ ...i, blurDataUrl: i.blurDataUrl ?? null, isPrimary: false })))} />
          </Card>
          <Card title="SEO">
            <Bilingual label="SEO başlığı" name="seoTitle" en={post?.seoTitleEn} tr={post?.seoTitleTr} fr={post?.seoTitleFr} />
            <Bilingual label="SEO açıklaması" name="seoDescription" en={post?.seoDescriptionEn} tr={post?.seoDescriptionTr} fr={post?.seoDescriptionFr} textarea rows={3} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Yayın">
            <Checkbox name="published" label="Yayında" defaultChecked={post?.published ?? true} />
            <Checkbox name="isFeatured" label="Öne çıkan (blog sayfasında büyük)" defaultChecked={post?.isFeatured} />
            <Field label="Yayın tarihi" hint="İleri tarih verirseniz o tarihte yayına girer.">
              <Input type="datetime-local" name="publishedAt" defaultValue={date} />
            </Field>
            <Field label="Yazar">
              <Input name="author" defaultValue={post?.author ?? "YEG Textile"} />
            </Field>
            <Field label="Kategori">
              <Select name="categoryId" defaultValue={post?.categoryId ?? ""}>
                <option value="">—</option>
                {categories.map((c) => (
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
