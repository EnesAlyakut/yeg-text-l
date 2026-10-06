export type ImageRef = {
  url: string;
  width: number;
  height: number;
  blur?: string | null;
  /** CSS object-position, used whenever the image is cropped */
  position?: string;
};

export type HeroSection = {
  image: ImageRef;
  /** Extra slides shown after `image` as a crossfading slideshow (ignored while a video is set) */
  images?: ImageRef[];
  mobileImage?: ImageRef | null;
  videoUrl?: string | null;
  titleEn: string;
  titleTr: string;
  titleFr?: string;
  subtitleEn: string;
  subtitleTr: string;
  subtitleFr?: string;
  ctaLabelEn: string;
  ctaLabelTr: string;
  ctaLabelFr?: string;
  ctaHref: string;
};

export type IntroSection = {
  textEn: string;
  textTr: string;
  textFr?: string;
  /** Small label above the text (defaults to "Manifesto") */
  labelEn?: string;
  labelTr?: string;
  labelFr?: string;
  titleEn?: string;
  titleTr?: string;
  titleFr?: string;
};

export type FeaturedSection = {
  titleEn: string;
  titleTr: string;
  titleFr?: string;
  productSlugs: string[];
  /** Campaign photos (1 large + 2); when set they replace the product cards */
  gallery?: ImageRef[];
};

export type StatementSection = {
  image: ImageRef;
  /** Extra frames that crossfade after `image` */
  images?: ImageRef[];
  captionEn: string;
  captionTr: string;
  captionFr?: string;
  /** Optional story told over the frame: small label, title (Enter = line break), one paragraph per line */
  eyebrowEn?: string;
  eyebrowTr?: string;
  eyebrowFr?: string;
  titleEn?: string;
  titleTr?: string;
  titleFr?: string;
  textEn?: string;
  textTr?: string;
  textFr?: string;
};

/** `images[i]` (optional, uploaded in the admin) replaces the photo of the i-th product. */
export type ShowcaseText = Record<`${"name" | "description" | "collection" | "color" | "material"}${"En" | "Tr" | "Fr"}`, string>;
/** `texts[i]` fills the info beside slot i (overrides the product's own text where filled). */
export type ShowcaseSection = { productSlugs: string[]; images?: (ImageRef | null)[]; texts?: Partial<ShowcaseText>[] };

export type StoryStep = { titleEn: string; titleTr: string; titleFr?: string; textEn: string; textTr: string; textFr?: string; image: ImageRef };
export type StorySection = {
  linesEn: string[];
  linesTr: string[];
  linesFr?: string[];
  textEn: string;
  textTr: string;
  textFr?: string;
  texture: ImageRef;
  steps: StoryStep[];
};

export type CollectionsSection = { titleEn: string; titleTr: string; titleFr?: string; collectionSlugs: string[] };

export type BannerSection = {
  image: ImageRef;
  /** Extra backgrounds that crossfade after `image` */
  images?: ImageRef[];
  titleEn: string;
  titleTr: string;
  titleFr?: string;
  textEn: string;
  textTr: string;
  textFr?: string;
  ctaLabelEn: string;
  ctaLabelTr: string;
  ctaLabelFr?: string;
  ctaHref: string;
};

export type MarqueeSection = { itemsEn: string[]; itemsTr: string[]; itemsFr?: string[] };

/** Same shape the admin GalleryField produces; alt text doubles as the caption. */
export type LookbookImage = {
  url: string;
  width: number;
  height: number;
  blurDataUrl: string | null;
  altEn: string;
  altTr: string;
  altFr?: string;
  objectPosition: string;
  isPrimary?: boolean;
};
export type LookbookSection = { titleEn: string; titleTr: string; titleFr?: string; textEn: string; textTr: string; textFr?: string; images: LookbookImage[] };

export type HomepageSections = {
  hero: HeroSection;
  intro: IntroSection;
  featured: FeaturedSection;
  statement: StatementSection;
  showcase: ShowcaseSection;
  lookbook: LookbookSection;
  story: StorySection;
  collections: CollectionsSection;
  banner: BannerSection;
  marquee: MarqueeSection;
};

export type HomepageKey = keyof HomepageSections;

export const HOMEPAGE_KEYS: HomepageKey[] = [
  "hero",
  "intro",
  "marquee",
  "featured",
  "statement",
  "showcase",
  "lookbook",
  "story",
  "collections",
  "banner",
];

export type ContactSettings = {
  email: string;
  phone: string;
  whatsapp: string;
  addressEn: string;
  addressTr: string;
  addressFr?: string;
  instagram: string;
  mapUrl?: string;
};

export type GeneralSettings = {
  currency: string;
  showPrices: boolean;
};

export type SpecRow = { labelEn: string; labelTr: string; labelFr?: string; valueEn: string; valueTr: string; valueFr?: string };
