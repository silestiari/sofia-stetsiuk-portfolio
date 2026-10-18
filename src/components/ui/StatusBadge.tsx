import { useTranslations } from "next-intl";
import type { ProjectStatus } from "@/content/types";

// Color + shape + text, never color alone (DESIGN_SYSTEM.md 4.7).
const look: Record<ProjectStatus, { icon: string; cls: string }> = {
  released: { icon: "●", cls: "text-status-pass border-status-pass" },
  "in-development": { icon: "◐", cls: "text-game-sky border-game-sky" },
  prototype: { icon: "◇", cls: "text-text-2 border-text-2" },
  unconfirmed: { icon: "○", cls: "text-text-3 border-text-3 border-dashed" },
};

/** Non-interactive status badge; label comes from messages (project.status.*). */
/** `pet`: pastel island — ink text on mint, the shape keeps the meaning (DESIGN_SYSTEM.md 4.7). */
export function StatusBadge({ status = "unconfirmed", pet = false }: { status?: ProjectStatus; pet?: boolean }) {
  const t = useTranslations("project.status");
  const { icon, cls } = look[status];
  return (
    <span className={`hud text-mono-xs inline-flex h-6 items-center gap-1.5 rounded-qa border px-2 ${pet ? "border-pet-ink/30 bg-pet-mint text-pet-ink" : cls}`}>
      <span aria-hidden="true">{icon}</span>
      {t(status)}
    </span>
  );
}
