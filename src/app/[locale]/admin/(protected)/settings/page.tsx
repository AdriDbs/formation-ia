import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ChangePasswordForm } from "./change-password-form";

export default async function AdminSettingsPage() {
  const t = await getTranslations("adminSettings");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted">{t("subtitle")}</p>
      </div>

      <Card className="max-w-md">
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
