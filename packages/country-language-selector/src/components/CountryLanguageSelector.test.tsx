import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CountryLanguageSelector } from "./CountryLanguageSelector";
import type { Country } from "../types";

const en = { code: "en", label: "English" };
const fr = { code: "fr", label: "French", nativeLabel: "Français" };
const nl = { code: "nl", label: "Dutch", nativeLabel: "Nederlands" };

const countries: Country[] = [
  { code: "BE", name: "Belgium", nativeName: "België", flag: "🇧🇪", languages: [nl, fr, en] },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", languages: [nl] },
  { code: "FR", name: "France", flag: "🇫🇷", languages: [fr, en] },
];

function openPopover() {
  return userEvent.click(screen.getByRole("button", { name: /select country/i }));
}

describe("CountryLanguageSelector — trigger", () => {
  it("renders the compact trigger with country and language codes", () => {
    render(
      <CountryLanguageSelector
        countries={countries}
        defaultValue={{ country: "BE", language: "fr" }}
      />
    );
    const trigger = screen.getByRole("button", { name: /select country/i });
    expect(trigger).toHaveTextContent("BE");
    expect(trigger).toHaveTextContent("fr");
  });

  it("opens and closes the popover on click", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await openPopover();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await openPopover();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not open when disabled", async () => {
    render(<CountryLanguageSelector countries={countries} disabled />);
    await openPopover();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CountryLanguageSelector — country selection", () => {
  it("commits immediately for a single-language country and closes", async () => {
    const onChange = vi.fn();
    render(<CountryLanguageSelector countries={countries} onChange={onChange} />);
    onChange.mockClear();
    await openPopover();
    await userEvent.click(screen.getByRole("option", { name: /netherlands/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(
      { country: "NL", language: "nl" },
      expect.objectContaining({ reason: "country" })
    );
  });

  it("reveals the language step for a multi-language country", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    await openPopover();
    await userEvent.click(screen.getByRole("option", { name: /france/i }));

    // Still open, now showing languages.
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /french/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /english/i })).toBeInTheDocument();
  });

  it("commits the chosen language and closes", async () => {
    const onChange = vi.fn();
    render(<CountryLanguageSelector countries={countries} onChange={onChange} />);
    onChange.mockClear();
    await openPopover();
    await userEvent.click(screen.getByRole("option", { name: /france/i }));
    await userEvent.click(screen.getByRole("option", { name: /english/i }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenLastCalledWith(
      { country: "FR", language: "en" },
      expect.objectContaining({ reason: "language" })
    );
  });
});

describe("CountryLanguageSelector — search", () => {
  it("filters the country list by query", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    await openPopover();
    await userEvent.type(screen.getByRole("combobox"), "belg");

    const list = screen.getByRole("listbox");
    expect(within(list).getByRole("option", { name: /belgium/i })).toBeInTheDocument();
    expect(within(list).queryByRole("option", { name: /france/i })).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    await openPopover();
    await userEvent.type(screen.getByRole("combobox"), "zzzz");
    expect(screen.getByText(/no matching countries/i)).toBeInTheDocument();
  });
});

describe("CountryLanguageSelector — keyboard navigation", () => {
  it("navigates and commits countries with the keyboard", async () => {
    const onChange = vi.fn();
    render(<CountryLanguageSelector countries={countries} onChange={onChange} />);
    onChange.mockClear();
    await openPopover();

    // First option (Belgium) is active; move down to Netherlands and commit.
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith(
      { country: "NL", language: "nl" },
      expect.objectContaining({ reason: "country" })
    );
  });

  it("keeps keyboard navigation working after switching to the language step (regression)", async () => {
    const onChange = vi.fn();
    render(<CountryLanguageSelector countries={countries} onChange={onChange} />);
    onChange.mockClear();
    await openPopover();

    // Enter the language step by choosing a multi-language country.
    await userEvent.click(screen.getByRole("option", { name: /france/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    // Focus must have moved into the popover so arrow keys still work even
    // though the search input unmounted on this step.
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenLastCalledWith(
      { country: "FR", language: "en" },
      expect.objectContaining({ reason: "language" })
    );
  });

  it("returns to the country step on Backspace with an empty query", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    await openPopover();
    await userEvent.click(screen.getByRole("option", { name: /france/i }));
    // In the language step now.
    expect(screen.getByRole("option", { name: /french/i })).toBeInTheDocument();

    await userEvent.keyboard("{Backspace}");
    // Back on the country step: the search combobox is visible again.
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    render(<CountryLanguageSelector countries={countries} />);
    await openPopover();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("CountryLanguageSelector — customisation", () => {
  it("supports a custom trigger renderer", () => {
    render(
      <CountryLanguageSelector
        countries={countries}
        defaultValue={{ country: "FR", language: "fr" }}
        renderTrigger={({ country, language }) => (
          <span>{`${country.name}/${language.label}`}</span>
        )}
      />
    );
    expect(screen.getByText("France/French")).toBeInTheDocument();
  });

  it("localises its own UI via the strings prop", async () => {
    render(
      <CountryLanguageSelector
        countries={countries}
        strings={{ searchPlaceholder: "Rechercher…" }}
      />
    );
    await openPopover();
    expect(screen.getByPlaceholderText("Rechercher…")).toBeInTheDocument();
  });

  it("renders SVG flags in image mode", () => {
    const { container } = render(
      <CountryLanguageSelector countries={countries} flagMode="image" />
    );
    const img = container.querySelector("img.cls-flag--image") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("flagcdn.com/be.svg");
  });
});
