import { useEffect, type RefObject } from "react";

/**
 * Calls `handler` when a pointerdown (or the Escape key) fires outside every
 * element in `refs`. Uses pointerdown rather than click so dismissals happen
 * before the target receives focus — important for accessible dropdowns.
 */
export function useClickOutside(
  refs: Array<RefObject<HTMLElement | null>>,
  enabled: boolean,
  handler: (event: Event) => void
): void {
  useEffect(() => {
    if (!enabled) return;

    const isInside = (target: Node | null): boolean => {
      if (!target) return false;
      return refs.some((ref) => {
        const el = ref.current;
        return !!el && el.contains(target);
      });
    };

    const onPointer = (event: PointerEvent | MouseEvent) => {
      if (!isInside(event.target as Node | null)) handler(event);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") handler(event);
    };

    document.addEventListener("pointerdown", onPointer, true);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("pointerdown", onPointer, true);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [enabled, handler, refs]);
}
