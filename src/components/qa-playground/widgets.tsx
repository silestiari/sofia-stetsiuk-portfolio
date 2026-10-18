"use client";

// Loot Shop demo widgets. Each one contains exactly ONE planted defect (docs/QA_PLAYGROUND_SPEC.md);
// everything else follows the a11y rules. Behaviour is deterministic: no randomness, "network" = setTimeout.
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { QaScenario, ShopItem, WidgetSetup } from "@/content/qa-scenarios";
import { sevLook } from "./BugReportCard";

type Setup<W extends WidgetSetup["widget"]> = Extract<WidgetSetup, { widget: W }>;
export interface WidgetProps<W extends WidgetSetup["widget"] = WidgetSetup["widget"]> {
  scenario: QaScenario & { setup: Setup<W> };
  found: boolean;
  onFound: () => void;
  inspect: boolean;
}

/** detect.target element: data attributes + a dashed severity callout once the bug is found. */
type Found = { found: boolean; scenario: QaScenario };
const target = (p: Found, name: string) => ({ "data-qa-target": name, "data-qa-found": p.found || undefined });
const ring = (p: Found) =>
  p.found ? `outline-1 outline-dashed outline-offset-4 ${sevLook[p.scenario.severity].outline}` : "";

const sum = (items: ShopItem[]) => items.reduce((acc, i) => acc + i.price * i.qty, 0);

const input =
  "h-11 w-full min-w-0 rounded-qa border bg-surface-2 px-3 text-body text-text placeholder:text-text-2 aria-invalid:border-sev-critical";
const smallBtn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-qa-panel border border-text-3 px-4 text-small font-bold text-text whitespace-nowrap hover:border-qa-accent";

function Lines({ items }: { items: ShopItem[] }) {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  return (
    <ul className="divide-y divide-line">
      {items.map((i) => (
        <li key={i.id} className="flex flex-wrap justify-between gap-x-4 py-2 text-small">
          <span>
            {i.name[locale]} <span className="font-mono text-text-2">×{i.qty}</span>
          </span>
          <span className="font-mono text-text-2">{t("gems", { count: i.price * i.qty })}</span>
        </li>
      ))}
    </ul>
  );
}

function Status({ children, tone = "ok" }: { children?: string; tone?: "ok" | "error" }) {
  return (
    <p role="status" className={`min-h-6 text-small ${tone === "error" ? "text-sev-critical" : "text-status-pass"}`}>
      {children}
    </p>
  );
}

