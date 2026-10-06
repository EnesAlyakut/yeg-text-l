"use client";

import { useRef, useState } from "react";

/** Hero video: paste a URL or upload an MP4/WebM (served from /uploads). */
export function VideoField({ name, value }: { name: string; value?: string | null }) {
  const [url, setUrl] = useState(value ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUrl(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Hata");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <span className="admin-label">Hero video (opsiyonel)</span>
      <div className="flex gap-2">
        <input name={name} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/uploads/video/… veya https://…mp4" className="admin-input" />
        <button type="button" className="admin-btn shrink-0" onClick={() => input.current?.click()} disabled={busy}>
          {busy ? "Yükleniyor…" : "Video yükle"}
        </button>
      </div>
      {url && (
        <video src={url} muted playsInline controls className="mt-3 max-h-48 rounded-md border border-line">
          <track kind="captions" />
        </video>
      )}
      {error && <p className="mt-2 text-xs text-brand">{error}</p>}
      <p className="admin-hint">Video girilirse hero görseli poster olarak kullanılır. Performans için 10 MB altı, sessiz, 1080p MP4 önerilir.</p>
      <input ref={input} type="file" accept="video/mp4,video/webm" hidden onChange={(e) => upload(e.target.files?.[0])} />
    </div>
  );
}
