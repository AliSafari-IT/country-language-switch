import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  Country,
  Language,
  Locale,
  LocaleChangeHandler,
  LocaleChangeMeta,
} from "../types";
import { readStorage, writeStorage } from "../utils/dom";

export interface UseCountryLanguageArgs {
  countries: Country[];
  value?: Locale;
  defaultValue?: Locale;
  onChange?: LocaleChangeHandler;
  persistKey?: string;
}

export interface UseCountryLanguageReturn {
  locale: Locale;
  country: Country;
  language: Language;
  setCountry: (code: string) => void;
  setLanguage: (code: string) => void;
  setLocale: (next: Locale, reason?: LocaleChangeMeta["reason"]) => void;
  /** True when the current country has more than one language. */
  needsLanguageChoice: boolean;
}

/**
 * Encapsulates the state machine for the selector — controlled vs
 * uncontrolled, persistence, and the country→language dependency rule
 * (switching country resets the language to that country's first entry,
 * unless the new country also supports the previous language).
 */
export function useCountryLanguage(
  args: UseCountryLanguageArgs
): UseCountryLanguageReturn {
  const { countries, value, defaultValue, onChange, persistKey } = args;
  const isControlled = value !== undefined;

  // Resolve the initial uncontrolled value using *only* the defaultValue and
  // the countries list. We deliberately skip localStorage here so that SSR
  // renders match the first client render (no hydration mismatch).
  const initialRef = useRef<Locale | null>(null);
  if (initialRef.current === null) {
    initialRef.current =
      (defaultValue && isValidLocale(defaultValue, countries) ? defaultValue : null) ??
      fallbackLocale(countries);
  }

  const [internal, setInternal] = useState<Locale>(initialRef.current);
  const current = isControlled ? (value as Locale) : internal;

  // Rehydrate from localStorage on mount. This happens post-hydration so it
  // never triggers an SSR/CSR mismatch. Also fires a single "init" event.
  const didInitRef = useRef(false);
  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;

    if (!isControlled && persistKey) {
      const hydrated = readPersistedLocale(persistKey, countries);
      if (hydrated) {
        setInternal(hydrated);
        onChange?.(hydrated, { reason: "init", previous: initialRef.current });
        return;
      }
    }
    onChange?.(current, { reason: "init", previous: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const byCode = useMemo(() => {
    const map = new Map<string, Country>();
    for (const c of countries) map.set(c.code, c);
    return map;
  }, [countries]);

  const country = byCode.get(current.country) ?? countries[0]!;
  const language =
    country.languages.find((l) => l.code === current.language) ??
    country.languages[0]!;

  const commit = useCallback(
    (next: Locale, reason: LocaleChangeMeta["reason"]) => {
      const previous = current;
      if (!isControlled) setInternal(next);
      if (persistKey && !isControlled) {
        writeStorage(persistKey, JSON.stringify(next));
      }
      onChange?.(next, { reason, previous });
    },
    [current, isControlled, onChange, persistKey]
  );

  const setCountry = useCallback(
    (code: string) => {
      const nextCountry = byCode.get(code);
      if (!nextCountry) return;
      // Preserve the active language if the new country also supports it,
      // otherwise fall back to that country's default language.
      const keep = nextCountry.languages.find(
        (l) => l.code === current.language
      );
      const nextLanguage = (keep ?? nextCountry.languages[0])!.code;
      commit({ country: nextCountry.code, language: nextLanguage }, "country");
    },
    [byCode, commit, current.language]
  );

  const setLanguage = useCallback(
    (code: string) => {
      if (!country.languages.some((l) => l.code === code)) return;
      commit({ country: country.code, language: code }, "language");
    },
    [commit, country]
  );

  const setLocale = useCallback(
    (next: Locale, reason: LocaleChangeMeta["reason"] = "country") => {
      commit(next, reason);
    },
    [commit]
  );

  return {
    locale: { country: country.code, language: language.code },
    country,
    language,
    setCountry,
    setLanguage,
    setLocale,
    needsLanguageChoice: country.languages.length > 1,
  };
}

function readPersistedLocale(key: string, countries: Country[]): Locale | null {
  const raw = readStorage(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Locale;
    return isValidLocale(parsed, countries) ? parsed : null;
  } catch {
    return null;
  }
}

function isValidLocale(locale: Locale, countries: Country[]): boolean {
  const c = countries.find((x) => x.code === locale.country);
  if (!c) return false;
  return c.languages.some((l) => l.code === locale.language);
}

function fallbackLocale(countries: Country[]): Locale {
  const first = countries[0];
  if (!first) {
    throw new Error(
      "[country-language-selector] `countries` must contain at least one entry."
    );
  }
  return { country: first.code, language: first.languages[0]!.code };
}
