"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import {
  changeAdminPasswordAction,
  type ChangePasswordState,
} from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChangePasswordForm() {
  const t = useTranslations("adminSettings");
  const [state, formAction, pending] = useActionState<ChangePasswordState, FormData>(
    changeAdminPasswordAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentPassword" className="text-xs font-semibold uppercase tracking-wide">
          {t("currentPasswordLabel")}
        </label>
        <Input id="currentPassword" name="currentPassword" type="password" required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="newPassword" className="text-xs font-semibold uppercase tracking-wide">
          {t("newPasswordLabel")}
        </label>
        <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirmPassword" className="text-xs font-semibold uppercase tracking-wide">
          {t("confirmPasswordLabel")}
        </label>
        <Input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required />
      </div>

      {state && "error" in state && state.error && (
        <p className="border border-accent bg-accent-soft px-3 py-2 text-sm text-ink">
          {t(`errors.${state.error}`)}
        </p>
      )}
      {state && "success" in state && state.success && (
        <p className="border border-ink bg-surface-muted px-3 py-2 text-sm text-ink">
          {t("success")}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? t("submitPending") : t("submit")}
      </Button>
    </form>
  );
}
