"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/cn";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("languageSwitcher");

  return (
    <div
      className={cn("inline-flex border border-border", className)}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-current={loc === locale}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors",
            loc === locale
              ? "bg-ink text-white"
              : "bg-white text-muted hover:text-ink"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
