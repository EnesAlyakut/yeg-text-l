"use server";

import type { Prisma } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidateSite, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { PAGE_KEYS, type PageKey } from "@/lib/page-content";

const isKey = (k: string): k is PageKey => (PAGE_KEYS as string[]).includes(k);

/** Saves the whole edited page (all languages + images) as one JSON row. */
export async function savePageContent(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const key = String(fd.get("key") ?? "");
  if (!isKey(key)) return { error: "Geçersiz sayfa." };
  let data: Prisma.InputJsonValue;
  try {
    data = JSON.parse(String(fd.get("data") ?? ""));
  } catch {
    return { error: "İçerik okunamadı." };
  }
  await db.pageContent.upsert({ where: { key }, create: { key, data }, update: { data } });
  revalidateSite();
  return { ok: true, message: "Kaydedildi, site güncellendi." };
}

/** The fabrics editor saves the list page and the detail texts together (a new fabric needs both). */
export async function saveFabrics(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  let fabrics: Prisma.InputJsonValue, details: Prisma.InputJsonValue;
  try {
    fabrics = JSON.parse(String(fd.get("data") ?? ""));
    details = JSON.parse(String(fd.get("details") ?? ""));
  } catch {
    return { error: "İçerik okunamadı." };
  }
  await db.$transaction([
    db.pageContent.upsert({ where: { key: "fabrics" }, create: { key: "fabrics", data: fabrics }, update: { data: fabrics } }),
    db.pageContent.upsert({ where: { key: "fabric-details" }, create: { key: "fabric-details", data: details }, update: { data: details } }),
  ]);
  revalidateSite();
  return { ok: true, message: "Kumaşlar kaydedildi, site güncellendi." };
}

/** Drops the saved copy so the page falls back to its built-in content. */
export async function resetPageContent(fd: FormData) {
  await requireAdmin();
  const key = String(fd.get("key") ?? "");
  if (!isKey(key)) return;
  await db.pageContent.deleteMany({ where: { key } });
  revalidateSite();
  redirect(`/admin/pages/${key}`);
}
