// QA Playground: DEMO defects planted on purpose in a fictional mini-app ("Loot Shop").
// They are teaching examples, NOT real bugs of Sofia's projects. Behaviour spec: docs/QA_PLAYGROUND_SPEC.md
import type { Localized } from "./types";

export type Severity = "S1" | "S2" | "S3" | "S4";
export type Priority = "P1" | "P2" | "P3" | "P4";
export type BugType = "functional" | "validation" | "ui-localization" | "state-logic" | "accessibility";

/** Prices are integer in-game "gems" — no rounding questions. */
export interface ShopItem {
  id: string;
  name: Localized;
  price: number;
  qty: number;
}

export type WidgetSetup =
  | {
      widget: "cart";
      items: ShopItem[];
      promo: { code: string; percent: number };
      bug: "discount-applied-twice";
    }
  | {
      widget: "registration-form";
      fields: { id: "nickname" | "email" | "teamSize"; label: Localized; placeholder: string }[];
      /** What a correct implementation accepts. */
      validEmailPattern: string;
      /** What the buggy implementation actually uses ('+' is missing from the local part). */
      buggyEmailPattern: string;
      teamSize: { min: number; max: number };
      bug: "valid-email-rejected";
    }
  | {
      widget: "item-card";
      item: ShopItem;
      /** Widget-local language preview, independent of the site locale. */
      previewLocales: ["en", "ru"];
      ctaLabel: Localized;
      /** Fixed width of the CTA; with nowrap + overflow hidden the RU label is clipped. */
      ctaWidthPx: number;
      bug: "ru-label-truncated";
    }
  | {
      widget: "checkout";
      items: ShopItem[];
      balance: number;
      /** Fake network delay of "Place order". */
      requestDelayMs: number;
      bug: "double-submit-duplicates-order";
    }
  | {
      widget: "inventory-list";
      items: ShopItem[];
      bug: "remove-button-not-keyboard-accessible";
    };

/** Machine-readable rule: the frontend marks the bug as found when `trigger` happened. */
export interface DetectRule {
  trigger:
    | "promo-applied"
    | "email-with-plus-rejected"
    | "preview-locale-ru"
    | "duplicate-order-created"
    | "keyboard-pass-skipped-remove";
  /** Element id inside the widget to highlight with a callout once found. */
  target: string;
  description: Localized;
}

export interface BugReport {
  environment: { app: string; browser: string; os: string; viewport: string; locale: string };
  preconditions: Localized;
  steps: Localized<string[]>;
  expected: Localized;
  actual: Localized;
  notes: Localized;
}

export interface QaScenario {
  id: `BUG-${string}`;
  type: BugType;
  severity: Severity;
  priority: Priority;
  title: Localized;
  hint: Localized;
  setup: WidgetSetup;
  report: BugReport;
  detect: DetectRule;
}

/** Shown next to the section title. */
export const qaDisclaimer: Localized = {
  en: "Demo defects: planted on purpose in a fictional mini-shop for this portfolio. Not bugs from real projects.",
  ru: "Демонстрационные дефекты: специально заложены в вымышленный мини-магазин для портфолио. Это не баги реальных проектов.",
};

// Environment values describe the demo scene, not a real test run.
const env = (locale: string, viewport = "1440×900") => ({
  app: "Loot Shop demo v0.1 (portfolio sandbox)",
  browser: "Chrome (latest stable)",
  os: "Windows 11",
  viewport,
  locale,
});

const sword: ShopItem = { id: "sword", name: { en: "Ember Sword", ru: "Огненный меч" }, price: 700, qty: 1 };
const shield: ShopItem = { id: "shield", name: { en: "Oak Shield", ru: "Дубовый щит" }, price: 300, qty: 1 };
const potion: ShopItem = { id: "potion", name: { en: "Health Potion", ru: "Зелье здоровья" }, price: 100, qty: 2 };

