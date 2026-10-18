import { useTranslations } from "next-intl";
import type { ProjectStatus } from "@/content/types";

// Shape + text, never colour alone. Lime only for the "pass"-like released state.
const look: Record<ProjectStatus, { icon: string; cls: string }> = {
  released: { icon: "●", cls: "text-status-pass border-status-pass" },
  "in-development": { icon: "◐", cls: "text-text border-text" },
  prototype: { icon: "◇", cls: "text-text-2 border-line-strong" },
  unconfirmed: { icon: "○", cls: "text-text-3 border-line-strong border-dashed" },
};

/** Non-interactive status pill; label comes from messages (project.status.*). */
export function StatusBadge({ status = "unconfirmed" }: { status?: ProjectStatus }) {
  const t = useTranslations("project.status");
  const { icon, cls } = look[status];
  return (
    <span className={`hud text-mono-xs inline-flex h-7 items-center gap-1.5 rounded-full border px-3 ${cls}`}>
      <span aria-hidden="true">{icon}</span>
      {t(status)}
    </span>
  );
}
