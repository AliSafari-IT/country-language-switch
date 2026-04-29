import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  CountryLanguageSelector,
  defaultCountries,
  type Locale,
  type LocaleChangeMeta,
} from "@asafarim/country-language-selector";
import { useTranslation } from "@asafarim/shared-i18n";
import { ALL_LOCALE_SLUGS, BENELUX_COUNTRIES } from "../i18n";
import { useLocaleContext } from "../hooks/useLocaleContext";

interface LogEntry {
  id: number;
  at: string;
  locale: Locale;
  reason: LocaleChangeMeta["reason"];
}

export default function DemoPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const { locale: routeLocale, slug: routeSlug } = useLocaleContext();
  const [navbarLocale] = useState<Locale>({
    country: "BE",
    language: "nl",
  });
  const [log, setLog] = useState<LogEntry[]>([]);

  const [controlled, setControlled] = useState<Locale>({
    country: "CH",
    language: "fr",
  });

  const pushLog = (locale: Locale, meta: LocaleChangeMeta) => {
    setLog((prev) =>
      [
        {
          id: prev.length === 0 ? 1 : prev[0]!.id + 1,
          at: new Date().toLocaleTimeString(),
          locale,
          reason: meta.reason,
        },
        ...prev,
      ].slice(0, 50)
    );
  };

  const country =
    defaultCountries.find((c) => c.code === navbarLocale.country) ?? defaultCountries[0]!;
  const language =
    country.languages.find((l) => l.code === navbarLocale.language) ?? country.languages[0]!;

  return (
    <>
      <section className="hero">
        <h1>{t("hero.demoTitle")}</h1>
        <p>{t("hero.demoSubtitle")}</p>
        <div className="chips">
          <span className="chip">🇧🇪 Belgium · NL / FR / DE / EN</span>
          <span className="chip">🇨🇭 Switzerland · DE / FR / IT / EN</span>
          <span className="chip">🇨🇦 Canada · EN / FR</span>
          <span className="chip">🇳🇱 Netherlands · NL / EN</span>
          <span className="chip">🇫🇷 France · FR / EN</span>
          <span className="chip">🇩🇪 Germany · DE / EN</span>
        </div>
      </section>

      <section className="panels" aria-label="State">
        <article className="panel panel--wide locale-panel">
          <h2>{t("locale.title")}</h2>
          <p>{t("locale.intro")}</p>
          <div className="locale-grid">
            <div>
              <strong>{t("locale.currentLocale")}</strong>
              <pre className="mono">
{JSON.stringify({ slug: routeSlug, ...routeLocale }, null, 2)}
              </pre>
            </div>
            <div>
              <strong>{t("locale.currentUrl")}</strong>
              <pre className="mono">{location.pathname}</pre>
            </div>
          </div>
          <p className="flag-modes__hint">{t("locale.slugExample")}</p>
          <div className="locale-slugs">
            {ALL_LOCALE_SLUGS.map((s) => (
              <a key={s} className="chip" href={`#/${s}`}>
                {s}
              </a>
            ))}
          </div>
          <div className="inline-selector" style={{ marginTop: 12 }}>
            <CountryLanguageSelector
              countries={BENELUX_COUNTRIES}
              value={routeLocale}
              triggerVariant="full"
              flagMode="image"
              align="start"
              ariaLabel={t("locale.selectLocale")}
              onChange={(next, meta) => {
                // The navbar instance owns navigation; this inline copy only logs.
                pushLog(next, meta);
              }}
            />
            <span>{t("locale.selectLocale")}</span>
          </div>
        </article>

        <article className="panel">
          <h2>Navbar selection (uncontrolled + persisted)</h2>
          <div className="big">
            <span aria-hidden="true">{country.flag}</span>
            <span>
              {country.name} · {language.label}
            </span>
          </div>
          <pre className="mono">{JSON.stringify(navbarLocale, null, 2)}</pre>
          <div className="row">
            <span className="chip">persistKey: asafarim-demo-locale</span>
            <span className="chip">Reload the page — it remembers.</span>
          </div>
        </article>

        <article className="panel">
          <h2>Controlled instance</h2>
          <div className="inline-selector">
            <CountryLanguageSelector
              value={controlled}
              triggerVariant="full"
              onChange={(next, meta) => {
                setControlled(next);
                pushLog(next, meta);
              }}
            />
            <span>← driven by React state</span>
          </div>
          <pre className="mono">{JSON.stringify(controlled, null, 2)}</pre>
          <div className="row">
            <button
              type="button"
              className="chip"
              onClick={() => setControlled({ country: "BE", language: "fr" })}
            >
              Force 🇧🇪 BE · fr
            </button>
            <button
              type="button"
              className="chip"
              onClick={() => setControlled({ country: "JP", language: "ja" })}
            >
              Force 🇯🇵 JP · ja
            </button>
          </div>
        </article>

        <article className="panel">
          <h2>Variant: flag-only (very tight navbars)</h2>
          <div className="inline-selector">
            <CountryLanguageSelector
              defaultValue={{ country: "FR", language: "fr" }}
              triggerVariant="flag"
            />
            <span>triggerVariant="flag"</span>
          </div>
        </article>

        <article className="panel">
          <h2>Variant: full labels</h2>
          <div className="inline-selector">
            <CountryLanguageSelector
              defaultValue={{ country: "NL", language: "nl" }}
              triggerVariant="full"
              align="start"
            />
            <span>triggerVariant="full", align="start"</span>
          </div>
        </article>

        <article className="panel panel--wide">
          <h2>Flag rendering: emoji vs image</h2>
          <p>
            Windows browsers don&rsquo;t ship regional-indicator emoji glyphs, so flags
            fall back to ISO codes (e.g. <code>BE</code>). Set <code>flagMode="image"</code>
            {" "}to load real SVG flags from <code>flagcdn.com</code> instead — works
            consistently across Windows, macOS, Linux, iOS, and Android.
          </p>
          <div className="flag-modes">
            <div className="flag-modes__col">
              <h3>flagMode="emoji" (default)</h3>
              <CountryLanguageSelector
                defaultValue={{ country: "BE", language: "nl" }}
                triggerVariant="full"
                align="start"
                flagMode="emoji"
              />
              <p className="flag-modes__hint">
                Zero network cost. Renders as letters on Windows.
              </p>
            </div>
            <div className="flag-modes__col">
              <h3>flagMode="image" (cross-platform)</h3>
              <CountryLanguageSelector
                defaultValue={{ country: "BE", language: "nl" }}
                triggerVariant="full"
                align="start"
                flagMode="image"
              />
              <p className="flag-modes__hint">
                SVG flags from flagcdn.com. Works on every OS.
              </p>
            </div>
            <div className="flag-modes__col">
              <h3>renderFlag (custom)</h3>
              <CountryLanguageSelector
                defaultValue={{ country: "BE", language: "nl" }}
                triggerVariant="full"
                align="start"
                renderFlag={(c) => (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 22,
                      height: 16,
                      borderRadius: 3,
                      background: "linear-gradient(135deg,#6366f1,#ec4899)",
                      color: "white",
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {c.code}
                  </span>
                )}
              />
              <p className="flag-modes__hint">
                Pass any React node — your sprite, icon library, etc.
              </p>
            </div>
          </div>
        </article>
      </section>

      <section className="log" aria-label="Change log">
        <h2>onChange log</h2>
        <div className="log__list" role="status" aria-live="polite">
          {log.length === 0 ? (
            <div className="log__item">No changes yet. Try picking a country.</div>
          ) : (
            log.map((e) => (
              <div key={e.id} className="log__item">
                <span className="log__reason">[{e.reason}]</span> {e.at} →{" "}
                {e.locale.country} · {e.locale.language}
              </div>
            ))
          )}
        </div>
      </section>

      <footer className="footer">{t("footer.mobileHint")}</footer>
    </>
  );
}
