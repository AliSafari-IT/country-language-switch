import type { Country, Language } from "../types";

/**
 * Canonical language catalogue. Reused across countries so labels stay
 * consistent and the data stays small.
 */
const L = {
  en: { code: "en", label: "English", nativeLabel: "English" },
  nl: { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
  fr: { code: "fr", label: "French", nativeLabel: "Français" },
  de: { code: "de", label: "German", nativeLabel: "Deutsch" },
  es: { code: "es", label: "Spanish", nativeLabel: "Español" },
  it: { code: "it", label: "Italian", nativeLabel: "Italiano" },
  pt: { code: "pt", label: "Portuguese", nativeLabel: "Português" },
  sv: { code: "sv", label: "Swedish", nativeLabel: "Svenska" },
  da: { code: "da", label: "Danish", nativeLabel: "Dansk" },
  no: { code: "no", label: "Norwegian", nativeLabel: "Norsk" },
  fi: { code: "fi", label: "Finnish", nativeLabel: "Suomi" },
  pl: { code: "pl", label: "Polish", nativeLabel: "Polski" },
  ja: { code: "ja", label: "Japanese", nativeLabel: "日本語" },
  zh: { code: "zh", label: "Chinese", nativeLabel: "中文" },
  ar: { code: "ar", label: "Arabic", nativeLabel: "العربية" },
  tr: { code: "tr", label: "Turkish", nativeLabel: "Türkçe" },
  ru: { code: "ru", label: "Russian", nativeLabel: "Русский" },
  ko: { code: "ko", label: "Korean", nativeLabel: "한국어" },
  hi: { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  fa: { code: "fa", label: "Persian", nativeLabel: "فارسی" },
} as const satisfies Record<string, Language>;

/**
 * A curated starter set of countries. Multi-language countries such as
 * Belgium, Switzerland, and Canada are the motivating cases — consumers can
 * replace or extend this list via the `countries` prop.
 */
export const defaultCountries: Country[] = [
  {
    code: "BE",
    name: "Belgium",
    nativeName: "België",
    flag: "🇧🇪",
    languages: [L.nl, L.fr, L.de, L.en],
  },
  {
    code: "NL",
    name: "Netherlands",
    nativeName: "Nederland",
    flag: "🇳🇱",
    languages: [L.nl, L.en],
  },
  {
    code: "FR",
    name: "France",
    nativeName: "France",
    flag: "🇫🇷",
    languages: [L.fr, L.en],
  },
  {
    code: "DE",
    name: "Germany",
    nativeName: "Deutschland",
    flag: "🇩🇪",
    languages: [L.de, L.en],
  },
  {
    code: "CH",
    name: "Switzerland",
    nativeName: "Schweiz",
    flag: "🇨🇭",
    languages: [L.de, L.fr, L.it, L.en],
  },
  {
    code: "LU",
    name: "Luxembourg",
    nativeName: "Lëtzebuerg",
    flag: "🇱🇺",
    languages: [L.fr, L.de, L.en],
  },
  {
    code: "CA",
    name: "Canada",
    nativeName: "Canada",
    flag: "🇨🇦",
    languages: [L.en, L.fr],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    languages: [L.en, L.es],
  },
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    languages: [L.en],
  },
  {
    code: "ES",
    name: "Spain",
    nativeName: "España",
    flag: "🇪🇸",
    languages: [L.es, L.en],
  },
  {
    code: "IT",
    name: "Italy",
    nativeName: "Italia",
    flag: "🇮🇹",
    languages: [L.it, L.en],
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    languages: [L.pt, L.en],
  },
  {
    code: "SE",
    name: "Sweden",
    nativeName: "Sverige",
    flag: "🇸🇪",
    languages: [L.sv, L.en],
  },
  {
    code: "DK",
    name: "Denmark",
    nativeName: "Danmark",
    flag: "🇩🇰",
    languages: [L.da, L.en],
  },
  {
    code: "NO",
    name: "Norway",
    nativeName: "Norge",
    flag: "🇳🇴",
    languages: [L.no, L.en],
  },
  {
    code: "FI",
    name: "Finland",
    nativeName: "Suomi",
    flag: "🇫🇮",
    languages: [L.fi, L.sv, L.en],
  },
  {
    code: "PL",
    name: "Poland",
    nativeName: "Polska",
    flag: "🇵🇱",
    languages: [L.pl, L.en],
  },
  {
    code: "JP",
    name: "Japan",
    nativeName: "日本",
    flag: "🇯🇵",
    languages: [L.ja, L.en],
  },
  {
    code: "CN",
    name: "China",
    nativeName: "中国",
    flag: "🇨🇳",
    languages: [L.zh, L.en],
  },
  {
    code: "KR",
    name: "South Korea",
    nativeName: "대한민국",
    flag: "🇰🇷",
    languages: [L.ko, L.en],
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    languages: [L.hi, L.en],
  },
  {
    code: "TR",
    name: "Türkiye",
    nativeName: "Türkiye",
    flag: "🇹🇷",
    languages: [L.tr, L.en],
  },
  {
    code: "RU",
    name: "Russia",
    nativeName: "Россия",
    flag: "🇷🇺",
    languages: [L.ru, L.en],
  },
  {
    code: "IR",
    name: "Iran",
    nativeName: "ایران",
    flag: "🇮🇷",
    languages: [L.fa, L.en],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    nativeName: "السعودية",
    flag: "🇸🇦",
    languages: [L.ar, L.en],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    languages: [L.ar, L.en],
  },
  {
    code: "BR",
    name: "Brazil",
    nativeName: "Brasil",
    flag: "🇧🇷",
    languages: [L.pt, L.en],
  },
  {
    code: "MX",
    name: "Mexico",
    nativeName: "México",
    flag: "🇲🇽",
    languages: [L.es, L.en],
  },
];

export const languageCatalogue = L;
