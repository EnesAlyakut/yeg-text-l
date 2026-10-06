"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleRead(id: string, isRead: boolean) {
  await requireAdmin();
  await db.contactMessage.update({ where: { id }, data: { isRead } });
  revalidatePath("/admin", "layout");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await db.contactMessage.delete({ where: { id } });
  revalidatePath("/admin", "layout");
}
