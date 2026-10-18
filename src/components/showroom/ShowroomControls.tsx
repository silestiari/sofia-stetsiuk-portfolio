"use client";

import type { ReactNode } from "react";
import { Tooltip } from "@/components/ui/Tooltip";
import { useRovingRadio } from "@/hooks/useRovingRadio";

/** Segmented radiogroup in the EN/RU gizmo style (pass switcher, backdrop, project). */
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
    <div {...radio.group} aria-label={label} className={`flex flex-wrap items-stretch rounded-qa border border-line ${className}`}>
      {options.map((o, i) => (
        <button
          key={o.value}
          type="button"
          {...radio.item(i)}
          className={`hud relative min-h-11 px-3 text-mono-xs md:min-h-8 ${
            i === selected ? "text-text outline-1 -outline-offset-1 outline-qa-accent" : "text-text-2 hover:text-text"
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
        className="grid size-11 place-items-center rounded-qa-panel border border-text-3 bg-bg/70 text-text hover:border-qa-accent"
      >
        <span aria-hidden="true">{children}</span>
      </button>
    </Tooltip>
  );
}
