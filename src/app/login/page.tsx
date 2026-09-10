"use client";

import { useActionState } from "react";
import { requestCodeAction, type RequestCodeState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<RequestCodeState, FormData>(
    requestCodeAction,
    null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <div className="mb-8 flex items-center gap-2">
        <span className="h-2.5 w-2.5 bg-accent" />
        <span className="text-sm font-semibold uppercase tracking-[0.2em]">
          Formation IA
        </span>
      </div>

      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">Connexion</h1>
        <p className="mb-6 text-sm text-muted">
          Saisissez votre adresse e-mail professionnelle. Un code à usage
          unique vous sera envoyé.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">
              Adresse e-mail
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="prenom.nom@entreprise.com"
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
            {pending ? "Envoi…" : "Recevoir un code"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
