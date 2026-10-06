"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(5000),
  subject: z.string().trim().max(200).optional().or(z.literal("")),
  locale: z.enum(["en", "tr", "fr"]),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = { status: "idle" | "success" | "error"; fields?: string[] };

// Simple flood guard: at most 5 messages per IP every 10 minutes.
const sent = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const recent = (sent.get(ip) ?? []).filter((t) => Date.now() - t < WINDOW);
  if (recent.length >= 5) return { status: "error", fields: ["message"] };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { status: "error", fields: parsed.error.issues.map((i) => String(i.path[0])) };
  }
  const { website, ...data } = parsed.data;
  if (website) return { status: "success" }; // silently drop bots

  await db.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      message: data.message,
      subject: data.subject || null,
      locale: data.locale,
    },
  });
  sent.set(ip, [...recent, Date.now()]);
  return { status: "success" };
}
