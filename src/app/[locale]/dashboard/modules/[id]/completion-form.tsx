"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
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
  const t = useTranslations("module");
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
        ? t("updating")
        : completed
          ? t("markIncomplete")
          : t("markComplete")}
    </Button>
  );
}
