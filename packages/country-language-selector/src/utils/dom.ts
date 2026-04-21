/**
 * Small DOM helpers that stay SSR-safe (no access during module load).
 */

export const isBrowser = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";

export function readStorage(key: string): string | null {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // ignore — private-mode Safari, quota, etc.
  }
}

/** Returns true on coarse-pointer / narrow viewports. */
export function isCoarsePointer(): boolean {
  if (!isBrowser()) return false;
  return window.matchMedia?.("(pointer: coarse)").matches ?? false;
}
