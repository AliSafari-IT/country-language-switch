import { NavLink, Outlet } from "react-router-dom";
import { CountryLanguageSelector } from "@asafarim/country-language-selector";

export default function Layout() {
  return (
    <div className="page">
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__dot" aria-hidden="true" />
          ASafariM Digital
        </div>
        <nav className="navbar__nav" aria-label="Primary">
          <NavLink to="/" end>
            Demo
          </NavLink>
          <NavLink to="/get-started">
            Get Started
          </NavLink>
          <a href="https://github.com/alisafari-it/country-language-switch" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.npmjs.com/package/@asafarim/country-language-selector" target="_blank" rel="noopener noreferrer">
            NPM
          </a>
          <a href="https://asafarim.be/" target="_blank" rel="noopener noreferrer">
            Website
          </a>
        </nav>
        <div className="navbar__spacer" />
        <CountryLanguageSelector
          defaultValue={{ country: "BE", language: "nl" }}
          persistKey="asafarim-demo-locale"
          ariaLabel="Change country and language"
          flagMode="image"
        />
        <button className="navbar__cta" type="button">
          Sign in
        </button>
      </header>

      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
