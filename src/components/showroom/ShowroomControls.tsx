"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useRovingRadio } from "@/hooks/useRovingRadio";

/** Pill segmented radiogroup — one look site-wide (docs/REDESIGN_UX_SPEC.md 3.3): checked = white pill. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const selected = Math.max(0, options.findIndex((o) => o.value === value));
  const radio = useRovingRadio(options.length, selected, (i) => onChange(options[i].value));
  return (
    <div {...radio.group} aria-label={label} className={`inline-flex flex-wrap items-center gap-1 rounded-3xl border border-ui-border p-1 ${className}`}>
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          {...radio.item(i)}
          className={`hud relative h-9 cursor-pointer rounded-full px-4 text-mono-xs transition-colors duration-150 before:absolute before:-inset-y-1 before:inset-x-0 ${
            i === selected ? "bg-text text-bg" : "text-text-2 hover:text-text"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** 44×44 icon control with aria-label and a tooltip that names the shortcut. */
export function IconButton({
  label,
  shortcut,
  pressed,
  onClick,
  children,
}: {
  label: string;
  shortcut?: string;
  pressed?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip content={label} shortcut={shortcut}>
      <button
        type="button"
        aria-label={label}
        aria-pressed={pressed}
        onClick={onClick}
        className="grid size-11 cursor-pointer place-items-center rounded-full border border-ui-border bg-bg/70 text-text transition-colors duration-150 hover:border-text aria-pressed:border-text aria-pressed:bg-text aria-pressed:text-bg"
      >
        <span aria-hidden="true">{children}</span>
      </button>
    </Tooltip>
  );
}
