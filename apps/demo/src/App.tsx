import { useState } from "react";
import {
  CountryLanguageSelector,
  defaultCountries,
  type Locale,
  type LocaleChangeMeta,
} from "@asafarim/country-language-selector";

interface LogEntry {
  id: number;
  at: string;
  locale: Locale;
  reason: LocaleChangeMeta["reason"];
}

export default function App() {
  // Uncontrolled usage with persistence — this is how most consumers will use it.
  const [navbarLocale, setNavbarLocale] = useState<Locale>({
    country: "BE",
    language: "nl",
  });
  const [log, setLog] = useState<LogEntry[]>([]);

  // A second, controlled instance to demonstrate `value` + `onChange`.
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
    <div className="page">
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__dot" aria-hidden="true" />
          ASafariM Digital
        </div>
        <nav className="navbar__nav" aria-label="Primary">
          <a href="https://github.com/AliSafari-IT" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://asafarim.be/" target="_blank" rel="noopener noreferrer">Website</a>
          <a href="https://testora.asafarim.be/" target="_blank" rel="noopener noreferrer">Testora</a>
          <a href="https://asafarim.be/about" target="_blank" rel="noopener noreferrer">About</a>
        </nav>
        <div className="navbar__spacer" />
        <CountryLanguageSelector
          defaultValue={{ country: "BE", language: "nl" }}
          persistKey="asafarim-demo-locale"
          ariaLabel="Change country and language"
          onChange={(locale, meta) => {
            setNavbarLocale(locale);
            pushLog(locale, meta);
          }}
        />
        <button className="navbar__cta" type="button">
          Sign in
        </button>
      </header>

      <section className="hero">
        <h1>Country &amp; language selector</h1>
        <p>
          A modern, accessible combobox-style selector that handles single-language
          countries as well as multi-language ones like Belgium, Switzerland, and
          Canada. Try it in the navbar above — or with the two examples below.
        </p>
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

      <footer className="footer">
        Resize to mobile width to see the bottom-sheet layout · Tab / ↑ ↓ / Enter / Esc all work.
      </footer>
    </div>
  );
}
