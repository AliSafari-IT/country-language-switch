import { useParams } from "react-router-dom";
import type { Locale } from "@asafarim/country-language-selector";
import { DEFAULT_LOCALE, parseLocaleSlug, toLocaleSlug } from "../i18n";

export interface LocaleOutletContext {
  locale: Locale;
  slug: string;
}

/**
 * Resolve the active locale from the `:localeSlug` URL param.
 *
 * Read directly from params instead of `useOutletContext`, because nested
 * `<Outlet />` elements (e.g. `Layout`) don't forward outer context.
 *
 * The `LocaleLayout` route element guarantees the slug is valid before any
 * page renders, so this hook can safely fall back to the default locale.
 */
export function useLocaleContext(): LocaleOutletContext {
  const { localeSlug } = useParams<{ localeSlug: string }>();
  const parsed = parseLocaleSlug(localeSlug);
  if (parsed && localeSlug) {
    return { locale: parsed, slug: localeSlug };
  }
  return { locale: DEFAULT_LOCALE, slug: toLocaleSlug(DEFAULT_LOCALE) };
}
