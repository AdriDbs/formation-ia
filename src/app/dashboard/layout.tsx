import Link from "next/link";
import { requireOnboardedParticipant } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireOnboardedParticipant();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 bg-accent" />
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              Formation IA
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
              >
                Espace admin
              </Link>
            )}
            <span className="text-sm text-muted">{user.name}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-semibold uppercase tracking-wide text-muted hover:text-ink"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
