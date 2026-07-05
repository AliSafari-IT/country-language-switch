import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useCountryLanguage } from "./useCountryLanguage";
import type { Country } from "../types";

const en = { code: "en", label: "English" };
const fr = { code: "fr", label: "French" };
const nl = { code: "nl", label: "Dutch" };
const de = { code: "de", label: "German" };

const countries: Country[] = [
  { code: "BE", name: "Belgium", flag: "🇧🇪", languages: [nl, fr, de, en] },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", languages: [nl, en] },
  { code: "FR", name: "France", flag: "🇫🇷", languages: [fr, en] },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", languages: [en] },
];

beforeEach(() => {
  localStorage.clear();
});

describe("useCountryLanguage — initialisation", () => {
  it("falls back to the first country + its first language", () => {
    const { result } = renderHook(() => useCountryLanguage({ countries }));
    expect(result.current.locale).toEqual({ country: "BE", language: "nl" });
  });

  it("honours a valid defaultValue", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        defaultValue: { country: "FR", language: "fr" },
      }),
    );
    expect(result.current.locale).toEqual({ country: "FR", language: "fr" });
  });

  it("ignores an invalid defaultValue and uses the fallback", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        defaultValue: { country: "XX", language: "zz" },
      }),
    );
    expect(result.current.locale).toEqual({ country: "BE", language: "nl" });
  });

  it("fires an init onChange event once on mount", () => {
    const onChange = vi.fn();
    renderHook(() => useCountryLanguage({ countries, onChange }));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      { country: "BE", language: "nl" },
      { reason: "init", previous: null },
    );
  });

  it("throws when the countries list is empty", () => {
    expect(() =>
      renderHook(() => useCountryLanguage({ countries: [] })),
    ).toThrow(/must contain at least one entry/);
  });
});

describe("useCountryLanguage — country → language dependency", () => {
  it("keeps the active language when the new country also supports it", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        defaultValue: { country: "BE", language: "fr" },
      }),
    );
    act(() => result.current.setCountry("FR"));
    expect(result.current.locale).toEqual({ country: "FR", language: "fr" });
  });

  it("falls back to the new country's default language otherwise", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        defaultValue: { country: "BE", language: "de" },
      }),
    );
    act(() => result.current.setCountry("NL")); // NL has no German
    expect(result.current.locale).toEqual({ country: "NL", language: "nl" });
  });

  it("ignores an unknown country code", () => {
    const { result } = renderHook(() => useCountryLanguage({ countries }));
    act(() => result.current.setCountry("XX"));
    expect(result.current.locale).toEqual({ country: "BE", language: "nl" });
  });

  it("ignores a language the current country does not support", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        defaultValue: { country: "GB", language: "en" },
      }),
    );
    act(() => result.current.setLanguage("fr"));
    expect(result.current.locale).toEqual({ country: "GB", language: "en" });
  });

  it("reports needsLanguageChoice for multi-language countries only", () => {
    const { result, rerender } = renderHook(
      (props: { def: { country: string; language: string } }) =>
        useCountryLanguage({ countries, defaultValue: props.def }),
      { initialProps: { def: { country: "BE", language: "nl" } } },
    );
    expect(result.current.needsLanguageChoice).toBe(true);
    act(() => result.current.setCountry("GB"));
    rerender({ def: { country: "BE", language: "nl" } });
    expect(result.current.needsLanguageChoice).toBe(false);
  });
});

describe("useCountryLanguage — onChange metadata", () => {
  it("reports the reason and previous locale on a country change", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useCountryLanguage({ countries, onChange }),
    );
    onChange.mockClear();
    act(() => result.current.setCountry("FR"));
    // BE→FR: FR has no Dutch, so it falls back to FR's default language (fr).
    expect(onChange).toHaveBeenCalledWith(
      { country: "FR", language: "fr" },
      { reason: "country", previous: { country: "BE", language: "nl" } },
    );
  });

  it("reports a language reason on a language change", () => {
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useCountryLanguage({ countries, onChange }),
    );
    onChange.mockClear();
    act(() => result.current.setLanguage("fr"));
    expect(onChange).toHaveBeenCalledWith(
      { country: "BE", language: "fr" },
      { reason: "language", previous: { country: "BE", language: "nl" } },
    );
  });
});

describe("useCountryLanguage — persistence", () => {
  it("writes the selection to localStorage under persistKey", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({ countries, persistKey: "loc" }),
    );
    act(() => result.current.setCountry("FR"));
    expect(JSON.parse(localStorage.getItem("loc")!)).toEqual({
      country: "FR",
      language: "fr",
    });
  });

  it("rehydrates a valid persisted locale on mount and fires init", () => {
    localStorage.setItem(
      "loc",
      JSON.stringify({ country: "NL", language: "en" }),
    );
    const onChange = vi.fn();
    const { result } = renderHook(() =>
      useCountryLanguage({ countries, persistKey: "loc", onChange }),
    );
    expect(result.current.locale).toEqual({ country: "NL", language: "en" });
    expect(onChange).toHaveBeenCalledWith(
      { country: "NL", language: "en" },
      expect.objectContaining({ reason: "init" }),
    );
  });

  it("ignores a corrupt or invalid persisted value", () => {
    localStorage.setItem("loc", "not json");
    const { result } = renderHook(() =>
      useCountryLanguage({ countries, persistKey: "loc" }),
    );
    expect(result.current.locale).toEqual({ country: "BE", language: "nl" });
  });
});

describe("useCountryLanguage — controlled mode", () => {
  it("reflects the controlled value and does not persist", () => {
    const { result } = renderHook(() =>
      useCountryLanguage({
        countries,
        value: { country: "FR", language: "fr" },
        persistKey: "loc",
      }),
    );
    expect(result.current.locale).toEqual({ country: "FR", language: "fr" });
    act(() => result.current.setCountry("NL"));
    // Controlled: internal state doesn't move; parent owns the value.
    expect(result.current.locale).toEqual({ country: "FR", language: "fr" });
    expect(localStorage.getItem("loc")).toBeNull();
  });
});
