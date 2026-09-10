import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconBook, IconFlask, IconCheck, IconChevronDown } from "@/components/icons";
import { CATEGORY_ICONS, type CategoryId } from "@/lib/modules/categories";
import type { ModuleWithStatus } from "@/lib/modules/progress";
import { cn } from "@/lib/cn";

const TYPE_ICONS = {
  theorique: IconBook,
  pratique: IconFlask,
} as const;

export async function CategorySection({
  categoryId,
  modules,
}: {
  categoryId: string;
  modules: ModuleWithStatus[];
}) {
  const t = await getTranslations();
  const Icon = CATEGORY_ICONS[categoryId as CategoryId] ?? IconBook;

  const sequential = modules.filter((m) => m.type !== "pause" && m.type !== "prerequis");
  const done = sequential.filter((m) => m.status === "completed").length;
  // Replié par défaut si aucun module n'est encore atteignable (catégorie future) —
  // ouvert sinon pour garder l'utilisateur concentré sur ce qui le concerne.
  const defaultOpen = modules.some((m) => m.status !== "locked");

  return (
    <section>
      <details open={defaultOpen} className="group/cat">
        <summary className="mb-4 flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-white">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold">
                {t(`categories.${categoryId}.title`)}
              </h2>
              <p className="text-xs text-muted">
                {t(`categories.${categoryId}.description`)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {sequential.length > 0 && (
              <div className="hidden w-32 shrink-0 sm:block">
                <div className="mb-1 text-right text-xs font-semibold text-muted">
                  {t("dashboard.modulesCompleted", { done, total: sequential.length })}
                </div>
                <ProgressBar percent={sequential.length ? (done / sequential.length) * 100 : 0} />
              </div>
            )}
            <IconChevronDown className="h-5 w-5 shrink-0 text-muted transition-transform group-open/cat:rotate-180" />
          </div>
        </summary>

        <ol className="flex flex-col">
          {modules.map((module, index) => {
            if (module.type === "pause") {
              return (
                <li key={module.id} className="flex items-center gap-3 py-3 pl-5 text-xs text-muted">
                  <span className="h-px flex-1 bg-border" />
                  {module.title}
                  <span className="h-px flex-1 bg-border" />
                </li>
              );
            }

            const isPrereq = module.type === "prerequis";
            const isLast = index === modules.length - 1;
            const TypeIcon = isPrereq
              ? IconCheck
              : TYPE_ICONS[module.type as "theorique" | "pratique"];
            const clickable = module.status !== "locked";

            const node = (
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center border-2",
                      module.status === "completed"
                        ? "border-ink bg-ink text-white"
                        : module.status === "available"
                          ? "border-accent text-accent"
                          : "border-border text-muted"
                    )}
                  >
                    {module.status === "completed" ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <TypeIcon className="h-4 w-4" />
                    )}
                  </span>
                  {!isLast && <span className="w-px flex-1 bg-border" />}
                </div>

                <Card
                  className={cn(
                    "mb-3 flex-1",
                    module.status === "locked"
                      ? "opacity-60"
                      : "transition-colors hover:border-ink"
                  )}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      {!isPrereq && (
                        <span className="text-xs font-semibold uppercase tracking-wide text-taupe">
                          {t(`types.${module.type}`)}
                        </span>
                      )}
                      <h3 className="truncate font-semibold">{module.title}</h3>
                    </div>
                    {!isPrereq && <StatusPill status={module.status} />}
                  </div>
                </Card>
              </div>
            );

            if (!clickable) {
              return <li key={module.id}>{node}</li>;
            }

            return (
              <li key={module.id}>
                <Link href={`/dashboard/modules/${module.id}`} className="block">
                  {node}
                </Link>
              </li>
            );
          })}
        </ol>
      </details>
    </section>
  );
}
