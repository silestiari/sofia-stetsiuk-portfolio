"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";

type Tone = "success" | "warning";
interface ToastData {
  id: number;
  message: string;
  tone: Tone;
}

const ToastContext = createContext<(message: string, tone?: Tone) => void>(() => {});

/** `const toast = useToast(); toast(t("emailCopied"))` */
export const useToast = () => useContext(ToastContext);

const HIDE_AFTER = 4000;

/** DESIGN_SYSTEM.md 4.14. One toast at a time; the live region is always in the DOM; focus is never moved. */
export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("a11y");
  const [toast, setToast] = useState<ToastData | null>(null);
  const [paused, setPaused] = useState(false);
  const nextId = useRef(0);

  const show = useCallback((message: string, tone: Tone = "success") => {
    setPaused(false);
    setToast({ id: ++nextId.current, message, tone });
  }, []);

  useEffect(() => {
    if (!toast || paused) return;
    const timer = setTimeout(() => setToast(null), HIDE_AFTER);
    return () => clearTimeout(timer);
  }, [toast, paused]);

  useEffect(() => {
    if (!toast) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setToast(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [toast]);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-(--z-toast) flex justify-center md:inset-x-auto md:right-6 md:bottom-6"
      >
        {toast && (
          <div
            key={toast.id}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="toast pointer-events-auto flex max-w-[360px] items-center gap-3 border border-line bg-surface-2 py-1 pl-4 text-small text-text shadow-popover"
          >
            <span aria-hidden="true" className={toast.tone === "success" ? "text-status-pass" : "text-sev-major"}>
              {toast.tone === "success" ? "✓" : "!"}
            </span>
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label={t("toastClose")}
              className="ml-auto grid size-11 shrink-0 cursor-pointer place-items-center text-text-2 hover:text-text"
            >
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}
