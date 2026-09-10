import { db } from "@/lib/db";
import { modules, moduleProgress } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { computeDayStatuses } from "@/lib/modules/progress";
import { groupByCategory } from "@/lib/modules/categories";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { IconArrowRight, IconCheck } from "@/components/icons";
import { CategorySection } from "./category-section";

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

  const sequential = [...day1, ...day2].filter(
    (m) => m.type !== "pause" && m.type !== "prerequis"
  );
  const done = sequential.filter((m) => m.status === "completed").length;
  const total = sequential.length;
  const overallPercent = total ? Math.round((done / total) * 100) : 0;
  const nextModule = sequential.find((m) => m.status === "available");

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6 border border-border bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-taupe">
            {user.team} · {t(`levels.${user.level ?? "novice"}`)}
          </p>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {t("dashboard.greeting", { name: user.name ?? "" })}
          </h1>
        </div>
        <ProgressRing percent={overallPercent} label={t("dashboard.overallProgress")} />
      </section>

      {nextModule ? (
        <Link href={`/dashboard/modules/${nextModule.id}`}>
          <Card className="flex items-center justify-between gap-4 border-2 border-ink transition-colors hover:bg-surface-muted">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-accent">
                {t("dashboard.continueEyebrow")}
              </p>
              <h2 className="truncate text-lg font-bold">{nextModule.title}</h2>
            </div>
            <Button className="shrink-0" type="button">
              {t("dashboard.continueCta")}
              <IconArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        </Link>
      ) : (
        <Card className="flex items-center gap-4 border-2 border-ink">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink text-white">
            <IconCheck className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">{t("dashboard.allDoneTitle")}</h2>
            <p className="text-sm text-muted">{t("dashboard.allDoneBody")}</p>
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-12">
        <div>
          <h2 className="mb-6 text-xl font-bold">{t("dashboard.day1")}</h2>
          <div className="flex flex-col gap-10">
            {groupByCategory(day1).map((group) => (
              <CategorySection key={group.id} categoryId={group.id} modules={group.modules} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-6 text-xl font-bold">{t("dashboard.day2")}</h2>
          <div className="flex flex-col gap-10">
            {groupByCategory(day2).map((group) => (
              <CategorySection key={group.id} categoryId={group.id} modules={group.modules} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ percent, label }: { percent: number; label: string }) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex shrink-0 items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0 -rotate-90">
        <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="square"
        />
      </svg>
      <div>
        <p className="text-2xl font-bold leading-none">{percent}%</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      </div>
    </div>
  );
}
