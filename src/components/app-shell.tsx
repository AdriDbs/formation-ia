"use client";

import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import {
  IconMenu,
  IconGrid,
  IconUser,
  IconUsers,
  IconMail,
  IconSettings,
} from "@/components/icons";

const ICONS = {
  grid: IconGrid,
  user: IconUser,
  users: IconUsers,
  mail: IconMail,
  settings: IconSettings,
} as const;

export type NavIconKey = keyof typeof ICONS;

export type NavItem = {
  href: string;
  label: string;
  icon: NavIconKey;
};

export function AppShell({
  tone = "light",
  logo,
  navItems,
  footer,
  children,
}: {
  tone?: "light" | "dark";
  logo: ReactNode;
  navItems: NavItem[];
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const dark = tone === "dark";

  return (
    <div className={cn("min-h-screen sm:flex", dark ? "bg-surface-muted" : "bg-surface-muted")}>
      {/* Sidebar (desktop / tablet) */}
      <aside
        className={cn(
          "hidden sm:sticky sm:top-0 sm:flex sm:h-screen sm:w-60 sm:shrink-0 sm:flex-col sm:border-r",
          dark ? "sm:border-white/10 sm:bg-ink sm:text-white" : "sm:border-border sm:bg-white"
        )}
      >
        <div className="flex items-center gap-2 px-6 py-6">{logo}</div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {navItems.map((item) => (
            <SidebarLink key={item.href} item={item} active={pathname === item.href} dark={dark} />
          ))}
        </nav>
        <div className={cn("border-t px-3 py-4", dark ? "border-white/10" : "border-border")}>
          {footer}
        </div>
      </aside>

      {/* Top bar (mobile) */}
      <header
        className={cn(
          "border-b sm:hidden",
          dark ? "border-white/10 bg-ink text-white" : "border-border bg-white"
        )}
      >
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 [&::-webkit-details-marker]:hidden">
            {logo}
            <IconMenu className="h-5 w-5 group-open:hidden" />
            <span className="hidden h-5 w-5 group-open:block">✕</span>
          </summary>
          <nav
            className={cn(
              "flex flex-col gap-1 border-t px-3 py-3",
              dark ? "border-white/10" : "border-border"
            )}
          >
            {navItems.map((item) => (
              <SidebarLink key={item.href} item={item} active={pathname === item.href} dark={dark} />
            ))}
          </nav>
          <div className={cn("border-t px-3 py-4", dark ? "border-white/10" : "border-border")}>
            {footer}
          </div>
        </details>
      </header>

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}

function SidebarLink({
  item,
  active,
  dark,
}: {
  item: NavItem;
  active: boolean;
  dark: boolean;
}) {
  const Icon = ICONS[item.icon];
  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-colors",
        active
          ? dark
            ? "bg-white text-ink"
            : "bg-ink text-white"
          : dark
            ? "text-white/70 hover:bg-white/10 hover:text-white"
            : "text-muted hover:bg-surface-muted hover:text-ink"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}
