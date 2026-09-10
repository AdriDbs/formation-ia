"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";

const schema = z.object({
  name: z.string().trim().min(1).max(255),
  team: z.string().trim().min(1).max(255),
  level: z.enum(["novice", "debutant", "intermediaire", "expert"]),
});

export type UpdateProfileState =
  | { error?: "invalid_form" }
  | { success: true }
  | null;

export async function updateProfileAction(
  _prevState: UpdateProfileState,
  formData: FormData
): Promise<UpdateProfileState> {
  const locale = await getLocale();
  const session = await getSession();
  if (!session) redirect(`/${locale}/login`);

  const parsed = schema.safeParse({
    name: formData.get("name"),
    team: formData.get("team"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return { error: "invalid_form" };
  }

  await db.update(users).set(parsed.data).where(eq(users.id, session.userId));

  revalidatePath(`/${locale}/dashboard`);
  revalidatePath(`/${locale}/profile`);
  return { success: true };
}
