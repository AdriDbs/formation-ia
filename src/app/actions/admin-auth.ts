"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { adminAccount } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/session";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/guards";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

export type AdminLoginState = { error?: "invalid_credentials" } | null;

export async function adminLoginAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const locale = await getLocale();
  const password = z.string().min(1).safeParse(formData.get("password"));

  if (!password.success) {
    return { error: "invalid_credentials" };
  }

  const [account] = await db.select().from(adminAccount).limit(1);
  if (!account) {
    return { error: "invalid_credentials" };
  }

  const valid = await verifyPassword(password.data, account.passwordHash);
  if (!valid) {
    return { error: "invalid_credentials" };
  }

  await createAdminSession();
  redirect(`/${locale}/admin`);
}

export async function adminLogoutAction() {
  const locale = await getLocale();
  await destroyAdminSession();
  redirect(`/${locale}/admin/login`);
}

export type ChangePasswordState =
  | { error?: "wrong_current" | "too_short" | "mismatch" }
  | { success: true }
  | null;

export async function changeAdminPasswordAction(
  _prevState: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  await requireAdmin();

  const current = String(formData.get("currentPassword") ?? "");
  const next = String(formData.get("newPassword") ?? "");
  const confirm = String(formData.get("confirmPassword") ?? "");

  const [account] = await db.select().from(adminAccount).limit(1);
  if (!account) {
    return { error: "wrong_current" };
  }

  const valid = await verifyPassword(current, account.passwordHash);
  if (!valid) return { error: "wrong_current" };
  if (next.length < 8) return { error: "too_short" };
  if (next !== confirm) return { error: "mismatch" };

  const passwordHash = await hashPassword(next);
  await db
    .update(adminAccount)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(adminAccount.id, account.id));

  return { success: true };
}
