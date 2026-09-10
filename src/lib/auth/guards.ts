import "server-only";
import { redirect } from "next/navigation";
import { getSession } from "./session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  if (!user) redirect("/login");

  return user;
}

export async function requireOnboardedParticipant() {
  const user = await requireUser();
  if (!user.onboardingComplete) redirect("/onboarding");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/dashboard");
  return user;
}
