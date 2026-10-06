import type { Locale } from "@/i18n/config";
import { importedImage } from "./production";

/**
 * Fabrics page. Groups and materials come from the previous yegtextile.com/fabrics page
 * (machine-translated English, cleaned up), translated into Turkish and French.
 * Each fabric gets a woven-pattern swatch drawn in CSS (see FabricSwatch) instead of a stock photo.
 */
export const fabricsHero = importedImage("fabrics/knitting-floor", "50% 40%");
export const FABRICS_PATH = "/fabrics";

export type Weave = "check" | "twill" | "mesh" | "dobby" | "canvas" | "drape" | "zebra" | "pinstripe" | "knit" | "velvet" | "quilt" | "ripstop";
export type FabricSlug = "shirt" | "suit-trouser" | "sportswear" | "fancy-outerwear" | "workwear" | "decoration" | "curtain" | "bed-linen" | "home-knit-velvet" | "upholstery" | "mattress" | "technical";
type Fabric = { slug: FabricSlug; weave: Weave; title: string; materials: string[] };
type Group = { id: "apparel" | "home" | "technical"; label: string; fabrics: Fabric[] };

const tr = {
  meta: {
    title: "Kumaşlar",
    description: "Gömleklikten döşemeliğe, perdeden teknik kumaşlara: YEG Textile’in giyim, ev tekstili ve teknik kumaş grupları.",
  },
  eyebrow: "Kumaşlar",
  title: "Kumaşlar",
  lead: "Giyimden ev tekstiline, teknik kumaşlara — 12 kumaş grubu.",
  groupsLabel: "Gruplar",
  countLabel: "kumaş grubu",
  materialsLabel: "Malzemeler",
  groups: [
    {
      id: "apparel",
      label: "Giyim",
      fabrics: [
        { slug: "shirt", weave: "check", title: "Gömleklik kumaşlar", materials: ["Düz", "Dobby", "İplik boyalı", "Ekose & çizgili", "Polyester-pamuk-viskon"] },
        { slug: "suit-trouser", weave: "twill", title: "Takım elbise & pantolon kumaşları", materials: ["Polyester", "Viskon", "Pamuk"] },
        { slug: "sportswear", weave: "mesh", title: "Spor giyim kumaşları", materials: ["Polyester", "Naylon", "Pamuk", "File", "Polar", "Raşel", "Mikrofiber"] },
        { slug: "fancy-outerwear", weave: "dobby", title: "Fantezi dış giyim kumaşları", materials: ["Düz", "Dobby", "İplik boyalı", "Ekose & çizgili", "Polyester-pamuk-viskon"] },
        { slug: "workwear", weave: "canvas", title: "İş elbisesi kumaşları", materials: ["Polyester", "Gabardin", "Kanvas", "Oxford"] },
      ],
    },
    {
      id: "home",
      label: "Ev & Dekorasyon",
      fabrics: [
        { slug: "decoration", weave: "drape", title: "Dekorasyon kumaşları", materials: ["Güneşlik", "Blackout", "Fon", "Perdelik", "Tül"] },
        { slug: "curtain", weave: "zebra", title: "Perde kumaşları", materials: ["Kaplamalı düz stor", "Zebra", "Blackout"] },
        { slug: "bed-linen", weave: "pinstripe", title: "Ev tekstili — nevresimlik", materials: ["Poli-pamuk", "Mikrofiber nevresim"] },
        { slug: "home-knit-velvet", weave: "knit", title: "Ev tekstili — örme & kadife", materials: ["Polyester", "Viskon", "Örme raşel", "Kadife"] },
        { slug: "upholstery", weave: "velvet", title: "Döşemelik kumaşlar", materials: ["Süet", "Raşel", "Kadife"] },
        { slug: "mattress", weave: "quilt", title: "Yatak kumaşları", materials: ["Polyester", "Viskon", "Pamuk"] },
      ],
    },
    {
      id: "technical",
      label: "Teknik",
      fabrics: [{ slug: "technical", weave: "ripstop", title: "Çadır, mobilya & bant kumaşları", materials: ["Top boyama", "İplik boyama"] }],
    },
  ] as Group[],
  /** Interlude ("ara kapak") after the materials band. The lockup stays in English on every language. */
  interlude: {
    lockup: ["FLAT.", "HARD.", "FINAL."],
    local: "Düz. Sert. Net." as string | null,
    lastWordLabel: "Ve son söz:",
    statement: "İyi üretim, doğru iletişim ve güven üzerine kurulmuş uzun vadeli iş birlikleri.",
  },
  ctaTitle: "Numune ister misiniz?",
  ctaText: "Koleksiyonunuz için doğru kumaşı birlikte seçelim; numune ve fiyat talepleriniz için bize ulaşın.",
  cta: "Bize ulaşın",
};

