"use client";

import { useRef, useState, type DragEvent } from "react";
import { FocalPoint } from "./FocalPoint";
import { MediaPicker } from "./MediaPicker";
import { qualityNote, uploadFile } from "./media-client";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string | null;
  altEn: string;
  altTr: string;
  altFr?: string;
  objectPosition: string;
  isPrimary: boolean;
};

/**
 * Enhanced Gallery Manager:
 * - Multi-image drag & drop upload zone
 * - Batch media library selection
 * - Primary image selection
 * - Focal point precision crop
 * - Visual reordering with clean indicators
 */
export function GalleryField({ name, initial, primary = true }: { name: string; initial: GalleryItem[]; primary?: boolean }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const add = (imgs: Omit<GalleryItem, "altEn" | "altTr" | "altFr" | "objectPosition" | "isPrimary">[]) =>
    setItems((cur) => [
      ...cur,
      ...imgs.map((i, idx) => ({
        ...i,
        altEn: "",
        altTr: "",
        altFr: "",
        objectPosition: i.height >= i.width ? "50% 28%" : "50% 45%",
        isPrimary: cur.length === 0 && idx === 0,
      })),
    ]);

  const uploadFilesList = async (files: FileList | File[]) => {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!list.length) return;
    setError("");
    setBusy(list.length);
    const done: Parameters<typeof add>[0] = [];
    for (const f of list) {
      try {
        const up = await uploadFile(f);
        done.push({ url: up.url, width: up.width, height: up.height, blurDataUrl: up.blurDataUrl });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Yükleme hatası");
      }
      setBusy((b) => b - 1);
    }
    add(done);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      await uploadFilesList(e.dataTransfer.files);
    }
  };

  const patch = (i: number, p: Partial<GalleryItem>) => setItems((cur) => cur.map((it, idx) => (idx === i ? { ...it, ...p } : it)));

  const move = (i: number, dir: -1 | 1) =>
    setItems((cur) => {
      const next = [...cur];
      const j = i + dir;
      if (j < 0 || j >= next.length) return cur;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const setPrimary = (i: number) => setItems((cur) => cur.map((it, idx) => ({ ...it, isPrimary: idx === i })));

  const remove = (i: number) =>
    setItems((cur) => {
      const next = cur.filter((_, idx) => idx !== i);
      if (next.length && !next.some((x) => x.isPrimary)) next[0] = { ...next[0], isPrimary: true };
      return next;
    });

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {/* Drag & drop upload zone */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => input.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300",
          isDragging
            ? "border-brand bg-brand/10 shadow-[0_0_25px_rgba(216,0,0,0.25)]"
            : "border-line bg-ink/30 hover:border-brand/60 hover:bg-ink/50",
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-graphite border border-line text-ash transition-transform duration-300 group-hover:scale-110 group-hover:text-brand">
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <p className="mt-3 text-sm font-medium text-bone">
          {busy > 0 ? (
            <span className="text-brand animate-pulse">Görseller yükleniyor ({busy} kaldı)…</span>
          ) : (
            <>
              Birden fazla görseli <span className="text-brand underline underline-offset-2">buraya sürükleyin</span> veya tıklayın
            </>
          )}
        </p>
        <p className="mt-1 text-xs text-ash">
          PNG, JPG, WEBP, AVIF desteklenir. Tek seferde birden fazla görsel seçip yükleyebilirsiniz.
        </p>

        <div className="mt-3 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="admin-btn text-xs py-1.5"
            onClick={() => setPicker(true)}
          >
            📂 Medya kütüphanesinden seç
          </button>
          {items.length > 0 && (
            <span className="text-xs text-mist font-medium">
              Toplam {items.length} görsel eklendi
            </span>
          )}
        </div>
      </div>

      {error && <p className="text-xs text-brand">{error}</p>}

      {/* Image list */}
      {items.length > 0 && (
        <div className="space-y-3">
          {items.map((it, i) => {
            const q = qualityNote(it.width, it.height);
            return (
              <div
                key={it.url + i}
                className={cn(
                  "flex flex-col gap-4 rounded-xl border p-4 transition-colors md:flex-row",
                  primary && it.isPrimary
                    ? "border-brand/70 bg-brand/5 shadow-[0_0_15px_rgba(216,0,0,0.15)]"
                    : "border-line bg-ink/40 hover:border-bone/30",
                )}
              >
                <div className="space-y-1.5 w-44 shrink-0 self-start md:w-36">
                  <FocalPoint
                    url={it.url}
                    position={it.objectPosition}
                    onChange={(objectPosition) => patch(i, { objectPosition })}
                    className="w-full rounded-md border border-line"
                  />
                  <p className="text-[10px] text-center text-ash">Tıklayarak odak belirleyin</p>
                </div>

                <div className="flex-1 space-y-3 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line/60 pb-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {primary && it.isPrimary ? (
                        <span className="admin-badge admin-badge--red font-semibold">★ Ana Görsel (Kapak)</span>
                      ) : (
                        <span className="admin-badge">Sıra #{i + 1}</span>
                      )}
                      <span className="text-ash tabular-nums">
                        {it.width}×{it.height}px
                      </span>
                      <span className={q.tone === "low" ? "text-brand" : q.tone === "good" ? "text-green-400" : "text-mist"}>
                        {q.text}
                      </span>
                      <span className="text-ash">· Odak: {it.objectPosition}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {primary && !it.isPrimary && (
                        <button
                          type="button"
                          className="admin-btn py-1 text-xs"
                          onClick={() => setPrimary(i)}
                          title="Bu görseli ana kapak yap"
                        >
                          ★ Ana görsel yap
                        </button>
                      )}
                      <button
                        type="button"
                        className="admin-btn px-2.5 py-1 text-xs disabled:opacity-30"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Yukarı taşı"
                        title="Yukarı taşı"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="admin-btn px-2.5 py-1 text-xs disabled:opacity-30"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        aria-label="Aşağı taşı"
                        title="Aşağı taşı"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger py-1 text-xs"
                        onClick={() => remove(i)}
                        title="Görseli kaldır"
                      >
                        ✕ Kaldır
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <div>
                      <label className="text-[11px] text-ash block mb-1">Alt metin (EN)</label>
                      <input
                        className="admin-input text-xs"
                        placeholder="English alt caption"
                        value={it.altEn}
                        onChange={(e) => patch(i, { altEn: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ash block mb-1">Alt metin (TR)</label>
                      <input
                        className="admin-input text-xs"
                        placeholder="Türkçe alt açıklama"
                        value={it.altTr}
                        onChange={(e) => patch(i, { altTr: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-ash block mb-1">Alt metin (FR)</label>
                      <input
                        className="admin-input text-xs"
                        placeholder="Texte alternatif français"
                        value={it.altFr ?? ""}
                        onChange={(e) => patch(i, { altFr: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="admin-hint">
        💡 İpucu: Birden fazla görsel eklediğinizde sitede ürün kartı üzerinde gezinirken ve detay sayfasında akıcı, yumuşak geçişli slayt gösterisi otomatik çalışır.
      </p>

      <input
        ref={input}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/avif"
        hidden
        onChange={(e) => uploadFilesList(e.target.files ?? [])}
      />

      <MediaPicker
        open={picker}
        multiple
        onClose={() => setPicker(false)}
        onPick={(picked) => add(picked.map((p) => ({ url: p.url, width: p.width, height: p.height, blurDataUrl: p.blurDataUrl })))}
      />
    </div>
  );
}
