"use client";

import { useState } from "react";
import type { SpecRow } from "@/lib/content-types";

const COLUMNS: { key: keyof SpecRow; head: string; placeholder: string }[] = [
  { key: "labelEn", head: "Başlık (EN)", placeholder: "Fit" },
  { key: "labelTr", head: "Başlık (TR)", placeholder: "Kalıp" },
  { key: "labelFr", head: "Başlık (FR)", placeholder: "Coupe" },
  { key: "valueEn", head: "Değer (EN)", placeholder: "Relaxed" },
  { key: "valueTr", head: "Değer (TR)", placeholder: "Rahat" },
  { key: "valueFr", head: "Değer (FR)", placeholder: "Ample" },
];

export function SpecsField({ name, initial }: { name: string; initial: SpecRow[] }) {
  const [rows, setRows] = useState<SpecRow[]>(initial);
  const patch = (i: number, p: Partial<SpecRow>) => setRows((r) => r.map((row, idx) => (idx === i ? { ...row, ...p } : row)));

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(rows.filter((r) => r.labelEn || r.labelTr))} />
      <div className="hidden grid-cols-[repeat(6,1fr)_auto] gap-2 px-1 pb-1 text-[0.65rem] text-ash md:grid">
        {COLUMNS.map((c) => (
          <span key={c.key}>{c.head}</span>
        ))}
        <span />
      </div>
      <div className="space-y-2">
        {rows.map((row, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 md:grid-cols-[repeat(6,1fr)_auto]">
            {COLUMNS.map((c) => (
              <input
                key={c.key}
                className="admin-input"
                placeholder={c.placeholder}
                value={row[c.key] ?? ""}
                onChange={(e) => patch(i, { [c.key]: e.target.value })}
              />
            ))}
            <button type="button" className="admin-btn admin-btn--danger col-span-3 md:col-span-1" onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="admin-btn mt-3"
        onClick={() => setRows((r) => [...r, { labelEn: "", labelTr: "", labelFr: "", valueEn: "", valueTr: "", valueFr: "" }])}
      >
        + Satır ekle
      </button>
    </div>
  );
}
