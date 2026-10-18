"use client";

import { useState } from "react";
import { Segmented } from "@/components/showroom/ShowroomControls";

type Filter = "all" | "web" | "roblox" | "ai";

/**
 * Projects filter: the site-wide Segmented; sets data-filter on #projects and CSS hides the other groups,
 * so without JS every project stays visible.
 */
export function ProjectFilter({ label, options }: { label: string; options: { id: Filter; label: string }[] }) {
  const [value, setValue] = useState<Filter>("all");
  return (
    <Segmented
      label={label}
      options={options.map((o) => ({ value: o.id, label: o.label }))}
      value={value}
      onChange={(v) => {
        setValue(v);
        document.getElementById("projects")?.setAttribute("data-filter", v);
      }}
    />
  );
}
