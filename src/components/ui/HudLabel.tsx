import type { ReactNode } from "react";

/** Non-interactive service label (mono caps, text-3); shown or hidden with the section's --hud-opacity, never dimmed below AA. */
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
    <span className={`hud ${size === "md" ? "text-mono" : "text-mono-xs"} hud-label text-text-3 ${className}`}>
      {children}
    </span>
  );
}
