import type { ReactNode } from "react";
import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/language-switcher";
import { AppShell, type NavItem } from "@/components/app-shell";
import { LogoMark, Wordmark } from "@/components/logo";
import { IconLogout } from "@/components/icons";

export async function ParticipantShell({ children }: { children: ReactNode }) {
  const user = await requireOnboardedParticipant();
  const t = await getTranslations();

  const navItems: NavItem[] = [
    { href: "/dashboard", label: t("nav.dashboard"), icon: "grid" },
    { href: "/profile", label: t("nav.profile"), icon: "user" },
  ];

  return (
    <AppShell
      logo={
        <Link href="/dashboard" className="flex items-center gap-2">
          <LogoMark />
          <Wordmark>{t("common.brand")}</Wordmark>
        </Link>
      }
      navItems={navItems}
      footer={
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-surface-muted text-xs font-bold uppercase">
              {(user.name ?? user.email).slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-muted">
                {user.level ? t(`levels.${user.level}`) : ""}
              </p>
            </div>
          </div>
          <LanguageSwitcher className="w-full justify-center" />
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 border border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted hover:border-ink hover:text-ink"
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
