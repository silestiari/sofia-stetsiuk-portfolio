"use client";

import { cloneElement, useEffect, useId, useRef, useState, type ReactElement, type ReactNode } from "react";

/**
 * DESIGN_SYSTEM.md 4.15. Hover (400ms delay) or focus (instant) shows the tip; Esc hides it.
 * The trigger gets aria-describedby. Never the only carrier of information: the trigger keeps its aria-label.
 */
export function Tooltip({
  content,
  shortcut,
  children,
}: {
  content: ReactNode;
  /** Keyboard hint, rendered mono: "R" → [R] */
  shortcut?: string;
  children: ReactElement<{ "aria-describedby"?: string }>;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const show = (delay: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <span
      className="relative inline-flex"
      onPointerEnter={(e) => e.pointerType === "mouse" && show(400)}
      onPointerLeave={hide}
      onFocus={() => show(0)}
      onBlur={hide}
    >
      {cloneElement(children, { "aria-describedby": id })}
      <span
        id={id}
        role="tooltip"
        hidden={!open}
        className="tooltip absolute bottom-[calc(100%+8px)] left-1/2 z-(--z-tooltip) w-max max-w-60 -translate-x-1/2 border border-line bg-surface-2 px-2 py-1 text-small text-text shadow-popover"
      >
        {content}
        {shortcut && <kbd className="hud text-mono-xs ml-2 text-text-2">[{shortcut}]</kbd>}
        {/* callout line pointing at the trigger */}
        <span aria-hidden="true" className="absolute top-full left-1/2 h-2 w-px bg-grid-strong" />
      </span>
    </span>
  );
}
