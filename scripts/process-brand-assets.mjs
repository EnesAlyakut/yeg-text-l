/**
 * Converts the raw brand package (brand-source/) into web-ready media under public/media
 * and writes src/data/media-manifest.json (dimensions + blur placeholders).
 *
 * Third-party reference imagery in the package (Levi's × Denim Tears, Cole Buxton, etc.)
 * is intentionally excluded — it is moodboard material, not YEG property.
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const SRC = path.join(ROOT, "brand-source");
// Build output; `npm run media:import` then stores every file in the database.
const OUT = path.join(ROOT, "brand-media");
const MANIFEST = path.join(ROOT, "src", "data", "media-manifest.json");

// Catalog pages that are byte-identical (or near-identical) re-exports of another page.
const CATALOG_DUPLICATES = new Set([54, 167, 171, 172, 180]);

const gemini = (id) => `AI foto/Gemini_Generated_Image_${id}.jpeg`;

/**
 * Tone profiles — deliberately gentle so the photography keeps its mood:
 *  photo  : campaign frames — a touch more contrast/colour, crisp after resampling
 *  studio : flat, light catalogue shots — slightly more depth and colour
 *  art    : typographic artboards — only sharpened after downscaling
 *  texture: smooth gradients — untouched
 */
const TONES = {
  photo: { contrast: 1.05, saturation: 1.07, brightness: 1.02, sharpen: 0.7 },
  studio: { contrast: 1.07, saturation: 1.06, brightness: 1, sharpen: 0.8 },
  art: { contrast: 1, saturation: 1.03, brightness: 1, sharpen: 0.5 },
  texture: null,
};

/**
 * [source, output, { max: long-edge cap, min: upscale target for small sources, tone, quality, trim }]
 * Small sources are enlarged 2× with Lanczos3 + sharpening, which renders noticeably crisper
 * on retina screens than letting the browser stretch them. (It cannot invent detail — original
 * high-resolution photography will always look better.)
 */
const JOBS = [
  // Campaign artboards — full-bleed capable
  ["4x/Artboard 43.jpg", "campaign/neon-monogram.jpg", { max: 3200, tone: "art" }],
  ["4x/Artboard 41.jpg", "campaign/after-dark-check.jpg", { max: 3200, tone: "art", trim: true }],
  ["4x/Artboard 48.jpg", "campaign/brick-wall-sky.jpg", { max: 3200, tone: "art" }],
  ["4x/Artboard 39.jpg", "campaign/built-for-the-few.jpg", { max: 3200, tone: "art" }],
  // AI campaign photography
  [gemini("6ns8vt6ns8vt6ns8"), "campaign/neon-room.jpg", { max: 2752, tone: "photo" }],
  [gemini("4l3nfv4l3nfv4l3n"), "campaign/lounge.jpg", { max: 2752, tone: "photo" }],
  [gemini("6d09n36d09n36d09"), "campaign/brick-wall-portrait.jpg", { max: 2466, tone: "photo" }],
  [gemini("9ukrvj9ukrvj9ukr"), "campaign/lounge-portrait.jpg", { max: 2528, tone: "photo" }],
  [gemini("ut9z3eut9z3eut9z"), "campaign/studio-sky.jpg", { max: 2466, tone: "studio" }],
  [gemini("91n61q91n61q91n6"), "campaign/alley-check.jpg", { min: 2752, tone: "photo" }],
  [gemini("upa0wvupa0wvupa0"), "campaign/alley-sand.jpg", { min: 2752, tone: "photo" }],
  [gemini("vkdhl3vkdhl3vkdh"), "campaign/alley-grey.jpg", { min: 2752, tone: "photo" }],
  [gemini("8qhpdp8qhpdp8qhp"), "campaign/checkpoint-grey.jpg", { min: 2466, tone: "photo" }],
  [gemini("jxzwwnjxzwwnjxzw"), "campaign/parking-sky.jpg", { min: 2466, tone: "photo" }],
  ["AI foto/Gemini_Generated_Image_ut9z3eut9z3eut9z (1).jpeg", "campaign/studio-black.jpg", { min: 2528, tone: "studio" }],
  ["AI foto/Gemini_Generated_Image_ut9z3eut9z3eut9z (2).jpeg", "campaign/studio-sage.jpg", { min: 2528, tone: "studio" }],
  // Brand textures
  ["4x/Artboard 1.jpg", "texture/red-glow.jpg", { max: 2400, tone: "texture", quality: 84 }],
  ["4x/Artboard 35.jpg", "texture/red-wave-01.jpg", { max: 2400, tone: "texture", quality: 84 }],
  ["4x/Artboard 38.jpg", "texture/red-wave-02.jpg", { max: 2400, tone: "texture", quality: 84 }],
  ["4x/Artboard 46.jpg", "texture/red-wave-03.jpg", { max: 2400, tone: "texture", quality: 84 }],
  ["4x/Artboard 54.jpg", "texture/red-dusk.jpg", { max: 2400, tone: "texture", quality: 84 }],
  ["4x/Artboard 42.jpg", "texture/particle-monogram.jpg", { max: 3200, tone: "art" }],
];

