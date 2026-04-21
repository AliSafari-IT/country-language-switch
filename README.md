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
