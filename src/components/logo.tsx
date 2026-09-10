import { cn } from "@/lib/cn";

/**
 * Monogramme "FI" géométrique, flat, coins droits — décliné en accent rouge
 * sur fond noir ou blanc selon le contexte. Pas d'arrondi, conforme charte.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-8 w-8 shrink-0", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" className="fill-ink" />
      <rect x="7" y="7" width="6" height="18" className="fill-white" />
      <rect x="7" y="7" width="14" height="5" className="fill-white" />
      <rect x="7" y="14.5" width="11" height="5" className="fill-white" />
      <rect x="21" y="21" width="4" height="4" className="fill-accent" />
    </svg>
  );
}

export function Wordmark({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "whitespace-nowrap text-sm font-bold uppercase tracking-[0.18em]",
        className
      )}
    >
      {children}
    </span>
  );
}
