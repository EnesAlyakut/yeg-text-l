"use client";

import Link from "next/link";
import { SaveBar, cell, useBulkRows } from "@/components/admin/bulk";
import { cn } from "@/lib/utils";
import { bulkUpdatePosts, type PostRow } from "../bulk-actions";

type Meta = { cover: { url: string; position: string } | null; galleryCount: number };

export function PostsTable({ rows: initial, meta, categories }: { rows: PostRow[]; meta: Record<string, Meta>; categories: { id: string; name: string }[] }) {
  const b = useBulkRows(initial, bulkUpdatePosts);
  const now = new Date().toISOString().slice(0, 10);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="admin-table">
          <thead>
            <tr>
              <th />
              <th>Başlık (TR)</th>
              <th>Başlık (EN)</th>
              <th>Kategori</th>
              <th>Yayın tarihi</th>
              <th className="text-center">Yayında</th>
              <th className="text-center">Öne çıkan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => {
              const m = meta[r.id];
              return (
                <tr key={r.id} className={cn(b.isDirty(r) && "[&>td]:bg-brand/5")}>
                  <td className="w-20">
                    {m.cover && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                      <img src={m.cover.url} alt="" className="h-12 w-16 rounded object-cover" style={{ objectPosition: m.cover.position }} />
                    )}
                  </td>
                  <td>
                    <input className={cn(cell.input, "min-w-56")} value={r.titleTr} onChange={(e) => b.patch(r.id, { titleTr: e.target.value })} />
                  </td>
                  <td>
                    <input className={cn(cell.input, "min-w-56")} value={r.titleEn} onChange={(e) => b.patch(r.id, { titleEn: e.target.value })} />
                  </td>
                  <td>
                    <select className={cn(cell.input, "min-w-32")} value={r.categoryId ?? ""} onChange={(e) => b.patch(r.id, { categoryId: e.target.value || null })}>
                      <option value="">—</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input type="date" className={cn(cell.input, "w-36")} value={r.publishedAt.slice(0, 10)} onChange={(e) => b.patch(r.id, { publishedAt: e.target.value })} />
                    {r.publishedAt.slice(0, 10) > now && <p className="mt-1 text-[0.65rem] text-ash">Zamanlandı</p>}
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className={cell.check} checked={r.published} onChange={(e) => b.patch(r.id, { published: e.target.checked })} />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className={cell.check} checked={r.isFeatured} onChange={(e) => b.patch(r.id, { isFeatured: e.target.checked })} />
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="whitespace-nowrap text-[0.7rem] text-ash">{m.galleryCount} görsel</span>
                      <Link href={`/admin/blog/${r.id}`} className="admin-btn whitespace-nowrap py-1.5">
                        Düzenle
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <SaveBar
        dirtyCount={b.dirty.length}
        pending={b.pending}
        message={b.message}
        onSave={b.saveAll}
        onReset={b.reset}
        hint="Başlık, kategori, tarih ve durumu tablodan değiştirin. İçerik, kapak ve galeri için “Düzenle”."
      />
    </>
  );
}