type FabricsContent = typeof tr;

const en: FabricsContent = {
  meta: {
    title: "Fabrics",
    description: "From shirting to upholstery, curtains to technical fabrics: YEG Textile’s apparel, home textile and technical fabric groups.",
  },
  eyebrow: "Fabrics",
  title: "Fabrics",
  lead: "From apparel to home textiles and technical fabrics — 12 fabric groups.",
  groupsLabel: "Groups",
  countLabel: "fabric groups",
  materialsLabel: "Materials",
  groups: [
    {
      id: "apparel",
      label: "Apparel",
      fabrics: [
        { slug: "shirt", weave: "check", title: "Shirt fabrics", materials: ["Plain", "Dobby", "Yarn-dyed", "Plaid & striped", "Polyester-cotton-viscose"] },
        { slug: "suit-trouser", weave: "twill", title: "Suit & trouser fabrics", materials: ["Polyester", "Viscose", "Cotton"] },
        { slug: "sportswear", weave: "mesh", title: "Sportswear fabrics", materials: ["Polyester", "Nylon", "Cotton", "Mesh", "Fleece", "Raschel", "Microfiber"] },
        { slug: "fancy-outerwear", weave: "dobby", title: "Fancy outerwear fabrics", materials: ["Plain", "Dobby", "Yarn-dyed", "Plaid & striped", "Polyester-cotton-viscose"] },
        { slug: "workwear", weave: "canvas", title: "Workwear fabrics", materials: ["Polyester", "Gabardine", "Canvas", "Oxford"] },
      ],
    },
    {
      id: "home",
      label: "Home & Decor",
      fabrics: [
        { slug: "decoration", weave: "drape", title: "Decoration fabrics", materials: ["Sunshade", "Blackout", "Backdrop", "Drapery", "Tulle"] },
        { slug: "curtain", weave: "zebra", title: "Curtain fabrics", materials: ["Coated plain roller blinds", "Zebra", "Blackout"] },
        { slug: "bed-linen", weave: "pinstripe", title: "Home textiles — bed linen", materials: ["Poly-cotton", "Microfiber bed sheets"] },
        { slug: "home-knit-velvet", weave: "knit", title: "Home textiles — knit & velvet", materials: ["Polyester", "Viscose", "Knitted raschel", "Velvet"] },
        { slug: "upholstery", weave: "velvet", title: "Upholstery fabrics", materials: ["Suede", "Raschel", "Velvet"] },
        { slug: "mattress", weave: "quilt", title: "Mattress fabrics", materials: ["Polyester", "Viscose", "Cotton"] },
      ],
    },
    {
      id: "technical",
      label: "Technical",
      fabrics: [{ slug: "technical", weave: "ripstop", title: "Tent, furniture & banding fabrics", materials: ["Piece-dyed", "Yarn-dyed"] }],
    },
  ],
  interlude: {
    lockup: ["FLAT.", "HARD.", "FINAL."],
    local: null,
    lastWordLabel: "And the last word:",
    statement: "Long-term partnerships built on good production, clear communication and trust.",
  },
  ctaTitle: "Need a sample?",
  ctaText: "Let’s choose the right fabric for your collection together — contact us for samples and pricing.",
  cta: "Contact us",
};

