import type { ButtonHTMLAttributes } from "react";

const base = "hud text-mono-xs inline-flex h-6 items-center gap-1 rounded-qa border px-2 normal-case tracking-normal";

/**
 * DESIGN_SYSTEM.md 4.8. Static <span> by default; pass `pressed` (+ onClick) to get a filter
 * <button aria-pressed> for the Skills matrix.
 */
export function TechChip({
  children,
  pressed,
  ...button
}: { children: string; pressed?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  if (pressed === undefined) {
    return <span className={`${base} border-line text-text-2`}>{children}</span>;
  }
  return (
    <button
      type="button"
      {...button}
      aria-pressed={pressed}
      className={`${base} cursor-pointer transition-colors duration-150 ${
        pressed ? "border-qa-accent bg-surface-2 text-text" : "border-grid-strong text-text-2 hover:border-qa-accent"
      }`}
    >
      {pressed && <span aria-hidden="true">✓</span>}
      {children}
    </button>
  );
}
