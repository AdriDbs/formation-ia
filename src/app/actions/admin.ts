"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { allowedEmails, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/guards";
import { revalidatePath } from "next/cache";

const emailSchema = z.string().trim().toLowerCase().email();

export type AddEmailState = { error?: string } | null;

export async function addAllowedEmailAction(
  _prevState: AddEmailState,
  formData: FormData
): Promise<AddEmailState> {
  const admin = await requireAdmin();

  const email = emailSchema.safeParse(formData.get("email"));
  const role = z.enum(["admin", "participant"]).safeParse(formData.get("role"));

  if (!email.success) return { error: "Adresse e-mail invalide." };
  if (!role.success) return { error: "Rôle invalide." };

  await db
    .insert(allowedEmails)
    .values({ email: email.data, role: role.data, addedBy: admin.email })
    .onConflictDoUpdate({
      target: allowedEmails.email,
      set: { role: role.data },
    });

  revalidatePath("/admin/emails");
  return null;
}

export async function removeAllowedEmailAction(id: number) {
  await requireAdmin();
  await db.delete(allowedEmails).where(eq(allowedEmails.id, id));
  revalidatePath("/admin/emails");
}

export async function updateUserRoleAction(userId: number, role: "admin" | "participant") {
  await requireAdmin();
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  if (!user) return;

  await db.update(users).set({ role }).where(eq(users.id, userId));
  await db
    .update(allowedEmails)
    .set({ role })
    .where(eq(allowedEmails.email, user.email));

  revalidatePath("/admin");
  revalidatePath("/admin/emails");
}
