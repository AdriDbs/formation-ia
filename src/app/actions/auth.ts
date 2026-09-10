"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { allowedEmails, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { issueOtp, verifyOtp } from "@/lib/auth/otp";
import { sendOtpEmail } from "@/lib/email/send-otp";
import { createSession, destroySession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const emailSchema = z.string().trim().toLowerCase().email();

export type RequestCodeState = { error?: string } | null;

export async function requestCodeAction(
  _prevState: RequestCodeState,
  formData: FormData
): Promise<RequestCodeState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { error: "Adresse e-mail invalide." };
  }
  const email = parsed.data;

  const [allowed] = await db
    .select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email));

  if (!allowed) {
    return {
      error:
        "Cette adresse n'est pas autorisée. Contactez un administrateur pour être ajouté.",
    };
  }

  const { code } = await issueOtp(email);
  await sendOtpEmail(email, code);

  redirect(`/login/verify?email=${encodeURIComponent(email)}`);
}

export type VerifyCodeState = { error?: string } | null;

export async function verifyCodeAction(
  _prevState: VerifyCodeState,
  formData: FormData
): Promise<VerifyCodeState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const code = z
    .string()
    .trim()
    .length(6)
    .regex(/^\d{6}$/)
    .safeParse(formData.get("code"));

  if (!email.success || !code.success) {
    return { error: "Code invalide." };
  }

  const result = await verifyOtp(email.data, code.data);
  if (!result.ok) {
    const messages: Record<string, string> = {
      not_found: "Aucun code en cours. Redemandez-en un.",
      expired: "Ce code a expiré. Redemandez-en un.",
      too_many_attempts: "Trop de tentatives. Redemandez un nouveau code.",
      invalid: "Code incorrect.",
    };
    return { error: messages[result.reason] };
  }

  const [allowed] = await db
    .select()
    .from(allowedEmails)
    .where(eq(allowedEmails.email, email.data));

  if (!allowed) {
    return { error: "Cette adresse n'est plus autorisée." };
  }

  let [user] = await db.select().from(users).where(eq(users.email, email.data));
  if (!user) {
    [user] = await db
      .insert(users)
      .values({ email: email.data, role: allowed.role })
      .returning();
  } else if (user.role !== allowed.role) {
    [user] = await db
      .update(users)
      .set({ role: allowed.role })
      .where(eq(users.id, user.id))
      .returning();
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });

  redirect(user.onboardingComplete ? "/dashboard" : "/onboarding");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
