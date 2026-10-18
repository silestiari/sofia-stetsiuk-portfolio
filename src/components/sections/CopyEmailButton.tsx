"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useToast } from "@/components/ui/Toast";

/**
 * DESIGN_SYSTEM.md 4.13: Clipboard API → toast + ✓ for 1.5s.
 * If the API is missing or refused, select the visible address (#targetId) and ask for Ctrl+C.
 */
export function CopyEmailButton({ email, targetId, className = "" }: { email: string; targetId: string; className?: string }) {
  const t = useTranslations("sections.contact");
  const toast = useToast();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const timer = setTimeout(() => setDone(false), 1500);
    return () => clearTimeout(timer);
  }, [done]);

  const fallback = () => {
    const el = document.getElementById(targetId);
    if (el) getSelection()?.selectAllChildren(el);
    toast(t("copyFallback"), "warning");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setDone(true);
      toast(t("copied"));
    } catch {
      fallback();
    }
  };

  return (
    <button type="button" onClick={copy} className={`btn btn-secondary h-12 px-6 ${className}`}>
      <span aria-hidden="true" className="w-4 text-center">
        {done ? "✓" : "⧉"}
      </span>
      {t("copyEmail")}
    </button>
  );
}
