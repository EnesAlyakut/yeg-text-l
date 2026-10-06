"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { uploadFile } from "@/components/admin/media-client";

export function MediaUploader() {
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(0);
  const [error, setError] = useState("");

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setBusy(files.length);
    for (const f of Array.from(files)) {
      try {
        await uploadFile(f);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Hata");
      }
      setBusy((b) => b - 1);
    }
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      {error && <span className="text-xs text-brand">{error}</span>}
      <button type="button" className="admin-btn admin-btn--primary" onClick={() => input.current?.click()} disabled={busy > 0}>
        {busy ? `Yükleniyor (${busy})…` : "+ Görsel yükle"}
      </button>
      <input ref={input} type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" hidden onChange={(e) => onFiles(e.target.files)} />
    </div>
  );
}
