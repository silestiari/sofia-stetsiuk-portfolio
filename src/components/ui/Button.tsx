import { Children, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

interface CommonProps {
  variant?: Variant;
  /** sm (44px) — header and dense toolbars */
  size?: Size;
  /** Shows "···", sets aria-busy, ignores repeated clicks */
  loading?: boolean;
  className?: string;
  children: ReactNode;
}
type LinkProps = CommonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type NativeButtonProps = CommonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">;
export type ButtonProps = LinkProps | NativeButtonProps;

/** Button label that rolls up letter by letter on hover (globals.css .btn-roll). Screen readers get the plain text. */
export function RollText({ text }: { text: string }) {
  return (
    <span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="btn-roll">
        {[...text].map((c, i) => (
          <span key={i} style={{ "--i": i } as CSSProperties}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}

const isExternal =(href: string) => /^(https?:)?\/\//.test(href);
const isLocalePath = (href: string) => href.startsWith("/") && !href.startsWith("//");

/** Pill button (docs/REDESIGN_UX_SPEC.md 3.1): primary = the pink fill, secondary = outline, ghost = inline link. Renders <a>/<Link> when `href` is given, otherwise <button>. */
export function Button(props: ButtonProps) {
  const t = useTranslations("a11y");
  const { variant = "primary", size = "md", loading = false, className = "", children, ...rest } = props;
  const cls = [
    "btn",
    `btn-${variant}`,
    variant === "ghost" ? "min-h-11 px-0" : size === "sm" ? "min-h-11 px-5 py-2" : "min-h-12 px-6 py-2",
    className,
  ].join(" ");
  const content = (
    <>
      {loading && <span aria-hidden="true">···</span>}
      {Children.map(children, (c) => (typeof c === "string" && c.trim() ? <RollText text={c} /> : c))}
    </>
  );

  if (rest.href !== undefined) {
    const { href, ...anchor } = rest as LinkProps;
    if (isExternal(href)) {
      return (
        <a {...anchor} href={href} target="_blank" rel="noopener noreferrer" className={cls} aria-busy={loading || undefined}>
          {content}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">{t("opensInNewTab")}</span>
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
