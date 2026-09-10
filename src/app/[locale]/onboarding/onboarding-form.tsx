"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  completeOnboardingAction,
  type OnboardingState,
} from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const LEVELS = ["novice", "debutant", "intermediaire", "expert"] as const;

export function OnboardingForm() {
  const t = useTranslations("onboarding");
  const tLevels = useTranslations("levels");
  const [state, formAction, pending] = useActionState<OnboardingState, FormData>(
    completeOnboardingAction,
    null
  );

  return (
    <Card className="w-full max-w-md">
      <h1 className="mb-1 text-xl font-bold">{t("title")}</h1>
      <p className="mb-6 text-sm text-muted">{t("subtitle")}</p>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">
            {t("nameLabel")}
          </label>
          <Input id="name" name="name" placeholder={t("namePlaceholder")} required autoFocus />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="team" className="text-xs font-semibold uppercase tracking-wide">
            {t("teamLabel")}
          </label>
          <Input id="team" name="team" placeholder={t("teamPlaceholder")} required />
        </div>

        <fieldset className="flex flex-col gap-1.5">
          <legend className="mb-1 text-xs font-semibold uppercase tracking-wide">
            {t("levelLabel")}
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {LEVELS.map((level, i) => (
              <label
                key={level}
                className="flex cursor-pointer items-center gap-2 border-2 border-border px-3 py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-muted"
              >
                <input
                  type="radio"
                  name="level"
                  value={level}
                  defaultChecked={i === 0}
                  className="accent-black"
                  required
                />
                {tLevels(level)}
              </label>
            ))}
          </div>
        </fieldset>

        {state?.error && (
          <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
            {t(`errors.${state.error}`)}
          </p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? t("submitPending") : t("submit")}
        </Button>
      </form>
    </Card>
  );
}
