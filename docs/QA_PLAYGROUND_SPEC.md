# QA Playground — спецификация виджетов

Данные: `src/content/qa-scenarios.ts` (`qaScenarios`, `qaDisclaimer`, типы). Тексты отчётов, подсказок, заголовков — только оттуда; UI-строки виджетов (кнопки «Apply», «Register», ошибки) — в messages.
Все дефекты **демонстрационные**: вымышленный мини-магазин «Loot Shop». `qaDisclaimer` выводится рядом с заголовком секции, всегда видим.
Валюта — целые «gems» (кристаллы), без дробей. Environment в отчётах — значения демо-сцены.

## Общий поток

1. Каждый сценарий = отдельный виджет (таб/карусель в колонке demo UI, 7col). Над виджетом — `hint[locale]`.
2. Виджет ведёт собственное состояние; при наступлении `detect.trigger` он вызывает `onFound(scenario.id)` (один раз).
3. Кнопка **Report a Bug** у виджета:
   - если баг найден → открывается/разворачивается Bug report card (DESIGN_SYSTEM 4.10) со всеми полями `report`, полоса severity, `aria-live="polite"`: «Bug found: S2 Major»; callout на элемент `detect.target` (через `data-qa-target="<target>"`);
   - если не найден → мягкое сообщение «Not yet — keep looking» + `hint`, без раскрытия отчёта.
4. Ненайденные карточки справа — плейсхолдер `??? — not found yet`. Счётчик `found X / N`.
5. **Reveal all** — помечает все сценарии найденными (альтернатива для клавиатуры/скринридера). **Reset** — сбрасывает found и состояния всех виджетов к `setup`.
6. Severity: S1 ⬢ critical, S2 ▲ major, S3 ◆ minor, S4 ● trivial — цвет + форма + текст. Priority выводится текстом (`P1`…`P4`).
7. Поля карточки: ID, severity, priority, type, title, ENV (`app · browser · os · viewport · locale`), PRECONDITIONS, STEPS (нумерованный список), EXPECTED, ACTUAL, NOTES (содержит подсказку о вложении).
8. Виджеты — обычный HTML внутри секции, никаких реальных запросов/оплаты/хранилища; «сеть» — `setTimeout`.
9. Дефекты заложены только внутри виджетов. Сами виджеты (кроме намеренного дефекта) должны быть доступны: `<label>` у полей, ошибки через `aria-describedby` + `aria-invalid`, видимый фокус. Исключение — ровно элемент BUG-003.

## BUG-001 · checkout · `double-submit-duplicates-order` · S1

Состояние: `items`, `balance` (2000), `orders: []`, `pending: false`. Итог = Σ price×qty = 900.
- **Норма (для понимания)**: клик «Place order» → `pending=true`, кнопка `disabled` + «Placing…», через `requestDelayMs` (800) создаётся 1 заказ, balance −900.
- **Дефект**: кнопка НЕ блокируется; каждый клик запускает свой таймер → каждый создаёт заказ (`#1`, `#2`…) и списывает 900. Баланс может уйти в минус (не ограничивать).
- Список «My orders» (`data-qa-target="orders-list"`) и баланс видны.
- **detect** `duplicate-order-created`: создан заказ, когда другой запрос из той же корзины ещё был pending (т.е. ≥2 клика за 800 мс). Клавиатура: двойное Enter тоже работает.

## BUG-002 · cart · `discount-applied-twice` · S2

Подытог = 700 + 300 + 100×2 = 1200. Поле «Promo code» + «Apply».
- **Норма**: `LOOT10` (регистр игнорировать, trim) → Discount −120, Total 1080. Повторный Apply не меняет сумму. Неизвестный код → ошибка поля «Code not found».
- **Дефект**: total = subtotal × (1 − p) × (1 − p) = 972; Discount показывается как −228 (subtotal − total). Повторный Apply ничего не добавляет (дефект — именно двойное применение внутри одного расчёта). Округление: `Math.round`.
- Total — `data-qa-target="cart-total"`.
- **detect** `promo-applied`: успешно применён валидный код.

## BUG-003 · inventory-list · `remove-button-not-keyboard-accessible` · S2

Строки предметов: название, qty, кнопка «Use» (нормальная `<button>`) и иконка корзины.
- **Норма**: иконка — `<button aria-label="Remove {name}">`, фокус, Enter/Space удаляют строку.
- **Дефект**: иконка — `<div onClick>` с SVG без `role`, `tabIndex`, `aria-label`. Мышью удаляет, с клавиатуры недостижима. Для иконки у меча — `data-qa-target="remove-sword"`.
- **detect** `keyboard-pass-skipped-remove`: фокус пришёл в виджет с клавиатуры (Tab), побывал хотя бы на одной кнопке «Use» и покинул виджет по Tab (focusout за пределы контейнера) — ИЛИ клик по иконке в режиме inspect. Inspect-режим показывает тултип `role: — · name: — · focusable: no`.
- Важно для axe-проверок сайта: этот элемент — намеренное нарушение; исключить его из e2e axe через селектор `[data-qa-demo-defect]` (ставится только на него).

## BUG-004 · registration-form · `valid-email-rejected` · S3

Поля из `setup.fields`. Валидация на submit:
- nickname: обязателен, 3–16 символов.
- teamSize: целое, `min..max` (1–4).
- email: **дефект** — проверка по `buggyEmailPattern` вместо `validEmailPattern`. Ошибка «Enter a valid email».
- **Норма**: валидный ввод → сообщение «You're in!», форма сбрасывается.
- Поле email — `data-qa-target="field-email"`.
- **detect** `email-with-plus-rejected`: при submit email проходит `validEmailPattern`, но не проходит `buggyEmailPattern`. Шаблоны — строки, создавать `new RegExp(pattern)`.

## BUG-005 · item-card · `ru-label-truncated` · S4

Карточка предмета (название, цена, CTA). Внутри виджета свой переключатель превью `EN | RU` (`aria-pressed`), независимый от языка сайта — чтобы EN-посетитель тоже мог найти баг. Название предмета берётся из `item.name[preview]`.
- **Норма**: CTA с `min-width`, текст переносится или кнопка растёт.
- **Дефект**: CTA `width: ctaWidthPx` (120px), `white-space: nowrap; overflow: hidden;` (без ellipsis) → RU «Добавить в инвентарь» видно как «Добавить в инв». `aria-label` не ставить — полный текст остаётся в DOM (скринридер читает его целиком; это ожидаемо для визуального дефекта). CTA — `data-qa-target="card-cta"`; клик добавляет предмет (работает).
- **detect** `preview-locale-ru`: превью переключено на RU.

## Не реализуем

Свободную форму «напиши свой баг-репорт» — не нужна для MVP; при добавлении валидация по DESIGN_SYSTEM 4.10 (error state).
