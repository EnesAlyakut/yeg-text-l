"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ALL_ADMIN_LINKS } from "./admin-links";

const norm = (s: string) => s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g, "");

/** "Ara… Ctrl + K": a command palette that jumps to any admin screen by typing. */
export function QuickSearch({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  // Opening always starts from an empty search
  const show = () => {
    setQ("");
    setCursor(0);
    setOpen(true);
    setTimeout(() => input.current?.focus(), 0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQ("");
        setCursor(0);
        setOpen((v) => !v);
        setTimeout(() => input.current?.focus(), 0);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length) return ALL_ADMIN_LINKS;
    return ALL_ADMIN_LINKS.filter((l) => {
      const hay = norm(`${l.label} ${l.hint} ${l.group} ${l.keywords ?? ""}`);
      return words.every((w) => hay.includes(w));
    });
  }, [q]);

  const go = (href: string) => {
    setOpen(false);
    onNavigate?.();
    router.push(href);
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="mb-6 flex w-full items-center justify-between rounded-md border border-line px-3 py-2 text-sm text-ash transition-colors hover:border-ash/50 hover:text-bone"
      >
        <span>⌕ Ara…</span>
        <kbd className="rounded border border-line px-1.5 text-[0.65rem]">Ctrl K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-start justify-center bg-ink/80 p-4 pt-[12vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="w-full max-w-xl overflow-hidden rounded-xl border border-line bg-graphite shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <input
              ref={input}
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setCursor(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setCursor((c) => Math.min(c + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setCursor((c) => Math.max(c - 1, 0));
                } else if (e.key === "Enter" && results[cursor]) {
                  e.preventDefault();
                  go(results[cursor].href);
                }
              }}
              placeholder="Nereye gitmek istiyorsunuz? (örn. sertifika, lookbook, telefon)"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-base outline-none placeholder:text-ash/60"
            />
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-ash">Sonuç yok.</li>}
              {results.map((r, i) => (
                <li key={r.href}>
                  <button
                    type="button"
                    onMouseEnter={() => setCursor(i)}
                    onClick={() => go(r.href)}
                    className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left", i === cursor ? "bg-brand/15" : "")}
                  >
                    <span aria-hidden className="flex size-8 shrink-0 items-center justify-center rounded-md bg-ink text-sm text-brand">
                      {r.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm text-bone">{r.label}</span>
                      <span className="block truncate text-xs text-ash">{r.hint}</span>
                    </span>
                    <span className="text-[0.65rem] uppercase tracking-[0.12em] text-ash/70">{r.group}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="border-t border-line px-5 py-2 text-[0.7rem] text-ash">↑ ↓ ile seç · Enter ile git · Esc ile kapat</p>
          </div>
        </div>
      )}
    </>
  );
}
