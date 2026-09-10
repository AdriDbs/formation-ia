"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { adminLoginAction, type AdminLoginState } from "@/app/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LogoMark, Wordmark } from "@/components/logo";
import { IconShield } from "@/components/icons";

export default function AdminLoginPage() {
  const t = useTranslations("adminLogin");
  const tCommon = useTranslations("common");
  const [state, formAction, pending] = useActionState<AdminLoginState, FormData>(
    adminLoginAction,
    null
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-4">
      <div className="mb-8 flex w-full max-w-sm items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <LogoMark />
          <Wordmark className="text-white">{tCommon("brand")}</Wordmark>
        </div>
        <LanguageSwitcher />
      </div>

      <Card className="w-full max-w-sm">
        <div className="mb-4 flex items-center gap-2 text-taupe">
          <IconShield className="h-5 w-5" />
          <span className="text-xs font-semibold uppercase tracking-wide">Admin</span>
        </div>
        <h1 className="mb-1 text-xl font-bold">{t("title")}</h1>
        <p className="mb-6 text-sm text-muted">{t("subtitle")}</p>

        <form action={formAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wide">
              {t("passwordLabel")}
            </label>
            <Input id="password" name="password" type="password" required autoFocus />
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
