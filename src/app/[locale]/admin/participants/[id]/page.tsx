import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { users, modules, moduleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { computeDayStatuses } from "@/lib/modules/progress";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

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

  const day1 = computeDayStatuses(allModules.filter((m) => m.day === 1), completedIds);
  const day2 = computeDayStatuses(allModules.filter((m) => m.day === 2), completedIds);

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin"
        className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
      >
        {t("common.backToList")}
      </Link>

      <div>
        <h1 className="text-2xl font-bold">{participant.name ?? participant.email}</h1>
        <p className="text-sm text-muted">
          {participant.email} · {participant.team ?? "—"} ·{" "}
          {participant.level ? t(`levels.${participant.level}`) : "—"}
        </p>
      </div>

      <ModuleTable title={t("dashboard.day1")} dayModules={day1} />
      <ModuleTable title={t("dashboard.day2")} dayModules={day2} />
    </div>
  );
}

async function ModuleTable({
  title,
  dayModules,
}: {
  title: string;
  dayModules: ReturnType<typeof computeDayStatuses>;
}) {
  if (dayModules.length === 0) return null;
  const t = await getTranslations();

  return (
    <section>
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
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
            {dayModules
              .filter((m) => m.type !== "pause")
              .map((m) => (
                <tr key={m.id} className="border-b border-border last:border-0">
                  <td className="px-6 py-3 font-medium">{m.title}</td>
                  <td className="px-6 py-3 text-muted">{t(`types.${m.type}`)}</td>
                  <td className="px-6 py-3">
                    {m.type === "prerequis" ? (
                      <span className="text-xs text-muted">—</span>
                    ) : (
                      <StatusPill status={m.status} />
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </Card>
    </section>
  );
}
