"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { addAllowedEmailAction, type AddEmailState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddEmailForm() {
  const t = useTranslations("admin");
  const [state, formAction, pending] = useActionState<AddEmailState, FormData>(
    addAllowedEmailAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4 sm:flex-row sm:items-end">
      <div className="flex flex-1 flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">
          {t("table.email")}
        </label>
        <Input id="email" name="email" type="email" placeholder="prenom.nom@entreprise.com" required />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? t("addEmailPending") : t("addEmailSubmit")}
      </Button>

      {state?.error && (
        <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink sm:basis-full">
          {t(`errors.${state.error}`)}
        </p>
      )}
    </form>
  );
}
