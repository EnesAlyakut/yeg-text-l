"use client";

import { useEffect, useState } from "react";
import type { LibraryItem } from "@/app/api/admin/media/route";
import { cn } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; onPick: (items: LibraryItem[]) => void; multiple?: boolean };

/** Modal grid of uploaded + brand-package images. */
export function MediaPicker({ open, onClose, onPick, multiple }: Props) {
  const [items, setItems] = useState<LibraryItem[] | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [filter, setFilter] = useState<"all" | "upload" | "brand">("all");

  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch("/api/admin/media")
      .then((r) => r.json())
      .then((data) => alive && setItems(data));
    return () => {
      alive = false;
    };
  }, [open]);

  if (!open) return null;
  const visible = (items ?? []).filter((i) => filter === "all" || i.source === filter);

  const confirm = () => {
    onPick((items ?? []).filter((i) => selected.includes(i.id)));
    setSelected([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="flex max-h-[88vh] w-full max-w-5xl flex-col rounded-xl border border-line bg-graphite" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between gap-4 border-b border-line p-4">
          <h3 className="font-semibold">Medya kütüphanesi</h3>
          <div className="flex gap-1 text-xs">
            {(["all", "upload", "brand"] as const).map((f) => (
              <button key={f} type="button" onClick={() => setFilter(f)} className={cn("admin-btn py-1.5", filter === f && "border-bone")}>
                {f === "all" ? "Tümü" : f === "upload" ? "Yüklenenler" : "Marka paketi"}
              </button>
            ))}
          </div>
        </header>
        {/* content-start + auto rows: tiles keep their square shape instead of being squeezed to fit the scroll box */}
        <div className="grid min-h-0 flex-1 auto-rows-max grid-cols-2 content-start gap-3 overflow-y-auto p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {!items && <p className="col-span-full text-sm text-ash">Yükleniyor…</p>}
          {visible.map((item) => {
            const on = selected.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                title={`${item.label} — ${item.width}×${item.height}`}
                onClick={() => setSelected((s) => (multiple ? (on ? s.filter((x) => x !== item.id) : [...s, item.id]) : [item.id]))}
                className={cn(
                  "group relative block aspect-square w-full overflow-hidden rounded-lg border-2 bg-ink transition-colors",
                  on ? "border-brand" : "border-transparent hover:border-line",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnails */}
                <img src={item.url} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                {on && <span className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-brand text-xs text-white">✓</span>}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent px-2 pb-1.5 pt-5 text-left text-[0.65rem] text-mist">
                  <span className="block truncate text-bone">{item.label}</span>
                  {item.width}×{item.height}
                </span>
              </button>
            );
          })}
        </div>
        <footer className="flex justify-end gap-2 border-t border-line p-4">
          <button type="button" className="admin-btn" onClick={onClose}>
            Vazgeç
          </button>
          <button type="button" className="admin-btn admin-btn--primary" disabled={!selected.length} onClick={confirm}>
            Seç {selected.length > 1 ? `(${selected.length})` : ""}
          </button>
        </footer>
      </div>
    </div>
  );
}
