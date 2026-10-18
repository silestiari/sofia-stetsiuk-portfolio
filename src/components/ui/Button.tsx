import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { useLocale } from "next-intl";
import { ui } from "@/content/ui";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  /** sm — only for the desktop header */
  size?: Size;
  /** Shows "···", sets aria-busy, ignores repeated clicks */
  loading?: boolean;
  className?: string;
  children: ReactNode;
}
type LinkProps = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
export type ButtonProps = LinkProps | NativeButtonProps;

const isExternal = (href: string) => /^(https?:)?\/\//.test(href);
const isLocalePath = (href: string) => href.startsWith("/") && !href.startsWith("//");

/** DESIGN_SYSTEM.md 4.4. Renders <a>/<Link> when `href` is given, otherwise <button>. */
export function Button(props: ButtonProps) {
  const locale = useLocale();
  const { variant = "primary", size = "md", loading = false, className = "", children, ...rest } = props;
  const cls = [
    "btn",
    `btn-${variant}`,
    variant === "ghost" ? "h-11 px-0" : size === "sm" ? "h-10 px-4" : "h-12 px-6",
    className,
  ].join(" ");
  const content = (
    <>
      {loading && <span aria-hidden="true">···</span>}
      {children}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as LinkProps;
    if (isExternal(href)) {
      return (
        <a {...anchor} href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-busy={loading || undefined}>
          {content}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">{ui.opensInNewTab[locale]}</span>
        </a>
      );
    }
    if (isLocalePath(href)) {
      return (
        <Link {...anchor} href={href} className={cls} aria-busy={loading || undefined}>
          {content}
        </Link>
      );
    }
    // #anchor, mailto:, tel:
    return (
      <a {...anchor} href={href} className={cls} aria-busy={loading || undefined}>
        {content}
      </a>
    );
  }

  const { type = "button", onClick, ...button } = rest as NativeButtonProps;
  return (
    <button
      {...button}
      type={type}
      className={cls}
      aria-busy={loading || undefined}
      onClick={loading ? undefined : onClick}
    >
      {content}
    </button>
  );
}
