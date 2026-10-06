"use server";

import type { Prisma } from "@prisma/client";
import { bool, int, json, lines, revalidateSite, str, type ActionState } from "@/lib/admin";
import { requireAdmin } from "@/lib/auth";
import { HOMEPAGE_KEYS, type HomepageSections, type ImageRef, type LookbookImage } from "@/lib/content-types";
import { db } from "@/lib/db";

const t = (fd: FormData, key: string) => ({ en: str(fd, `${key}En`), tr: str(fd, `${key}Tr`), fr: str(fd, `${key}Fr`) });
const img = (fd: FormData, key: string) => json<ImageRef | null>(fd, key, null);
const imgs = (fd: FormData, key: string, fallback: ImageRef[] = []) => json<ImageRef[]>(fd, key, fallback).filter((i) => i && typeof i.url === "string");

export async function saveHomepage(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const current = Object.fromEntries((await db.homepageSection.findMany()).map((r) => [r.key, r.data])) as Partial<HomepageSections>;

  const heroTitle = t(fd, "hero.title");
  const heroSub = t(fd, "hero.subtitle");
  const heroCta = t(fd, "hero.ctaLabel");
  const heroImage = img(fd, "hero.image") ?? current.hero?.image;
  if (!heroImage) return { error: "Hero görseli zorunludur." };

  const statementImage = img(fd, "statement.image") ?? current.statement?.image;
  const storyTexture = img(fd, "story.texture") ?? current.story?.texture;
  const bannerImage = img(fd, "banner.image") ?? current.banner?.image;
  if (!statementImage || !storyTexture || !bannerImage) return { error: "Bölüm görselleri boş bırakılamaz." };

  const sections: HomepageSections = {
    hero: {
      image: heroImage,
      images: imgs(fd, "hero.images", current.hero?.images),
      mobileImage: img(fd, "hero.mobileImage"),
      videoUrl: str(fd, "hero.videoUrl") || null,
      titleEn: heroTitle.en,
      titleTr: heroTitle.tr,
      titleFr: heroTitle.fr,
      subtitleEn: heroSub.en,
      subtitleTr: heroSub.tr,
      subtitleFr: heroSub.fr,
      ctaLabelEn: heroCta.en,
      ctaLabelTr: heroCta.tr,
      ctaLabelFr: heroCta.fr,
      ctaHref: str(fd, "hero.ctaHref") || "/products",
    },
    intro: {
      textEn: str(fd, "intro.textEn"),
      textTr: str(fd, "intro.textTr"),
      textFr: str(fd, "intro.textFr"),
      labelEn: str(fd, "intro.labelEn"),
      labelTr: str(fd, "intro.labelTr"),
      labelFr: str(fd, "intro.labelFr"),
      titleEn: str(fd, "intro.titleEn"),
      titleTr: str(fd, "intro.titleTr"),
      titleFr: str(fd, "intro.titleFr"),
    },
    marquee: { itemsEn: lines(fd, "marquee.itemsEn"), itemsTr: lines(fd, "marquee.itemsTr"), itemsFr: lines(fd, "marquee.itemsFr") },
    featured: {
      titleEn: str(fd, "featured.titleEn"),
      titleTr: str(fd, "featured.titleTr"),
      titleFr: str(fd, "featured.titleFr"),
      productSlugs: json<string[]>(fd, "featured.productSlugs", []),
      gallery: [0, 1, 2].map((i) => img(fd, `featured.gallery.${i}`)).filter((i): i is ImageRef => Boolean(i)),
    },
    statement: { image: statementImage, images: imgs(fd, "statement.images", current.statement?.images), captionEn: str(fd, "statement.captionEn"), captionTr: str(fd, "statement.captionTr"), captionFr: str(fd, "statement.captionFr"),
      eyebrowEn: str(fd, "statement.eyebrowEn"), eyebrowTr: str(fd, "statement.eyebrowTr"), eyebrowFr: str(fd, "statement.eyebrowFr"),
      titleEn: str(fd, "statement.titleEn"), titleTr: str(fd, "statement.titleTr"), titleFr: str(fd, "statement.titleFr"),
      textEn: str(fd, "statement.textEn"), textTr: str(fd, "statement.textTr"), textFr: str(fd, "statement.textFr") },
    showcase: { productSlugs: json<string[]>(fd, "showcase.productSlugs", []),       images: [0, 1, 2, 3, 4].map((i) => img(fd, `showcase.images.${i}`)),
      texts: [0, 1, 2, 3, 4].map((i) =>
        Object.fromEntries(
          (["name", "description", "collection", "color", "material"] as const).flatMap((f) => {
            const v = t(fd, `showcase.texts.${i}.${f}`);
            return [[`${f}En`, v.en], [`${f}Tr`, v.tr], [`${f}Fr`, v.fr]];
          }),
        ),
      ),
    },
    lookbook: {
      titleEn: str(fd, "lookbook.titleEn"),
      titleTr: str(fd, "lookbook.titleTr"),
      titleFr: str(fd, "lookbook.titleFr"),
      // No longer shown on the site; kept as stored
      textEn: current.lookbook?.textEn ?? "",
      textTr: current.lookbook?.textTr ?? "",
      textFr: current.lookbook?.textFr ?? "",
      images: json<LookbookImage[]>(fd, "lookbook.images", current.lookbook?.images ?? []),
    },
    story: {
      // Big lines are only a screen-reader heading now; kept as stored
      linesEn: current.story?.linesEn ?? [],
      linesTr: current.story?.linesTr ?? [],
      linesFr: current.story?.linesFr ?? [],
      textEn: str(fd, "story.textEn"),
      textTr: str(fd, "story.textTr"),
      textFr: str(fd, "story.textFr"),
      texture: storyTexture,
      steps: [0, 1, 2].map((i) => ({
        titleEn: str(fd, `story.steps.${i}.titleEn`),
        titleTr: str(fd, `story.steps.${i}.titleTr`),
        titleFr: str(fd, `story.steps.${i}.titleFr`),
        textEn: str(fd, `story.steps.${i}.textEn`),
        textTr: str(fd, `story.steps.${i}.textTr`),
        textFr: str(fd, `story.steps.${i}.textFr`),
        image: img(fd, `story.steps.${i}.image`) ?? current.story?.steps[i]?.image ?? storyTexture,
      })),
    },
    collections: { titleEn: str(fd, "collections.titleEn"), titleTr: str(fd, "collections.titleTr"), titleFr: str(fd, "collections.titleFr"), collectionSlugs: json<string[]>(fd, "collections.collectionSlugs", []) },
    banner: {
      image: bannerImage,
      images: imgs(fd, "banner.images", current.banner?.images),
      titleEn: str(fd, "banner.titleEn"),
      titleTr: str(fd, "banner.titleTr"),
      titleFr: str(fd, "banner.titleFr"),
      textEn: str(fd, "banner.textEn"),
      textTr: str(fd, "banner.textTr"),
      textFr: str(fd, "banner.textFr"),
      ctaLabelEn: str(fd, "banner.ctaLabelEn"),
      ctaLabelTr: str(fd, "banner.ctaLabelTr"),
      ctaLabelFr: str(fd, "banner.ctaLabelFr"),
      ctaHref: str(fd, "banner.ctaHref") || "/contact",
    },
  };

  await db.$transaction(
    HOMEPAGE_KEYS.map((key) =>
      db.homepageSection.upsert({
        where: { key },
        update: { data: sections[key] as unknown as Prisma.InputJsonValue, enabled: bool(fd, `${key}.enabled`), sortOrder: int(fd, `${key}.sortOrder`) },
        create: { key, data: sections[key] as unknown as Prisma.InputJsonValue, enabled: bool(fd, `${key}.enabled`), sortOrder: int(fd, `${key}.sortOrder`) },
      }),
    ),
  );

  revalidateSite();
  return { ok: true, message: "Ana sayfa güncellendi." };
}
