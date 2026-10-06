"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { bulkUpdateProducts, type BulkRow } from "./bulk-actions";

export type TableProduct = BulkRow & {
  nameTr: string;
  nameEn: string;
  code: string | null;
  image: { url: string; position: string } | null;
};

type Opt = { id: string; name: string };

/** Inline, spreadsheet-style editing for the whole catalogue with a single save. */
export function BulkTable({ products, categories, collections, currency }: { products: TableProduct[]; categories: Opt[]; collections: Opt[]; currency: string }) {
  const [rows, setRows] = useState(products);
  const [source, setSource] = useState(() => JSON.stringify(products));
  // Only real data changes replace the local copy — a plain refresh never wipes unsaved edits.
  const incoming = JSON.stringify(products);
  if (source !== incoming) {
    setSource(incoming);
    setRows(products);
  }
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const original = useMemo(() => new Map(products.map((p) => [p.id, JSON.stringify(pick(p))])), [products]);
  const dirty = rows.filter((r) => original.get(r.id) !== JSON.stringify(pick(r)));

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty.length) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty.length]);

  const patch = (id: string, p: Partial<TableProduct>) => setRows((cur) => cur.map((r) => (r.id === id ? { ...r, ...p } : r)));

  const save = () =>
    start(async () => {
      if (!dirty.length) {
        setMessage({ ok: true, text: "Değişiklik yok — her şey kayıtlı." });
        return;
      }
      const res = await bulkUpdateProducts(dirty.map(pick));
      setMessage(res.ok ? { ok: true, text: `${res.count} ürün güncellendi.` } : { ok: false, text: res.error ?? "Kaydedilemedi." });
      if (res.ok) router.refresh();
    });

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="admin-table">
          <thead>
            <tr>
              <th />
              <th>Ürün</th>
              <th>Kategori</th>
              <th>Koleksiyon</th>
              <th>Fiyat ({currency})</th>
              <th>Sıra</th>
              <th className="text-center">Yayında</th>
              <th className="text-center">Öne çıkan</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const changed = original.get(p.id) !== JSON.stringify(pick(p));
              return (
                <tr key={p.id} className={cn(changed && "[&>td]:bg-brand/5")}>
                  <td className="w-14">
                    {p.image && (
                      // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                      <img src={p.image.url} alt="" className="h-14 w-10 rounded object-cover" style={{ objectPosition: p.image.position }} />
                    )}
                  </td>
                  <td className="min-w-52">
                    <Link href={`/admin/products/${p.id}`} className="font-medium hover:text-brand">
                      {p.nameTr}
                    </Link>
                    <p className="text-xs text-ash">
                      {p.code} · {p.nameEn}
                    </p>
                  </td>
                  <td>
                    <select className="admin-input min-w-44 py-1.5" value={p.categoryId ?? ""} onChange={(e) => patch(p.id, { categoryId: e.target.value || null })}>
                      <option value="">—</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select className="admin-input min-w-36 py-1.5" value={p.collectionId ?? ""} onChange={(e) => patch(p.id, { collectionId: e.target.value || null })}>
                      <option value="">—</option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className="admin-input w-24 py-1.5 tabular-nums"
                      value={Number.isFinite(p.price) ? p.price : ""}
                      onChange={(e) => patch(p.id, { price: e.target.value === "" ? NaN : Number(e.target.value) })}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      step="1"
                      className="admin-input w-20 py-1.5 tabular-nums"
                      value={p.sortOrder}
                      onChange={(e) => patch(p.id, { sortOrder: Number.parseInt(e.target.value || "0", 10) })}
                    />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="size-4 accent-[#d80000]" checked={p.published} onChange={(e) => patch(p.id, { published: e.target.checked })} />
                  </td>
                  <td className="text-center">
                    <input type="checkbox" className="size-4 accent-[#d80000]" checked={p.isFeatured} onChange={(e) => patch(p.id, { isFeatured: e.target.checked })} />
                  </td>
                  <td>
                    <Link href={`/admin/products/${p.id}`} className="admin-btn whitespace-nowrap py-1.5">
                      Düzenle
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-between gap-4 border-t border-line bg-coal/95 px-4 py-4 backdrop-blur lg:-mx-10 lg:px-10">
        <p className="text-sm">
          {message ? (
            <span className={message.ok ? "text-green-400" : "text-brand"}>{message.text}</span>
          ) : dirty.length ? (
            <span className="text-bone">{dirty.length} üründe kaydedilmemiş değişiklik var.</span>
          ) : (
            <span className="text-ash">Alanları doğrudan tablodan değiştirebilirsiniz. Görsel, açıklama ve SEO için “Düzenle”.</span>
          )}
        </p>
        <div className="flex gap-2">
          {dirty.length > 0 && (
            <button type="button" className="admin-btn" onClick={() => (setRows(products), setMessage(null))} disabled={pending}>
              Vazgeç
            </button>
          )}
          <button type="button" className="admin-btn admin-btn--primary" onClick={save} disabled={pending}>
            {pending ? "Kaydediliyor…" : `Tümünü kaydet${dirty.length ? ` (${dirty.length})` : ""}`}
          </button>
        </div>
      </div>
    </>
  );
}

function pick(r: BulkRow): BulkRow {
  return { id: r.id, price: r.price, sortOrder: r.sortOrder, categoryId: r.categoryId, collectionId: r.collectionId, published: r.published, isFeatured: r.isFeatured };
}
