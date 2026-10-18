import type { ReactNode } from "react";

/** Non-interactive service label (mono caps, text-3); fades with the section's --hud-opacity. */
export function HudLabel({
  children,
  size = "xs",
  className = "",
}: {
  children: ReactNode;
  size?: "xs" | "md";
  className?: string;
}) {
  return (
    <span className={`hud ${size === "md" ? "text-mono" : "text-mono-xs"} hud-label text-text-3 opacity-(--hud-opacity) ${className}`}>
      {children}
    </span>
  );
}
