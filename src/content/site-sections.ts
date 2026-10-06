import type { Locale } from "@/i18n/config";
import { ABOUT_PATH, aboutMenu } from "./about-sections";

/**
 * In-page sections reachable from the header submenus and the footer.
 * Light on purpose: the Navbar (client) bundles this file.
 */
export const homeSections = [{ id: "ar-ge", tr: "Ar-Ge", en: "R&D", fr: "R&D" }] as const;

export const AR_GE_ID = "ar-ge";
export const HOME_PATH = "/";

const homeUi = {
  tr: { submenu: "Ana sayfa alt menüsü" },
  en: { submenu: "Home submenu" },
  fr: { submenu: "Sous-menu Accueil" },
};

export type Submenu = { submenu: string; items: { id: string; label: string; index: string }[] };

/** Submenus keyed by the (locale-less) path of the header link they belong to. */
export function siteSubmenus(lang: Locale): Record<string, Submenu> {
  return {
    [HOME_PATH]: {
      submenu: homeUi[lang].submenu,
      items: homeSections.map((s, i) => ({ id: s.id, label: s[lang], index: String(i + 1).padStart(2, "0") })),
    },
    [ABOUT_PATH]: aboutMenu(lang),
  };
}

export const arGeLabel = (lang: Locale) => homeSections[0][lang];
