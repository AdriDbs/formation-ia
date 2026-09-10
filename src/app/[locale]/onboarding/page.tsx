import { requireUser } from "@/lib/auth/guards";
import { redirect } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { OnboardingForm } from "./onboarding-form";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function OnboardingPage() {
  const user = await requireUser();
  const locale = await getLocale();
  if (user.onboardingComplete) redirect({ href: "/dashboard", locale });

  const t = await getTranslations("common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-muted px-4">
      <div className="mb-8 flex w-full max-w-md items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 bg-accent" />
          <span className="text-sm font-semibold uppercase tracking-[0.2em]">
            {t("brand")}
          </span>
        </div>
        <LanguageSwitcher />
      </div>
      <OnboardingForm />
    </main>
  );
}
