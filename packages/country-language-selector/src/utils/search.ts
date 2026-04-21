import type { Country } from "../types";

/** Remove diacritics so "Türkiye" matches "turkiye". */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Score a country against a query. Higher is better. Returns null when the
 * country shouldn't appear at all for the given query.
 *
 * Scoring, in priority order:
 *   1. exact country-code match           (1000)
 *   2. prefix match on country code       ( 900)
 *   3. prefix match on name / native name ( 700)
 *   4. prefix match on any language code  ( 500)
 *   5. substring match on name            ( 300)
 *   6. substring match on a language name ( 100)
 */
export function scoreCountry(country: Country, rawQuery: string): number | null {
  const q = normalize(rawQuery);
  if (!q) return 0;

  const code = country.code.toLowerCase();
  const name = normalize(country.name);
  const native = country.nativeName ? normalize(country.nativeName) : "";

  if (code === q) return 1000;
  if (code.startsWith(q)) return 900;
  if (name.startsWith(q) || native.startsWith(q)) return 700;

  for (const lang of country.languages) {
    if (lang.code.startsWith(q)) return 500;
  }

  if (name.includes(q) || native.includes(q)) return 300;

  for (const lang of country.languages) {
    const label = normalize(lang.label);
    const nativeLabel = lang.nativeLabel ? normalize(lang.nativeLabel) : "";
    if (label.includes(q) || nativeLabel.includes(q)) return 100;
  }

  return null;
}

export function filterCountries(countries: Country[], query: string): Country[] {
  if (!query.trim()) return countries;
  return countries
    .map((c) => ({ c, s: scoreCountry(c, query) }))
    .filter((x): x is { c: Country; s: number } => x.s !== null)
    .sort((a, b) => b.s - a.s || a.c.name.localeCompare(b.c.name))
    .map((x) => x.c);
}
