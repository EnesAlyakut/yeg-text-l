import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { storeImage, storeVideo } from "@/lib/uploads";

const MAX_IMAGE = 25 * 1024 * 1024;
const MAX_VIDEO = 60 * 1024 * 1024;

/** Admin upload endpoint — files are normalised and saved into the database. */
export async function POST(request: Request) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });

  try {
    if (file.type.startsWith("video/")) {
      if (file.size > MAX_VIDEO) return NextResponse.json({ error: "Video 60 MB'tan büyük olamaz" }, { status: 413 });
      return NextResponse.json(await storeVideo(file));
    }
    if (file.size > MAX_IMAGE) return NextResponse.json({ error: "Görsel 25 MB'tan büyük olamaz" }, { status: 413 });
    return NextResponse.json(await storeImage(file));
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }
}