// ---------- BUG-001: the button is never disabled, every click places its own order ----------
export function CheckoutWidget(p: WidgetProps<"checkout">) {
  const t = useTranslations("sections.qa-playground");
  const { items, balance: start, requestDelayMs } = p.scenario.setup;
  const total = sum(items);
  const [balance, setBalance] = useState(start);
  const [orders, setOrders] = useState<number[]>([]);
  const [pending, setPending] = useState(0);
  const pendingRef = useRef(0);
  const nextOrder = useRef(1);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  const { onFound } = p;

  useEffect(() => {
    const set = timers.current;
    return () => set.forEach(clearTimeout);
  }, []);

  const placeOrder = () => {
    // Defect: no `pending` guard and no disabled state.
    pendingRef.current += 1;
    setPending(pendingRef.current);
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      if (pendingRef.current > 1) onFound(); // another request from the same cart is still pending
      pendingRef.current -= 1;
      setPending(pendingRef.current);
      const n = nextOrder.current++;
      setOrders((o) => [...o, n]);
      setBalance((b) => b - total);
    }, requestDelayMs);
    timers.current.add(timer);
  };

  return (
    <div className="grid gap-4">
      <Lines items={items} />
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-small">
        <dt className="text-text-2">{t("total")}</dt>
        <dd className="font-mono">{t("gems", { count: total })}</dd>
        <dt className="text-text-2">{t("balance")}</dt>
        <dd className={`font-mono ${balance < 0 ? "text-sev-critical" : ""}`}>{t("gems", { count: balance })}</dd>
      </dl>
      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={placeOrder} className="btn btn-primary h-12 px-6">
          {t("placeOrder")}
        </button>
        <span className="font-mono text-mono text-text-2" aria-live="polite">
          {pending > 0 ? t("placing", { count: pending }) : ""}
        </span>
      </div>
      <div {...target(p, "orders-list")} className={ring(p)}>
        <h3 className="hud text-mono-xs text-text-3">{t("orders")}</h3>
        {orders.length === 0 ? (
          <p className="mt-2 text-small text-text-2">{t("noOrders")}</p>
        ) : (
          <ul className="mt-2 grid gap-1 font-mono text-mono">
            {orders.map((n) => (
              <li key={n} className="flex justify-between gap-4 rounded-qa bg-surface-2 px-3 py-2">
                <span>{t("order", { number: n })}</span>
                <span className="text-text-2">−{t("gems", { count: total })}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------- BUG-002: the promo percent is applied twice inside one calculation ----------
export function CartWidget(p: WidgetProps<"cart">) {
  const t = useTranslations("sections.qa-playground");
  const { items, promo } = p.scenario.setup;
  const id = useId();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState(false);
  const subtotal = sum(items);
  const rate = 1 - promo.percent / 100;
  const total = applied ? Math.round(subtotal * rate * rate) : subtotal; // defect: rate × rate
  const { onFound } = p;

  const apply = (e: FormEvent) => {
    e.preventDefault();
    if (code.trim().toUpperCase() !== promo.code) return setError(true);
    setError(false);
    setApplied(true);
    onFound();
  };

  return (
    <div className="grid gap-4">
      <Lines items={items} />
      <form onSubmit={apply} noValidate className="grid gap-1">
        <label htmlFor={`${id}-code`} className="text-small text-text-2">
          {t("promoLabel")}
        </label>
        <div className="flex flex-wrap gap-2">
          <input
            id={`${id}-code`}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            aria-invalid={error || undefined}
            aria-describedby={error ? `${id}-err` : undefined}
            autoComplete="off"
            placeholder={promo.code}
            className={`${input} max-w-60 flex-1 border-text-3 font-mono uppercase`}
          />
          <button type="submit" className={smallBtn}>
            {t("apply")}
          </button>
        </div>
        {error ? (
          <p id={`${id}-err`} className="text-small text-sev-critical">
            <span aria-hidden="true">✕ </span>
            {t("codeNotFound")}
          </p>
        ) : (
          <Status>{applied ? t("promoApplied", { code: promo.code }) : undefined}</Status>
        )}
      </form>
      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-small">
        <dt className="text-text-2">{t("subtotal")}</dt>
        <dd className="font-mono">{t("gems", { count: subtotal })}</dd>
        {applied && (
          <>
            <dt className="text-text-2">{t("discount")}</dt>
            <dd className="font-mono">−{t("gems", { count: subtotal - total })}</dd>
          </>
        )}
        <dt className="font-bold">{t("total")}</dt>
        <dd className="justify-self-start">
          <span {...target(p, "cart-total")} className={`font-mono font-bold ${ring(p)}`}>
            {t("gems", { count: total })}
          </span>
        </dd>
      </dl>
    </div>
  );
}

// ---------- BUG-003: the remove icon is a <div onClick> — no role, no name, not focusable ----------
export function InventoryWidget(p: WidgetProps<"inventory-list">) {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  const [items, setItems] = useState(p.scenario.setup.items);
  const [message, setMessage] = useState("");
  const [inspected, setInspected] = useState<string | null>(null);
  const tabbing = useRef(false);
  const visitedUse = useRef(false);
  const { onFound, inspect } = p;

  return (
    <div
      onKeyDown={(e) => {
        tabbing.current = e.key === "Tab";
      }}
      onFocus={(e) => {
        if (e.target instanceof HTMLElement && e.target.dataset.use && e.target.matches(":focus-visible")) visitedUse.current = true;
      }}
      onBlur={(e) => {
        // Keyboard pass: focus visited a "Use" button and left the widget via Tab — the remove icons were skipped.
        if (tabbing.current && visitedUse.current && !e.currentTarget.contains(e.relatedTarget as Node | null)) onFound();
        tabbing.current = false;
      }}
      className="grid gap-3"
    >
      {items.length === 0 ? (
        <p className="text-small text-text-2">{t("inventoryEmpty")}</p>
      ) : (
        <ul className="divide-y divide-line">
          {items.map((i) => (
            <li key={i.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2">
              <span className="flex-1 text-small">
                {i.name[locale]} <span className="font-mono text-text-2">×{i.qty}</span>
              </span>
              <button
                type="button"
                data-use="true"
                onClick={() => setMessage(t("used", { name: i.name[locale] }))}
                className={smallBtn}
              >
                {t("use")}
              </button>
              <span className="relative inline-flex">
                {/* PLANTED DEFECT (BUG-003): excluded from axe via [data-qa-demo-defect]. Correct: <button aria-label="Remove …">. */}
                <div
                  data-qa-demo-defect="BUG-003"
                  {...(i.id === "sword" ? target(p, "remove-sword") : {})}
                  onClick={() => {
                    if (inspect) {
                      setInspected(i.id);
                      onFound();
                    } else {
                      setItems((list) => list.filter((x) => x.id !== i.id));
                    }
                  }}
                  className={`grid size-11 cursor-pointer place-items-center rounded-qa text-text-2 hover:text-sev-critical ${
                    inspect ? "outline-1 outline-dashed outline-qa-accent" : ""
                  } ${i.id === "sword" ? ring(p) : ""}`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />
                  </svg>
                </div>
              </span>
              {inspect && inspected === i.id && (
                <span className="basis-full rounded-qa border border-line bg-surface-2 px-2 py-1 font-mono text-mono-xs text-text">
                  {t("inspectInfo")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
      <Status>{message}</Status>
    </div>
  );
}

// ---------- BUG-004: email is checked against buggyEmailPattern ("+" missing) ----------
export function RegistrationWidget(p: WidgetProps<"registration-form">) {
  const t = useTranslations("sections.qa-playground");
  const locale = useLocale();
  const { fields, validEmailPattern, buggyEmailPattern, teamSize } = p.scenario.setup;
  const id = useId();
  const empty = { nickname: "", email: "", teamSize: "" };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});
  const [done, setDone] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const { onFound } = p;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const { nickname, email } = values;
    const size = Number(values.teamSize);
    const next: typeof errors = {};
    if (nickname.trim().length < 3 || nickname.trim().length > 16) next.nickname = t("errNickname");
    const valid = new RegExp(validEmailPattern).test(email.trim());
    if (!new RegExp(buggyEmailPattern).test(email.trim())) next.email = t("errEmail"); // defect: wrong pattern
    if (valid && next.email) onFound();
    if (!/^\d+$/.test(values.teamSize.trim()) || size < teamSize.min || size > teamSize.max)
      next.teamSize = t("errTeamSize", teamSize);
    setErrors(next);
    setDone(Object.keys(next).length === 0);
    const firstInvalid = fields.find((f) => next[f.id]);
    if (firstInvalid) (formRef.current?.elements.namedItem(firstInvalid.id) as HTMLInputElement | null)?.focus();
    else setValues(empty);
  };

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="grid gap-4">
      {fields.map((f) => {
        const err = errors[f.id];
        const field = (
          <div key={f.id} className="grid gap-1">
            <label htmlFor={`${id}-${f.id}`} className="text-small text-text-2">
              {f.label[locale]}
            </label>
            <input
              id={`${id}-${f.id}`}
              name={f.id}
              type={f.id === "email" ? "email" : "text"}
              inputMode={f.id === "teamSize" ? "numeric" : undefined}
              autoComplete={f.id === "email" ? "email" : f.id === "nickname" ? "nickname" : "off"}
              placeholder={f.placeholder}
              value={values[f.id]}
              onChange={(e) => {
                setValues((v) => ({ ...v, [f.id]: e.target.value }));
                setDone(false);
              }}
              aria-invalid={err ? true : undefined}
              aria-describedby={err ? `${id}-${f.id}-err` : undefined}
              className={`${input} border-text-3`}
            />
            {err && (
              <p id={`${id}-${f.id}-err`} className="text-small text-sev-critical">
                <span aria-hidden="true">✕ </span>
                {err}
              </p>
            )}
          </div>
        );
        return f.id === "email" ? (
          <div key={f.id} {...target(p, "field-email")} className={ring(p)}>
            {field}
          </div>
        ) : (
          field
        );
      })}
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary h-12 px-6">
          {t("register")}
        </button>
        <Status>{done ? t("registered") : undefined}</Status>
      </div>
    </form>
  );
}

// ---------- BUG-005: fixed-width CTA with nowrap + overflow hidden clips the RU label ----------
export function ItemCardWidget(p: WidgetProps<"item-card">) {
  const t = useTranslations("sections.qa-playground");
  const { item, previewLocales, ctaLabel, ctaWidthPx } = p.scenario.setup;
  const [preview, setPreview] = useState<(typeof previewLocales)[number]>("en");
  const [count, setCount] = useState(0);
  const { onFound } = p;

  return (
    <div className="grid gap-4">
      <div role="group" aria-label={t("cardLanguage")} className="flex items-center gap-2">
        <span aria-hidden="true" className="hud text-mono-xs text-text-3">
          {t("cardLanguage")}
        </span>
        {previewLocales.map((l) => (
          <button
            key={l}
            type="button"
            aria-pressed={preview === l}
            onClick={() => {
              setPreview(l);
              if (l === "ru") onFound();
            }}
            className="hud text-mono-xs min-h-11 min-w-11 cursor-pointer rounded-qa border border-text-3 px-3 text-text-2 aria-pressed:border-qa-accent aria-pressed:text-text"
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid w-full max-w-64 gap-3 rounded-qa-panel border border-line bg-surface-2 p-4">
        <div aria-hidden="true" className="grid aspect-[4/3] place-items-center rounded-qa bg-bg font-mono text-h2 text-qa-accent">
          ⚔
        </div>
        <p lang={preview} className="font-bold">
          {item.name[preview]}
        </p>
        <p className="font-mono text-mono text-text-2">
          {t("price")}: {t("gems", { count: item.price })}
        </p>
        <span className={`justify-self-start ${ring(p)}`}>
          {/* PLANTED DEFECT (BUG-005): fixed width + nowrap + overflow hidden, no ellipsis. */}
          <button
            type="button"
            lang={preview}
            {...target(p, "card-cta")}
            onClick={() => setCount((c) => c + 1)}
            style={{ width: ctaWidthPx }}
            className="h-11 cursor-pointer overflow-hidden rounded-qa-panel bg-qa-accent-fill px-3 text-left text-small font-bold whitespace-nowrap text-white"
          >
            {ctaLabel[preview]}
          </button>
        </span>
      </div>
      <Status>{count > 0 ? t("inBag", { count }) : undefined}</Status>
    </div>
  );
}
