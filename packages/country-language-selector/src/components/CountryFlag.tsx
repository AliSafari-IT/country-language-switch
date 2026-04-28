"use client";

import type { ReactNode } from "react";
import type { Country } from "../types";

export type FlagMode = "emoji" | "image";

interface CountryFlagProps {
  country: Country;
  mode?: FlagMode;
  /** Optional custom renderer. Overrides `mode`. */
  render?: (country: Country) => ReactNode;
  /** Render context, used for sizing presets. */
  size?: "sm" | "md";
  className?: string;
}

/**
 * Renders a country flag using either the emoji from `country.flag`
 * or an SVG from `flagcdn.com` (recommended on Windows where regional
 * indicator pairs render as plain text).
 */
export function CountryFlag({
  country,
  mode = "emoji",
  render,
  size = "md",
  className,
}: CountryFlagProps) {
  if (render) {
    return (
      <span className={["cls-flag", className].filter(Boolean).join(" ")} aria-hidden="true">
        {render(country)}
      </span>
    );
  }

  if (mode === "image") {
    const code = country.code.toLowerCase();
    // flagcdn.com serves both raster and vector flags; SVG keeps it crisp.
    const src = `https://flagcdn.com/${code}.svg`;
    return (
      <img
        src={src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={[
          "cls-flag",
          "cls-flag--image",
          `cls-flag--${size}`,
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    );
  }

  return (
    <span
      className={["cls-flag", "cls-flag--emoji", className].filter(Boolean).join(" ")}
      aria-hidden="true"
    >
      {country.flag}
    </span>
  );
}
