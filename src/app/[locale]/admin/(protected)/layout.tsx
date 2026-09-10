import { requireAdmin } from "@/lib/auth/guards";
import { adminLogoutAction } from "@/app/actions/admin-auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AppShell, type NavItem } from "@/components/app-shell";
import { LogoMark, Wordmark } from "@/components/logo";
import { IconLogout } from "@/components/icons";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  const t = await getTranslations();

  const navItems: NavItem[] = [
    { href: "/admin", label: t("nav.participants"), icon: "users" },
    { href: "/admin/emails", label: t("nav.access"), icon: "mail" },
    { href: "/admin/settings", label: t("nav.settings"), icon: "settings" },
  ];

  return (
    <AppShell
      tone="dark"
      logo={
        <Link href="/admin" className="flex items-center gap-2">
          <LogoMark />
          <Wordmark className="text-white">{t("common.brand")}</Wordmark>
        </Link>
      }
      navItems={navItems}
      footer={
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="text-center text-xs font-semibold uppercase tracking-wide text-white/70 hover:text-white"
          >
            {t("nav.participantView")}
          </Link>
          <LanguageSwitcher className="w-full justify-center" />
          <form action={adminLogoutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 border border-white/20 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:border-white hover:text-white"
            >
              <IconLogout className="h-4 w-4" />
              {t("common.logout")}
            </button>
          </form>
        </div>
      }
    >
      {children}
    </AppShell>
  );
}
