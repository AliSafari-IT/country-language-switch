# Country & language selector: @asafarim/country-language-selector

A modern, accessible, reusable React + TypeScript country & language selector built for navbars. First-class support for multi-language countries (Belgium, Switzerland, Canada, …).

## Demo

[Country & language selector](https://alisafari-it.github.io/country-language-switch/)

## Install

Inside this monorepo it's already wired up. To publish or consume externally:

```bash
pnpm add @asafarim/country-language-selector
```

Import the stylesheet once at your app root:

```ts
import "@asafarim/country-language-selector/styles.css";
```

## Usage

### Uncontrolled

```tsx
import { CountryLanguageSelector } from "@asafarim/country-language-selector";

export function Navbar() {
  return (
    <CountryLanguageSelector
      defaultValue={{ country: "BE", language: "nl" }}
      persistKey="site-locale"
      onChange={(locale, meta) => console.log(locale, meta.reason)}
    />
  );
}
```

### Controlled

```tsx
const [locale, setLocale] = useState<Locale>({ country: "FR", language: "fr" });

<CountryLanguageSelector
  value={locale}
  onChange={(next) => setLocale(next)}
/>;
```

### Custom country list

```tsx
import { CountryLanguageSelector, type Country } from "@asafarim/country-language-selector";

const countries: Country[] = [
  { code: "BE", name: "Belgium", flag: "🇧🇪",
    languages: [
      { code: "nl", label: "Dutch", nativeLabel: "Nederlands" },
      { code: "fr", label: "French", nativeLabel: "Français" },
    ],
  },
  // …
];

<CountryLanguageSelector countries={countries} defaultValue={{ country: "BE", language: "nl" }} />;
```

### Custom trigger

```tsx
<CountryLanguageSelector
  renderTrigger={({ country, language }) => (
    <>
      <span>{country.flag}</span>
      <span>{country.name} · {language.label}</span>
    </>
  )}
/>
```

### Flag rendering

Windows browsers don't ship regional-indicator emoji glyphs, so flags like `🇧🇪` render as plain text (`BE`). Use `flagMode="image"` to load real SVG flags from `flagcdn.com` instead:

```tsx
<CountryLanguageSelector
  defaultValue={{ country: "BE", language: "nl" }}
  flagMode="image"
/>
```

For full control, use `renderFlag` to supply your own flag implementation (e.g., a local sprite, an icon library, or your own CDN):

```tsx
<CountryLanguageSelector
  renderFlag={(country) => (
    <img src={`/flags/${country.code}.png`} alt="" />
  )}
/>
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `countries` | `Country[]` | bundled set | Replace or extend to control the list. |
| `value` | `Locale` | — | Enables controlled mode. |
| `defaultValue` | `Locale` | first country | Uncontrolled seed. |
| `onChange` | `(locale, meta) => void` | — | `meta.reason` is `"country" \| "language" \| "init" \| "reset"`. |
| `persistKey` | `string` | — | Persists uncontrolled state to localStorage. |
| `triggerVariant` | `"compact" \| "full" \| "flag"` | `"compact"` | Trigger rendering. |
| `flagMode` | `"emoji" \| "image"` | `"emoji"` | How flags are rendered. |
| `renderFlag` | `(country) => ReactNode` | — | Custom flag renderer; overrides `flagMode`. |
| `align` | `"start" \| "end"` | `"end"` | Popover alignment. |
| `ariaLabel` | `string` | — | Accessible label on the trigger. |
| `renderTrigger` | `(ctx) => ReactNode` | — | Override trigger content. |
| `strings` | `Partial<SelectorStrings>` | — | Localise the selector's own UI. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `className` / `popoverClassName` | `string` | — | Styling hooks. |

## Behaviour

- **Compact trigger** showing flag + country code + language code (`🇧🇪 BE · NL`).
- **Combobox popover** with type-ahead search (diacritic-insensitive, ranked).
- **Country → Language dependency**: picking a country with multiple supported
  languages reveals a secondary language list. Single-language countries commit
  immediately. Switching to a new country keeps the current language if that
  country also supports it, otherwise falls back to the country's default.
- **Mobile**: promotes to a bottom sheet with a backdrop on coarse-pointer / narrow viewports.
- **Keyboard**:
  - `Space` / `Enter` / `ArrowDown` on the trigger → open
  - Typing filters the list; `↑ ↓` moves the active row; `Home` / `End` jump
  - `Enter` commits the active row; `Escape` closes and returns focus to the trigger
  - While in the language step, `Backspace` with empty search returns to the country list
- **ARIA**: `role="dialog"`, combobox + listbox semantics, `aria-activedescendant`, `aria-selected`, focus trap.

## Framework notes

The package ships ESM + CJS + types. It injects a `"use client"` directive so
Next.js App Router consumers can import it directly into server components'
trees. There is no Next.js-specific logic in the package itself — only React.
