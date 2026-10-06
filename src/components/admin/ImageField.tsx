"use client";

import { useRef, useState } from "react";
import type { ImageRef } from "@/lib/content-types";
import { FocalPoint } from "./FocalPoint";
import { MediaPicker } from "./MediaPicker";
import { qualityNote, uploadFile } from "./media-client";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  /** Hidden input name; value is JSON ImageRef or "" */
  name: string;
  value?: ImageRef | null;
  hint?: string;
  /** Called on every change (for parents that manage their own state) */
  onChange?: (v: ImageRef | null) => void;
};

export function ImageField({ label, name, value, hint, onChange }: Props) {
  const [img, setImg] = useState<ImageRef | null>(value ?? null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [picker, setPicker] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const update = (next: ImageRef | null) => {
    setImg(next);
    onChange?.(next);
  };

  const onFile = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const up = await uploadFile(file);
      update({ url: up.url, width: up.width, height: up.height, blur: up.blurDataUrl, position: "50% 50%" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const q = img ? qualityNote(img.width, img.height) : null;

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      await onFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <span className="admin-label">{label}</span>
      <input type="hidden" name={name} value={img ? JSON.stringify(img) : ""} />
      <div className="flex flex-col gap-4 sm:flex-row">
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => !img && input.current?.click()}
          className={cn(
            "w-full sm:w-56 transition-all duration-300 rounded-md",
            !img && "cursor-pointer",
            isDragging && "ring-2 ring-brand bg-brand/10",
          )}
        >
          {img ? (
            <FocalPoint url={img.url} position={img.position ?? "50% 50%"} onChange={(position) => update({ ...img, position })} className="border border-line" />
          ) : (
            <div className="grid aspect-[4/3] place-items-center rounded-md border border-dashed border-line text-xs text-ash hover:border-brand/60 hover:text-bone">
              {busy ? "Yükleniyor…" : "Sürükleyin veya tıklayın"}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 text-xs">
          {img && (
            <>
              <p className="break-all text-ash">{img.url}</p>
              <p>
                {img.width}×{img.height}px —{" "}
                <span className={q?.tone === "low" ? "text-brand" : q?.tone === "good" ? "text-green-400" : "text-mist"}>{q?.text}</span>
              </p>
              <p className="text-ash">Odak: {img.position} (görsele tıklayarak değiştirin)</p>
            </>
          )}
          <div className="mt-auto flex flex-wrap gap-2">
            <button type="button" className="admin-btn" onClick={() => input.current?.click()} disabled={busy}>
              {busy ? "Yükleniyor…" : "Yükle"}
            </button>
            <button type="button" className="admin-btn" onClick={() => setPicker(true)}>
              Kütüphaneden seç
            </button>
            {img && (
              <button type="button" className="admin-btn admin-btn--danger" onClick={() => update(null)}>
                Kaldır
              </button>
            )}
          </div>
          {error && <p className="text-brand">{error}</p>}
          {hint && <p className="admin-hint">{hint}</p>}
        </div>
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => onFile(e.target.files?.[0])} />
      <MediaPicker
        open={picker}
        onClose={() => setPicker(false)}
        onPick={([item]) => item && update({ url: item.url, width: item.width, height: item.height, blur: item.blurDataUrl, position: "50% 50%" })}
      />
    </div>
  );
}
