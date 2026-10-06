import { PageTitle } from "@/components/admin/ui";
import { db } from "@/lib/db";
import { DeleteMedia } from "./DeleteMedia";
import { MediaUploader } from "./MediaUploader";

export const metadata = { title: "Medya" };

export default async function MediaPage() {
  const select = { id: true, url: true, filename: true, width: true, height: true, size: true, mimeType: true } as const;
  const [uploads, brandAssets, stats] = await Promise.all([
    db.mediaAsset.findMany({ where: { source: "upload" }, orderBy: { createdAt: "desc" }, select }),
    db.mediaAsset.findMany({ where: { source: "brand", mimeType: { not: "image/svg+xml" } }, orderBy: { url: "asc" }, select }),
    db.mediaAsset.aggregate({ _count: true, _sum: { size: true } }),
  ]);
  const brand = brandAssets.map((a) => [a.url.replace(/^\/media\//, "").replace(/\.jpg$/, ""), { src: a.url, width: a.width, height: a.height }] as const);
  const images = uploads.filter((u) => u.mimeType.startsWith("image/"));

  return (
    <>
      <PageTitle title="Medya kütüphanesi" description={`Tüm görseller veritabanında saklanır — toplam ${stats._count} dosya, ${((stats._sum.size ?? 0) / 1024 / 1024).toFixed(1)} MB. Yüklenen görseller otomatik optimize edilir.`} actions={<MediaUploader />} />

      <h2 className="mb-3 text-sm font-semibold">Yüklenenler ({images.length})</h2>
      {images.length === 0 ? (
        <p className="mb-10 text-sm text-ash">Henüz yükleme yok.</p>
      ) : (
        <ul className="mb-12 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
          {images.map((u) => (
            <li key={u.id} className="admin-card p-2">
              {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
              <img src={u.url} alt="" loading="lazy" className="aspect-square w-full rounded object-cover" />
              <p className="mt-1 truncate text-[0.65rem]" title={u.filename}>
                {u.filename}
              </p>
              <div className="flex items-center justify-between text-[0.65rem] text-ash">
                {u.width}×{u.height}
                <DeleteMedia id={u.id} />
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mb-1 text-sm font-semibold">Marka paketi ({brand.length})</h2>
      <p className="mb-4 text-xs text-ash">ZIP içeriğinden optimize edilip veritabanına aktarılan kampanya, katalog ve doku görselleri (salt okunur).</p>
      <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
        {brand.map(([key, m]) => (
          <li key={key} className="admin-card p-2">
            {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail */}
            <img src={m.src} alt="" loading="lazy" className="aspect-square w-full rounded object-cover" />
            <p className="mt-1 truncate text-[0.65rem]" title={key}>
              {key}
            </p>
            <p className="text-[0.65rem] text-ash">
              {m.width}×{m.height}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
