"use client";

import { useActionState } from "react";
import { addAllowedEmailAction, type AddEmailState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddEmailForm() {
  const [state, formAction, pending] = useActionState<AddEmailState, FormData>(
    addAllowedEmailAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">
          Adresse e-mail
        </label>
        <Input id="email" name="email" type="email" placeholder="prenom.nom@entreprise.com" required />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="text-xs font-semibold uppercase tracking-wide">Rôle</legend>
        <div className="flex gap-2">
          <label className="flex cursor-pointer items-center gap-2 border-2 border-border px-3 py-2 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-muted">
            <input type="radio" name="role" value="participant" defaultChecked className="accent-black" />
            Participant
          </label>
          <label className="flex cursor-pointer items-center gap-2 border-2 border-border px-3 py-2 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-muted">
            <input type="radio" name="role" value="admin" className="accent-black" />
            Administrateur
          </label>
        </div>
      </fieldset>

      {state?.error && (
        <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
          {state.error}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Ajout…" : "Ajouter"}
      </Button>
    </form>
  );
}
