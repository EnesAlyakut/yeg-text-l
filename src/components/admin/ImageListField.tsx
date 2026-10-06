"use client";

import { useRef, useState } from "react";
import type { ImageRef } from "@/lib/content-types";
import { FocalPoint } from "./FocalPoint";
import { MediaPicker } from "./MediaPicker";
import { qualityNote, uploadFile } from "./media-client";

type Props = {
  label: string;
  /** Hidden input name; value is a JSON ImageRef[] */
  name: string;
  value?: ImageRef[] | null;
  hint?: string;
  /** Hard cap on the number of images */
  max?: number;
};

/** Several images in order (slideshow slides): upload many, pick from the library, reorder, set each crop focus. */
export function ImageListField({ label, name, value, hint, max = 8 }: Props) {
  const [items, setItems] = useState<ImageRef[]>(value ?? []);
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const room = Math.max(0, max - items.length);
  const add = (imgs: ImageRef[]) => setItems((cur) => [...cur, ...imgs].slice(0, max));
  const patch = (i: number, p: Partial<ImageRef>) => setItems((cur) => cur.map((it, idx) => (idx === i ? { ...it, ...p } : it)));
  const remove = (i: number) => setItems((cur) => cur.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) =>
    setItems((cur) => {
      const j = i + dir;
      if (j < 0 || j >= cur.length) return cur;
      const next = [...cur];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    const list = Array.from(files).slice(0, room);
    setBusy(list.length);
    const done: ImageRef[] = [];
    for (const f of list) {
      try {
        const up = await uploadFile(f);
        done.push({ url: up.url, width: up.width, height: up.height, blur: up.blurDataUrl, position: "50% 50%" });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hata");
      }
      setBusy((b) => b - 1);
    }
    add(done);
    if (input.current) input.current.value = "";
  };

  return (
    <div>
      <span className="admin-label">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(items)} />
      <div className="space-y-3">
        {items.map((it, i) => {
          const q = qualityNote(it.width, it.height);
          return (
            <div key={it.url + i} className="flex flex-col gap-4 rounded-lg border border-line bg-ink/40 p-3 sm:flex-row">
              <FocalPoint url={it.url} position={it.position ?? "50% 50%"} onChange={(position) => patch(i, { position })} className="w-full shrink-0 self-start sm:w-48" />
              <div className="flex flex-1 flex-col gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="admin-badge">Slayt {i + 2}</span>
                  <span className="text-ash">
                    {it.width}×{it.height}
                  </span>
                  <span className={q.tone === "low" ? "text-brand" : q.tone === "good" ? "text-green-400" : "text-mist"}>{q.text}</span>
                  <span className="text-ash">· Odak {it.position}</span>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
                  <button type="button" className="admin-btn py-1.5" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yukarı taşı">
                    ↑
                  </button>
                  <button type="button" className="admin-btn py-1.5" onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Aşağı taşı">
                    ↓
                  </button>
                  <button type="button" className="admin-btn admin-btn--danger py-1.5" onClick={() => remove(i)}>
                    Kaldır
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className="admin-btn" onClick={() => input.current?.click()} disabled={busy > 0 || room === 0}>
          {busy > 0 ? `Yükleniyor (${busy})…` : "Slayt görseli yükle"}
        </button>
        <button type="button" className="admin-btn" onClick={() => setPicker(true)} disabled={room === 0}>
          Kütüphaneden ekle
        </button>
        <span className="text-xs text-ash">
          {items.length}/{max}
        </span>
        {error && <span className="text-xs text-brand">{error}</span>}
      </div>
      {hint && <p className="admin-hint">{hint}</p>}
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => onFiles(e.target.files)} />
      <MediaPicker
        open={picker}
        multiple
        onClose={() => setPicker(false)}
        onPick={(picked) => add(picked.map((p) => ({ url: p.url, width: p.width, height: p.height, blur: p.blurDataUrl, position: "50% 50%" })))}
      />
    </div>
  );
}
