"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const schema = z.object({
  name: z.string().trim().min(1, "Le nom est requis.").max(255),
  team: z.string().trim().min(1, "L'équipe est requise.").max(255),
  level: z.enum(["novice", "debutant", "intermediaire", "expert"]),
});

export type OnboardingState = { error?: string } | null;

export async function completeOnboardingAction(
  _prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const parsed = schema.safeParse({
    name: formData.get("name"),
    team: formData.get("team"),
    level: formData.get("level"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
  }

  await db
    .update(users)
    .set({ ...parsed.data, onboardingComplete: true })
    .where(eq(users.id, session.userId));

  redirect("/dashboard");
}
