"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import { db } from "@/lib/db";

// Naive in-memory throttle: 8 failed attempts per IP per 15 minutes.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60 * 1000;

export async function login(_prev: { error?: string }, formData: FormData): Promise<{ error?: string }> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const entry = attempts.get(ip);
  if (entry && entry.until > Date.now() && entry.count >= 8) return { error: "Çok fazla deneme. Lütfen 15 dakika sonra tekrar deneyin." };

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const user = email ? await db.user.findUnique({ where: { email } }) : null;
  const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!user || !ok) {
    const next = entry && entry.until > Date.now() ? { count: entry.count + 1, until: entry.until } : { count: 1, until: Date.now() + WINDOW };
    attempts.set(ip, next);
    return { error: "E-posta veya şifre hatalı." };
  }

  attempts.delete(ip);
  await createSession(user);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
