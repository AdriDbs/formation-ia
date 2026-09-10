import { db } from "@/lib/db";
import { modules, moduleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { computeDayStatuses, progressPercent } from "@/lib/modules/progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card } from "@/components/ui/card";
import { StatusPill } from "@/components/ui/status-pill";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
  const user = await requireOnboardedParticipant();
  const t = await getTranslations();

  const allModules = await db.select().from(modules);
  const completedRows = await db
    .select({ moduleId: moduleProgress.moduleId })
    .from(moduleProgress)
    .where(eq(moduleProgress.userId, user.id));
  const completedIds = new Set(completedRows.map((r) => r.moduleId));

  const day1 = computeDayStatuses(
    allModules.filter((m) => m.day === 1),
    completedIds
  );
  const day2 = computeDayStatuses(
    allModules.filter((m) => m.day === 2),
    completedIds
  );

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {t("dashboard.greeting", { name: user.name ?? "" })}
          </h1>
          <p className="text-sm text-muted">
            {user.team} · {t(`levels.${user.level ?? "novice"}`)}
          </p>
        </div>
        <div className="flex gap-6">
          <Metric label={t("dashboard.day1")} percent={progressPercent(day1)} />
          <Metric label={t("dashboard.day2")} percent={progressPercent(day2)} />
        </div>
      </section>

      <DayBlock title={t("dashboard.day1")} dayModules={day1} />
      <DayBlock title={t("dashboard.day2")} dayModules={day2} />
    </div>
  );
}

function Metric({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="w-32">
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">
          {label}
        </span>
        <span className="text-sm font-bold">{percent}%</span>
      </div>
      <ProgressBar percent={percent} />
    </div>
  );
}

async function DayBlock({
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
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="flex flex-col gap-3">
        {dayModules.map((module) => {
          const isPause = module.type === "pause";
          const isPrereq = module.type === "prerequis";
          const clickable = !isPause && module.status !== "locked";

          const content = (
            <Card
              className={
                isPause
                  ? "border-dashed bg-surface-muted"
                  : module.status === "locked"
                    ? "opacity-60"
                    : "hover:border-ink transition-colors"
              }
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    {!isPause && (
                      <span className="text-xs font-semibold uppercase tracking-wide text-taupe">
                        {t(`types.${module.type}`)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold">{module.title}</h3>
                </div>
                {!isPause && !isPrereq && <StatusPill status={module.status} />}
              </div>
            </Card>
          );

          if (!clickable) {
            return <div key={module.id}>{content}</div>;
          }

          return (
            <Link key={module.id} href={`/dashboard/modules/${module.id}`}>
              {content}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
