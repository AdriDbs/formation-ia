"use client";

import { useTransition } from "react";
import { removeAllowedEmailAction } from "@/app/actions/admin";

export function RemoveEmailButton({ id }: { id: number }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Retirer cette adresse de la liste des accès autorisés ?")) {
          startTransition(() => removeAllowedEmailAction(id));
        }
      }}
      className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline disabled:opacity-50"
    >
      Retirer
    </button>
  );
}
