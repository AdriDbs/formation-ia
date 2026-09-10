"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { loginAction, type LoginState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LoginPage() {
  const t = useTranslations("login");
  const tCommon = useTranslations("common");
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-accent" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            {tCommon("brand")}
          </span>
        </div>
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-sm">
        <h1 className="mb-1 text-xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-sm text-muted">{t("subtitle")}</p>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wide">
              {t("emailLabel")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              autoFocus
            />
          </div>

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
    </main>
  );
}
