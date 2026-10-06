import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

const TR_MAP: Record<string, string> = { ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u", İ: "i" };

export function slugify(input: string) {
  return input
    .trim()
    .replace(/[çğıöşüİ]/gi, (c) => TR_MAP[c] ?? TR_MAP[c.toLowerCase()] ?? c)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function readingMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}
