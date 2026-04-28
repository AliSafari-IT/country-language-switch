/**
 * Public types for @asafarim/country-language-selector.
 *
 * The model is deliberately minimal:
 *   - A `Country` owns an ordered list of supported `Language` codes.
 *   - A `Locale` is the user-facing selection: `{ country, language }`.
 *
 * Codes follow ISO standards so they interop cleanly with i18n libraries:
 *   - Country: ISO 3166-1 alpha-2 (e.g. "BE", "FR", "DE", "NL")
 *   - Language: BCP 47 primary subtag / ISO 639-1 (e.g. "nl", "fr", "de", "en")
 */

import type { ReactNode } from "react";

export type CountryCode = string; // ISO 3166-1 alpha-2, uppercase by convention
export type LanguageCode = string; // BCP 47 / ISO 639-1, lowercase by convention

export interface Language {
  /** BCP 47 / ISO 639-1 code, e.g. "nl". */
  code: LanguageCode;
  /** English label shown in the UI, e.g. "Dutch". */
  label: string;
  /** Native label shown as a subtitle, e.g. "Nederlands". */
  nativeLabel?: string;
}

export interface Country {
  /** ISO 3166-1 alpha-2 code, e.g. "BE". */
  code: CountryCode;
  /** English label, e.g. "Belgium". */
  name: string;
  /** Native label, e.g. "België". */
  nativeName?: string;
  /** Emoji flag. Rendered as text so it needs no image asset. */
  flag: string;
  /**
   * Ordered list of languages this country supports in this app.
   * The first entry is treated as the country's default language.
   */
  languages: Language[];
}

export interface Locale {
  country: CountryCode;
  language: LanguageCode;
}

/**
 * Callback fired whenever the effective locale changes. Fires on both
 * country-driven changes (with language defaulted) and explicit language
 * changes within the currently-selected country.
 */
export type LocaleChangeHandler = (locale: Locale, meta: LocaleChangeMeta) => void;

export interface LocaleChangeMeta {
  /** What caused the change. Useful for analytics / side effects. */
  reason: "country" | "language" | "init" | "reset";
  /** The previous locale, or null if none was set. */
  previous: Locale | null;
}

export interface CountryLanguageSelectorProps {
  /** Countries to render. Defaults to the bundled `defaultCountries`. */
  countries?: Country[];

  /** Controlled value. If provided, the component becomes controlled. */
  value?: Locale;
  /** Default value for uncontrolled usage. */
  defaultValue?: Locale;
  /** Notified on every change. */
  onChange?: LocaleChangeHandler;

  /**
   * When set, the selection is persisted to `localStorage` under this key
   * and rehydrated on mount. Ignored in controlled mode.
   */
  persistKey?: string;

  /** Label read by screen readers on the trigger button. */
  ariaLabel?: string;

  /**
   * Trigger display mode:
   *   - "compact" (default): flag + country code + language code, e.g. `🇧🇪 BE · NL`
   *   - "full": flag + country name + language name
   *   - "flag": flag only, for very tight navbars
   */
  triggerVariant?: "compact" | "full" | "flag";

  /**
   * How country flags are rendered:
   *   - "emoji" (default): use the emoji flag from `country.flag`. Compact and zero
   *     network cost, but Windows browsers render these as ISO codes (e.g. `BE`)
   *     because the Segoe UI Emoji font lacks regional indicator pairs.
   *   - "image": fetch SVG flags from `flagcdn.com` keyed by `country.code`. Works
   *     consistently across all platforms including Windows.
   */
  flagMode?: "emoji" | "image";

  /**
   * Optional custom flag renderer. Overrides `flagMode` for total control,
   * e.g. to use a local sprite, an icon component, or your own CDN.
   */
  renderFlag?: (country: Country) => ReactNode;

  /** Align the popover to the trigger. Defaults to "end" (right-aligned). */
  align?: "start" | "end";

  /** Disable the whole selector. */
  disabled?: boolean;

  /** Escape hatch for styling overrides. */
  className?: string;
  popoverClassName?: string;

  /** Optional render prop to fully customise the trigger contents. */
  renderTrigger?: (ctx: RenderTriggerContext) => ReactNode;

  /** i18n strings. Override to localise the selector's own UI. */
  strings?: Partial<SelectorStrings>;
}

export interface RenderTriggerContext {
  country: Country;
  language: Language;
  open: boolean;
}

export interface SelectorStrings {
  ariaLabel: string;
  searchPlaceholder: string;
  emptyResults: string;
  chooseCountry: string;
  chooseLanguage: string;
  backToCountries: string;
  close: string;
}

export const defaultStrings: SelectorStrings = {
  ariaLabel: "Select country and language",
  searchPlaceholder: "Search country…",
  emptyResults: "No matching countries",
  chooseCountry: "Country",
  chooseLanguage: "Language",
  backToCountries: "Back",
  close: "Close",
};
