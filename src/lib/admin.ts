import "server-only";
import { revalidatePath } from "next/cache";
import { invalidateQueryCache } from "./queries";

/** Every admin mutation affects the public site in both languages. */
export function revalidateSite() {
  invalidateQueryCache();
  revalidatePath("/[lang]", "layout");
  revalidatePath("/sitemap.xml");
}

export const str = (fd: FormData, key: string) => {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
};

export const optStr = (fd: FormData, key: string) => str(fd, key) || null;

export const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";

export const int = (fd: FormData, key: string, fallback = 0) => {
  const n = Number.parseInt(str(fd, key), 10);
  return Number.isFinite(n) ? n : fallback;
};

export function json<T>(fd: FormData, key: string, fallback: T): T {
  try {
    const raw = str(fd, key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Newline-separated textarea → string[] */
export const lines = (fd: FormData, key: string) =>
  str(fd, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export type ActionState = { ok?: boolean; error?: string; message?: string };
