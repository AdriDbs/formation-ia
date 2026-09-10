import { requireAdmin } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();
  const t = await getTranslations();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-ink text-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/admin" className="flex shrink-0 items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 bg-accent" />
              <span className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]">
                {t("common.brand")} · Admin
              </span>
            </Link>
            <nav className="flex flex-wrap items-center gap-4">
              <Link
                href="/admin"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                {t("nav.participants")}
              </Link>
              <Link
                href="/admin/emails"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                {t("nav.access")}
              </Link>
            </nav>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <Link
              href="/dashboard"
              className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
            >
              {t("nav.participantView")}
            </Link>
            <span className="hidden text-sm text-white/80 sm:inline">
              {user.name ?? user.email}
            </span>
            <LanguageSwitcher />
            <form action={logoutAction}>
              <button
                type="submit"
                className="whitespace-nowrap text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                {t("common.logout")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
