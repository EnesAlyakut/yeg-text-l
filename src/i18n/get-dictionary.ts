import "server-only";
import type { Locale } from "./config";
import en from "./dictionaries/en";
import fr from "./dictionaries/fr";
import tr from "./dictionaries/tr";

const dictionaries = { en, tr, fr };

export const getDictionary = (lang: Locale) => dictionaries[lang];
export type { Dictionary } from "./dictionaries/en";
