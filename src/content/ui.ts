import type { Localized } from "./types";

// ponytail: interface strings missing from src/messages (owned by content-localization).
// Move them to messages as the keys in comments, then delete this file.
export const ui = {
  skipToContent: { en: "Skip to content", ru: "К содержимому" }, // a11y.skipToContent
  openMenu: { en: "Open menu", ru: "Открыть меню" }, // a11y.openMenu
  closeMenu: { en: "Close menu", ru: "Закрыть меню" }, // a11y.closeMenu
  opensInNewTab: { en: "(opens in new tab)", ru: "(откроется в новой вкладке)" }, // a11y.opensInNewTab
  dismiss: { en: "Dismiss", ru: "Закрыть" }, // a11y.dismiss
  labs: { en: "Labs", ru: "Лаборатории" }, // nav.labs
} satisfies Record<string, Localized>;
