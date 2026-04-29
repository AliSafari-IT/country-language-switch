import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { CountryLanguageSelector } from "@asafarim/country-language-selector";
import { useTranslation } from "@asafarim/shared-i18n";
import { BENELUX_COUNTRIES, toLocaleSlug } from "../i18n";
import { useLocaleContext } from "../hooks/useLocaleContext";

export default function Layout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { locale, slug } = useLocaleContext();

  const baseHref = `/${slug}`;

  // Strip the leading `/:slug` to compute the path that should be preserved
  // when switching locales.
  const subPath = location.pathname.startsWith(baseHref)
    ? location.pathname.slice(baseHref.length) || ""
    : "";

  return (
    <div className="page">
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__dot" aria-hidden="true" />
          ASafariM Digital
        </div>
        <nav className="navbar__nav" aria-label={t("nav.primary")}>
          <NavLink to={baseHref} end>
            {t("nav.demo")}
          </NavLink>
          <NavLink to={`${baseHref}/get-started`}>
            {t("nav.getStarted")}
          </NavLink>
          <a
            href="https://github.com/alisafari-it/country-language-switch"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("nav.github")}
          </a>
          <a
            href="https://www.npmjs.com/package/@asafarim/country-language-selector"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("nav.npm")}
          </a>
          <a href="https://asafarim.be/" target="_blank" rel="noopener noreferrer">
            {t("nav.website")}
          </a>
        </nav>
        <div className="navbar__spacer" />
        <CountryLanguageSelector
          countries={BENELUX_COUNTRIES}
          value={locale}
          ariaLabel={t("ariaLabel.changeCountryLanguage")}
          flagMode="image"
          onChange={(next) => {
            const nextSlug = toLocaleSlug(next);
            navigate(`/${nextSlug}${subPath}`);
          }}
        />
        <button className="navbar__cta" type="button">
          {t("nav.signIn")}
        </button>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
