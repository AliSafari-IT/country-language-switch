# Changelog

All notable changes to `@asafarim/country-language-selector` are documented in
this file. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Keyboard navigation and the focus trap no longer break after advancing to the
  language step of a multi-language country. Focus is now moved into the popover
  when the search input unmounts, and restored to the search input when
  returning to the country list.

### Added

- Test suite (Vitest + Testing Library) covering the search ranking utility, the
  `useCountryLanguage` state machine (controlled/uncontrolled, persistence, the
  country → language dependency rule), and the component's open/close, search,
  selection, keyboard, and customisation behaviour.

## [0.4.1]

- Baseline release: accessible combobox-style country + language selector with
  type-ahead search, multi-language country support, controlled/uncontrolled
  modes, `localStorage` persistence, emoji/image/custom flag rendering, mobile
  bottom-sheet, and full keyboard + ARIA support.
