import "server-only";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
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

const EXT_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

type CachedMedia = { bytes: Uint8Array; mimeType: string; etag: string };
const mediaCache = new Map<string, CachedMedia>();
const MAX_CACHE_BYTES = 64 * 1024 * 1024; // 64MB cache
let currentCacheBytes = 0;

/**
 * Fast media serving: checks in-memory cache, then disk (brand-media / storage), and finally DB.
 * Implements ETag / 304 Not Modified, HTTP Range, and immutable cache headers.
 */
export async function serveMedia(url: string, request: Request) {
  let item = mediaCache.get(url);

  if (!item) {
    let bytes: Uint8Array | null = null;
    let mimeType = "application/octet-stream";

    // 1. Check local disk first (50-100x faster than Postgres binary select)
    let diskPath: string | null = null;
    if (url.startsWith("/media/")) {
      diskPath = path.join(process.cwd(), "brand-media", url.slice(7));
    } else if (url.startsWith("/uploads/")) {
      diskPath = path.join(process.cwd(), "storage", "uploads", url.slice(9));
    }

    if (diskPath && existsSync(diskPath)) {
      try {
        const fileBuf = await fs.readFile(diskPath);
        bytes = new Uint8Array(fileBuf);
        const ext = path.extname(diskPath).toLowerCase();
        mimeType = EXT_MIME[ext] ?? "image/jpeg";
      } catch {
        // Fall back to database on read error
      }
    }

    // 2. Fall back to database if not on disk
    if (!bytes) {
      const asset = await db.mediaAsset.findUnique({ where: { url }, select: { data: true, mimeType: true } });
      if (asset?.data) {
        bytes = new Uint8Array(asset.data);
        mimeType = asset.mimeType;
      }
    }

    if (!bytes) {
      return new Response("Not found", { status: 404 });
    }

    const etag = `"${bytes.length.toString(16)}-${bytes[0]?.toString(16) || "0"}${bytes[Math.floor(bytes.length / 2)]?.toString(16) || "0"}"`;
    item = { bytes, mimeType, etag };

    // Cache in memory if under quota
    if (bytes.length < 4 * 1024 * 1024 && currentCacheBytes + bytes.length <= MAX_CACHE_BYTES) {
      mediaCache.set(url, item);
      currentCacheBytes += bytes.length;
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": item.mimeType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "ETag": item.etag,
    "X-Content-Type-Options": "nosniff",
    "Accept-Ranges": "bytes",
  };

  // Conditional request (304 Not Modified)
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch && ifNoneMatch === item.etag) {
    return new Response(null, { status: 304, headers });
  }

  // HTTP Range (video seeking)
  const range = request.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range) {
    const start = range[1] ? Number(range[1]) : 0;
    const end = range[2] ? Math.min(Number(range[2]), item.bytes.length - 1) : item.bytes.length - 1;
    if (start >= item.bytes.length || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${item.bytes.length}` } });
    }
    return new Response(item.bytes.subarray(start, end + 1) as unknown as BodyInit, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${item.bytes.length}`, "Content-Length": String(end - start + 1) },
    });
  }

  return new Response(item.bytes as unknown as BodyInit, { headers: { ...headers, "Content-Length": String(item.bytes.length) } });
}