async function blurDataUrl(file) {
  const buf = await sharp(file).resize(16, 16, { fit: "inside" }).jpeg({ quality: 60 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString("base64")}`;
}

async function convert(srcRel, outRel, { max = 4000, min = 0, tone = "photo", quality = 92, trim = false } = {}) {
  const src = path.join(SRC, srcRel);
  const out = path.join(OUT, outRel);
  await fs.mkdir(path.dirname(out), { recursive: true });

  let input = await sharp(src).rotate().toBuffer();
  // Remove baked-in letterbox bars so the frame can be cropped freely.
  if (trim) input = await sharp(input).trim({ background: "#000000", threshold: 18 }).toBuffer();

  const { width, height } = await sharp(input).metadata();
  const long = Math.max(width, height);
  const target = long < min ? min : Math.min(long, max);
  let img = sharp(input);
  if (target !== long) img = img.resize(target, target, { fit: "inside", kernel: "lanczos3" });

  const t = TONES[tone];
  if (t) {
    img = img
      .modulate({ saturation: t.saturation, brightness: t.brightness })
      .linear(t.contrast, 128 * (1 - t.contrast))
      .sharpen({ sigma: target > long ? t.sharpen + 0.3 : t.sharpen, m1: 0.6, m2: 2.5 });
  }

  await img.jpeg({ quality, mozjpeg: true, progressive: true, chromaSubsampling: "4:4:4" }).toFile(out);
  const meta = await sharp(out).metadata();
  return { src: `/media/${outRel}`, width: meta.width, height: meta.height, blur: await blurDataUrl(out) };
}

async function main() {
  const manifest = {};

  for (const [srcRel, outRel, opts] of JOBS) {
    manifest[outRel.replace(/\.jpg$/, "")] = await convert(srcRel, outRel, opts);
    process.stdout.write(".");
  }

  const catalogDir = path.join(SRC, "katalog pdf foto");
  for (const name of await fs.readdir(catalogDir)) {
    const m = name.match(/-(\d+)\.jpg$/i);
    if (!m) continue;
    const page = Number(m[1]);
    if (CATALOG_DUPLICATES.has(page)) continue;
    const id = `p${String(page).padStart(3, "0")}`;
    manifest[`catalog/${id}`] = await convert(`katalog pdf foto/${name}`, `catalog/${id}.jpg`, { min: 1440, max: 1600, tone: "studio" });
    process.stdout.write(".");
  }

  await fs.mkdir(path.join(OUT, "brand"), { recursive: true });
  const logos = { "Artboard 69": "logo-white", "Artboard 68": "logo-red", "Artboard 58": "logo-badge-red", "Artboard 67": "logo-badge-black" };
  for (const [from, to] of Object.entries(logos)) {
    await fs.copyFile(path.join(SRC, "logo", "SVG", `${from}.svg`), path.join(OUT, "brand", `${to}.svg`));
  }

  await fs.mkdir(path.dirname(MANIFEST), { recursive: true });
  await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n${Object.keys(manifest).length} images → public/media`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
