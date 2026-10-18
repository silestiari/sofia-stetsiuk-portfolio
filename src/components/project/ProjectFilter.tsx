"use client";

import { useRef, useState, type KeyboardEvent } from "react";

type Filter = "all" | "web" | "roblox" | "ai";

/**
 * radiogroup with roving tabindex. Sets data-filter on the enclosing section; CSS hides the other groups,
 * so without JS every project stays visible (DESIGN_SYSTEM.md 5.2).
 */
export function ProjectFilter({ label, options }: { label: string; options: { id: Filter; label: string }[] }) {
  const [value, setValue] = useState<Filter>("all");
  const group = useRef<HTMLDivElement>(null);

  const select = (i: number) => {
    const next = options[(i + options.length) % options.length];
    setValue(next.id);
    group.current?.closest("section")?.setAttribute("data-filter", next.id);
    group.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[options.indexOf(next)]?.focus();
  };

  const onKey = (e: KeyboardEvent, i: number) => {
    const to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: -1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    select(to);
  };

  return (
    <div ref={group} role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o, i) => {
        const checked = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => select(i)}
            onKeyDown={(e) => onKey(e, i)}
            className={`hud text-mono inline-flex h-11 cursor-pointer items-center rounded-qa border px-4 transition-colors duration-150 ${
              checked ? "border-qa-accent bg-surface-2 text-text" : "border-text-3 text-text-2 hover:border-qa-accent"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
