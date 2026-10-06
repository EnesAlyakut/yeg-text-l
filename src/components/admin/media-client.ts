"use client";

export type UploadedImage = { url: string; width: number; height: number; blurDataUrl: string | null };

export async function uploadFile(file: File): Promise<UploadedImage & { error?: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Yükleme başarısız");
  return data;
}

/** "50% 30%" ⇄ {x, y} */
export const parsePosition = (pos: string) => {
  const [x, y] = pos.split(" ").map((v) => Number.parseFloat(v));
  return { x: Number.isFinite(x) ? x : 50, y: Number.isFinite(y) ? y : 50 };
};

export const qualityNote = (w: number, h: number) => {
  const long = Math.max(w, h);
  if (long >= 2400) return { tone: "good", text: "Tam ekran için uygun" } as const;
  if (long >= 1200) return { tone: "ok", text: "Yarım ekran / kart için uygun" } as const;
  return { tone: "low", text: "Düşük çözünürlük — sadece küçük kartlarda" } as const;
};
