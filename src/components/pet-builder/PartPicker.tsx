"use client";

import { useId, useState } from "react";
import { useRovingRadio } from "@/hooks/useRovingRadio";

export interface PickerTab {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string; swatch: string }[];
}

// Pastels are fills only; the text on them is always --pet-ink (DESIGN_SYSTEM.md 1.2).
const SWATCH: Record<string, string> = {
  AIR: "bg-pet-sky",
  FIRE: "bg-pet-surface",
  WATER: "bg-pet-mint",
  NONE: "bg-pet-bg",
  RARE: "bg-pet-sky",
  EPIC: "bg-pet-lilac",
  LEGENDARY: "bg-pet-butter",
};

/** Slot tabs (role="tablist" pills) + option circles (role="radiogroup"), DESIGN_SYSTEM.md 4.12. */
export function PartPicker({
  tabs,
  label,
  optionsLabel,
  onChoose,
}: {
  tabs: PickerTab[];
  label: string;
  optionsLabel: (slot: string) => string;
  onChoose: (tab: PickerTab, value: string) => void;
}) {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const selected = Math.max(0, tab.options.findIndex((o) => o.value === tab.value));
  const tabList = useRovingRadio(tabs.length, active, setActive, "tab");
  const radio = useRovingRadio(tab.options.length, selected, (i) => onChoose(tab, tab.options[i].value));

  return (
    <div>
      <div {...tabList.group} aria-label={label} className="flex flex-wrap gap-2">
        {tabs.map((x, i) => (
          <button
            key={x.id}
            type="button"
            id={`${uid}-tab-${i}`}
            aria-controls={`${uid}-panel`}
            {...tabList.item(i)}
            className={`min-h-11 rounded-full border-2 px-4 text-small font-semibold text-pet-ink focus-visible:[outline:var(--ring-pet)] ${
              i === active ? "border-pet-lilac bg-pet-lilac" : "border-pet-lilac bg-pet-bg hover:scale-103"
            } transition-transform duration-(--dur-micro) ease-(--ease-soft)`}
          >
            {x.label}
          </button>
        ))}
      </div>

      <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${active}`} className="mt-6">
        <div {...radio.group} aria-label={optionsLabel(tab.label)} className="flex flex-wrap gap-4">
          {tab.options.map((o, i) => (
            <button
              key={o.value || "none"}
              type="button"
              {...radio.item(i)}
              className="group flex w-20 flex-col items-center gap-2 text-center text-small text-pet-ink focus-visible:[outline:var(--ring-pet)]"
            >
              <span
                className={`relative grid size-14 place-items-center rounded-full shadow-pet transition-transform duration-(--dur-micro) ease-(--ease-soft) group-hover:scale-106 md:size-16 ${
                  SWATCH[o.swatch] ?? "bg-pet-bg"
                } ${i === selected ? "border-2 border-pet-ink" : "border border-pet-lilac"}`}
              >
                <span aria-hidden="true" className="font-display text-lead font-medium">
                  {o.label.slice(0, 1)}
                </span>
                {i === selected && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-pet-ink text-mono-xs text-pet-bg"
                  >
                    ✓
                  </span>
                )}
              </span>
              <span className="leading-tight">{o.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
