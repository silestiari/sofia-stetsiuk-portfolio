import type { ButtonHTMLAttributes } from "react";

const base = "hud text-mono-xs inline-flex items-center gap-1.5 rounded-full border px-3";

/**
 * Tag pill (docs/REDESIGN_UX_SPEC.md 3.2). Static <span> by default: dim border, no hover — it doesn't look clickable.
 * Pass `pressed` (+ onClick) to get a filter <button aria-pressed>: ui-border, white fill when pressed.
 */
export function TechChip({
  children,
  pressed,
  ...button
}: { children: string; pressed?: boolean } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  if (pressed === undefined) return <span className={`${base} h-7 border-line-strong text-text-2`}>{children}</span>;
  return (
    <button
      type="button"
      {...button}
      aria-pressed={pressed}
      className={`${base} relative h-9 cursor-pointer transition-colors duration-150 before:absolute before:-inset-y-1 before:inset-x-0 ${
        pressed ? "border-text bg-text text-bg" : "border-ui-border text-text-2 hover:border-text hover:text-text"
      }`}
    >
      {pressed && <span aria-hidden="true">✓</span>}
      {children}
    </button>
  );
}
