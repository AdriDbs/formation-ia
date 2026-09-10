// Layout racine de /admin : volontairement minimal, sans vérification de
// session — /admin/login doit rester accessible sans être admin. La
// protection réelle (session + coquille visuelle) vit dans
// `(protected)/layout.tsx`, qui englobe toutes les routes admin sauf login.
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
