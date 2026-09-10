import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const user = await requireOnboardedParticipant();
  const t = await getTranslations("profile");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-sm text-muted">{t("subtitle")}</p>
      </div>

      <Card className="max-w-md">
        <p className="mb-6 text-sm text-muted">
          {t("emailLabel")} : <span className="font-medium text-ink">{user.email}</span>
        </p>
        <ProfileForm name={user.name ?? ""} team={user.team ?? ""} level={user.level ?? "novice"} />
      </Card>
    </div>
  );
}