const fr: FabricsContent = {
  meta: {
    title: "Tissus",
    description: "De la chemise à l’ameublement, des rideaux aux tissus techniques : les familles de tissus habillement, linge de maison et techniques de YEG Textile.",
  },
  eyebrow: "Tissus",
  title: "Tissus",
  lead: "De l’habillement au linge de maison et aux tissus techniques — 12 familles de tissus.",
  groupsLabel: "Familles",
  countLabel: "familles de tissus",
  materialsLabel: "Matières",
  groups: [
    {
      id: "apparel",
      label: "Habillement",
      fabrics: [
        { slug: "shirt", weave: "check", title: "Tissus pour chemises", materials: ["Uni", "Dobby", "Teint en fil", "Carreaux & rayures", "Polyester-coton-viscose"] },
        { slug: "suit-trouser", weave: "twill", title: "Tissus pour costumes & pantalons", materials: ["Polyester", "Viscose", "Coton"] },
        { slug: "sportswear", weave: "mesh", title: "Tissus pour vêtements de sport", materials: ["Polyester", "Nylon", "Coton", "Mesh", "Polaire", "Raschel", "Microfibre"] },
        { slug: "fancy-outerwear", weave: "dobby", title: "Tissus fantaisie pour l’extérieur", materials: ["Uni", "Dobby", "Teint en fil", "Carreaux & rayures", "Polyester-coton-viscose"] },
        { slug: "workwear", weave: "canvas", title: "Tissus pour vêtements de travail", materials: ["Polyester", "Gabardine", "Toile", "Oxford"] },
      ],
    },
    {
      id: "home",
      label: "Maison & Déco",
      fabrics: [
        { slug: "decoration", weave: "drape", title: "Tissus de décoration", materials: ["Pare-soleil", "Occultant", "Toile de fond", "Rideau", "Voilage"] },
        { slug: "curtain", weave: "zebra", title: "Tissus pour rideaux & stores", materials: ["Stores enrouleurs enduits", "Zébra", "Occultant"] },
        { slug: "bed-linen", weave: "pinstripe", title: "Linge de maison — literie", materials: ["Poly-coton", "Draps en microfibre"] },
        { slug: "home-knit-velvet", weave: "knit", title: "Linge de maison — maille & velours", materials: ["Polyester", "Viscose", "Raschel tricoté", "Velours"] },
        { slug: "upholstery", weave: "velvet", title: "Tissus d’ameublement", materials: ["Suédine", "Raschel", "Velours"] },
        { slug: "mattress", weave: "quilt", title: "Tissus pour matelas", materials: ["Polyester", "Viscose", "Coton"] },
      ],
    },
    {
      id: "technical",
      label: "Technique",
      fabrics: [{ slug: "technical", weave: "ripstop", title: "Tissus pour tentes, mobilier & sangles", materials: ["Teint en pièce", "Teint en fil"] }],
    },
  ],
  interlude: {
    lockup: ["FLAT.", "HARD.", "FINAL."],
    local: "Plat. Dur. Net.",
    lastWordLabel: "Et le mot de la fin :",
    statement: "Des partenariats durables, fondés sur une production de qualité, une communication juste et la confiance.",
  },
  ctaTitle: "Besoin d’un échantillon ?",
  ctaText: "Choisissons ensemble le bon tissu pour votre collection — contactez-nous pour les échantillons et les prix.",
  cta: "Nous contacter",
};

const content = { en, tr, fr };

export type { FabricsContent };
/** All languages, the defaults the admin edits on top of */
export const fabricsContent = content;

export const getFabrics = (lang: Locale) => content[lang];

export const fabricPath = (slug: string) => `${FABRICS_PATH}/${slug}`;

/** All fabrics in page order (01–12), each with its group. Pass loaded (admin-edited) content, or a language for the defaults. */
export const flatFabrics = (src: Locale | FabricsContent) =>
  (typeof src === "string" ? content[src] : src).groups.flatMap((g) => g.fabrics.map((fabric) => ({ fabric, group: g })));

/** Slugs are structural (they are the URLs), so they always come from the defaults. */
export const fabricSlugs = () => flatFabrics("en").map((f) => f.fabric.slug);

export const isFabricSlug = (slug: string): slug is FabricSlug => fabricSlugs().includes(slug as FabricSlug);

/** One fabric with its position, neighbours (wrapping) and the rest of its group. */
export function findFabric(src: Locale | FabricsContent, slug: string) {
  const all = flatFabrics(src);
  const index = all.findIndex((f) => f.fabric.slug === slug);
  if (index < 0) return null;
  const { fabric, group } = all[index];
  return {
    fabric,
    group,
    index,
    total: all.length,
    prev: all[(index - 1 + all.length) % all.length].fabric,
    next: all[(index + 1) % all.length].fabric,
    siblings: group.fabrics.filter((f) => f.slug !== slug),
  };
}

/** Every distinct material across the groups, for the scrolling band. */
export const allMaterials = (src: Locale | FabricsContent) => [...new Set(flatFabrics(src).flatMap(({ fabric }) => fabric.materials))];
