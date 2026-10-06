"use client";

import { bulkUpdateTaxonomy, type TaxonomyRow } from "@/app/admin/(panel)/bulk-actions";
import { deleteTaxonomy, saveTaxonomy } from "@/app/admin/(panel)/taxonomy-actions";
import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { SaveBar, cell, useBulkRows } from "./bulk";
import { DeleteButton } from "./DeleteButton";

type Row = TaxonomyRow & { count: number };

/** All categories editable at once; one save button; add and delete inline. */
export function TaxonomyTable({ kind, rows, countLabel }: { kind: "category" | "blogCategory"; rows: Row[]; countLabel: string }) {
  const counts = Object.fromEntries(rows.map((r) => [r.id, r.count]));
  // Stable reference: the hook re-syncs whenever this array identity changes.
  const editable = useMemo(() => rows.map(({ count: _count, ...r }) => r), [rows]);
  const b = useBulkRows<TaxonomyRow>(editable, (dirty) => bulkUpdateTaxonomy(kind, dirty));

  return (
    <>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ad (TR)</th>
              <th>Ad (EN)</th>
              <th>Ad (FR)</th>
              <th>Slug</th>
              <th>Sıra</th>
              <th>{countLabel}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {b.rows.map((r) => (
              <tr key={r.id} className={cn(b.isDirty(r) && "[&>td]:bg-brand/5")}>
                <td>
                  <input className={cn(cell.input, "min-w-44")} value={r.nameTr} onChange={(e) => b.patch(r.id, { nameTr: e.target.value })} />
                </td>
                <td>
                  <input className={cn(cell.input, "min-w-44")} value={r.nameEn} onChange={(e) => b.patch(r.id, { nameEn: e.target.value })} />
                </td>
                <td>
                  <input className={cn(cell.input, "min-w-44")} value={r.nameFr ?? ""} placeholder={r.nameEn} onChange={(e) => b.patch(r.id, { nameFr: e.target.value })} />
                </td>
                <td>
                  <input className={cn(cell.input, "min-w-36 font-mono text-xs")} value={r.slug} onChange={(e) => b.patch(r.id, { slug: e.target.value })} />
                </td>
                <td>
                  <input type="number" className={cn(cell.input, "w-20")} value={r.sortOrder} onChange={(e) => b.patch(r.id, { sortOrder: Number.parseInt(e.target.value || "0", 10) })} />
                </td>
                <td className="text-ash">{counts[r.id]}</td>
                <td className="text-right">
                  <DeleteButton action={deleteTaxonomy.bind(null, kind, r.id)} confirmText="Silinsin mi? İlişkili kayıtlar silinmez, sadece bu etiketten çıkarılır." />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form action={saveTaxonomy.bind(null, kind, null)} className="mt-4 grid grid-cols-2 gap-2 rounded-lg border border-dashed border-line p-3 md:grid-cols-[1fr_1fr_1fr_1fr_90px_auto] md:items-center">
        <input name="nameTr" placeholder="Yeni — Türkçe ad" required className="admin-input" />
        <input name="nameEn" placeholder="New — English name" required className="admin-input" />
        <input name="nameFr" placeholder="Nouveau — nom français" className="admin-input" />
        <input name="slug" placeholder="slug (otomatik)" className="admin-input" />
        <input name="sortOrder" type="number" defaultValue={rows.length} className="admin-input" />
        <button className="admin-btn admin-btn--primary">+ Ekle</button>
      </form>

      <SaveBar dirtyCount={b.dirty.length} pending={b.pending} message={b.message} onSave={b.saveAll} onReset={b.reset} hint="Tüm satırları düzenleyip tek seferde kaydedin." />
    </>
  );
}
