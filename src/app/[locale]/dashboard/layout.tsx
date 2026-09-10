import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedParticipant();
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-6 py-4">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 bg-accent" />
            <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]">
              {t("common.brand")}
            </span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
              >
                {t("nav.adminSpace")}
              </Link>
            )}
            <span className="hidden text-sm text-muted sm:inline">{user.name}</span>
            <LanguageSwitcher />
            <form action={logoutAction}>
              <button
                type="submit"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
              >
                {t("common.logout")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
