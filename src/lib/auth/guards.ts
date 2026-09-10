import "server-only";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { getSession } from "./session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function requireUser() {
  const locale = await getLocale();
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);

  const [user] = await db.select().from(users).where(eq(users.id, session.userId));
  if (!user) redirect(`/${locale}/login`);

  return user;
}

export async function requireOnboardedParticipant() {
  const locale = await getLocale();
  const user = await requireUser();
  if (!user.onboardingComplete) redirect(`/${locale}/onboarding`);
  return user;
}

export async function requireAdmin() {
  const locale = await getLocale();
  const user = await requireUser();
  if (user.role !== "admin") redirect(`/${locale}/dashboard`);
  return user;
}
