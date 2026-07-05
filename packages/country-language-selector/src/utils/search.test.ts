import { describe, expect, it } from "vitest";
import { filterCountries, normalize, scoreCountry } from "./search";
import type { Country } from "../types";

const en = { code: "en", label: "English" };
const fr = { code: "fr", label: "French", nativeLabel: "Français" };
const nl = { code: "nl", label: "Dutch", nativeLabel: "Nederlands" };

const belgium: Country = {
  code: "BE",
  name: "Belgium",
  nativeName: "België",
  flag: "🇧🇪",
  languages: [nl, fr, en],
};
const france: Country = {
  code: "FR",
  name: "France",
  flag: "🇫🇷",
  languages: [fr, en],
};
const turkiye: Country = {
  code: "TR",
  name: "Türkiye",
  nativeName: "Türkiye",
  flag: "🇹🇷",
  languages: [{ code: "tr", label: "Turkish" }, en],
};

const countries = [belgium, france, turkiye];

describe("normalize", () => {
  it("strips diacritics, lowercases and trims", () => {
    expect(normalize("  Türkiye ")).toBe("turkiye");
    expect(normalize("België")).toBe("belgie");
    expect(normalize("Français")).toBe("francais");
  });
});

describe("scoreCountry", () => {
  it("returns 0 for an empty query so every country is kept", () => {
    expect(scoreCountry(belgium, "")).toBe(0);
    expect(scoreCountry(belgium, "   ")).toBe(0);
  });

  it("ranks an exact country-code match highest", () => {
    expect(scoreCountry(belgium, "be")).toBe(1000);
    expect(scoreCountry(belgium, "BE")).toBe(1000);
  });

  it("ranks a country-code prefix above a name prefix", () => {
    // "f" is a prefix of both the code "FR" and the name "France".
    expect(scoreCountry(france, "f")).toBe(900);
  });

  it("matches on native name with diacritics", () => {
    expect(scoreCountry(belgium, "belgië")).toBe(700);
    expect(scoreCountry(turkiye, "turk")).toBe(700);
  });

  it("matches on a language code prefix", () => {
    expect(scoreCountry(france, "fr")).toBe(1000); // code wins first
    expect(scoreCountry(belgium, "nl")).toBe(500); // no code/name match → language
  });

  it("matches on a substring of the name", () => {
    expect(scoreCountry(france, "anc")).toBe(300);
  });

  it("matches on a language label substring", () => {
    expect(scoreCountry(belgium, "dutch")).toBe(100);
  });

  it("returns null when nothing matches", () => {
    expect(scoreCountry(france, "zzz")).toBeNull();
  });
});

describe("filterCountries", () => {
  it("returns the full list unchanged for an empty query", () => {
    expect(filterCountries(countries, "")).toBe(countries);
    expect(filterCountries(countries, "   ")).toBe(countries);
  });

  it("filters out non-matching countries", () => {
    const result = filterCountries(countries, "belg");
    expect(result).toEqual([belgium]);
  });

  it("orders by score, then alphabetically by name", () => {
    // "fr" is an exact code match for FR (1000) and a language match for BE (500).
    const result = filterCountries(countries, "fr");
    expect(result.map((c) => c.code)).toEqual(["FR", "BE"]);
  });

  it("is diacritic-insensitive", () => {
    expect(filterCountries(countries, "turkiye")).toEqual([turkiye]);
  });
});
