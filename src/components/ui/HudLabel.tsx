import type { ReactNode } from "react";

/** DESIGN_SYSTEM.md 4.5. Non-interactive service label; fades with the section's --hud-opacity. */
export function HudLabel({
  children,
  size = "xs",
  onSurface2 = false,
  className = "",
}: {
  children: ReactNode;
  size?: "xs" | "md";
  /** text-3 fails contrast on surface-2, use text-2 there */
  onSurface2?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`hud ${size === "md" ? "text-mono" : "text-mono-xs"} ${onSurface2 ? "text-text-2" : "text-text-3"} hud-label opacity-(--hud-opacity) ${className}`}
    >
      {children}
    </span>
  );
}
