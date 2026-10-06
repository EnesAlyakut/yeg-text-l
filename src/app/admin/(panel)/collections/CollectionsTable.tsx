"use client";

import Link from "next/link";
import { SaveBar, cell, useBulkRows } from "@/components/admin/bulk";
import { cn } from "@/lib/utils";
import { bulkUpdateCollections, type CollectionRow } from "../bulk-actions";

type Meta = { id: string; cover: { url: string; position: string } | null; productCount: number; galleryCount: number };

export function CollectionsTable({ rows: initial, meta }: { rows: CollectionRow[]; meta: Record<string, Meta> }) {
  const b = useBulkRows(initial, bulkUpdateCollections);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="admin-table">
          <thead>
            <tr>
              <th />
              <th>Ad (TR)</th>
              <th>Ad (EN)</th>
              <th>Sezon (TR / EN)</th>
              <th>Slug</th>
              <th>Sıra</th>
              <th className="text-center">Yayında</th>
              <th className="text-center">Öne çıkan</th>
              <th>İçerik</th>
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
                    <input className={cn(cell.input, "min-w-36")} value={r.nameTr} onChange={(e) => b.patch(r.id, { nameTr: e.target.value })} />
                  </td>
                  <td>
                    <input className={cn(cell.input, "min-w-36")} value={r.nameEn} onChange={(e) => b.patch(r.id, { nameEn: e.target.value })} />
                  </td>
                  <td>
                    <div className="flex gap-1.5">
                      <input className={cn(cell.input, "w-24")} value={r.seasonTr} onChange={(e) => b.patch(r.id, { seasonTr: e.target.value })} />
                      <input className={cn(cell.input, "w-24")} value={r.seasonEn} onChange={(e) => b.patch(r.id, { seasonEn: e.target.value })} />
                    </div>
                  </td>
                  <td>
                    <input className={cn(cell.input, "min-w-32 font-mono text-xs")} value={r.slug} onChange={(e) => b.patch(r.id, { slug: e.target.value })} />
                  </td>
                  <td>
                    <input type="number" className={cn(cell.input, "w-20")} value={r.sortOrder} onChange={(e) => b.patch(r.id, { sortOrder: Number.parseInt(e.target.value || "0", 10) })} />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className={cell.check} checked={r.published} onChange={(e) => b.patch(r.id, { published: e.target.checked })} />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className={cell.check} checked={r.isFeatured} onChange={(e) => b.patch(r.id, { isFeatured: e.target.checked })} />
                  </td>
                  <td className="whitespace-nowrap text-xs text-ash">
                    {m.productCount} ürün · {m.galleryCount} görsel
                  </td>
                  <td>
                    <Link href={`/admin/collections/${r.id}`} className="admin-btn whitespace-nowrap py-1.5">
                      Düzenle
                    </Link>
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
        hint="Alanları tablodan değiştirin. Kapak, galeri, açıklama, ürün ataması ve SEO için “Düzenle”."
      />
    </>
  );
}
