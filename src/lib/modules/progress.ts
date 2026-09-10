import type { modules as modulesTable } from "@/lib/db/schema";

export type ModuleRow = typeof modulesTable.$inferSelect;

export type ModuleStatus = "locked" | "available" | "completed";

export type ModuleWithStatus = ModuleRow & { status: ModuleStatus };

/**
 * Calcule l'état de chaque module d'une journée à partir des modules
 * complétés par l'utilisateur. Les modules de type "pause" sont des
 * séparateurs décoratifs : ils sont ignorés dans le calcul de
 * déblocage mais renvoyés avec le statut "completed" pour ne jamais
 * bloquer visuellement l'affichage. Les modules "prerequis" sont
 * toujours affichés comme non bloquants (statut "available").
 */
export function computeDayStatuses(
  dayModules: ModuleRow[],
  completedModuleIds: Set<number>
): ModuleWithStatus[] {
  const sorted = [...dayModules].sort((a, b) => a.position - b.position);

  let previousSequentialCompleted = true;

  return sorted.map((module) => {
    if (module.type === "pause") {
      return { ...module, status: "completed" as const };
    }
    if (module.type === "prerequis") {
      return { ...module, status: "available" as const };
    }

    const isCompleted = completedModuleIds.has(module.id);
    let status: ModuleStatus;
    if (isCompleted) {
      status = "completed";
    } else if (previousSequentialCompleted) {
      status = "available";
    } else {
      status = "locked";
    }

    previousSequentialCompleted = isCompleted;
    return { ...module, status };
  });
}

export function progressPercent(dayModules: ModuleWithStatus[]) {
  const sequential = dayModules.filter(
    (m) => m.type !== "pause" && m.type !== "prerequis"
  );
  if (sequential.length === 0) return 0;
  const done = sequential.filter((m) => m.status === "completed").length;
  return Math.round((done / sequential.length) * 100);
}
