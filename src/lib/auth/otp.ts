import "server-only";
import { createHash, randomInt } from "crypto";
import { db } from "@/lib/db";
import { otpCodes } from "@/lib/db/schema";
import { and, eq, isNull, desc } from "drizzle-orm";

const OTP_TTL_MINUTES = 10;
const MAX_ATTEMPTS = 5;

function hashCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

export function generateCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

export async function issueOtp(email: string) {
  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000);
  await db.insert(otpCodes).values({
    email,
    codeHash: hashCode(code),
    expiresAt,
  });
  return { code, expiresAt };
}

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_found" | "expired" | "too_many_attempts" | "invalid" };

export async function verifyOtp(
  email: string,
  code: string
): Promise<VerifyResult> {
  // Prend le code le plus récent non consommé pour cette adresse.
  const [target] = await db
    .select()
    .from(otpCodes)
    .where(and(eq(otpCodes.email, email), isNull(otpCodes.consumedAt)))
    .orderBy(desc(otpCodes.id))
    .limit(1);

  if (!target) return { ok: false, reason: "not_found" };
  if (target.attempts >= MAX_ATTEMPTS)
    return { ok: false, reason: "too_many_attempts" };
  if (target.expiresAt.getTime() < Date.now())
    return { ok: false, reason: "expired" };

  if (target.codeHash !== hashCode(code)) {
    await db
      .update(otpCodes)
      .set({ attempts: target.attempts + 1 })
      .where(eq(otpCodes.id, target.id));
    return { ok: false, reason: "invalid" };
  }

  await db
    .update(otpCodes)
    .set({ consumedAt: new Date() })
    .where(eq(otpCodes.id, target.id));

  return { ok: true };
}
