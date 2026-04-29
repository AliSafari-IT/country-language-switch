# Country-Language Selector — Monorepo

A pnpm workspace containing a reusable React + TypeScript country/language selector component and a runnable Vite demo app.

## Layout

```
.
├── apps/
│   └── demo/                             # Vite + React playground
└── packages/
    └── country-language-selector/        # The reusable package (@asafarim/country-language-selector)
```

## Quickstart

```bash
pnpm install
pnpm build:pkg      # build the library once so the demo can resolve it
pnpm dev            # runs the demo app on http://localhost:5173
```

During library development you can run both in watch mode:

```bash
pnpm dev:pkg        # tsup --watch on the library
pnpm dev            # Vite dev server on the demo
```

## Reusing in a Next.js app

The package ships ESM + CJS + types and has `"use client"` annotations on the
interactive entry points, so it can be dropped straight into a Next.js 13+ App
Router project:

```tsx
// app/layout.tsx
import "@asafarim/country-language-selector/styles.css";

// app/components/LocaleSwitcher.tsx
"use client";
import { CountryLanguageSelector } from "@asafarim/country-language-selector";
export default function LocaleSwitcher() {
  return <CountryLanguageSelector persistKey="site-locale" />;
}
```

## UX direction (summary)

A compact navbar trigger (`🇧🇪 BE · NL`) opens a **combobox-style popover**
with a type-ahead search. Picking a country with **multiple official
languages** (e.g. Belgium → NL/FR/DE/EN) reveals a secondary language step
inside the same popover. Single-language countries commit immediately. The
popover promotes to a bottom sheet on narrow viewports. Full keyboard support,
ARIA combobox + listbox semantics, focus trap, escape-to-close.

See [`packages/country-language-selector/README.md`](./packages/country-language-selector/README.md)
for the detailed API.

## Demo: locale-aware routing

The demo app under [`apps/demo`](./apps/demo) showcases locale-dependent
routing by combining `@asafarim/country-language-selector` with
[`@asafarim/shared-i18n`](https://www.npmjs.com/package/@asafarim/shared-i18n).
The URL slug encodes both country and language using a `{country}-{language}`
pattern (or a bare `en` for the universal English fallback):

| Selection                       | URL                                |
| ------------------------------- | ---------------------------------- |
| 🇧🇪 Belgium · Dutch              | `/be-nl/get-started`               |
| 🇧🇪 Belgium · French             | `/be-fr/get-started`               |
| 🇧🇪 Belgium · German             | `/be-de/get-started`               |
| 🇧🇪 Belgium · English            | `/be-en/get-started`               |
| 🇳🇱 Netherlands · Dutch          | `/nl-nl/get-started`               |
| 🇱🇺 Luxembourg · Luxembourgish   | `/lu-lb/get-started`               |
| 🌐 International · English      | `/en/get-started` (fallback)       |

The demo only ships translations for the **Benelux** countries (Belgium, the
Netherlands and Luxembourg) plus a universal English fallback. Translation
JSON files live under [`apps/demo/src/i18n/locales`](./apps/demo/src/i18n/locales)
and are wired up via `setupI18n()` in
[`apps/demo/src/i18n/index.ts`](./apps/demo/src/i18n/index.ts). The
`LocaleLayout` route ([`apps/demo/src/components/LocaleLayout.tsx`](./apps/demo/src/components/LocaleLayout.tsx))
validates the `:localeSlug` URL param, syncs the active i18next language, and
redirects unknown slugs to the default locale.
