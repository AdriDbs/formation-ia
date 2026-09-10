"use server";

import { db } from "@/lib/db";
import { modules, moduleProgress } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { computeDayStatuses } from "@/lib/modules/progress";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function markModuleCompleteAction(moduleId: number) {
  const session = await getSession();
  if (!session) redirect("/login");

  const [module] = await db.select().from(modules).where(eq(modules.id, moduleId));
  if (!module || module.type === "pause" || module.type === "prerequis") {
    throw new Error("Ce module ne peut pas être marqué comme terminé.");
  }

  const dayModules = await db
    .select()
    .from(modules)
    .where(eq(modules.day, module.day));

  const completedRows = await db
    .select({ moduleId: moduleProgress.moduleId })
    .from(moduleProgress)
    .where(eq(moduleProgress.userId, session.userId));

  const completedIds = new Set(completedRows.map((r) => r.moduleId));
  const withStatus = computeDayStatuses(dayModules, completedIds);
  const current = withStatus.find((m) => m.id === moduleId);

  if (!current || current.status === "locked") {
    throw new Error("Ce module est encore verrouillé.");
  }

  await db
    .insert(moduleProgress)
    .values({ userId: session.userId, moduleId })
    .onConflictDoNothing();

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/modules/${moduleId}`);
}

export async function unmarkModuleCompleteAction(moduleId: number) {
  const session = await getSession();
  if (!session) redirect("/login");

  await db
    .delete(moduleProgress)
    .where(
      and(
        eq(moduleProgress.userId, session.userId),
        eq(moduleProgress.moduleId, moduleId)
      )
    );

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/modules/${moduleId}`);
}
