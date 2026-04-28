"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MutableRefObject,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type {
  Country,
  CountryLanguageSelectorProps,
  Language,
  SelectorStrings,
} from "../types";
import { defaultStrings } from "../types";
import { defaultCountries } from "../data/countries";
import { useCountryLanguage } from "../hooks/useCountryLanguage";
import { useClickOutside } from "../hooks/useClickOutside";
import { useFocusTrap } from "../hooks/useFocusTrap";
import { filterCountries } from "../utils/search";
import { isCoarsePointer } from "../utils/dom";
import { ArrowLeft, CheckIcon, ChevronDown, SearchIcon } from "./icons";
import { CountryFlag } from "./CountryFlag";

type Step = "country" | "language";

/**
 * A compact, accessible country + language selector for navbars.
 *
 * The component is a combobox-style popover. It supports both controlled
 * and uncontrolled usage and optionally persists the selection to
 * localStorage.
 */
export const CountryLanguageSelector = forwardRef<
  HTMLDivElement,
  CountryLanguageSelectorProps
>(function CountryLanguageSelector(props, ref) {
  const {
    countries = defaultCountries,
    value,
    defaultValue,
    onChange,
    persistKey,
    ariaLabel,
    triggerVariant = "compact",
    flagMode = "emoji",
    renderFlag,
    align = "end",
    disabled,
    className,
    popoverClassName,
    renderTrigger,
    strings: stringsProp,
  } = props;

  const strings: SelectorStrings = useMemo(
    () => ({ ...defaultStrings, ...(stringsProp ?? {}) }),
    [stringsProp]
  );

  const { country, language, setCountry, setLanguage } = useCountryLanguage({
    countries,
    value,
    defaultValue,
    onChange,
    persistKey,
  });

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("country");
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number; right: number } | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const listboxId = useId();
  const activeOptionId = `${listboxId}-opt-${activeIndex}`;

  // Close on outside click / Escape.
  useClickOutside([rootRef, popoverRef], open, () => setOpen(false));

  // Trap focus while open.
  useFocusTrap(popoverRef, open);

  // Detect coarse pointers so we know when to show a mobile backdrop.
  // Also check viewport width for browser dev tools compatibility.
  useEffect(() => {
    const checkMobile = () => {
      const isTouch = isCoarsePointer();
      const isNarrow = window.matchMedia?.("(max-width: 768px)").matches ?? false;
      setIsMobile(isTouch || isNarrow);
    };

    checkMobile();
    const mediaQuery = window.matchMedia?.("(max-width: 768px)");
    mediaQuery?.addEventListener?.("change", checkMobile);
    return () => mediaQuery?.removeEventListener?.("change", checkMobile);
  }, []);

  // Reset transient UI state when we open.
  useEffect(() => {
    if (!open) return;
    setStep("country");
    setQuery("");
    setActiveIndex(0);
    // Focus the search input on open — next tick so the animation settles.
    const t = window.setTimeout(() => searchRef.current?.focus(), 10);
    return () => window.clearTimeout(t);
  }, [open]);

  // Compute popover position under the trigger when portal is used.
  useEffect(() => {
    if (!open || !isMobile) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      if (!trigger) return;
      const rect = trigger.getBoundingClientRect();
      setPopoverPos({
        top: rect.bottom + 8,
        left: rect.left,
        right: window.innerWidth - rect.right,
      });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open, isMobile]);

  const filtered = useMemo(() => filterCountries(countries, query), [countries, query]);

  // Clamp the active index whenever the filtered list changes.
  useEffect(() => {
    if (activeIndex > Math.max(0, filtered.length - 1)) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  const closeAndRefocus = useCallback(() => {
    setOpen(false);
    // Return focus to the trigger for good keyboard UX.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const commitCountry = useCallback(
    (c: Country) => {
      setCountry(c.code);
      if (c.languages.length > 1) {
        setStep("language");
        setActiveIndex(0);
      } else {
        closeAndRefocus();
      }
    },
    [setCountry, closeAndRefocus]
  );

  const commitLanguage = useCallback(
    (l: Language) => {
      setLanguage(l.code);
      closeAndRefocus();
    },
    [setLanguage, closeAndRefocus]
  );

  const onTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (
        e.key === "ArrowDown" ||
        e.key === "Enter" ||
        e.key === " " ||
        e.key === "ArrowUp"
      ) {
        e.preventDefault();
        setOpen(true);
      }
    },
    [disabled]
  );

  const onListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      const list = step === "country" ? filtered : country.languages;
      if (list.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i + 1) % list.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i - 1 + list.length) % list.length);
      } else if (e.key === "Home") {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === "End") {
        e.preventDefault();
        setActiveIndex(list.length - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const item = list[activeIndex];
        if (!item) return;
        if (step === "country") commitCountry(item as Country);
        else commitLanguage(item as Language);
      } else if (e.key === "Escape") {
        e.preventDefault();
        closeAndRefocus();
      } else if (e.key === "Backspace" && step === "language" && !query) {
        e.preventDefault();
        setStep("country");
        setActiveIndex(0);
      }
    },
    [step, filtered, country, activeIndex, commitCountry, commitLanguage, closeAndRefocus, query]
  );

  // Ensure the active option scrolls into view during keyboard navigation.
  useEffect(() => {
    const el = document.getElementById(activeOptionId);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeOptionId]);

  return (
    <div
      ref={(el) => {
        rootRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) (ref as MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      className={["cls-root", className].filter(Boolean).join(" ")}
    >
      <button
        ref={triggerRef}
        type="button"
        className="cls-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={ariaLabel ?? strings.ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={onTriggerKeyDown}
      >
        {renderTrigger ? (
          renderTrigger({ country, language, open })
        ) : (
          <TriggerContent
            variant={triggerVariant}
            country={country}
            language={language}
            flagMode={flagMode}
            renderFlag={renderFlag}
          />
        )}
        <ChevronDown className="cls-trigger__chev" />
      </button>

      {open && renderPopover()}
    </div>
  );

  function renderPopover() {
    const portalStyle: CSSProperties | undefined =
      isMobile && popoverPos
        ? {
            position: "fixed",
            top: popoverPos.top,
            left: align === "start" ? popoverPos.left : undefined,
            right: align === "end" ? popoverPos.right : undefined,
            maxHeight: `calc(100vh - ${popoverPos.top}px - 16px)`,
          }
        : undefined;

    const popoverContent = (
      <>
        {isMobile && <div className="cls-backdrop" aria-hidden="true" />}
        <div
          ref={popoverRef}
          role="dialog"
          aria-label={strings.ariaLabel}
          data-align={align}
          tabIndex={-1}
          className={["cls-popover", popoverClassName].filter(Boolean).join(" ")}
          onKeyDown={onListKeyDown}
          style={portalStyle}
        >
          {step === "country" ? (
            <>
              <div className="cls-search">
                <SearchIcon className="cls-search__icon" />
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls={listboxId}
                  aria-activedescendant={activeOptionId}
                  aria-autocomplete="list"
                  className="cls-search__input"
                  placeholder={strings.searchPlaceholder}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                />
              </div>

              <div className="cls-section-title">
                <span>{strings.chooseCountry}</span>
              </div>

              {filtered.length === 0 ? (
                <div className="cls-empty">{strings.emptyResults}</div>
              ) : (
                <ul
                  id={listboxId}
                  role="listbox"
                  aria-label={strings.chooseCountry}
                  className="cls-list"
                >
                  {filtered.map((c, i) => {
                    const selected = c.code === country.code;
                    return (
                      <li
                        key={c.code}
                        id={`${listboxId}-opt-${i}`}
                        role="option"
                        aria-selected={selected}
                        data-active={i === activeIndex}
                        className="cls-option"
                        onMouseEnter={() => setActiveIndex(i)}
                        onClick={() => commitCountry(c)}
                      >
                        <CountryFlag
                          country={c}
                          mode={flagMode}
                          render={renderFlag}
                          size="md"
                          className="cls-option__flag"
                        />
                        <span className="cls-option__body">
                          <span className="cls-option__title">{c.name}</span>
                          {c.nativeName && c.nativeName !== c.name && (
                            <span className="cls-option__subtitle">{c.nativeName}</span>
                          )}
                        </span>
                        <span className="cls-option__meta">
                          {c.languages.length > 1 ? (
                            <span className="cls-badge">{c.languages.length} langs</span>
                          ) : (
                            <span className="cls-badge">{c.languages[0]!.code.toUpperCase()}</span>
                          )}
                          {selected && <CheckIcon className="cls-check" />}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <>
              <div className="cls-section-title">
                <button
                  type="button"
                  className="cls-back"
                  onClick={() => {
                    setStep("country");
                    setActiveIndex(0);
                  }}
                >
                  <ArrowLeft width={12} height={12} />
                  {strings.backToCountries}
                </button>
                <span>
                  <CountryFlag
                    country={country}
                    mode={flagMode}
                    render={renderFlag}
                    size="sm"
                  />{" "}
                  {country.name}
                </span>
              </div>

              <ul
                id={listboxId}
                role="listbox"
                aria-label={strings.chooseLanguage}
                className="cls-list"
              >
                {country.languages.map((l, i) => {
                  const selected = l.code === language.code;
                  return (
                    <li
                      key={l.code}
                      id={`${listboxId}-opt-${i}`}
                      role="option"
                      aria-selected={selected}
                      data-active={i === activeIndex}
                      className="cls-option"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => commitLanguage(l)}
                    >
                      <span className="cls-option__body">
                        <span className="cls-option__title">{l.label}</span>
                        {l.nativeLabel && l.nativeLabel !== l.label && (
                          <span className="cls-option__subtitle">{l.nativeLabel}</span>
                        )}
                      </span>
                      <span className="cls-option__meta">
                        <span className="cls-badge">{l.code.toUpperCase()}</span>
                        {selected && <CheckIcon className="cls-check" />}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>
      </>
    );

    if (isMobile && typeof document !== "undefined") {
      return createPortal(
        <div className={["cls-root", "cls-portal", className].filter(Boolean).join(" ")}>
          {popoverContent}
        </div>,
        document.body
      );
    }
    return popoverContent;
  }
});

function TriggerContent({
  variant,
  country,
  language,
  flagMode,
  renderFlag,
}: {
  variant: "compact" | "full" | "flag";
  country: Country;
  language: Language;
  flagMode: "emoji" | "image";
  renderFlag?: (country: Country) => ReactNode;
}) {
  const flag = (
    <CountryFlag
      country={country}
      mode={flagMode}
      render={renderFlag}
      size="sm"
      className="cls-trigger__flag"
    />
  );
  if (variant === "flag") {
    return (
      <>
        {flag}
        <span className="cls-trigger__lang">{language.code}</span>
      </>
    );
  }
  if (variant === "full") {
    return (
      <>
        {flag}
        <span className="cls-trigger__code">{country.name}</span>
        <span className="cls-trigger__sep" aria-hidden="true">
          ·
        </span>
        <span className="cls-trigger__lang">{language.label}</span>
      </>
    );
  }
  // compact (default)
  return (
    <>
      {flag}
      <span className="cls-trigger__code">{country.code}</span>
      <span className="cls-trigger__sep" aria-hidden="true">
        ·
      </span>
      <span className="cls-trigger__lang">{language.code}</span>
    </>
  );
}
