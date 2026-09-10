import { db } from "@/lib/db";
import { allowedEmails } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { AddEmailForm } from "./add-email-form";
import { RemoveEmailButton } from "./remove-email-button";

export default async function EmailsPage() {
  const entries = await db
    .select()
    .from(allowedEmails)
    .orderBy(desc(allowedEmails.createdAt));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Accès à la plateforme</h1>
        <p className="text-sm text-muted">
          Seules les adresses listées ici peuvent créer un compte et se connecter.
        </p>
      </div>

      <Card className="max-w-md">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Ajouter une adresse
        </h2>
        <AddEmailForm />
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted">
              <th className="px-6 py-3">E-mail</th>
              <th className="px-6 py-3">Rôle</th>
              <th className="px-6 py-3">Ajouté par</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border last:border-0">
                <td className="px-6 py-3 font-medium">{entry.email}</td>
                <td className="px-6 py-3">
                  <span className="inline-flex items-center rounded-[var(--radius-pill)] border border-border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted">
                    {entry.role === "admin" ? "Administrateur" : "Participant"}
                  </span>
                </td>
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
