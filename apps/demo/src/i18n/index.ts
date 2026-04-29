import { initI18n } from "@asafarim/shared-i18n";
import type { Country, Locale } from "@asafarim/country-language-selector";

import enApp from "./locales/en/app.json";
import nlApp from "./locales/nl/app.json";
import frApp from "./locales/fr/app.json";
import deApp from "./locales/de/app.json";
import lbApp from "./locales/lb/app.json";

/**
 * Benelux-focused country catalogue for the demo.
 * The catalogue drives both the selector and the allowed URL slugs.
 * The synthetic "UN" country represents the universal English fallback (slug: `en`).
 */
export const BENELUX_COUNTRIES: Country[] = [
  {
    code: "BE",
    name: "Belgium",
    nativeName: "België",
    flag: "🇧🇪",
    languages: [
      { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
      { code: "fr", label: "French", nativeLabel: "Français" },
      { code: "de", label: "German", nativeLabel: "Deutsch" },
      { code: "en", label: "English" },
    ],
  },
  {
    code: "NL",
    name: "Netherlands",
    nativeName: "Nederland",
    flag: "🇳🇱",
    languages: [
      { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
      { code: "en", label: "English" },
    ],
  },
  {
    code: "LU",
    name: "Luxembourg",
    nativeName: "Lëtzebuerg",
    flag: "🇱🇺",
    languages: [
      { code: "fr", label: "French", nativeLabel: "Français" },
      { code: "de", label: "German", nativeLabel: "Deutsch" },
      { code: "lb", label: "Luxembourgish", nativeLabel: "Lëtzebuergesch" },
      { code: "en", label: "English" },
    ],
  },
  {
    code: "UN",
    name: "International",
    nativeName: "International",
    flag: "🌐",
    languages: [{ code: "en", label: "English" }],
  },
];

/** Supported i18next language codes. */
export const SUPPORTED_LANGUAGES = ["en", "nl", "fr", "de", "lb"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Default locale when no URL slug is present. */
export const DEFAULT_LOCALE: Locale = { country: "UN", language: "en" };

/**
 * Turn a Locale into a URL slug.
 * - Universal English fallback (`UN/en`) collapses to `en`.
 * - All other locales use `{country}-{language}` in lowercase.
 */
export function toLocaleSlug(locale: Locale): string {
  if (locale.country === "UN") return locale.language.toLowerCase();
  return `${locale.country.toLowerCase()}-${locale.language.toLowerCase()}`;
}

/**
 * Parse a URL slug into a Locale. Returns `null` if the slug does not match
 * a known country/language pair in the Benelux catalogue.
 */
export function parseLocaleSlug(slug: string | undefined | null): Locale | null {
  if (!slug) return null;
  const normalized = slug.toLowerCase();

  // Universal fallback: `/en`
  if (normalized === "en") return { country: "UN", language: "en" };

  const match = normalized.match(/^([a-z]{2})-([a-z]{2,3})$/);
  if (!match) return null;

  const countryCode = match[1]!.toUpperCase();
  const languageCode = match[2]!;

  const country = BENELUX_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return null;
  const language = country.languages.find((l) => l.code === languageCode);
  if (!language) return null;

  return { country: countryCode, language: languageCode };
}

/**
 * Resolve which i18next language should be active for a given locale.
 * Falls back to `en` when the locale uses a language that has no bundled translations.
 */
export function resolveI18nLanguage(locale: Locale): SupportedLanguage {
  const lang = locale.language.toLowerCase() as SupportedLanguage;
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang) ? lang : "en";
}

/** All valid slugs (for sitemap / dev reference). */
export const ALL_LOCALE_SLUGS: string[] = [
  "en",
  ...BENELUX_COUNTRIES.filter((c) => c.code !== "UN").flatMap((c) =>
    c.languages.map((l) => `${c.code.toLowerCase()}-${l.code}`)
  ),
];

/** Bootstrap shared-i18n with the Benelux translation resources. */
export function setupI18n(): void {
  initI18n({
    defaultNS: "app",
    ns: ["app", "common"],
    supportedLngs: [...SUPPORTED_LANGUAGES],
    defaultLanguage: "en",
    resources: {
      en: { app: enApp },
      nl: { app: nlApp },
      fr: { app: frApp },
      de: { app: deApp },
      lb: { app: lbApp },
    },
  });
}
