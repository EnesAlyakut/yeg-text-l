"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type PickOption = { value: string; label: string; sub?: string; image?: string | null };

/**
 * Ordered multi-select with search — used for "products in this collection",
 * homepage featured products, showcase products and collection order.
 */
export function PickList({ name, options, initial, ordered, max }: { name: string; options: PickOption[]; initial: string[]; ordered?: boolean; max?: number }) {
  const [selected, setSelected] = useState<string[]>(initial.filter((v) => options.some((o) => o.value === v)));
  const [q, setQ] = useState("");
  const byValue = useMemo(() => new Map(options.map((o) => [o.value, o])), [options]);
  const available = options.filter((o) => !selected.includes(o.value) && (!q || `${o.label} ${o.sub ?? ""}`.toLowerCase().includes(q.toLowerCase())));

  const move = (i: number, dir: -1 | 1) =>
    setSelected((s) => {
      const n = [...s];
      const j = i + dir;
      if (j < 0 || j >= n.length) return s;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <input type="hidden" name={name} value={JSON.stringify(selected)} />
      <div>
        <p className="admin-label">
          Seçili ({selected.length}
          {max ? ` / ${max}` : ""})
        </p>
        <ul className="max-h-80 space-y-1 overflow-y-auto rounded-md border border-line p-1">
          {selected.length === 0 && <li className="p-3 text-xs text-ash">Henüz seçim yok.</li>}
          {selected.map((v, i) => {
            const o = byValue.get(v)!;
            return (
              <li key={v} className="flex items-center gap-2 rounded bg-smoke px-2 py-1.5 text-sm">
                {o.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={o.image} alt="" className="h-8 w-6 rounded object-cover" />
                )}
                <span className="min-w-0 flex-1 truncate">
                  {o.label}
                  {o.sub && <span className="block truncate text-[0.7rem] text-ash">{o.sub}</span>}
                </span>
                {ordered && (
                  <>
                    <button type="button" className="px-1 text-ash hover:text-bone" onClick={() => move(i, -1)} aria-label="Yukarı">
                      ↑
                    </button>
                    <button type="button" className="px-1 text-ash hover:text-bone" onClick={() => move(i, 1)} aria-label="Aşağı">
                      ↓
                    </button>
                  </>
                )}
                <button type="button" className="px-1 text-ash hover:text-brand" onClick={() => setSelected((s) => s.filter((x) => x !== v))} aria-label="Kaldır">
                  ×
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        <input className="admin-input mb-2" placeholder="Ara…" value={q} onChange={(e) => setQ(e.target.value)} />
        <ul className="max-h-72 space-y-1 overflow-y-auto rounded-md border border-line p-1">
          {available.map((o) => (
            <li key={o.value}>
              <button
                type="button"
                disabled={Boolean(max && selected.length >= max)}
                onClick={() => setSelected((s) => [...s, o.value])}
                className={cn("flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-smoke disabled:opacity-40")}
              >
                {o.image && (
                  // eslint-disable-next-line @next/next/no-img-element -- admin thumbnail
                  <img src={o.image} alt="" className="h-8 w-6 rounded object-cover" />
                )}
                <span className="min-w-0 flex-1 truncate">
                  {o.label}
                  {o.sub && <span className="block truncate text-[0.7rem] text-ash">{o.sub}</span>}
                </span>
                <span className="text-ash">+</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
