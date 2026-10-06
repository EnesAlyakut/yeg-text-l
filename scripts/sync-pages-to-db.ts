/**
 * Writes the editable static pages (About, Production, Fabrics, fabric details, Contact, Sustainability)
 * into the database (PageContent), so every page's content lives there and is edited from the admin.
 * Only missing pages are written — content already edited in the admin is never overwritten.
 * Run: npm run db:pages   (pass --force to reset every page to the built-in content)
 */
import { PrismaClient, type Prisma } from "@prisma/client";
import { aboutContent, aboutImages } from "../src/content/about";
import { contactContent } from "../src/content/contact";
import { fabricDetailsContent, fabricLabelsContent } from "../src/content/fabric-details";
import { fabricSlugs, fabricsContent, fabricsHero } from "../src/content/fabrics";
import { PRODUCTION_ADDRESS, productionContent, productionImages } from "../src/content/production";
import { sustainabilityContent } from "../src/content/sustainability";

if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "postgresql://yeg:yeg_local_dev@localhost:5433/yeg?schema=public";

// Same shape as PAGE_DEFAULTS in src/lib/page-content.ts (that module is server-only, so it is mirrored here)
const PAGES: Record<string, unknown> = {
  about: { ...aboutContent, images: aboutImages },
  production: { ...productionContent, images: productionImages, address: PRODUCTION_ADDRESS },
  fabrics: { ...fabricsContent, images: { hero: fabricsHero, swatches: Object.fromEntries(fabricSlugs().map((s) => [s, null])) } },
  "fabric-details": { ...fabricDetailsContent, labels: fabricLabelsContent },
  contact: contactContent,
  sustainability: sustainabilityContent,
};

const db = new PrismaClient();
const force = process.argv.includes("--force");

async function main() {
  let written = 0;
  for (const [key, value] of Object.entries(PAGES)) {
    const data = JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
    const exists = await db.pageContent.findUnique({ where: { key }, select: { key: true } });
    if (exists && !force) continue;
    await db.pageContent.upsert({ where: { key }, create: { key, data }, update: { data } });
    written++;
  }
  console.log(`Pages in the database: ${Object.keys(PAGES).length} (${written} written${force ? ", forced" : ""}).`);
}

main().finally(() => db.$disconnect());
