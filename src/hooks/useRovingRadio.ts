"use client";

import type { KeyboardEvent } from "react";

/**
 * Props for a role="radiogroup" (or "tablist") of buttons with roving tabindex (DESIGN_SYSTEM.md 7):
 * one Tab stop, arrows move and select, Home/End jump. Spread `item(i)` on each option button.
 */
export function useRovingRadio(count: number, selected: number, onSelect: (i: number) => void, kind: "radio" | "tab" = "radio") {
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    const keys: Record<string, number> = {
      ArrowRight: selected + 1,
      ArrowDown: selected + 1,
      ArrowLeft: selected - 1,
      ArrowUp: selected - 1,
      Home: 0,
      End: count - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    e.stopPropagation();
    const next = (keys[e.key] + count) % count;
    onSelect(next);
    const buttons = e.currentTarget.querySelectorAll<HTMLElement>(`[role="${kind}"]`);
    buttons[next]?.focus();
  };
  return {
    group: { role: kind === "tab" ? "tablist" : "radiogroup", onKeyDown },
    item: (i: number) => ({
      role: kind,
      [kind === "tab" ? "aria-selected" : "aria-checked"]: i === selected,
      tabIndex: i === selected ? 0 : -1,
      onClick: () => onSelect(i),
    }),
  } as const;
}
