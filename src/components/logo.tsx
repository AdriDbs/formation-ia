import { cn } from "@/lib/cn";

/**
 * Badge "B" flat, coins droits, accent rouge en coin — pas d'arrondi,
 * conforme charte BearingPoint.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative flex h-8 w-8 shrink-0 items-center justify-center bg-ink text-base font-black leading-none text-white",
        className
      )}
      aria-hidden="true"
    >
      B
      <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-accent" />
    </span>
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
