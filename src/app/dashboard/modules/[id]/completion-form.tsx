"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  markModuleCompleteAction,
  unmarkModuleCompleteAction,
} from "@/app/actions/progress";
import { Button } from "@/components/ui/button";

export function ModuleCompletionForm({
  moduleId,
  completed,
}: {
  moduleId: number;
  completed: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={completed ? "secondary" : "primary"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          if (completed) {
            await unmarkModuleCompleteAction(moduleId);
          } else {
            await markModuleCompleteAction(moduleId);
          }
          router.refresh();
        })
      }
    >
      {pending
        ? "Mise à jour…"
        : completed
          ? "Marquer comme non terminé"
          : "Marquer comme terminé"}
    </Button>
  );
}
