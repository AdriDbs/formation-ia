import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, modules, moduleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { computeModuleStatuses, progressPercent } from "@/lib/modules/progress";
import { groupByCategory, CATEGORY_ICONS, type CategoryId } from "@/lib/modules/categories";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { IconBook, IconFlask, IconCheck, IconChevronDown } from "@/components/icons";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const TYPE_ICONS = {
  theorique: IconBook,
  pratique: IconFlask,
} as const;

export default async function ParticipantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = Number(id);
  if (!Number.isInteger(userId)) notFound();

  const t = await getTranslations();

  const [participant] = await db.select().from(users).where(eq(users.id, userId));
  if (!participant) notFound();

  const allModules = await db.select().from(modules);
  const completedRows = await db
    .select({ moduleId: moduleProgress.moduleId })
    .from(moduleProgress)
    .where(eq(moduleProgress.userId, userId));
  const completedIds = new Set(completedRows.map((r) => r.moduleId));

  const withStatus = computeModuleStatuses(allModules, completedIds);
  const overallPercent = progressPercent(withStatus);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin"
        className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
      >
        {t("common.backToList")}
      </Link>

      <div className="flex flex-col gap-6 border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-taupe">
            {participant.email} · {participant.team ?? "—"}
          </p>
          <h1 className="text-2xl font-bold">
            {participant.name ?? participant.email}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {participant.level ? t(`levels.${participant.level}`) : "—"}
          </p>
        </div>
        <div className="w-full shrink-0 sm:w-48">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted">
              {t("dashboard.overallProgress")}
            </span>
            <span className="text-lg font-bold">{overallPercent}%</span>
          </div>
          <ProgressBar percent={overallPercent} />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {groupByCategory(withStatus).map((group) => (
          <AdminCategorySection key={group.id} categoryId={group.id} modules={group.modules} />
        ))}
      </div>
    </div>
  );
}

async function AdminCategorySection({
  categoryId,
  modules,
}: {
  categoryId: string;
  modules: ReturnType<typeof computeModuleStatuses>;
}) {
  const t = await getTranslations();
  const Icon = CATEGORY_ICONS[categoryId as CategoryId] ?? IconBook;
  const sequential = modules.filter((m) => m.type !== "pause" && m.type !== "prerequis");
  const done = sequential.filter((m) => m.status === "completed").length;

  return (
    <details open={done > 0} className="group/cat">
      <summary className="mb-3 flex cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink text-white">
            <Icon className="h-4 w-4" />
          </span>
          <h2 className="text-sm font-bold">{t(`categories.${categoryId}.title`)}</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted">
            {t("dashboard.modulesCompleted", { done, total: sequential.length })}
          </span>
          <IconChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform group-open/cat:rotate-180" />
        </div>
      </summary>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-6 py-3">{t("admin.table.module")}</th>
              <th className="px-6 py-3">{t("admin.table.type")}</th>
              <th className="px-6 py-3">{t("admin.table.status")}</th>
            </tr>
          </thead>
          <tbody>
            {modules
              .filter((m) => m.type !== "pause")
              .map((m) => {
                const isPrereq = m.type === "prerequis";
                const TypeIcon = isPrereq
                  ? IconCheck
                  : TYPE_ICONS[m.type as "theorique" | "pratique"];
                return (
                  <tr key={m.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 font-medium">
                        <TypeIcon className="h-4 w-4 shrink-0 text-muted" />
                        {m.title}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-muted">{t(`types.${m.type}`)}</td>
                    <td className="px-6 py-3">
                      {isPrereq ? (
                        <span className="text-xs text-muted">—</span>
                      ) : (
                        <StatusPill status={m.status} />
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </Card>
    </details>
  );
}
