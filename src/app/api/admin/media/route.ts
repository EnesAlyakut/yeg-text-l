import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export type LibraryItem = { id: string; url: string; width: number; height: number; blurDataUrl: string | null; label: string; source: "upload" | "brand" };

/** Media library for pickers: every image stored in the database (uploads first, then the brand package). */
export async function GET() {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const assets = await db.mediaAsset.findMany({
    where: { mimeType: { startsWith: "image/" }, NOT: { mimeType: "image/svg+xml" } },
    select: { id: true, url: true, width: true, height: true, blurDataUrl: true, filename: true, source: true },
    orderBy: [{ source: "desc" }, { createdAt: "desc" }],
  });
  const items: LibraryItem[] = assets.map((a) => ({
    id: a.id,
    url: a.url,
    width: a.width,
    height: a.height,
    blurDataUrl: a.blurDataUrl,
    label: a.source === "brand" ? a.url.replace(/^\/media\//, "") : a.filename,
    source: a.source === "brand" ? "brand" : "upload",
  }));
  return NextResponse.json(items);
}
