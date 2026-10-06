"use client";

import { useEffect, useState } from "react";
import { slugify } from "@/lib/utils";

/** Auto-generates the slug from the English name field until the user edits it by hand. */
export function SlugInput({ defaultValue, sourceName, prefix }: { defaultValue?: string; sourceName: string; prefix: string }) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [touched, setTouched] = useState(Boolean(defaultValue));

  useEffect(() => {
    if (touched) return;
    const source = document.querySelector<HTMLInputElement>(`[name="${sourceName}"]`);
    if (!source) return;
    const sync = () => setValue(slugify(source.value));
    source.addEventListener("input", sync);
    return () => source.removeEventListener("input", sync);
  }, [touched, sourceName]);

  return (
    <div>
      <span className="admin-label">Slug (URL)</span>
      <div className="flex items-center overflow-hidden rounded-md border border-line bg-ink">
        <span className="shrink-0 border-r border-line px-3 py-2.5 text-xs text-ash">{prefix}</span>
        <input
          name="slug"
          value={value}
          required
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          onChange={(e) => {
            setTouched(true);
            setValue(slugify(e.target.value));
          }}
          className="w-full bg-transparent px-3 py-2.5 text-sm outline-none"
        />
      </div>
      <p className="admin-hint">İngilizce addan otomatik oluşturulur; SEO için kısa ve açıklayıcı tutun. Her iki dilde aynı slug kullanılır.</p>
    </div>
  );
}
