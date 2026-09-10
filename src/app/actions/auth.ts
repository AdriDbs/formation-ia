"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { allowedEmails, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession, destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

const emailSchema = z.string().trim().toLowerCase().email();

export type LoginState = { error?: "invalid_email" | "not_allowed" } | null;

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const locale = await getLocale();
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: "invalid_email" };
  }
  const email = parsed.data;

  const [allowed] = await db
    .select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email));

  if (!allowed) {
    return { error: "not_allowed" };
  }

  let [user] = await db.select().from(users).where(eq(users.email, email));
  if (!user) {
    [user] = await db.insert(users).values({ email }).returning();
  }

  await createSession({ userId: user.id, email: user.email });

  redirect(`/${locale}${user.onboardingComplete ? "/dashboard" : "/onboarding"}`);
}

export async function logoutAction() {
  const locale = await getLocale();
  await destroySession();
  redirect(`/${locale}/login`);
}
