"use client";

import { parsePosition } from "./media-client";

/** Click anywhere on the thumbnail to choose the crop focus (CSS object-position). */
export function FocalPoint({ url, position, onChange, className }: { url: string; position: string; onChange: (pos: string) => void; className?: string }) {
  const { x, y } = parsePosition(position);
  return (
    <div
      className={`relative cursor-crosshair overflow-hidden rounded-md bg-ink ${className ?? ""}`}
      onClick={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const nx = Math.round(((e.clientX - r.left) / r.width) * 100);
        const ny = Math.round(((e.clientY - r.top) / r.height) * 100);
        onChange(`${nx}% ${ny}%`);
      }}
      title="Kırpma odağını seçmek için tıklayın"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- admin preview */}
      <img src={url} alt="" className="block h-auto w-full" />
      <span
        className="pointer-events-none absolute size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-brand/70 shadow"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
    </div>
  );
}
