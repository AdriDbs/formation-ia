"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { allowedEmails } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";

const emailSchema = z.string().trim().toLowerCase().email();

export type AddEmailState = { error?: "invalid_email" } | null;

export async function addAllowedEmailAction(
  _prevState: AddEmailState,
  formData: FormData
): Promise<AddEmailState> {
  const admin = await requireAdmin();
  const locale = await getLocale();

  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) return { error: "invalid_email" };

  await db
    .insert(allowedEmails)
    .values({ email: email.data, addedBy: admin.email })
    .onConflictDoNothing();

  revalidatePath(`/${locale}/admin/emails`);
  return null;
}

export async function removeAllowedEmailAction(id: number) {
  await requireAdmin();
  const locale = await getLocale();
  await db.delete(allowedEmails).where(eq(allowedEmails.id, id));
  revalidatePath(`/${locale}/admin/emails`);
}
