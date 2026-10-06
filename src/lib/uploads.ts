import "server-only";
import crypto from "node:crypto";
import sharp from "sharp";
import { db } from "./db";
import { slugify } from "./utils";

const MAX_EDGE = 4000;
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm"]);

export type StoredImage = { id: string; url: string; width: number; height: number; blurDataUrl: string; size: number; filename: string };

const month = () => new Date().toISOString().slice(0, 7);
const token = () => crypto.randomBytes(4).toString("hex");

/**
 * Normalises every admin upload so it drops straight into the design system and stores it
 * in the database with a blur placeholder and exact dimensions. Quality is preserved: originals are
 * kept as-is when possible, otherwise encoded once as near-lossless JPEG (capped at 4000px).
 */
export async function storeImage(file: File): Promise<StoredImage> {
  if (!IMAGE_TYPES.has(file.type)) throw new Error("Unsupported image type");
  const input = Buffer.from(await file.arrayBuffer());
  const base = slugify(file.name.replace(/\.[^.]+$/, "")).slice(0, 48) || "image";

  const meta = await sharp(input).metadata();
  const fits = Math.max(meta.width ?? 0, meta.height ?? 0) <= MAX_EDGE;
  const upright = !meta.orientation || meta.orientation === 1;

  // JPEG/WebP/AVIF that already fit and need no rotation are stored byte-for-byte — no re-compression at all.
  // Everything else (PNG, oversized, rotated) is encoded once at near-lossless quality.
  const keep = file.type !== "image/png" && fits && upright;
  const output = keep
    ? { data: input, info: { width: meta.width!, height: meta.height!, size: input.length } }
    : await sharp(input)
        .rotate()
        .resize(MAX_EDGE, MAX_EDGE, { fit: "inside", withoutEnlargement: true })
        .flatten({ background: "#000000" })
        .jpeg({ quality: 97, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
        .toBuffer({ resolveWithObject: true });
  const mime = keep ? file.type : "image/jpeg";
  const ext = { "image/jpeg": "jpg", "image/webp": "webp", "image/avif": "avif" }[mime] ?? "jpg";
  const blur = await sharp(output.data).resize(16, 16, { fit: "inside" }).jpeg({ quality: 60 }).toBuffer();

  const asset = await db.mediaAsset.create({
    data: {
      url: `/uploads/${month()}/${base}-${token()}.${ext}`,
      filename: file.name,
      mimeType: mime,
      source: "upload",
      width: output.info.width,
      height: output.info.height,
      size: output.info.size,
      blurDataUrl: `data:image/jpeg;base64,${blur.toString("base64")}`,
      data: output.data,
    },
    select: { id: true, url: true, width: true, height: true, blurDataUrl: true, size: true, filename: true },
  });
  return { ...asset, blurDataUrl: asset.blurDataUrl! };
}

export async function storeVideo(file: File) {
  if (!VIDEO_TYPES.has(file.type)) throw new Error("Unsupported video type");
  const ext = file.type === "video/webm" ? "webm" : "mp4";
  const asset = await db.mediaAsset.create({
    data: {
      url: `/uploads/video/${crypto.randomBytes(6).toString("hex")}.${ext}`,
      filename: file.name,
      mimeType: file.type,
      source: "upload",
      size: file.size,
      data: Buffer.from(await file.arrayBuffer()),
    },
    select: { id: true, url: true, size: true, filename: true },
  });
  return asset;
}

/**
 * Streams a stored file from the database. Supports HTTP Range so videos can seek.
 * Responses are immutable (every stored URL is unique), so browsers/CDNs cache them forever.
 */
export async function serveMedia(url: string, request: Request) {
  const asset = await db.mediaAsset.findUnique({ where: { url }, select: { data: true, mimeType: true } });
  if (!asset?.data) return new Response("Not found", { status: 404 });

  const bytes = new Uint8Array(asset.data);
  const headers: Record<string, string> = {
    "Content-Type": asset.mimeType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };

  const range = request.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), bytes.length - 1) : bytes.length - 1;
    if (start >= bytes.length || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${bytes.length}` } });
    return new Response(bytes.subarray(start, end + 1), {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${bytes.length}`, "Content-Length": String(end - start + 1) },
    });
  }
  return new Response(bytes, { headers: { ...headers, "Content-Length": String(bytes.length) } });
}
