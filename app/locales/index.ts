import en from "./en";
import fr from "./fr";
import { merge } from "../utils/merge";

import type { LocaleType } from "./en";
export type { LocaleType, PartialLocaleType } from "./en";

const ALL_LANGS = {
  en,
  fr,
};

export type Lang = keyof typeof ALL_LANGS;

export const AllLangs = Object.keys(ALL_LANGS) as Lang[];

export const ALL_LANG_OPTIONS: Record<Lang, string> = {
  en: "English",
  fr: "Français",
};

const LANG_KEY = "lang";
const DEFAULT_LANG = "en";

const fallbackLang = en;
const targetLang = ALL_LANGS[getLang()] as LocaleType;

// if target lang missing some fields, it will use fallback lang string
merge(fallbackLang, targetLang);

export default fallbackLang as LocaleType;

function getItem(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

function getLanguage() {
  try {
    return navigator.language.toLowerCase();
  } catch {
    return DEFAULT_LANG;
  }
}

export function getLang(): Lang {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get("lang") &&
      AllLangs.includes(params.get("lang")!.toLowerCase() as Lang)
    ) {
      return params.get("lang") as Lang;
    }
  }

  const savedLang = getItem(LANG_KEY);

  if (AllLangs.includes((savedLang ?? "") as Lang)) {
    return savedLang as Lang;
  }

  const lang = getLanguage();

  for (const option of AllLangs) {
    if (lang.includes(option)) {
      return option;
    }
  }

  return DEFAULT_LANG;
}

export function changeLang(lang: Lang) {
  setItem(LANG_KEY, lang);
  location.reload();
}

export function getISOLang() {
  const isoLangString: Record<string, string> = {
    en: "en-US",
    fr: "fr-FR",
  };

  const lang = getLang();
  return isoLangString[lang] ?? lang;
}
