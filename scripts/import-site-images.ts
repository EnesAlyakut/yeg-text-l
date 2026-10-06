/**
 * Imports photos from the previous yegtextile.com site (production + fabrics pages) into the
 * media store, with the same processing as admin uploads, and writes their metadata for the pages.
 *
 * Run: npx tsx scripts/import-site-images.ts [folder]
 * With a folder, source files are read from there (same file names) instead of downloaded.
 */
import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ORIGIN = "https://www.yegtextile.com/";
const images = [
  { url: "/media/production/raw-material.jpg", source: "resimler/baslik/1-png1738911216.30970.webp" },
  { url: "/media/production/cutting.jpg", source: "resimler/baslik/1-jpg1738911273.41738.webp" },
  { url: "/media/production/sewing.jpg", source: "resimler/baslik/1-jpeg1738911309.95356.webp" },
  { url: "/media/production/craft.jpg", source: "resimler/baslik/1-jpeg1738911347.53094.webp" },
  { url: "/media/production/network.jpg", source: "resimler/baslik/1-jpeg1738911393.42968.webp" },
  { url: "/media/production/quality.jpg", source: "resimler/baslik/1-jpeg1738911440.38743.webp" },
  { url: "/media/fabrics/knitting-floor.jpg", source: "public/temalar/default/site/images/icerik_baslik.jpg" },
];

const db = new PrismaClient();

async function read(source: string) {
  const local = process.argv[2];
  if (local) return fs.readFileSync(path.join(local, path.basename(source)));
  const res = await fetch(ORIGIN + source);
  if (!res.ok) throw new Error(`${source}: HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const out: Record<string, { src: string; width: number; height: number; blur: string }> = {};
  for (const img of images) {
    const output = await sharp(await read(img.source))
      .rotate()
      .flatten({ background: "#000000" })
      .jpeg({ quality: 90, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" })
      .toBuffer({ resolveWithObject: true });
    const blur = await sharp(output.data).resize(16, 16, { fit: "inside" }).jpeg({ quality: 60 }).toBuffer();
    const data = {
      filename: path.basename(img.source),
      mimeType: "image/jpeg",
      source: "brand",
      width: output.info.width,
      height: output.info.height,
      size: output.info.size,
      blurDataUrl: `data:image/jpeg;base64,${blur.toString("base64")}`,
      data: output.data,
    };
    await db.mediaAsset.upsert({ where: { url: img.url }, update: data, create: { url: img.url, ...data } });
    const key = img.url.replace(/^\/media\//, "").replace(/\.jpg$/, "");
    out[key] = { src: img.url, width: data.width, height: data.height, blur: data.blurDataUrl };
    console.log(`${img.url}  ${data.width}×${data.height}  ${(data.size / 1024).toFixed(0)} KB`);
  }
  fs.writeFileSync(path.join(import.meta.dirname, "..", "src", "data", "imported-media.json"), JSON.stringify(out, null, 2) + "\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
