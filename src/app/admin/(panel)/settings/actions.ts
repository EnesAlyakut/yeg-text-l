"use server";

import bcrypt from "bcryptjs";
import { bool, revalidateSite, str, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveSettings(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const email = str(fd, "email");
  if (!email) return { error: "E-posta zorunludur." };
  const contact = {
    email,
    phone: str(fd, "phone"),
    whatsapp: str(fd, "whatsapp"),
    addressEn: str(fd, "addressEn"),
    addressTr: str(fd, "addressTr"),
    addressFr: str(fd, "addressFr"),
    instagram: str(fd, "instagram").replace(/^@/, ""),
    mapUrl: str(fd, "mapUrl"),
  };
  const currency = str(fd, "currency").toUpperCase() || "USD";
  if (!/^[A-Z]{3}$/.test(currency)) return { error: "Para birimi 3 harfli ISO kodu olmalı (USD, EUR, TRY)." };
  const general = { currency, showPrices: bool(fd, "showPrices") };

  await db.$transaction([
    db.setting.upsert({ where: { key: "contact" }, update: { value: contact }, create: { key: "contact", value: contact } }),
    db.setting.upsert({ where: { key: "general" }, update: { value: general }, create: { key: "general", value: general } }),
  ]);
  revalidateSite();
  return { ok: true, message: "Ayarlar kaydedildi." };
}

export async function changePassword(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const session = await requireAdmin();
  const current = str(fd, "current");
  const next = str(fd, "next");
  if (next.length < 10) return { error: "Yeni şifre en az 10 karakter olmalı." };
  if (next !== str(fd, "confirm")) return { error: "Yeni şifreler eşleşmiyor." };
  const user = await db.user.findUniqueOrThrow({ where: { id: session.sub } });
  if (!(await bcrypt.compare(current, user.passwordHash))) return { error: "Mevcut şifre hatalı." };
  await db.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(next, 12) } });
  return { ok: true, message: "Şifre güncellendi." };
}
