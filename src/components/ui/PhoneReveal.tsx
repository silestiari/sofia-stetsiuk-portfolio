"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile } from "@/content/profile";

/**
 * The number stays out of the server HTML: a button first, the tel: link with the number after a click.
 * Focus moves to the revealed link so keyboard users can press Enter again to call.
 */
export function PhoneReveal({
  className,
  revealedClassName = className,
  label,
  children,
}: {
  className: string;
  revealedClassName?: string;
  /** aria-label for icon-only buttons */
  label?: string;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);
  const { display, href } = profile.contacts.phone;

  useEffect(() => {
    if (shown) link.current?.focus();
  }, [shown]);

  return shown ? (
    <a ref={link} href={href} className={revealedClassName}>
      <span className="whitespace-nowrap normal-case">{display}</span>
    </a>
  ) : (
    <button type="button" aria-label={label} onClick={() => setShown(true)} className={className}>
      {children}
    </button>
  );
}
