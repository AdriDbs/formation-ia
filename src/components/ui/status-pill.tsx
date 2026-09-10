import { useTranslations } from "next-intl";
import type { ModuleStatus } from "@/lib/modules/progress";
import { cn } from "@/lib/cn";

const styles: Record<ModuleStatus, string> = {
  completed: "bg-ink text-white",
  available: "bg-accent text-white",
  locked: "bg-white text-muted border border-border",
};

export function StatusPill({ status }: { status: ModuleStatus }) {
  const t = useTranslations("status");
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status]
      )}
    >
      {t(status)}
    </span>
  );
}
