import Link from "next/link";
import { db } from "@/lib/db";
import { users, modules, moduleProgress } from "@/lib/db/schema";
import { computeDayStatuses, progressPercent } from "@/lib/modules/progress";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card } from "@/components/ui/card";

const LEVEL_LABELS: Record<string, string> = {
  novice: "Novice",
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  expert: "Expert",
};

export default async function AdminPage() {
  const [allUsers, allModules, allProgress] = await Promise.all([
    db.select().from(users),
    db.select().from(modules),
    db.select().from(moduleProgress),
  ]);

  const day1Modules = allModules.filter((m) => m.day === 1);
  const day2Modules = allModules.filter((m) => m.day === 2);

  const participants = allUsers
    .filter((u) => u.role === "participant")
    .map((u) => {
      const completedIds = new Set(
        allProgress.filter((p) => p.userId === u.id).map((p) => p.moduleId)
      );
      const day1 = progressPercent(computeDayStatuses(day1Modules, completedIds));
      const day2 = progressPercent(computeDayStatuses(day2Modules, completedIds));
      return { user: u, day1, day2 };
    })
    .sort((a, b) => (a.user.name ?? "").localeCompare(b.user.name ?? ""));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Participants</h1>
        <p className="text-sm text-muted">
          {participants.length} participant{participants.length > 1 ? "s" : ""}
        </p>
      </div>

      {participants.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            Aucun participant n&apos;a encore terminé son onboarding.
          </p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
                <th className="px-6 py-3">Nom</th>
                <th className="px-6 py-3">Équipe</th>
                <th className="px-6 py-3">Niveau</th>
                <th className="px-6 py-3">Jour 1</th>
                <th className="px-6 py-3">Jour 2</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(({ user, day1, day2 }) => (
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
                    {user.level ? LEVEL_LABELS[user.level] : "—"}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <ProgressBar percent={day1} />
                      </div>
                      <span className="text-xs text-muted">{day1}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20">
                        <ProgressBar percent={day2} />
                      </div>
                      <span className="text-xs text-muted">{day2}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
