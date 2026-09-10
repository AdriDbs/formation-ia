"use client";

import { useActionState } from "react";
import {
  completeOnboardingAction,
  type OnboardingState,
} from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const LEVELS = [
  { value: "novice", label: "Novice" },
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "expert", label: "Expert" },
];

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    completeOnboardingAction,
    null
  );

  return (
    <Card className="w-full max-w-md">
      <h1 className="mb-1 text-xl font-bold">Votre profil</h1>
      <p className="mb-6 text-sm text-muted">
        Ces informations nous permettent de suivre votre progression.
      </p>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">
            Nom complet
          </label>
          <Input id="name" name="name" placeholder="Jeanne Dupont" required autoFocus />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="team" className="text-xs font-semibold uppercase tracking-wide">
            Équipe
          </label>
          <Input id="team" name="team" placeholder="Ex: Consulting, Data, Tech…" required />
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide">
            Niveau IA
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((level, i) => (
              <label
                key={level.value}
                className="flex cursor-pointer items-center gap-2 border-2 border-border px-3 py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-muted"
              >
                <input
                  type="radio"
                  name="level"
                  value={level.value}
                  defaultChecked={i === 0}
                  className="accent-black"
                  required
                />
                {level.label}
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && (
          <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
            {state.error}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Enregistrement…" : "Commencer la formation"}
        </Button>
      </form>
    </Card>
  );
}
