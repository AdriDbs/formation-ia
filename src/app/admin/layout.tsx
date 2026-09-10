import Link from "next/link";
import { requireAdmin } from "@/lib/auth/guards";
import { logoutAction } from "@/app/actions/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b border-border bg-ink text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 bg-accent" />
              <span className="text-sm font-semibold uppercase tracking-[0.2em]">
                Formation IA · Admin
              </span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                Participants
              </Link>
              <Link
                href="/admin/emails"
                className="text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                Accès
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
            >
              Vue participant
            </Link>
            <span className="text-sm text-white/80">{user.name ?? user.email}</span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="text-xs font-semibold uppercase tracking-wide text-white/80 hover:text-white"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
