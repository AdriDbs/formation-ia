"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { verifyCodeAction, type VerifyCodeState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

function VerifyForm() {
  const params = useSearchParams();
  const email = params.get("email") ?? "";

  const [state, formAction, pending] = useActionState<VerifyCodeState, FormData>(
    verifyCodeAction,
    null
  );

  return (
    <Card className="w-full max-w-sm">
      <h1 className="mb-1 text-xl font-bold">Vérification</h1>
      <p className="mb-6 text-sm text-muted">
        Un code à 6 chiffres a été envoyé à <strong className="text-ink">{email}</strong>.
      </p>

      <form action={formAction} className="flex flex-col gap-4">
        <input type="hidden" name="email" value={email} />
        <div className="flex flex-col gap-1.5">
          <label htmlFor="code" className="text-xs font-semibold uppercase tracking-wide">
            Code de vérification
          </label>
          <Input
            id="code"
            name="code"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="000000"
            className="text-center text-2xl font-bold tracking-[0.5em]"
            required
            autoFocus
          />
        </div>

        {state?.error && (
          <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Vérification…" : "Valider"}
        </Button>

        <a
          href="/login"
          className="text-center text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
        >
          Utiliser une autre adresse
        </a>
      </form>
    </Card>
  );
}

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <div className="mb-8 flex items-center gap-2">
        <span className="h-2.5 w-2.5 bg-accent" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">
          Formation IA
        </span>
      </div>

      <Suspense fallback={null}>
        <VerifyForm />
      </Suspense>
    </main>
  );
}
