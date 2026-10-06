"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

type Result = { ok: boolean; error?: string; count?: number };

/**
 * Spreadsheet-style editing state shared by the admin list pages:
 * tracks which rows changed, warns before leaving, saves all changed rows at once.
 */
export function useBulkRows<T extends { id: string }>(initial: T[], save: (rows: T[]) => Promise<Result>) {
  const [rows, setRows] = useState(initial);
  const [source, setSource] = useState(() => JSON.stringify(initial));
  // Fresh server data (after save / new row added) replaces the local copy — only when the data
  // really changed, so a plain re-render or refresh never wipes unsaved edits.
  const incoming = JSON.stringify(initial);
  if (source !== incoming) {
    setSource(incoming);
    setRows(initial);
  }
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const original = useMemo(() => new Map(initial.map((r) => [r.id, JSON.stringify(r)])), [initial]);
  const isDirty = (r: T) => original.get(r.id) !== JSON.stringify(r);
  const dirty = rows.filter(isDirty);

  useEffect(() => {
    if (!dirty.length) return;
    const onLeave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty.length]);

  return {
    rows,
    dirty,
    isDirty,
    pending,
    message,
    patch: (id: string, p: Partial<T>) => {
      setMessage(null);
      setRows((cur) => cur.map((r) => (r.id === id ? { ...r, ...p } : r)));
    },
    reset: () => {
      setRows(initial);
      setMessage(null);
    },
    saveAll: () =>
      start(async () => {
        if (!dirty.length) {
          setMessage({ ok: true, text: "Değişiklik yok — her şey kayıtlı." });
          return;
        }
        const res = await save(dirty);
        setMessage(res.ok ? { ok: true, text: `${res.count ?? dirty.length} kayıt güncellendi.` } : { ok: false, text: res.error ?? "Kaydedilemedi." });
        if (res.ok) router.refresh();
      }),
  };
}

export function SaveBar({
  dirtyCount,
  pending,
  message,
  onSave,
  onReset,
  hint,
}: {
  dirtyCount: number;
  pending: boolean;
  message: { ok: boolean; text: string } | null;
  onSave: () => void;
  onReset: () => void;
  hint: string;
}) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-4 flex items-center justify-between gap-4 border-t border-line bg-coal/95 px-4 py-4 backdrop-blur lg:-mx-10 lg:px-10">
      <p className="text-sm">
        {message ? (
          <span className={message.ok ? "text-green-400" : "text-brand"}>{message.text}</span>
        ) : dirtyCount ? (
          <span className="text-bone">{dirtyCount} kayıtta kaydedilmemiş değişiklik var.</span>
        ) : (
          <span className="text-ash">{hint}</span>
        )}
      </p>
      <div className="flex gap-2">
        {dirtyCount > 0 && (
          <button type="button" className="admin-btn" onClick={onReset} disabled={pending}>
            Vazgeç
          </button>
        )}
        <button type="button" className="admin-btn admin-btn--primary" onClick={onSave} disabled={pending}>
          {pending ? "Kaydediliyor…" : `Tümünü kaydet${dirtyCount ? ` (${dirtyCount})` : ""}`}
        </button>
      </div>
    </div>
  );
}

/** Compact inputs sized for table cells. */
export const cell = {
  input: "admin-input py-1.5",
  check: "size-4 accent-[#d80000]",
};
