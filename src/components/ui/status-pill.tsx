import type { ModuleStatus } from "@/lib/modules/progress";
import { cn } from "@/lib/cn";

const config: Record<ModuleStatus, { label: string; className: string }> = {
  completed: { label: "Terminé", className: "bg-ink text-white" },
  available: { label: "Disponible", className: "bg-accent text-white" },
  locked: {
    label: "Verrouillé",
    className: "bg-white text-muted border border-border",
  },
};

export function StatusPill({ status }: { status: ModuleStatus }) {
  const { label, className } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[var(--radius-pill)] px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        className
      )}
    >
      {label}
    </span>
  );
}
