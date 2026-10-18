"use client";

import { useId, useState } from "react";
import { useRovingRadio } from "@/hooks/useRovingRadio";

export interface PickerTab {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
}

/** Slot tabs (role="tablist" pills, active = white) + option circles (role="radiogroup"). */
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
            className={`hud min-h-11 cursor-pointer rounded-full border px-4 text-mono-xs transition-colors duration-150 ${
              i === active ? "border-text bg-text text-bg" : "border-ui-border text-text-2 hover:border-text hover:text-text"
            }`}
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
              className="group flex w-20 cursor-pointer flex-col items-center gap-2 text-center text-small text-text-2 aria-checked:text-text"
            >
              <span
                className={`relative grid size-14 place-items-center rounded-full bg-surface-1 transition-colors duration-150 md:size-16 ${
                  i === selected ? "border-2 border-text text-text" : "border border-ui-border group-hover:border-text"
                }`}
              >
                <span aria-hidden="true" className="font-display text-lead font-medium">
                  {o.label.slice(0, 1)}
                </span>
                {i === selected && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 grid size-6 place-items-center rounded-full bg-text text-mono-xs text-bg"
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
