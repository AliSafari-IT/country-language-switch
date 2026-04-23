export default function GetStartedPage() {
  return (
    <div className="get-started">
      <section className="hero">
        <h1>Get Started</h1>
        <p>
          Install the <code>@asafarim/country-language-selector</code> package and drop
          the combobox into any React navbar.
        </p>
      </section>

      <div className="panels">
        <article className="panel panel--wide">
          <h2>Installation</h2>
          <pre className="mono mono--block">
{`npm install @asafarim/country-language-selector
# or
pnpm add @asafarim/country-language-selector
# or
yarn add @asafarim/country-language-selector`}
          </pre>
          <p>
            Import the stylesheet once at your app root (before your own CSS so you can
            override variables):
          </p>
          <pre className="mono mono--block">
{`import "@asafarim/country-language-selector/styles.css";`}
          </pre>
        </article>

        <article className="panel panel--wide">
          <h2>Quick Start — Uncontrolled</h2>
          <p>
            The simplest way to use the selector. It manages its own state and persists
            the choice to <code>localStorage</code> so the user keeps their locale across
            reloads.
          </p>
          <pre className="mono mono--block">
{`import { CountryLanguageSelector } from "@asafarim/country-language-selector";

export function Navbar() {
  return (
    <CountryLanguageSelector
      defaultValue={{ country: "BE", language: "nl" }}
      persistKey="site-locale"
      onChange={(locale, meta) =>
        console.log(locale, meta.reason)
      }
    />
  );
}`}
          </pre>
        </article>

        <article className="panel panel--wide">
          <h2>Controlled</h2>
          <p>
            Drive the selector with your own React state when you need to sync it with a
            router, CMS, or global store.
          </p>
          <pre className="mono mono--block">
{`import { useState } from "react";
import {
  CountryLanguageSelector,
  type Locale,
} from "@asafarim/country-language-selector";

export function Navbar() {
  const [locale, setLocale] = useState<Locale>({
    country: "FR",
    language: "fr",
  });

  return (
    <CountryLanguageSelector
      value={locale}
      onChange={(next) => setLocale(next)}
    />
  );
}`}
          </pre>
        </article>

        <article className="panel panel--wide">
          <h2>Custom country list</h2>
          <p>
            Pass your own array of countries instead of using the built-in defaults.
          </p>
          <pre className="mono mono--block">
{`import {
  CountryLanguageSelector,
  type Country,
} from "@asafarim/country-language-selector";

const myCountries: Country[] = [
  {
    code: "NL",
    name: "Netherlands",
    nativeName: "Nederland",
    flag: "🇳🇱",
    languages: [
      { code: "nl", label: "Nederlands" },
      { code: "en", label: "English" },
    ],
  },
  {
    code: "BE",
    name: "Belgium",
    nativeName: "België",
    flag: "🇧🇪",
    languages: [
      { code: "nl", label: "Nederlands" },
      { code: "fr", label: "Français" },
      { code: "de", label: "Deutsch" },
    ],
  },
];

<CountryLanguageSelector
  countries={myCountries}
  defaultValue={{ country: "BE", language: "nl" }}
/>`}
          </pre>
        </article>

        <article className="panel panel--wide">
          <h2>Props</h2>
          <div className="props-table">
            <div className="props-row props-row--head">
              <span>Prop</span>
              <span>Type</span>
              <span>Default</span>
              <span>Description</span>
            </div>
            <div className="props-row">
              <span><code>defaultValue</code></span>
              <span><code>{"{ country: string; language: string }"}</code></span>
              <span>—</span>
              <span>Initial locale when uncontrolled.</span>
            </div>
            <div className="props-row">
              <span><code>value</code></span>
              <span><code>{"{ country: string; language: string }"}</code></span>
              <span>—</span>
              <span>Makes the component controlled.</span>
            </div>
            <div className="props-row">
              <span><code>onChange</code></span>
              <span><code>Function</code></span>
              <span>—</span>
              <span>Called when a new locale is picked.</span>
            </div>
            <div className="props-row">
              <span><code>persistKey</code></span>
              <span><code>string</code></span>
              <span>—</span>
              <span><code>localStorage</code> key for persistence.</span>
            </div>
            <div className="props-row">
              <span><code>countries</code></span>
              <span><code>Country[]</code></span>
              <span>built-in list</span>
              <span>Override the full country catalogue.</span>
            </div>
            <div className="props-row">
              <span><code>triggerVariant</code></span>
              <span><code>"full" | "flag"</code></span>
              <span><code>"full"</code></span>
              <span>Trigger button appearance.</span>
            </div>
            <div className="props-row">
              <span><code>align</code></span>
              <span><code>"start" | "end"</code></span>
              <span><code>"end"</code></span>
              <span>Dropdown alignment.</span>
            </div>
            <div className="props-row">
              <span><code>ariaLabel</code></span>
              <span><code>string</code></span>
              <span>—</span>
              <span>Accessible label for the trigger.</span>
            </div>
          </div>
        </article>
      </div>

      <footer className="footer">
        <a href="https://github.com/AliSafari-IT/country-language-switch">View on GitHub</a>
      </footer>
    </div>
  );
}
