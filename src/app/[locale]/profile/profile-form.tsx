"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { updateProfileAction, type UpdateProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const LEVELS = ["novice", "debutant", "intermediaire", "expert"] as const;

export function ProfileForm({
  name,
  team,
  level,
}: {
  name: string;
  team: string;
  level: string;
}) {
  const t = useTranslations("onboarding");
  const tProfile = useTranslations("profile");
  const tCommon = useTranslations("common");
  const tLevels = useTranslations("levels");
  const [state, formAction, pending] = useActionState<UpdateProfileState, FormData>(
    updateProfileAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-xs font-semibold uppercase tracking-wide">
          {t("nameLabel")}
        </label>
        <Input id="name" name="name" defaultValue={name} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="team" className="text-xs font-semibold uppercase tracking-wide">
          {t("teamLabel")}
        </label>
        <Input id="team" name="team" defaultValue={team} required />
      </div>

      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1 text-xs font-semibold uppercase tracking-wide">
          {t("levelLabel")}
        </legend>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map((l) => (
            <label
              key={l}
              className="flex cursor-pointer items-center gap-2 border-2 border-border px-3 py-2.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-surface-muted"
            >
              <input
                type="radio"
                name="level"
                value={l}
                defaultChecked={l === level}
                className="accent-black"
                required
              />
              {tLevels(l)}
            </label>
          ))}
        </div>
      </fieldset>

      {state && "error" in state && state.error && (
        <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
          {t(`errors.${state.error}`)}
        </p>
      )}
      {state && "success" in state && state.success && (
        <p className="border border-ink bg-surface-muted px-3 py-2 text-sm text-ink">
          {tProfile("saved")}
        </p>
      )}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? tCommon("saving") : tCommon("save")}
      </Button>
    </form>
  );
}
