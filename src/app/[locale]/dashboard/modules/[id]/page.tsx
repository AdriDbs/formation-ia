import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { modules, moduleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { computeDayStatuses } from "@/lib/modules/progress";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ModuleCompletionForm } from "./completion-form";

export default async function ModulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const moduleId = Number(id);
  if (!Number.isInteger(moduleId)) notFound();

  const user = await requireOnboardedParticipant();
  const t = await getTranslations();

  const [module] = await db.select().from(modules).where(eq(modules.id, moduleId));
  if (!module) notFound();

  const dayModules = await db.select().from(modules).where(eq(modules.day, module.day));
  const completedRows = await db
    .select({ moduleId: moduleProgress.moduleId })
    .from(moduleProgress)
    .where(eq(moduleProgress.userId, user.id));
  const completedIds = new Set(completedRows.map((r) => r.moduleId));

  const withStatus = computeDayStatuses(dayModules, completedIds);
  const current = withStatus.find((m) => m.id === moduleId)!;

  if (current.status === "locked") notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
      >
        {t("common.backToDashboard")}
      </Link>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-taupe">
            {t(`dashboard.day${module.day}`)} · {t(`types.${module.type}`)}
          </span>
          <StatusPill status={current.status} />
        </div>

        <h1 className="mb-4 text-2xl font-bold">{module.title}</h1>

        {module.description && (
          <p className="mb-8 whitespace-pre-line text-sm text-muted">
            {module.description}
          </p>
        )}

        <div className="border border-dashed border-border bg-surface-muted px-6 py-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted">
            {t("module.underConstructionTitle")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("module.underConstructionBody")}</p>
        </div>

        {module.type !== "prerequis" && (
          <div className="mt-8">
            <ModuleCompletionForm
              moduleId={module.id}
              completed={current.status === "completed"}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
