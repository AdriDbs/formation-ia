import { db } from "@/lib/db";
import { allowedEmails } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { AddEmailForm } from "./add-email-form";
import { RemoveEmailButton } from "./remove-email-button";

export default async function EmailsPage() {
  const t = await getTranslations();
  const entries = await db
    .select()
    .from(allowedEmails)
    .orderBy(desc(allowedEmails.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.emailsTitle")}</h1>
        <p className="text-sm text-muted">{t("admin.emailsSubtitle")}</p>
      </div>

      <Card className="max-w-xl">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          {t("admin.addEmailTitle")}
        </h2>
        <AddEmailForm />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-6 py-3">{t("admin.table.email")}</th>
              <th className="px-6 py-3">{t("admin.table.addedBy")}</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium">{entry.email}</td>
                <td className="px-6 py-3 text-muted">{entry.addedBy ?? "—"}</td>
                <td className="px-6 py-3 text-right">
                  <RemoveEmailButton id={entry.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
