import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "@asafarim/shared-i18n";
import {
  DEFAULT_LOCALE,
  parseLocaleSlug,
  resolveI18nLanguage,
  toLocaleSlug,
} from "../i18n";

/**
 * Route element wrapping every `/:localeSlug/*` route.
 *
 * Responsibilities:
 * 1. Validate the `:localeSlug` param. Unknown slugs redirect to the default locale.
 * 2. Sync the active i18next language with the URL slug.
 */
export default function LocaleLayout() {
  const { localeSlug } = useParams<{ localeSlug: string }>();
  const { i18n } = useTranslation();

  const parsed = parseLocaleSlug(localeSlug);

  useEffect(() => {
    if (!parsed) return;
    const next = resolveI18nLanguage(parsed);
    if (i18n.language !== next) {
      void i18n.changeLanguage(next);
    }
  }, [parsed, i18n]);

  if (!parsed) {
    return <Navigate to={`/${toLocaleSlug(DEFAULT_LOCALE)}`} replace />;
  }

  return <Outlet />;
}
