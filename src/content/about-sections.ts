import type { Locale } from "@/i18n/config";

/**
 * Anchor targets on the About page. The same list drives the header dropdown,
 * the mobile accordion and the page's own index, so ids can never drift apart.
 * Kept free of heavy imports: the Navbar (client) bundles this file.
 */
export const aboutSections = [
  { id: "biz-kimiz", tr: "Biz Kimiz?", en: "Who We Are", fr: "Qui sommes-nous ?" },
  { id: "hikayemiz", tr: "Hikâyemiz", en: "Our Story", fr: "Notre histoire" },
  { id: "marka-bakisi", tr: "YEG’in Marka Bakışı", en: "YEG’s Brand Perspective", fr: "La vision de marque de YEG" },
  { id: "sirket-olarak-yeg", tr: "Şirket Olarak YEG", en: "YEG as a Company", fr: "YEG, l’entreprise" },
  { id: "uretim-kapasitesi", tr: "Üretim Kapasitesi", en: "Production Capacity", fr: "Capacité de production" },
  { id: "uretim-alanlari", tr: "Üretim Alanlarımız", en: "Our Production Areas", fr: "Nos domaines de production" },
  { id: "kalite", tr: "Kalite ve Sorumluluk", en: "Quality & Responsibility", fr: "Qualité et responsabilité" },
  { id: "is-yapma-bicimimiz", tr: "İş Yapma Biçimimiz", en: "How We Work", fr: "Notre façon de travailler" },
  { id: "uluslararasi", tr: "Uluslararası Yapılanma", en: "International Structure", fr: "Structure internationale" },
  { id: "gelecege-bakis", tr: "Geleceğe Bakış", en: "Looking Ahead", fr: "Regard vers l’avenir" },
] as const;

export type AboutSectionId = (typeof aboutSections)[number]["id"];

export const ABOUT_PATH = "/about";

const ui = {
  tr: { submenu: "Hakkımızda alt menüsü", onThisPage: "Bu sayfada" },
  en: { submenu: "About submenu", onThisPage: "On this page" },
  fr: { submenu: "Sous-menu À propos", onThisPage: "Sur cette page" },
};

export function aboutMenu(lang: Locale) {
  return {
    ...ui[lang],
    items: aboutSections.map((s, i) => ({ id: s.id, label: s[lang], index: String(i + 1).padStart(2, "0") })),
  };
}
