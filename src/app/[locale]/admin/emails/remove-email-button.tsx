"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { removeAllowedEmailAction } from "@/app/actions/admin";

export function RemoveEmailButton({ id }: { id: number }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(t("removeConfirm"))) {
          startTransition(() => removeAllowedEmailAction(id));
        }
      }}
      className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline disabled:opacity-50"
    >
      {t("remove")}
    </button>
  );
}