export const qaScenarios: QaScenario[] = [
  {
    id: "BUG-001",
    type: "state-logic",
    severity: "S1",
    priority: "P1",
    title: {
      en: "Double-clicking \"Place order\" creates two orders and charges gems twice",
      ru: "Двойной клик по «Оформить заказ» создаёт два заказа и списывает кристаллы дважды",
    },
    hint: {
      en: "Checkout. What happens if you are impatient with the button?",
      ru: "Оформление заказа. Что будет, если нетерпеливо нажимать кнопку?",
    },
    setup: { widget: "checkout", items: [sword, potion], balance: 2000, requestDelayMs: 800, bug: "double-submit-duplicates-order" },
    report: {
      environment: env("en-US"),
      preconditions: {
        en: "Cart contains Ember Sword ×1 and Health Potion ×2 (total 900 gems). Balance: 2000 gems.",
        ru: "В корзине Огненный меч ×1 и Зелье здоровья ×2 (итого 900 кристаллов). Баланс: 2000 кристаллов.",
      },
      steps: {
        en: ["Open the Checkout widget.", "Double-click \"Place order\" quickly (two clicks within ~0.5 s).", "Wait for the request to finish and check \"My orders\" and the balance."],
        ru: ["Открыть виджет «Оформление заказа».", "Быстро дважды кликнуть «Оформить заказ» (два клика за ~0,5 с).", "Дождаться ответа и проверить «Мои заказы» и баланс."],
      },
      expected: {
        en: "One order is created. The button is disabled with a loading state after the first click. Balance: 1100 gems.",
        ru: "Создаётся один заказ. После первого клика кнопка блокируется и показывает загрузку. Баланс: 1100 кристаллов.",
      },
      actual: {
        en: "Two identical orders (#1, #2) are created. Balance: 200 gems — 900 gems charged twice.",
        ru: "Создаются два одинаковых заказа (#1, #2). Баланс: 200 кристаллов — 900 списано дважды.",
      },
      notes: {
        en: "Reproducible 5/5. Root cause guess: no disable/idempotency on submit. With balance < 1800 the second charge drives the balance negative. Attachment: screen recording of the double click + orders list.",
        ru: "Воспроизводится 5/5. Предположительно нет блокировки кнопки / идемпотентности запроса. При балансе < 1800 второе списание уводит баланс в минус. Вложение: запись экрана с двойным кликом и списком заказов.",
      },
    },
    detect: {
      trigger: "duplicate-order-created",
      target: "orders-list",
      description: {
        en: "Found when a second order is created from the same cart while the first request is still pending.",
        ru: "Найден, когда из той же корзины создан второй заказ, пока первый запрос ещё не завершён.",
      },
    },
  },
  {
    id: "BUG-002",
    type: "functional",
    severity: "S2",
    priority: "P1",
    title: {
      en: "Promo code LOOT10 applies a 19% discount instead of 10%",
      ru: "Промокод LOOT10 даёт скидку 19% вместо 10%",
    },
    hint: {
      en: "Cart. Do the math on the total after the promo code.",
      ru: "Корзина. Пересчитайте итог после промокода.",
    },
    setup: { widget: "cart", items: [sword, shield, potion], promo: { code: "LOOT10", percent: 10 }, bug: "discount-applied-twice" },
    report: {
      environment: env("en-US"),
      preconditions: {
        en: "Cart: Ember Sword 700 ×1, Oak Shield 300 ×1, Health Potion 100 ×2. Subtotal 1200 gems.",
        ru: "Корзина: Огненный меч 700 ×1, Дубовый щит 300 ×1, Зелье здоровья 100 ×2. Подытог 1200 кристаллов.",
      },
      steps: {
        en: ["Open the Cart widget.", "Enter \"LOOT10\" in the Promo code field.", "Click \"Apply\".", "Compare Discount and Total with the subtotal."],
        ru: ["Открыть виджет «Корзина».", "Ввести «LOOT10» в поле «Промокод».", "Нажать «Применить».", "Сравнить «Скидку» и «Итого» с подытогом."],
      },
      expected: {
        en: "Discount: −120 gems (10%). Total: 1080 gems.",
        ru: "Скидка: −120 кристаллов (10%). Итого: 1080 кристаллов.",
      },
      actual: {
        en: "Discount: −228 gems. Total: 972 gems — 10% is applied twice (1200 × 0.9 × 0.9).",
        ru: "Скидка: −228 кристаллов. Итого: 972 кристалла — 10% применяется дважды (1200 × 0,9 × 0,9).",
      },
      notes: {
        en: "Reproducible 5/5, independent of cart contents. Revenue impact: every promo order is under-charged. Attachment: screenshot of the cart summary.",
        ru: "Воспроизводится 5/5, не зависит от состава корзины. Влияние: каждый заказ с промокодом недоплачивается. Вложение: скриншот итогов корзины.",
      },
    },
    detect: {
      trigger: "promo-applied",
      target: "cart-total",
      description: {
        en: "Found when a valid promo code is applied (the wrong total appears immediately).",
        ru: "Найден, когда применён валидный промокод (неверный итог появляется сразу).",
      },
    },
  },
  {
    id: "BUG-003",
    type: "accessibility",
    severity: "S2",
    priority: "P2",
    title: {
      en: "\"Remove item\" icon button is unreachable by keyboard and has no accessible name",
      ru: "Иконка «Удалить предмет» недоступна с клавиатуры и не имеет доступного имени",
    },
    hint: {
      en: "Inventory. Put the mouse away and try to remove an item using only Tab and Enter.",
      ru: "Инвентарь. Уберите мышь и попробуйте удалить предмет только через Tab и Enter.",
    },
    setup: { widget: "inventory-list", items: [sword, shield, potion], bug: "remove-button-not-keyboard-accessible" },
    report: {
      environment: env("en-US"),
      preconditions: {
        en: "Inventory contains 3 items. Keyboard only, no mouse. (Also checked with a screen reader.)",
        ru: "В инвентаре 3 предмета. Только клавиатура, без мыши. (Дополнительно проверено скринридером.)",
      },
      steps: {
        en: ["Open the Inventory widget.", "Press Tab repeatedly through the item rows.", "Try to focus the trash icon next to \"Ember Sword\" and press Enter."],
        ru: ["Открыть виджет «Инвентарь».", "Нажимать Tab, проходя по строкам предметов.", "Попытаться сфокусировать иконку корзины у «Огненного меча» и нажать Enter."],
      },
      expected: {
        en: "The trash icon receives visible focus, is announced as \"Remove Ember Sword, button\", and Enter/Space removes the item.",
        ru: "Иконка получает видимый фокус, озвучивается как «Удалить Огненный меч, кнопка», Enter/Space удаляет предмет.",
      },
      actual: {
        en: "Focus skips the trash icons entirely; the item cannot be removed without a mouse. The element has no role or accessible name.",
        ru: "Фокус перескакивает иконки корзины; удалить предмет без мыши нельзя. У элемента нет роли и доступного имени.",
      },
      notes: {
        en: "The icon is a <div onClick> instead of <button aria-label=\"…\">. Violates WCAG 2.1.1 Keyboard and 4.1.2 Name, Role, Value. Mouse users are not affected.",
        ru: "Иконка — <div onClick> вместо <button aria-label=\"…\">. Нарушение WCAG 2.1.1 Keyboard и 4.1.2 Name, Role, Value. Пользователи мыши не затронуты.",
      },
    },
    detect: {
      trigger: "keyboard-pass-skipped-remove",
      target: "remove-sword",
      description: {
        en: "Found when focus leaves the widget via Tab after visiting the rows (the remove icons were skipped), or when the remove icon is clicked in inspect mode.",
        ru: "Найден, когда фокус покидает виджет по Tab после прохода по строкам (иконки удаления пропущены) или когда иконку кликают в режиме инспекции.",
      },
    },
  },
  {
    id: "BUG-004",
    type: "validation",
    severity: "S3",
    priority: "P3",
    title: {
      en: "Tournament sign-up rejects valid emails containing \"+\"",
      ru: "Регистрация на турнир отклоняет валидные email со знаком «+»",
    },
    hint: {
      en: "Tournament sign-up. Is every valid email really accepted?",
      ru: "Регистрация на турнир. Все ли валидные email принимаются?",
    },
    setup: {
      widget: "registration-form",
      fields: [
        { id: "nickname", label: { en: "Nickname", ru: "Никнейм" }, placeholder: "PixelKnight" },
        { id: "email", label: { en: "Email", ru: "Email" }, placeholder: "player+cup@example.com" },
        { id: "teamSize", label: { en: "Team size", ru: "Размер команды" }, placeholder: "1–4" },
      ],
      validEmailPattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$",
      buggyEmailPattern: "^[A-Za-z0-9._-]+@[^\\s@]+\\.[^\\s@]+$",
      teamSize: { min: 1, max: 4 },
      bug: "valid-email-rejected",
    },
    report: {
      environment: env("en-US"),
      preconditions: {
        en: "Tournament sign-up form is open and empty.",
        ru: "Открыта пустая форма регистрации на турнир.",
      },
      steps: {
        en: ["Enter Nickname: \"PixelKnight\".", "Enter Email: \"player+cup@example.com\".", "Enter Team size: \"2\".", "Click \"Register\"."],
        ru: ["Ввести Никнейм: «PixelKnight».", "Ввести Email: «player+cup@example.com».", "Ввести Размер команды: «2».", "Нажать «Зарегистрироваться»."],
      },
      expected: {
        en: "The form is submitted; confirmation \"You're in!\" is shown. \"+\" is a valid character in the local part (RFC 5322).",
        ru: "Форма отправляется, показывается подтверждение «Вы в игре!». «+» — допустимый символ в локальной части адреса (RFC 5322).",
      },
      actual: {
        en: "Error under Email: \"Enter a valid email\". The form is not submitted.",
        ru: "Ошибка под полем Email: «Введите корректный email». Форма не отправляется.",
      },
      notes: {
        en: "Workaround: use an address without \"+\". Same email without \"+\" (playercup@example.com) is accepted. Plus-addressing is common for Gmail users.",
        ru: "Обходной путь: адрес без «+». Тот же адрес без «+» (playercup@example.com) принимается. Plus-адресация распространена у пользователей Gmail.",
      },
    },
    detect: {
      trigger: "email-with-plus-rejected",
      target: "field-email",
      description: {
        en: "Found when the user submits an email that the correct pattern accepts but the buggy one rejects (contains \"+\").",
        ru: "Найден, когда отправлен email, который корректный шаблон принимает, а ошибочный отклоняет (содержит «+»).",
      },
    },
  },
  {
    id: "BUG-005",
    type: "ui-localization",
    severity: "S4",
    priority: "P3",
    title: {
      en: "RU: \"Add to inventory\" button label is clipped on the item card",
      ru: "RU: подпись кнопки «Добавить в инвентарь» обрезана на карточке предмета",
    },
    hint: {
      en: "Item card. Switch the card's language to RU and read every label.",
      ru: "Карточка предмета. Переключите язык карточки на RU и прочитайте все подписи.",
    },
    setup: {
      widget: "item-card",
      item: sword,
      previewLocales: ["en", "ru"],
      ctaLabel: { en: "Add to bag", ru: "Добавить в инвентарь" },
      ctaWidthPx: 120,
      bug: "ru-label-truncated",
    },
    report: {
      environment: env("ru-RU"),
      preconditions: {
        en: "Item card \"Ember Sword\" is displayed.",
        ru: "Отображается карточка предмета «Огненный меч».",
      },
      steps: {
        en: ["Open the Item card widget.", "Switch the card language to RU.", "Look at the primary button label."],
        ru: ["Открыть виджет «Карточка предмета».", "Переключить язык карточки на RU.", "Посмотреть на подпись основной кнопки."],
      },
      expected: {
        en: "The full label \"Добавить в инвентарь\" is visible (button grows or text wraps).",
        ru: "Подпись «Добавить в инвентарь» видна полностью (кнопка расширяется или текст переносится).",
      },
      actual: {
        en: "The label is clipped to \"Добавить в инв\"; the rest is hidden. EN label \"Add to bag\" fits.",
        ru: "Подпись обрезана до «Добавить в инв», остальное скрыто. EN-подпись «Add to bag» помещается.",
      },
      notes: {
        en: "Cosmetic: the button still works. Cause: fixed width 120px + white-space: nowrap + overflow: hidden. RU strings are typically 20–30% longer — check other fixed-width buttons too.",
        ru: "Косметика: кнопка работает. Причина: фиксированная ширина 120px + white-space: nowrap + overflow: hidden. RU-строки обычно на 20–30% длиннее — проверить другие кнопки с фиксированной шириной.",
      },
    },
    detect: {
      trigger: "preview-locale-ru",
      target: "card-cta",
      description: {
        en: "Found when the card preview is switched to RU (the clipped label becomes visible).",
        ru: "Найден, когда превью карточки переключено на RU (появляется обрезанная подпись).",
      },
    },
  },
];
