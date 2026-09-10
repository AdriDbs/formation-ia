import { db } from "@/lib/db";
import { users, modules, moduleProgress } from "@/lib/db/schema";
import { computeModuleStatuses, progressPercent } from "@/lib/modules/progress";
import { CATEGORY_ORDER } from "@/lib/modules/categories";
import { ProgressBar } from "@/components/ui/progress-bar";
import { BarChart } from "@/components/ui/bar-chart";
import { Card } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function AdminPage() {
  const t = await getTranslations();

  const [allUsers, allModules, allProgress] = await Promise.all([
    db.select().from(users),
    db.select().from(modules),
    db.select().from(moduleProgress),
  ]);

  const participants = allUsers
    .map((u) => {
      const completedIds = new Set(
        allProgress.filter((p) => p.userId === u.id).map((p) => p.moduleId)
      );
      const withStatus = computeModuleStatuses(allModules, completedIds);
      return { user: u, percent: progressPercent(withStatus), withStatus };
    })
    .sort((a, b) => (a.user.name ?? "").localeCompare(b.user.name ?? ""));

  const avgProgress = participants.length
    ? Math.round(
        participants.reduce((sum, p) => sum + p.percent, 0) / participants.length
      )
    : 0;
  const completedCount = participants.filter((p) => p.percent === 100).length;

  const categoryAverages = CATEGORY_ORDER.map((categoryId) => {
    const percents = participants.map((p) => {
      const categoryModules = p.withStatus.filter((m) => m.category === categoryId);
      return progressPercent(categoryModules);
    });
    const avg = percents.length
      ? Math.round(percents.reduce((sum, v) => sum + v, 0) / percents.length)
      : 0;
    return { label: t(`categories.${categoryId}.title`), percent: avg };
  });

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.overview.title")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Kpi label={t("admin.overview.participantsLabel")} value={String(participants.length)} />
        <Kpi label={t("admin.overview.avgProgressLabel")} value={`${avgProgress}%`} />
        <Kpi label={t("admin.overview.completedLabel")} value={String(completedCount)} />
      </div>

      <Card>
        <h2 className="mb-6 text-sm font-bold uppercase tracking-wide">
          {t("admin.overview.byCategoryTitle")}
        </h2>
        <BarChart data={categoryAverages} />
      </Card>

      <div>
        <h2 className="mb-4 text-xl font-bold">{t("admin.participantsTitle")}</h2>

        {participants.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">{t("admin.noParticipants")}</p>
          </Card>
        ) : (
          <Card className="overflow-x-auto p-0">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
                  <th className="px-6 py-3">{t("admin.table.name")}</th>
                  <th className="px-6 py-3">{t("admin.table.team")}</th>
                  <th className="px-6 py-3">{t("admin.table.level")}</th>
                  <th className="px-6 py-3">{t("admin.table.progress")}</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(({ user, percent }) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="px-6 py-3">
                      <Link
                        href={`/admin/participants/${user.id}`}
                        className="font-semibold hover:text-accent"
                      >
                        {user.name ?? user.email}
                      </Link>
                    </td>
                    <td className="px-6 py-3 text-muted">{user.team ?? "—"}</td>
                    <td className="px-6 py-3 text-muted">
                      {user.level ? t(`levels.${user.level}`) : "—"}
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-32">
                          <ProgressBar percent={percent} />
                        </div>
                        <span className="text-xs text-muted">{percent}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </Card>
  );
}
